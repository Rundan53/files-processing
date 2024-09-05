const path = require("path");
const fs = require("fs");
const util = require("util");

const AppError = require("../utils/error");

const templateService = require("../services/template.service");

const validateRequestObject = require("../utils/validation");

const templateValidationSchema = require("../validators/template.validator");

const { isValidObjectId } = require("mongoose");
const validator = require("validator");

const { Worker, isMainThread } = require("worker_threads");

const cacheManager = require("../thirdParty/nodeCache");

const {
  processTheCompressionAndUpload,
} = require("../services/ffmpeg.services/imageCompression");

//adding new template to the database
const addTemplate = async (req, res, next) => {
  try {
    const {
      categoryId,
      templateName,
      eventId,
      templateType,
      templateURL,
      compressedURL,
      gifURL,
      // file,        //delete later if not required
    } = req.body;

    const value = validateRequestObject(
      {
        templateName,
        categoryId,
        eventId,
        templateURL,
        templateType: templateType ? templateType.toUpperCase() : templateType,
        compressedURL,
        gifURL,
      },
      templateValidationSchema,
    );

    const newTemplate = await templateService.addTemplate({
      templateName: value.templateName,
      templateType: value.templateType,
      categoryId: value.categoryId,
      eventId: value.eventId,
      createdBy: req.session?.user?.id,
      templateURL: value.templateURL,
      compressedURL: value.compressedURL,
      gifURL: value.gifURL,
    });

    if (!newTemplate) {
      throw new AppError("Something went wrong", 500);
    }

    //delete from cache if tempate is added in same category/event
    const keyPrefixForCategory = value.categoryId + value.templateType;
    const keyPrefixForEvent = value.eventId + value.templateType;
    const prefixes = [keyPrefixForCategory, keyPrefixForEvent];
    //deletes from cache if category exists in cache
    cacheManager.deleteFromCache(prefixes);

    // Return the file URL after successful upload
    return res.status(200).json({
      success: true,
      message: "Template added successfully",
      data: {
        newTemplate,
      },
    });
  } catch (error) {
    next(error);
  }
};

const uploadTemplate = (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Return the file URL after successful upload

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        url: file.location,
        templateType: req.templateType,
        file,
      },
    });
  } catch (error) {
    next(error);
  }
};

