const validateRequestObject = require("../../utils/validation");
const signupValidationSchema = require("../../validators/signup.validator");

const userService = require("../../services/user.service");

async function signupUSer(req, res, next) {
  try {
    const { username, email, password, confirmPassword } = req.body;

    const value = validateRequestObject(
      {
        username,
        email,
        password,
        confirmPassword,
      },
      signupValidationSchema,
    );

    const user = await userService.signupUser({
      username,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = signupUSer;
