const signupUser = require("./signupUser.controller");
const loginUser = require("./loginUser.controller");
const logoutUser = require("./logoutUser.controller");
const isLoggedIn = require("./isLoggedIn.controller");

module.exports = {
  signupUser,
  loginUser,
  logoutUser,
  isLoggedIn,
};
