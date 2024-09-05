const nodemailer = require("nodemailer");
const { convert } = require("html-to-text");
const path = require("path");
const config = require("../config/config");
const fsPromises = require("fs/promises");

async function generateHtmlTemplate(templatePath, details) {
  function replaceContent(details, htmlString) {
    for (const [key, value] of Object.entries(details)) {
      htmlString = htmlString.replaceAll(`{{${key}}}`, value);
    }
    return htmlString;
  }

  async function readFile(templatePath) {
    const file = await fsPromises.readFile(templatePath);
    const htmlString = file.toString();

    return replaceContent(details, htmlString);
  }

  const htmlString = await readFile(templatePath);

  return replaceContent(details, htmlString);
}

module.exports = class Email {
  constructor(data) {
    // this.firstName = user.name.split(" ")[0];
    this.to = data.user?.email;
    this.from = config.inviteEmail;
    this.data = data;
  }

  createNewTransport() {
    // if (process.env.NODE_ENV === "production") {
    // Brevo email for production

    return nodemailer.createTransport({
      host: process.env.BREVO_HOST,
      port: process.env.BREVO_PORT,
      auth: {
        user: process.env.BREVO_LOGIN,
        pass: process.env.BREVO_PASSWORD,
      },
    });
    // }

    // In dev env test emails in MailTrap
    // return nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: process.env.EMAIL_PORT,
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });
  }

  // This works as a generic method to send emails because we will send many types of email in future so passing a
  // template and subject and creating new methods like sendWelcome is easier and clean
  async send(html, subject) {
    // Send the actual email

    // 2. Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      // for clients that dont support html sent by us, this extracts the text important for the mail
      text: convert(html),
    };

    // 3. Create a transport and send email
    const transport = this.createNewTransport();
    await transport.sendMail(mailOptions);
  }

  async sendFirstInviteEmail() {
    const subject = `Invitation for registeration on barcadly media software`;
    const templatePath = path.join(
      __dirname,
      "..",
      "views",
      "templates",
      "invite.html",
    );

    const obj = {
      name: `${this.data?.user?.email}`.split("@")[0],
      email: this.data?.user?.email,
      role: this.data?.user?.role,
      registrationLink: `${config.frontendOrigin}/register?uuid=${this.data.uuid}`,
      invitedBy: "Barcadly Services",
    };

    const html = await generateHtmlTemplate(templatePath, obj);

    await this.send(html, subject);
  }

  async sendNewRoleEmail() {
    const subject = `You've been added as a ${this.data.user.role}`;
    const templatePath = path.join(
      __dirname,
      "..",
      "views",
      "templates",
      "newRole.html",
    );

    const obj = {
      name: `${this.data?.user?.email}`.split("@")[0],
      email: this.data?.user?.email,
      role: this.data?.user?.role,
      registrationLink: `${config.frontendOrigin}/register?uuid=${this.data.uuid}`,
      invitedBy: "Barcadly Services",
    };

    const html = await generateHtmlTemplate(templatePath, obj);

    await this.send(html, subject);
  }

  //   async sendWelcome() {
  //     await this.send("welcome", "Welcome to the Natours family!");
  //   }

  //   async sendPasswordReset() {
  //     await this.send("passwordReset", "Your password reset token (valid for only 10mins)");
  //   }
};
