const { Router } = require("express");
const router = Router();

//routers
const authRouter = require("./auth");
const inviteValidationRouter = require("./inviteValidation");
const rolesRouter = require("./role");
const adminRouter = require("./admin");
const clientRouter = require("./client");
const categoryRouter = require("./category");
const draftRouter = require("./draft");
const templateRouter = require("./template");
const eventRouter = require("./event");

//middlwares
const { authenticate } = require("../middlewares/authMiddleware");

router.use("/auth", authRouter);
router.use("/validate-invitation/", inviteValidationRouter);
router.use(authenticate);
router.use("/admin", adminRouter);
router.use("/clients", clientRouter);
router.use("/categories", categoryRouter);
router.use("/drafts", draftRouter);

router.use("/events", eventRouter);

router.use("/templates", templateRouter);

router.use("/roles", rolesRouter);

module.exports = router;
