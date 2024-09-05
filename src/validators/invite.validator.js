const Joi = require("joi");
const { isValidObjectId } = require("mongoose");

const customMessages = {
  "string.base": "{{#label}} must be a string",
  "string.empty": "Please enter {{#label}}",
  "any.required": "Please enter {{#label}}",
  "any.only": "{{#label}} must match {{#valids}}",

  // email
  "string.email":
    "{{#label}} must be a valid email address",

  "any.invalid": "Invalid {{#label}}",
};

const inviteValidateSchema = Joi.object({
  inviteeEmail: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages(customMessages),

  roleId: Joi.string()
    .trim()
    .required()
    .custom((value, helpers) => {
      if (!isValidObjectId(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "MongoDB ObjectId")
    .description("MongoDB object id validation")
    .messages(customMessages),
});

module.exports = inviteValidateSchema;
