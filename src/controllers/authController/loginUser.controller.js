const validateRequestObject = require("../../utils/validation");
const loginValidationSchema = require("../../validators/login.validator");

const userService = require("../../services/user.service");

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const value = validateRequestObject(
      {
        email,
        password,
      },
      loginValidationSchema,
    );

    const user = await userService.loginUser({ email, password });
    const userObject = user.toObject();
    // const roles = user.roleIds.map((role) => {
    //   return role;
    // });

    req.session.user = {
      id: userObject._id,
      roles: userObject.roleIds,
      email: userObject.email,
    };

    res.status(200).json({
      success: true,
      message: "Login in successful",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = loginUser;
