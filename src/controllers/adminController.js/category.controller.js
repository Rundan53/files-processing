const categoryValidateSchema = require("../../validators/category.validator");
const categoryService = require("../../services/catergory.service");
const AppError = require("../../utils/error");
const validateRequestObject = require("../../utils/validation");

const addNewCategory = async (req, res, next) => {
  try {
    const { categoryName, categoryType } = req.body;
    console.log(categoryName, categoryType);
    const { id: leaderId } = req.session.user;

    const value = validateRequestObject(
      { categoryName, categoryType },
      categoryValidateSchema,
    );
    console.log(value.categoryName);
    const newCategory = await categoryService.addCategory({
      categoryName,
      categoryType,
      createdBy: leaderId,
    });

    res.status(201).json({
      success: true,
      message: "successfully added category",
      data: {
        newCategory,
      },
    });
  } catch (error) {
    next(error);
  }
};

const listAllCategories = async (req, res, next) => {
  try {
    let { type: categoryType } = req.query;
    categoryType = categoryType ? categoryType.toUpperCase() : categoryType;
    const categories = await categoryService.fetchAllCategories(categoryType);

    res.status(200).json({
      success: true,
      message: "successfully fetched all categories",
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCategoriesBasedOnEvents = (req, res, r) => {
  categoryValidateSchema({});
};

module.exports = {
  addNewCategory,
  listAllCategories,
};
