const { v4: uuidv4, validate: uuidValidate } = require("uuid");
const { ObjectId } = require("mongodb");
const inviteRepository = require("../dataAccess/invite.repository");
const roleRepository = require("../dataAccess/role.repository");
const userRepository = require("../dataAccess/user.repository");
const Email = require("../thirdParty/sendEmail");

const AppError = require("../utils/error");

const inviteUser = async ({ inviterId, inviteeEmail, inviteeRoleId }) => {
  // check if role id is valid and if role is descendant of the inviter

  const populateOptions = {
    path: "roleIds",
    // fileds : ''        //add later
  };

  const [inviter, inviteeRole] = await Promise.all([
    userRepository.findById({ id: inviterId, populateOptions }),
    roleRepository.findById({ id: inviteeRoleId }),
  ]);

  const role = inviter.roleIds?.find((role) => {
    return role.roleTag === "TEAM_LEAD";
  });

  if (role.roleTag !== "TEAM_LEAD") {
    const statusCode = 403;
    const message = "You're not authorized to invite anyone";
    throw new AppError(message, statusCode);
  }

  const existingInviteeForMentionedRole = await inviteRepository.findOne({
    filter: { inviteeEmail, inviteeRoleId },
  });

  if (existingInviteeForMentionedRole) {
    const message = `This email is already registered with us for ${inviteeRole.roleName} role`;
    const statusCode = 400;

    throw new AppError(message, statusCode);
  }

  const registeredUser = await userRepository.findOne({
    filter: { email: inviteeEmail },
  });

  //invitaion for already registered user
  if (registeredUser) {
    if (
      registeredUser.roleIds.find((role) => role.toString() === inviteeRoleId)
    ) {
      const message = `This email is already registered with us for ${inviteeRole.roleName} role`;
      const statusCode = 400;
      throw new AppError(message, statusCode);
    }

    const inviteeRoleName = inviteeRole.roleName;

    const data = {
      user: {
        email: inviteeEmail,
        role: inviteeRoleName,
      },
    };

    const email = new Email(data);
    await email.sendNewRoleEmail();

    const invite = await inviteRepository.addNew({
      inviteeEmail,
      inviterId,
      inviteeRoleId,
      acceptedTime: new Date(),
    });

    if (invite) {
      registeredUser.roleIds.push(inviteeRoleId);
      await registeredUser.save();

      return invite;
    }

    return;
  }

  //if user is not registered
  const inviteeRoleName = inviteeRole.roleName;

  //   // send email
  const uuid = uuidv4();

  const data = {
    user: {
      email: inviteeEmail,
      role: inviteeRoleName,
    },
    uuid,
  };

  const email = new Email(data);
  await email.sendFirstInviteEmail();

  // save to db if inviting first time

  const invite = await inviteRepository.addNew({
    inviteeEmail,
    inviterId,
    inviteeRoleId,
    uuid,
  });

  return invite;
}; //

const validateRegistration = async (uuid) => {
  if (!uuid || !uuidValidate(uuid)) {
    throw new AppError(
      "Invalid registration link! Please visit the invitation link on your email.",
      404,
    );
  }

  const validInvite = await inviteRepository.findOne({ filter: { uuid } });

  if (!validInvite) {
    throw new AppError(
      "Invalid registration link! Please visit the invitation link on your email.",
      404,
    );
  }

  return validInvite;
};

module.exports = {
  inviteUser,
  validateRegistration,
};
