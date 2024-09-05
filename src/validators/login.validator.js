const Joi = require("joi");

const customMessages = {
  "string.base": "{{#label}} must be a string",
  "string.empty": "Please enter {{#label}}",
  "any.required": "Please enter {{#label}}",
  "any.only": "{{#label}} must match {{#valids}}",

  // email
  "string.email": "{{#label}} must be a valid email address",
};

const loginValidateSchema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages(customMessages),

  password: Joi.string().required().messages(customMessages),
});

module.exports = loginValidateSchema;
