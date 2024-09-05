const { Router } = require("express");
const router = Router();

//middleware
const { restrictTo } = require("../middlewares/authMiddleware");

//controllers
const roleController = require("../controllers/role.controller");

router.route("/").get(restrictTo("TEAM_LEAD"), roleController.listUserRoles);

module.exports = router;
