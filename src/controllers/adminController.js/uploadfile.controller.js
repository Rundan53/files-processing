const AppError = require("../../utils/error");
const validateRequestObject = require("../../utils/validation");

const uploadFile = (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Return the file URL after successful upload
    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      url: file.location,
      templateType: req.templateType,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFile,
};