const compressImageFile = async (req, res, next) => {
  try {
    const { fileURL } = req.body;

    if (!fileURL || !validator.isURL(fileURL)) {
      throw new AppError("Invalid file URL", 400);
    }

    const compressedURL = await processTheCompressionAndUpload(fileURL);

    if (compressedURL) {
      res.status(200).json({
        message: "Succesfully Uploaded and Compressed file",
        data: {
          compressedURL,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

//compressing and converting to gif, the uplaoded video template
const compressVideofile = async (req, res, next) => {
  try {
    const { fileURL } = req.body;

    if (!fileURL || !validator.isURL(fileURL)) {
      throw new AppError("Invalid file URL", 400);
    }

    //if Main Thread then spawn new thread to execute compression and git conversion
    if (isMainThread) {
      const pathToCompression = path.join(
        __dirname,
        "../services/ffmpeg.services/compression.js",
      );
      const worker = new Worker(pathToCompression, {
        workerData: {
          fileURL,
        },
      });

      //listens to worker's response fron spawned thread
      worker.on("message", (filedata) => {
        if (!filedata || !Array.isArray(filedata) || filedata.length === 0) {
          throw new AppError("Error while compressing the file", 500);
        }

        const compressedURL = filedata[0]?.Location;
        const gifURL = filedata[1]?.Location;
        // const videoDurationInSecs = filedata[1]?.videoDurationInSecs;

        res.status(200).json({
          message: "Succesfully Uploaded and Compressed file",
          data: {
            compressedURL,
            gifURL,
            // videoDurationInSecs,
          },
        });
      });

      //listens the errors from new spawned thread
      worker.on("error", (err) => {
        const message = err.message;
        const statusCode = 500;

        throw new AppError(message, statusCode);
      });

      //exit from the
      worker.on("exit", (code) => {
        if (code !== 0) {
          console.error(`Worker stopped with exit code ${code}`);
        } else {
          console.log("Worker stopped successfully");
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

//getting templates by category name
const listTemplatesByCategory = async (req, res, next) => {
  try {
    const { category_id: categoryId } = req.params;
    const { type: templateType, page, limit } = req.query;

    if (!templateType) {
      return next(
        new AppError("templateType is required. Either IMAGE or VIDEO", 400),
      );
    }

    if (!isValidObjectId(categoryId)) {
      throw new AppError("Invalid category id", 400);
    }

    //key for cache according to category and type
    const cacheKey = categoryId + templateType.toUpperCase() + (limit || 10);

    // Check if data already in the cache
    const templateDataAtPage = cacheManager.fetchFromCache(cacheKey, page);

    //if templates present in cache then send response from cache
    if (templateDataAtPage) {
      return res.status(200).json({
        message: "Successfully fetched all templates",
        success: true,
        data: {
          templates: templateDataAtPage.templates,
          totalTemplates: templateDataAtPage.totalTemplates,
        },
      });
    }
    const sort = req.query?.sort?.split(",").join(" ");
    const queryOptions = { sort, page, limit: limit ? limit : 10 };

    const isEvent = false;
    const newTemplateData = await templateService.fetchFilteredTemplates(
      templateType.toUpperCase(),
      categoryId,
      isEvent,
      queryOptions,
    );

    if (!newTemplateData.templates || newTemplateData.templates.length <= 0) {
      return res.status(200).json({
        success: true,
        message: "No templates for this category",
      });
    }

    // Insert the specific page data in the existed key of cache or create new cache entry
    cacheManager.setOrUpdateCache(cacheKey, page, newTemplateData);

    res.status(200).json({
      message: "Successfully fetched all templates",
      success: true,
      data: {
        templates: newTemplateData.templates,
        totalTemplates: newTemplateData.totalTemplates,
      },
    });
  } catch (error) {
    next(error);
  }
};

//getting templates by event name / event date
const listTemplatesByEvent = async (req, res, next) => {
  try {
    const { event_id: eventId } = req.params;
    const { type: templateType, page, limit } = req.query;

    if (!templateType) {
      return next(
        new AppError("templateType is required. Either IMAGE or VIDEO", 400),
      );
    }

    if (!isValidObjectId(eventId)) {
      throw new AppError("Invalid event id", 400);
    }

    const cacheKey = eventId + templateType.toUpperCase() + (limit || 10);
    // Check if data already in the cache
    const templateDataAtPage = cacheManager.fetchFromCache(cacheKey, page);

    //if templates present in cache then send response from cache
    if (templateDataAtPage) {
      return res.status(200).json({
        message: "Successfully fetched all templates",
        success: true,
        data: {
          templates: templateDataAtPage.templates,
          totalTemplates: templateDataAtPage.totalTemplates,
        },
      });
    }

    const sort = req.query?.sort?.split(",").join(" ");
    const queryOptions = { sort, page, limit: limit ? limit : 10 };
    const isEvent = true;
    const templateData = await templateService.fetchFilteredTemplates(
      templateType.toUpperCase(),
      eventId,
      isEvent,
      queryOptions,
    );

    if (templateData.templates && templateData.templates.length <= 0) {
      return res.status(200).json({
        success: true,
        message: "No templates for this event",
      });
    }

    // Insert the specific page data in the existed key of cache or create new cache entry
    cacheManager.setOrUpdateCache(cacheKey, page, templateData);

    res.status(200).json({
      message: "successfully fetched all templates",
      success: true,
      data: {
        templates: templateData.templates,
        totalTemplates: templateData.totalTemplates,
      },
    });
  } catch (error) {
    next(error);
  }
};

const templateWithVideoFramesResponse = async (
  templateData,
  serverUrl,
  res,
) => {
  if (isMainThread) {
    const pathToFrameGenerator = path.join(
      __dirname,
      "../services/ffmpeg.services/generateVideoFrames.js",
    );
    const worker = new Worker(pathToFrameGenerator, {
      workerData: {
        template: { ...templateData, _id: templateData._id.toString() },
        serverUrl,
      },
    });

    //listens to worker's response fron spawned thread
    worker.on("message", async (outputPaths) => {
      if (
        !outputPaths ||
        !Array.isArray(outputPaths) ||
        outputPaths.length === 0
      ) {
        throw new AppError("Error while generating frames", 500);
      }

      templateData.totalVideoFrames = outputPaths.length;
      const template = { ...templateData, frames: outputPaths };

      await templateService.updateTemplate({
        filter: { _id: template._id },
        update: { totalVideoFrames: outputPaths.length },
      });

      res.status(200).json({
        message: "Succesfully Uploaded and Compressed file",
        data: {
          template,
        },
      });
    });

    //listens the errors from new spawned thread
    worker.on("error", (err) => {
      const message = err.message;
      const statusCode = 500;

      throw new AppError(message, statusCode);
    });

    //exit from the
    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      } else {
        console.log("Worker stopped successfully");
      }
    });
  }
};

const pathExists = async (itemPath) => {
  return new Promise((resolve, reject) => {
    fs.access(itemPath, fs.constants.F_OK, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

const getTemplate = async (req, res, next) => {
  try {
    const { templateId } = req.params;

    if (!templateId) {
      return next(new AppError("Invalid template ID", 400));
    }

    const template = await templateService.getTemplateById(templateId);

    if (!template) {
      return next(new AppError("Template not found", 404));
    }

    if (template.templateType !== "VIDEO") {
      return res.status(200).json({
        success: true,
        message: "Successfully fetced template",
        data: {
          template,
        },
      });
    }

    // generate frames for video for response
    const serverUrl = `${req.protocol}://${req.get("host")}`;

    const outputFolder = path.join(
      __dirname,
      "..",
      "public",
      "images",
      `${template._id}`,
    );

    const framesFolderExists = await pathExists(outputFolder);

    // if folder already exists check if the frames exists and send those without generating new frames
    if (framesFolderExists) {
      const outputPaths = [];

      const readdirAsync = util.promisify(fs.readdir);

      const folderFiles = await readdirAsync(outputFolder);
      const frameFiles = folderFiles.filter((file) => file.startsWith("frame"));

      frameFiles.forEach((file) => {
        outputPaths.push(`${serverUrl}/images/${template._id}/${file}`);
      });

      if (
        outputPaths.length > 0 &&
        template.totalVideoFrames &&
        template.totalVideoFrames === outputPaths.length
      ) {
        const templateWithFrames = { ...template, frames: outputPaths };

        return res.status(200).json({
          message: "Succesfully Uploaded and Compressed file",
          data: {
            template: templateWithFrames,
          },
        });
      }
    }

    // generate new frames for the video template and send response
    await templateWithVideoFramesResponse(template, serverUrl, res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadTemplate,
  addTemplate,
  listTemplatesByCategory,
  listTemplatesByEvent,
  compressVideofile,
  getTemplate,
  compressImageFile,
};
