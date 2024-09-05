const { Router } = require("express");
const router = Router();

//middlewares
const { restrictTo } = require("../middlewares/authMiddleware");

const adminController = require("../controllers/adminController.js");
const parseAndUploadToS3 = require("../middlewares/awsS3Middleware.js");

router
  .route("/")
  .post(
    restrictTo("TEAM_LEAD"),
    parseAndUploadToS3("TEAM_LEAD").upload.single("image"),
    adminController.addNewDraft,
  )
  .patch(
    restrictTo("TEAM_LEAD"),
    parseAndUploadToS3("TEAM_LEAD").upload.single("image"),
    adminController.addEditedDraft,
  );

router.route("/").get(restrictTo("TEAM_LEAD"), adminController.listAllDrafts);

router
  .route("/:draftId")
  .get(restrictTo("TEAM_LEAD"), adminController.getDraft);

// delete/:id
// router
//   .route("/upload_logo")
//   .post(
//     restrictTo("TEAM_LEAD"),
//     parseAndUploadToS3("TEAM_LEAD").upload.single("logo"),
//     clientController.uploadLogo,
//   );

// router.route("/").get(adminController.getAdminDrafts);

module.exports = router;
