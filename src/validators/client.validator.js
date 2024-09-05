const Joi = require("joi");
const validator = require("validator");

const customMessages = {
  "string.base": "{{#label}} must be a string",
  "string.empty": "Please enter {{#label}}",
  "any.required": "Please enter {{#label}}",
  "any.only": "{{#label}} must match {{#valids}}",
  "string.min": "{{#label}} must be at least {{#limit}} characters long",
  "string.max": "{{#label}} must be at most {{#limit}} characters long",
  // email
  "string.email": "{{#label}} must be a valid email address",

  "any.invalid": "Invalid {{#label}}",
};

const clientValidationSchema = Joi.object({
  clientName: Joi.string().trim().required().messages(customMessages),

  businessName: Joi.string().trim().required().messages(customMessages),

  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages(customMessages),

  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Mobile number must be exactly 10 digits.",
    }),

  logoURL: Joi.string()
    .custom((value, helpers) => {
      if (!validator.isURL(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "URL validation")
    .description("URL validation")
    .messages(customMessages),

  address: Joi.string().trim().messages(customMessages),
});

module.exports = clientValidationSchema;
