const Category = require("../models/category.model");

const generalModelMethods = require("./generalModel.methods");

const { findOne, findById, addNew, getAllRecords, getFilteredRecords } =
  generalModelMethods(Category);

module.exports = {
  findOne,
  findById,
  addNew,
  getAllRecords,
  getFilteredRecords,
};
