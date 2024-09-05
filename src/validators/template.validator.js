const Joi = require("joi");
const { isValidObjectId } = require("mongoose");
const validator = require("validator");

const customMessages = {
  "string.base": "{{#label}} must be a string",
  "string.empty": "Please enter {{#label}}",
  "any.required": "Please enter {{#label}}",
  "any.only": "{{#label}} must match {{#valids}}",

  "any.invalid": "Invalid {{#label}}",
};

const templateValidationSchema = Joi.object({
  templateName: Joi.string().trim().required().messages(customMessages),

  categoryId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!isValidObjectId(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "MongoDB ObjectId")
    .description("MongoDB object id validation")
    .messages(customMessages),

  eventId: Joi.string()
    .custom((value, helpers) => {
      if (!isValidObjectId(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "MongoDB ObjectId")
    .description("MongoDB object id validation")
    .messages(customMessages),

  templateType: Joi.string()
    .trim()
    .required()
    .valid("VIDEO", "IMAGE")
    .messages(customMessages),

  templateURL: Joi.string()
    .custom((value, helpers) => {
      if (!validator.isURL(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "URL validation")
    .description("URL Validation")
    .messages(customMessages),

  compressedURL: Joi.alternatives()
    .conditional("templateType", {
      is: "VIDEO",
      then: Joi.string().required(),
      otherwise: Joi.forbidden(),
    })
    .custom((value, helpers) => {
      if (!value) {
        return;
      }
      if (!validator.isURL(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "URL validation")
    .description("URL Validation")
    .messages(customMessages),

  gifURL: Joi.alternatives()
    .conditional("templateType", {
      is: "VIDEO",
      then: Joi.string().required(),
      otherwise: Joi.forbidden(),
    })
    .custom((value, helpers) => {
      if (!value) {
        return;
      }
      if (!validator.isURL(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "URL validation")
    .description("URL Validation")
    .messages(customMessages),
});

module.exports = templateValidationSchema;
