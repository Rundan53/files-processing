const Joi = require("joi");
const { isValidObjectId } = require("mongoose");

const customMessages = {
  "string.base": "{{#label}} must be a string",
  "string.empty": "Please enter {{#label}}",
  "any.required": "Please enter {{#label}}",
  "any.only": "{{#label}} must match {{#valids}}",

  // email
  "string.email": "{{#label}} must be a valid email address",

  "any.invalid": "Invalid {{#label}}",
};

const categoryValidateSchema = Joi.object({
  categoryName: Joi.string()
    .lowercase()
    .trim()
    .required()
    .messages(customMessages),

  categoryType: Joi.string()
    .trim()
    .required()
    .valid("LOGO", "TEMPLATE")
    .messages(customMessages),
});

module.exports = categoryValidateSchema;
