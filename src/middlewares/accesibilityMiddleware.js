const AppError = require("../utils/error");
const { message } = require("../validators/invite.validator");

const checkUserAccessibilityToUploadTemp = (req, res, next) => {
  const roles = req.session?.user?.roles;

  let allowedRoleTags = [];
  console.log({ ROLESDIKHA: roles });
  roles.forEach((role) => {
    if (
      (role.roleTag === "GRAPHIC_DESIGNER" &&
        req.query.templateType?.toUpperCase() === "IMAGE") ||
      (role.roleTag === "VIDEO_EDITOR" &&
        req.query.templateType?.toUpperCase() === "VIDEO")
    ) {
      allowedRoleTags.push(role.roleTag);
    }
  });

  req.allowedRoleTags = allowedRoleTags;
  next();
};

const checkUserAccessibilityToAddTemp = (req, res, next) => {
  const roles = req.session?.user?.roles;

  let allowedRoleTags = [];
  roles.forEach((role) => {
    if (
      (role.roleTag === "GRAPHIC_DESIGNER" &&
        req.body.templateType?.toUpperCase() === "IMAGE") ||
      (role.roleTag === "VIDEO_EDITOR" &&
        req.body.templateType?.toUpperCase() === "VIDEO")
    ) {
      allowedRoleTags.push(role.roleTag);
    }
  });

  req.allowedRoleTags = allowedRoleTags;
  next();
};

module.exports = {
  checkUserAccessibilityToUploadTemp,
  checkUserAccessibilityToAddTemp,
};
