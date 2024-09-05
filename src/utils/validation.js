const AppError = require("../utils/error");

const validateOptions = {
  errors: {
    wrap: {
      label: false,
    },
  },
  abortEarly: false,
};

function validateRequestObject(object, schema, options = validateOptions) {
  const { error, value } = schema.validate(object, options);

  if (error) {
    console.log({ error });
    const customErrorMessages = error.details.map((err) => {
      return { [err.path[0]]: err.message };
    });
    throw new AppError(
      `Please enter a valid ${error.details[0].path[0]}`,
      400,
      {
        errors: customErrorMessages,
      },
    );
  }

  return value;
}

module.exports = validateRequestObject;
