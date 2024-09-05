const inviteValidationSchema = require("../validators/invite.validator");
const validateRequestObject = require("../utils/validation");

const inviteService = require("../services/invite.service");

const AppError = require("../utils/error");

const invite = async (req, res, next) => {
  try {
    const { inviteeEmail, roleId } = req.body;

    const { id: inviterId } = req.session.user;

    const value = validateRequestObject(
      { inviteeEmail, roleId },
      inviteValidationSchema,
    );

    const invite = await inviteService.inviteUser({
      inviterId,
      inviteeEmail,
      inviteeRoleId: roleId,
    });

    res.status(200).json({
      success: true,
      message: "Invitation successful",
      data: { invite },
    });
  } catch (error) {
    next(error);
  }
};

const validateRegistration = async (req, res, next) => {
  try {
    const { uuid } = req.params;

    if (!uuid) {
      return next(
        new AppError(
          "Please visit the invitation link on your email to register on the website",
          400,
        ),
      );
    }

    const invitation = await inviteService.validateRegistration(uuid);

    res.status(200).json({
      success: true,
      message: "Invitation valid",
      data: {
        email: invitation.inviteeEmail,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  invite,
  validateRegistration,
};
