const draftValidateSchema = require("../../validators/draft.validator");
const draftService = require("../../services/draft.service");
const AppError = require("../../utils/error");
const validateRequestObject = require("../../utils/validation");
const { isValidObjectId } = require("mongoose");

const addNewDraft = async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Return the file URL after successful upload
    const createdBy = req.session?.user?.id;
    const { templateId, clientId, draftId } = req.body;
    const metadata = req.body.metadata && JSON.parse(req.body.metadata);

    const draftUrl = req.file.location;

    //if draft already present then edit the metadata and fileURL
    // if (draftId && isValidObjectId(draftId)) {
    //   const updatedDraft = await draftService.updateDraft({
    //     _id: draftId,
    //     draftUrl,
    //     metadata,
    //   });

    //   if (!updatedDraft) {
    //     throw new AppError("Something went wrong while saving changes", 500);
    //   }

    //   return res.status(200).json({
    //     success: true,
    //     message: "Draft Updated Successfully",
    //     data: {
    //       updatedDraft,
    //     },
    //   });
    // }

    const value = validateRequestObject(
      {
        clientId,
        templateId,
        draftUrl,
      },
      draftValidateSchema,
    );

    const draft = await draftService.addDraft({
      templateId: value.templateId,
      clientId: value.clientId,
      draftUrl: value.draftUrl,
      metadata,
      createdBy,
    });

    return res.status(200).json({
      success: true,
      message: "Draft added successfully",
      data: {
        draft,
      },
    });
  } catch (error) {
    next(error);
  }
};

const addEditedDraft = async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const { draftId } = req.body;
    const draftUrl = req.file.location;
    const metadata = req.body.metadata && JSON.parse(req.body.metadata);

    //if draft already present then update the metadata and fileURL
    if (draftId && isValidObjectId(draftId)) {
      const updatedDraft = await draftService.updateDraft({
        _id: draftId,
        draftUrl,
        metadata,
      });

      return res.status(200).json({
        success: true,
        message: "Draft Updated Successfully",
        data: {
          updatedDraft,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const listAllDrafts = async (req, res, next) => {
  try {
    const user = req.session?.user?.id;

    const clients = await draftService.fetchAllClientDrafts(user);

    if (!clients || clients.length == 0) {
      return res.status(200).json({
        success: true,
        message: "You have not added any drafts",
      });
    }

    res.status(200).json({
      success: true,
      message: "Here are your drafts",
      data: {
        clients,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getDraft = async (req, res, next) => {
  try {
    const { draftId } = req.params;

    if (!draftId) {
      return next(new AppError("Invalid draft ID", 400));
    }

    const draft = await draftService.getDraftById(draftId);

    if (!draft) {
      return next(new AppError("Draft not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Successfully fetched draft",
      data: {
        draft,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addNewDraft,
  listAllDrafts,
  getDraft,
  addEditedDraft,
};
