const userService = require("../../services/user.service");

const isLoggedIn = async (req, res, next) => {
  try {
    const userId = req.session?.user?.id;

    const user = await userService.getUserById(userId);

    res.status(200).json({
      message: "Authentication valid",
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = isLoggedIn;
