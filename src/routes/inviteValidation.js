const { Router } = require("express");
const router = Router();

const inviteController = require("../controllers/invite.controller");

router.route("/:uuid").get(inviteController.validateRegistration);

module.exports = router;
