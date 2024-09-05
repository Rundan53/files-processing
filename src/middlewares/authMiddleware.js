const AppError = require("../utils/error");

const authenticate = async (req, res, next) => {
  if (!req.session || !req.session?.user) {
    return next(new AppError("Please login to get access", 401));
  }

  next();
};

const restrictTo = (...roles) => {
  return async function (req, res, next) {
    if (!req.session || !req.session?.user) {
      return next(new AppError("Please login to get access", 401));
    }

    const sessionRoles = req.session?.user?.roles;

    if (req.allowedRoleTags) {
      roles = req.allowedRoleTags;
    }

    const roleTag = sessionRoles.filter((role) => {
      if (roles.includes(role.roleTag)) {
        return role.roleTag;
      }
    });

    if (!roleTag || roleTag.length <= 0) {
      return next(
        new AppError("You're not authorized to access this resource", 403),
      );
    }

    next();
  };
};

module.exports = {
  authenticate,
  restrictTo,
};
