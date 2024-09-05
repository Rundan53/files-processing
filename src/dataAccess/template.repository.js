const Template = require("../models/template.model");

const generalModelMethods = require("./generalModel.methods");

const {
  findOne,
  findById,
  addNew,
  getAllRecords,
  getFilteredRecords,
  updateOne,
  countTotalDocuments,
} = generalModelMethods(Template);

module.exports = {
  findOne,
  findById,
  addNew,
  getAllRecords,
  getFilteredRecords,
  updateOne,
  countTotalDocuments,
};
