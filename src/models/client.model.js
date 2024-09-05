const { Schema, model } = require("mongoose");
const validator = require("validator");
const clientSchema = new Schema(
  {
    clientName: {
      type: String,
      required: [true, "Please enter client name"],
      trim: true,
    },

    businessName: {
      type: String,
      required: [true, "Please enter business name"],
      trim: true,
      unique: true,
    },

    // socialLinks: {},

    email: {
      type: String,
      required: [true, "Please enter client email"],
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter a valid email id"],
    },

    address: {
      type: String,
    },

    phoneNumber: {
      type: String,
      minlength: [10, "Phone number should be atleast 10 characters long"],
    },

    logoURL: {
      type: String,
      validate: [validator.isURL, "Please enter a valid logo image link"],
    },

    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploader is missing"],
    },
  },
  {
    timestamps: true,
  },
);

const Client = model("Client", clientSchema);
Client.ensureIndexes();
module.exports = Client;
