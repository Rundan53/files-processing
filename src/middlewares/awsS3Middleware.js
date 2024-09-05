const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const config = require("../config/config");
const AppError = require("../utils/error");

const editorFileFilter = async function (req, file, cb) {
  try {
    //   const userRole = req.session?.user?.role?.roleTag;
    let userRole;

    if (req.query.templateType?.toUpperCase() === "IMAGE") {
      const sessionRoles = req.session?.user?.roles;
      const graphicDesigner = sessionRoles.find(
        (role) => role.roleTag === "GRAPHIC_DESIGNER",
      );

      userRole = graphicDesigner ? graphicDesigner.roleTag : userRole;
    } else if (req.query.templateType?.toUpperCase() === "VIDEO") {
      const sessionRoles = req.session?.user?.roles;
      const videoEditor = sessionRoles.find(
        (role) => role.roleTag === "VIDEO_EDITOR",
      );

      console.log({ videoEditor });
      userRole = videoEditor ? videoEditor.roleTag : userRole;
    }

    //checking if the filetype and file upload match (if file is video n type is image then error)
    if (file) {
      if (
        file.mimetype.startsWith("image") &&
        req.query.templateType.toUpperCase() === "VIDEO"
      ) {
        throw new AppError("Please enter valid file type", 400);
      } else if (
        file.mimetype.startsWith("video") &&
        req.query.templateType.toUpperCase() === "IMAGE"
      ) {
        throw new AppError("Please enter valid file type", 400);
      }
    }

    if (userRole === "GRAPHIC_DESIGNER") {
      req.folder = "images";
      if (file && file.mimetype.startsWith("image")) {
        req.templateType = "IMAGE";
        cb(null, true);
      } else {
        cb(new AppError("You're only allowed to upload images", 406));
      }
    } else if (userRole === "VIDEO_EDITOR") {
      req.folder = "videos";
      if (file && file.mimetype.startsWith("video")) {
        req.templateType = "VIDEO";
        cb(null, true);
      } else {
        cb(new AppError("You're only allowed to upload videos", 406));
      }
    } else {
      cb(new AppError("You are not allowed to upload files"));
    }
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      cb(error);
    } else {
      cb(new Error("Error while checking file type"));
    }
  }
};

const teamLeadFileFilter = async function (req, file, cb) {
  try {
    //checking if the filetype and file upload match (if file is video n type is image then error)
    if (file) {
      if (!file.mimetype.startsWith("image")) {
        cb(new AppError("You're only allowed to upload images", 406));
      }

      //change folder according to object i.e logo/draft
      const baseUrl = req.baseUrl;
      if (baseUrl.includes("clients")) {
        req.folder = "logos";
      } else if (baseUrl.includes("drafts")) {
        req.folder = "drafts";
      }

      cb(null, true);
    } else {
      cb(new AppError("You are not allowed to upload files"));
    }
  } catch (error) {
    console.log(error);

    if (error instanceof AppError) {
      cb(error);
    } else {
      cb(new Error("Error while checking file type"));
    }
  }
};

let s3 = new S3Client({
  region: "us-east-1",
  endpoint: "https://s3.amazonaws.com",
  credentials: {
    accessKeyId: config.awsIamUserKey,
    secretAccessKey: config.awsIamSecret,
  },
  //   sslEnabled: false,
  //   s3ForcePathStyle: true,
  //   signatureVersion: "v4",
});

function parseAndUploadToS3(roleType) {
  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: config.bucketName,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: "public-read",
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        const folder = req.folder;
        const filename = `${folder}/${Date.now()}_${file.originalname}`;
        cb(null, filename);
      },
    }),

    fileFilter:
      roleType && roleType == "TEAM_LEAD"
        ? teamLeadFileFilter
        : editorFileFilter,
  });

  return { upload };
}

module.exports = parseAndUploadToS3;
