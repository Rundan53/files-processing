function generalModelMethods(Model) {
  const findOne = async ({ filter, populateOptions, selectFields }) => {
    console.log(filter);
    return Model.findOne(filter).select(selectFields).populate(populateOptions);
  };

  const findById = async ({ id, populateOptions, selectFields }) => {
    return Model.findById(id)
      .select(selectFields)
      .populate(populateOptions)
      .lean();
  };

  const addNew = async (data) => {
    return Model.create(data);
  };

  const getFilteredRecords = async ({
    filter,
    populateOptions,
    selectOptions,
    queryOptions,
  }) => {
    const page = queryOptions?.page ? queryOptions.page : 1;
    const sortBy = queryOptions?.sort ? queryOptions.sort : "-createdAt";
    const limit = queryOptions?.limit;
    const skip = (page - 1) * limit;

    return Model.find(filter)
      .select(selectOptions)
      .populate(populateOptions)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);
  };

  const getAllRecords = async (
    { populateOptions } = { populateOptions: "" },
  ) => {
    return Model.find().populate(populateOptions);
  };

  const updateOne = async ({ filter, update, options }) => {
    console.log(filter, update);
    return Model.findOneAndUpdate(filter, update, options);
  };

  const updateMany = async ({ filter, update, options }) => {
    return Model.updateMany(filter, update, options);
  };

  const countTotalDocuments = async ({ filter }) => {
    return Model.countDocuments(filter);
  };

  const aggregate = async (pipeline) => {
    return Model.aggregate(pipeline);
  };

  return {
    findOne,
    findById,
    addNew,
    getAllRecords,
    getFilteredRecords,
    updateOne,
    updateMany,
    countTotalDocuments,
    aggregate,
  };
}

module.exports = generalModelMethods;
