const { Router } = require("express");
const router = Router();

//middlewares
const { restrictTo } = require("../middlewares/authMiddleware");

const clientController = require("../controllers/adminController.js");
const parseAndUploadToS3 = require("../middlewares/awsS3Middleware.js");

router.route("/").post(restrictTo("TEAM_LEAD"), clientController.addNewClient);
router.route("/").get(restrictTo("TEAM_LEAD"), clientController.listAllClients);
router
  .route("/upload_logo")
  .post(
    restrictTo("TEAM_LEAD"),
    parseAndUploadToS3("TEAM_LEAD").upload.single("logo"),
    clientController.uploadLogo,
  );
module.exports = router;
