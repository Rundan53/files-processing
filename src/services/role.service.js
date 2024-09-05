const roleRepository = require("../dataAccess/role.repository");

const fetchAllUserRoles = async () => {
  const data = await roleRepository.getAllRecords();
  return data;
};

module.exports = {
  fetchAllUserRoles,
};
