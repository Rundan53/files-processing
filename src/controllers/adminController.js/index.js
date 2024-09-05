const { uploadFile } = require("./uploadfile.controller");
const { addNewCategory, listAllCategories } = require("./category.controller");
const { addNewEvent, listAllEvents } = require("./event.controller");
const {
  addNewClient,
  listAllClients,
  uploadLogo,
} = require("./client.controller");

const {
  addNewDraft,
  listAllDrafts,
  getDraft,
  getAdminDrafts,
  addEditedDraft,
} = require("./draft.controller");
module.exports = {
  uploadFile,
  addNewCategory,
  listAllCategories,
  addNewEvent,
  listAllEvents,
  addNewClient,
  listAllClients,
  uploadLogo,
  addNewDraft,
  listAllDrafts,
  getDraft,
  getAdminDrafts,
  addEditedDraft,
};
