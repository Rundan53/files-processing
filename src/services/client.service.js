const clientRepository = require("../dataAccess/client.repository");
const AppError = require("../utils/error");

const addClient = async ({
  clientName,
  businessName,
  email,
  address,
  phoneNumber,
  logoURL,
  addedBy,
}) => {
  return clientRepository.addNew({
    clientName,
    businessName,
    email,
    address,
    phoneNumber,
    logoURL,
    addedBy,
  });
};

const fetchAllClients = async (addedBy) => {
  const queryOptions = { sort: "businessName" };

  return clientRepository.getFilteredRecords({
    filter: { addedBy },
    queryOptions,
  });
};

module.exports = {
  addClient,
  fetchAllClients,
};
