const Joi = require("joi");

const customMessages = {
  "string.base": "{{#label}} must be a string",
  "string.empty": "Please enter {{#label}}",
  "any.required": "Please enter {{#label}}",
  "any.only": "{{#label}} must match {{#valids}}",
  // username, password
  "string.alphanum": "{{#label}} must only contain alpha-numeric characters",
  "string.min": "{{#label}} must be at least {{#limit}} characters long",
  "string.max": "{{#label}} must be at most {{#limit}} characters long",
  // email
  "string.email": "{{#label}} must be a valid email address",
};

const signupValidateSchema = Joi.object({
  username: Joi.string().min(3).trim().required().messages(customMessages),

  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages(customMessages),

  password: Joi.string()
    .min(8)
    .trim()
    .pattern(
      new RegExp(
        "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$",
      ),
    )
    .required()
    .messages(customMessages),

  confirmPassword: Joi.string()
    .trim()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords must match",
      "string.empty": "Please confirm password",
    }),
}).with("password", "confirmPassword");

module.exports = signupValidateSchema;
