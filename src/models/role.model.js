const { Schema, model } = require("mongoose");

const roleSchema = new Schema({
  roleName: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },

  roleTag: {
    type: String,
    trim: true,
  },
});

roleSchema.pre("save", function (next) {
  const roleTag = this.roleName.split(" ").join("_").toUpperCase();
  this.roleTag = roleTag;
  next();
});

const Role = model("Role", roleSchema);

module.exports = Role;
