const draftRepository = require("../dataAccess/draft.repository");
const AppError = require("../utils/error");

const addDraft = async ({
  templateId,
  clientId,
  draftUrl,
  createdBy,
  metadata,
}) => {
  return draftRepository.addNew({
    templateId,
    clientId,
    draftUrl,
    createdBy,
    metadata,
  });
};

const updateDraft = async ({ _id, draftUrl, metadata }) => {
  return draftRepository.updateOne({
    filter: { _id },
    update: { metadata, draftUrl },
    options: { new: true },
  });
};

const fetchAllDrafts = async (createdBy) => {
  return draftRepository.getFilteredRecords({ filter: { createdBy } });
};

const getDraftById = async (draftId) => {
  return draftRepository.findById({ id: draftId });
};

const fetchAllClientDrafts = async (leaderId) => {
  return draftRepository.fetchAllDrafts(leaderId);
};

module.exports = {
  addDraft,
  fetchAllDrafts,
  getDraftById,
  fetchAllClientDrafts,
  updateDraft,
};
