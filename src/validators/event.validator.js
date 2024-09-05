const Joi = require("joi");

const customMessages = {
  "string.base": "Invalid type, {#label} must be a string",
  "string.empty": "{#label} cannot be empty",
  "any.required": "{#label} is required",
  "date.base": "Invalid date format",
  "number.base": "Invalid number format",
  "any.only": "{#label} must be one of {#valids}",
};

const eventValidateSchema = Joi.object({
  eventName: Joi.string().trim().required().messages(customMessages),

  eventDate: Joi.date().required().messages(customMessages),
});

module.exports = eventValidateSchema;
