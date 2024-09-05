const { UUID } = require("mongodb");
const { Schema, model } = require("mongoose");
const validator = require("validator");

function isBarcadelyEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@barcadlyservices\.in$/;
  return emailPattern.test(email);
}

const inviteSchema = new Schema(
  {
    inviteeEmail: {
      type: String,
      required: [true, "Please enter the invitee Email"],
      validate: [
        {
          validator: validator.isEmail,
          message: (prop) => `${prop.value} is not a valid email format`,
        },
        {
          validator: isBarcadelyEmail,
          message: (prop) => `${prop.value} is not a valid barcadly email`,
        },
      ],

      lowercase: true,
      trim: true,
    },

    inviterId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    inviteeRoleId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Role",
      //add enum later for roles below inviters
    },

    acceptedTime: {
      type: Date,
    },

    uuid: {
      type: UUID,
    },
  },
  { timestamps: true },
);

const Invite = model("Invite", inviteSchema);

module.exports = Invite;
