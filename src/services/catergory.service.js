const categoryRepository = require("../dataAccess/category.repository");
const AppError = require("../utils/error");

const addCategory = async ({ categoryName, categoryType, createdBy }) => {
  const existingCategory = await categoryRepository.findOne({
    filter: {
      categoryName: categoryName,
      categoryType: categoryType,
    },
  });

  if (existingCategory) {
    const message = `Category ${categoryName} of the type ${categoryType} already exists`;
    const statusCode = 409;
    const errors = [
      {
        categoryName: `${categoryName} of type ${categoryType} aready exists`,
      },
    ];
    throw new AppError(message, statusCode, { errors });
  }

  const newCategory = categoryRepository.addNew({
    categoryName,
    categoryType,
    createdBy,
  });

  return newCategory;
};

const fetchAllCategories = async (categoryType) => {
  if (!categoryType || !["TEMPLATE", "LOGO"].includes(categoryType)) {
    return await categoryRepository.getAllRecords();
  }

  const queryOptions = { sort: "categoryName" };
  const categories = await categoryRepository.getFilteredRecords({
    filter: { categoryType },
    queryOptions,
  });

  if (categories.length <= 0) {
    throw new AppError("No categories found", 404);
  }

  return categories;
};

module.exports = {
  addCategory,
  fetchAllCategories,
};
