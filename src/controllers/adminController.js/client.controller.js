const clientValidateSchema = require("../../validators/client.validator");
const clientService = require("../../services/client.service");
const AppError = require("../../utils/error");
const validateRequestObject = require("../../utils/validation");

const addNewClient = async (req, res, next) => {
  try {
    const { clientName, businessName, email, address, phoneNumber, logoURL } =
      req.body;
    const addedBy = req.session?.user?.id;

    const value = validateRequestObject(
      {
        clientName,
        businessName,
        email,
        address,
        phoneNumber,
        logoURL,
      },
      clientValidateSchema,
    );

    const newClient = await clientService.addClient({
      clientName: value.clientName,
      businessName: value.businessName,
      email: value.email,
      address: value.address,
      phoneNumber: value.phoneNumber,
      logoURL: value.logoURL,
      addedBy,
    });

    res.status(201).json({
      success: true,
      message: "Client added successfully",
      data: {
        client: newClient,
      },
    });
  } catch (error) {
    next(error);
  }
};

const listAllClients = async (req, res, next) => {
  try {
    const user = req.session?.user?.id;

    const clients = await clientService.fetchAllClients(user);

    if (!clients || clients.length == 0) {
      return res.status(200).json({
        success: true,
        message: "You have not added any clients",
      });
    }

    res.status(200).json({
      success: true,
      message: "Here are your clients",
      data: {
        clients,
      },
    });
  } catch (error) {
    next(error);
  }
};

const uploadLogo = (req, res, next) => {
  try {
    const file = req.file;
    console.log(file);
    if (!file) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Return the file URL after successful upload

    return res.status(200).json({
      success: true,
      message: "Logo uploaded successfully",
      data: {
        url: file.location,
        file,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addNewClient,
  listAllClients,
  uploadLogo,
};
