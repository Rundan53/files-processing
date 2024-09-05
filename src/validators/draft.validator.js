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

const draftValidationSchema = Joi.object({
  clientId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!isValidObjectId(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "MongoDB ObjectId")
    .description("MongoDB object id validation")
    .messages(customMessages),

  templateId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!isValidObjectId(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "MongoDB ObjectId")
    .description("MongoDB object id validation")
    .messages(customMessages),

  draftUrl: Joi.string()
    .custom((value, helpers) => {
      if (!validator.isURL(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "URL validation")
    .description("URL validation")
    .messages(customMessages),
});

module.exports = draftValidationSchema;
