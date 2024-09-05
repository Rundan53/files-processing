const { Router } = require("express");
const router = Router();

//middlewares
const { restrictTo } = require("../middlewares/authMiddleware");

const inviteController = require("../controllers/invite.controller");

router.route("/invite").post(restrictTo("TEAM_LEAD"), inviteController.invite);

module.exports = router;
