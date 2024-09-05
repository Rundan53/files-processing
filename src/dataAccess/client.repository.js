const Client = require("../models/client.model");

const generalModelMethods = require("./generalModel.methods");

const {
  findOne,
  findById,
  addNew,
  getAllRecords,
  getFilteredRecords,
  updateOne,
  updateMany,
} = generalModelMethods(Client);

module.exports = {
  findOne,
  findById,
  addNew,
  getAllRecords,
  getFilteredRecords,
  updateOne,
  updateMany,
};
