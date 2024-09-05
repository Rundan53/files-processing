const { Schema, model } = require("mongoose");
const validator = require("validator");

const TemplateSchema = new Schema(
  {
    templateName: {
      type: String,
      required: [true, "Please enter the template name"],
    },

    templateType: {
      type: String,
      required: [true, "Template type is required"],
      enum: ["IMAGE", "VIDEO"],
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    tags: [
      {
        type: String,
      },
    ],

    templateURL: {
      type: String,
      required: true,
      validate: [validator.isURL, "invalid template URL"],
    },

    compressedURL: {
      type: String,
      required: false, //image templates don't have compressedURL
      validate: [validator.isURL, "invalid compressed template URL"],
    },

    gifURL: {
      type: String,
      required: false, //image templates don't have gifURL
      validate: [validator.isURL, "invalid compressed template URL"],
    },

    metadata: {
      type: Object,
      default: {},
      // required: true,
    },

    totalVideoFrames: Number,
  },

  { timestamps: true },
);

TemplateSchema.index({ categoryId: 1, templateType: 1 });
TemplateSchema.index({ eventId: 1, templateType: 1 });

const Template = model("Template", TemplateSchema);
Template.ensureIndexes();
module.exports = Template;
