const { Router } = require("express");
const router = Router();

//middlwares
const { restrictTo } = require("../middlewares/authMiddleware");
const parseAndUploadToS3 = require("../middlewares/awsS3Middleware");
const {
  checkUserAccessibilityToAddTemp,
  checkUserAccessibilityToUploadTemp,
} = require("../middlewares/accesibilityMiddleware");

//controllers
const templateController = require("../controllers/template.controller");

router
  .route("/upload")
  .post(
    checkUserAccessibilityToUploadTemp,
    restrictTo(),
    parseAndUploadToS3().upload.single("template"),
    templateController.uploadTemplate,
  );

router.route("/video/compress").post(templateController.compressVideofile);

router
  .route("/category/:category_id")
  .get(restrictTo("TEAM_LEAD"), templateController.listTemplatesByCategory);

router
  .route("/events/:event_id")
  .get(restrictTo("TEAM_LEAD"), templateController.listTemplatesByEvent);

router
  .route("/")
  .post(
    checkUserAccessibilityToAddTemp,
    restrictTo(),
    templateController.addTemplate,
  );

router.route("/:templateId").get(templateController.getTemplate);

module.exports = router;
