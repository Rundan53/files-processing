const { Router } = require("express");
const router = Router();

//middlware
const { restrictTo } = require("../middlewares/authMiddleware");

//controllers
const adminController = require("../controllers/adminController.js");

router
  .route("/")
  .post(restrictTo("TEAM_LEAD"), adminController.addNewCategory)
  .get(adminController.listAllCategories);

module.exports = router;
