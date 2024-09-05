const logoutUser = async (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).send("Unable to log out");
      } else {
        res.clearCookie("connect.sid", {
          httpOnly: true,
          secure: false,
          domain: "localhost",
          path: "/",
        });
        res.status(200).json({
          message: "Successfully logged out",
          success: true,
        });
      }
    });
  } else {
    res.end();
  }
};

module.exports = logoutUser;
