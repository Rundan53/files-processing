const templateRepository = require("../dataAccess/template.repository");

const addTemplate = async ({
  templateName,
  templateType,
  categoryId,
  eventId,
  createdBy,
  templateURL,
  compressedURL,
  gifURL,
}) => {
  const newTemplate = await templateRepository.addNew({
    templateName,
    templateType,
    categoryId,
    eventId,
    createdBy,
    templateURL,
    compressedURL,
    gifURL,
  });

  return newTemplate;
};

const fetchFilteredTemplates = async (
  templateType,
  id,
  isEvent,
  queryOptions,
) => {
  let filteroptions = {
    categoryId: id,
    templateType,
  };

  if (isEvent) {
    filteroptions = {
      eventId: id,
      templateType,
    };
  }
  const totalTemplatesPromise = templateRepository.countTotalDocuments({
    filter: filteroptions,
  });

  const templatesPromise = templateRepository.getFilteredRecords({
    filter: filteroptions,
    queryOptions,
  });

  const [totalTemplates, templates] = await Promise.all([
    totalTemplatesPromise,
    templatesPromise,
  ]);

  return { totalTemplates, templates };
};

const getTemplateById = async (templateId) => {
  return templateRepository.findById({ id: templateId });
};

const updateTemplate = async ({ filter, update, options }) => {
  options = options ? options : { upsert: true };
  return templateRepository.updateOne({ filter, update, options });
};

module.exports = {
  addTemplate,
  fetchFilteredTemplates,
  getTemplateById,
  updateTemplate,
};
