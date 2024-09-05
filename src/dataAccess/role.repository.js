const Role = require("../models/role.model");

const generalModelMethods = require("./generalModel.methods");

const { findOne, findById, addNew, getAllRecords, getFilteredRecords } =
  generalModelMethods(Role);

module.exports = {
  findOne,
  findById,
  addNew,
  getAllRecords,
  getFilteredRecords,
};
