const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController/index");

const { authenticate } = require("../middlewares/authMiddleware");

router.route("/signup").post(authController.signupUser);

router.route("/login").post(authController.loginUser);
router.route("/logout").post(authController.logoutUser);
router.route("/check-auth").get(authenticate, authController.isLoggedIn);

module.exports = router;
