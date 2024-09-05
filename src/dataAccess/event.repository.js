const Event = require("../models/event.model");

const generalModelMethods = require("./generalModel.methods");

const {
  findOne,
  findById,
  addNew,
  getAllRecords,
  getFilteredRecords,
  updateMany,
  updateOne,
} = generalModelMethods(Event);

module.exports = {
  findOne,
  findById,
  addNew,
  getAllRecords,
  getFilteredRecords,
  updateMany,
  updateOne,
};
