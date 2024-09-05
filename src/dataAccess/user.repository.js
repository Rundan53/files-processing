const User = require("../models/user.model");

const generalModelMethods = require("./generalModel.methods");

const {
  findOne,
  findById,
  addNew,
  updateOne,
  updateMany,
  getAllRecords,
  getFilteredRecords,
} = generalModelMethods(User);

module.exports = {
  findOne,
  findById,
  addNew,
  getAllRecords,
  getFilteredRecords,
  updateOne,
  updateMany,
};
