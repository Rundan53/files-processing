const roleService = require("../services/role.service");
const Role = require("../models/role.model");
const AppError = require("../utils/error");

async function listUserRoles(req, res, next) {
  try {
    const data = await roleService.fetchAllUserRoles();

    if (!data || data.length === 0) {
      const message = "No Roles Found";
      const statusCode = 404;
      throw new AppError(message, statusCode);
    }

    res.status(200).json({
      success: true,
      message: "Fetched all Roles from Database",
      data: {
        roles: data,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listUserRoles,
};
