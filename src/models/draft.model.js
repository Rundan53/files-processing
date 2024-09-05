const { required } = require("joi");
const { Schema, model } = require("mongoose");
const validator = require("validator");

const DraftSchema = new Schema(
  {
    templateId: {
      type: Schema.Types.ObjectId,
      ref: "Template",
      required: [true, "Template Id is required"],
    },

    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client Id is required"],
    },

    metadata: {
      type: Object,
    },

    draftUrl: {
      type: String,
      validate: [validator.isURL, "Please enter a valid URL"],
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Draft = model("Draft", DraftSchema);
module.exports = Draft;
