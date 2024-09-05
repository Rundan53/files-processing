const mongoose = require("mongoose");
const config = require('./src/config/config')
const Role = require("./src/models/role.model");

mongoose
  .connect(
    config.mongoConnectionURI,
  )
  .then(() => {
    console.log("connected");
  });

const roles = ["Team Lead", "Graphic Designer", "Video Editor"];

const addRoles = async (roles) => {
  roles.forEach(async (role) => {
    await Role.create({ roleName: role });
  });
};

addRoles(roles);
