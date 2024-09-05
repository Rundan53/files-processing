const Draft = require("../models/draft.model");
const ObjectId = require("mongoose").Types.ObjectId;

const generalModelMethods = require("./generalModel.methods");

const {
  findOne,
  findById,
  addNew,
  getAllRecords,
  getFilteredRecords,
  updateOne,
  updateMany,
  aggregate,
} = generalModelMethods(Draft);

const fetchAllDrafts = async (id) => {
  const pipeline = [
    { $match: { createdBy: new ObjectId(id) } },

    { $sort: { createdAt: -1 } },

    {
      $lookup: {
        from: "clients",
        localField: "clientId",
        foreignField: "_id",
        as: "client",
      },
    },

    {
      $lookup: {
        from: "templates",
        localField: "templateId",
        foreignField: "_id",
        as: "template",
      },
    },

    {
      $group: {
        _id: "$clientId",
        drafts: {
          $push: {
            draftId: "$_id",
            templateId: "$templateId",
            darftUrl: "$draftUrl",
            clientId: "$clientId",
            templateName: { $arrayElemAt: ["$template.templateName", 0] },
            businessName: { $arrayElemAt: ["$client.businessName", 0] },
          },
        },
      },
    },

    {
      $addFields: {
        businessName: { $arrayElemAt: ["$drafts.businessName", 0] },
      },
    },

    { $sort: { businessName: 1 } },
  ];

  return aggregate(pipeline);
};

module.exports = {
  findOne,
  findById,
  addNew,
  getAllRecords,
  getFilteredRecords,
  updateOne,
  updateMany,
  aggregate,
  fetchAllDrafts,
};
