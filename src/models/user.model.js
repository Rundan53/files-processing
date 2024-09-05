const { Schema, model } = require("mongoose");
const validator = require("validator");

function isValidPassword(password) {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/;
  return regex.test(password);
}

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, `Please enter your name`],
      minlength: [3, "Username should be of more than 3 characters"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter a valid email id"],
    },

    password: {
      type: String,
      required: true,
      select: false,
      validate: [
        isValidPassword,
        "Password must contain alphanumeric and special characters",
      ],
    },

    roleIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: [true, "Please enter your role"],
      },
    ],

    passwordUpdatedAt: Date,

    passwordResetToken: String,

    passwordTokenExpiresAt: Date,
  },
  { timestamps: true },
);

const User = model("User", UserSchema);

module.exports = User;
