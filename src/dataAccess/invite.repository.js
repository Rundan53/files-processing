const { get } = require("mongoose");
const Invite = require("../models/invite.model");

const generalModelMethods = require("./generalModel.methods");

const {
  findOne,
  findById,
  addNew,
  getAllRecords,
  getFilteredRecords,
  updateOne,
  updateMany,
} = generalModelMethods(Invite);

module.exports = {
  findOne,
  findById,
  addNew,
  getAllRecords,
  getFilteredRecords,
  updateOne,
  updateMany,
};
