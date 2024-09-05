const eventService = require("../../services/event.service");
const validateRequestObject = require("../../utils/validation");
const eventValidateSchema = require("../../validators/event.validator");

const addNewEvent = async (req, res, next) => {
  try {
    const { eventName, eventDate } = req.body;
    const { id: createdBy } = req.session.user;

    const value = validateRequestObject(
      { eventName, eventDate },
      eventValidateSchema,
    );

    const newEvent = await eventService.addEvent({
      eventName: value.eventName,
      eventDate: value.eventDate,
      createdBy,
    });

    res.status(200).json({
      success: true,
      message: "Added new event",
      data: {
        newEvent,
      },
    });
  } catch (error) {
    next(error);
  }
};

const listAllEvents = async (req, res, next) => {
  try {
    let { date: eventDate, month: eventMonth } = req.query;

    eventDate = eventDate ? new Date(eventDate).toISOString() : eventDate;

    const events = await eventService.fetchAllEvents({
      eventDate,
      eventMonth,
    });

    if (events.length <= 0) {
      return res.status(200).json({
        success: true,
        message: "No events for this date found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fetched all events",
      data: {
        events,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addNewEvent,
  listAllEvents,
};
