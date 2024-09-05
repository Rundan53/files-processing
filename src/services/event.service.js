const eventRepository = require("../dataAccess/event.repository");
const AppError = require("../utils/error");

const addEvent = async ({ eventName, eventDate, createdBy }) => {
  const existingEvent = await eventRepository.findOne({
    filter: {
      eventName: eventName.toLowerCase(),
      eventDate,
    },
  });

  if (existingEvent) {
    const message = `Event ${eventName} already exists`;
    const statusCode = 409;
    const errors = [
      {
        eventName: `Event ${eventName} already exists`,
      },
    ];
    throw new AppError(message, statusCode, { errors });
  }

  const eventMonth = new Date(eventDate).getMonth() + 1;

  const newEvent = eventRepository.addNew({
    eventName,
    eventDate,
    createdBy,
    eventMonth,
  });

  return newEvent;
};

const fetchAllEvents = async ({ eventDate, eventMonth }) => {
  if (!eventDate && !eventMonth) {
    return eventRepository.getAllRecords();
  }

  let events = [];

  const queryOptions = { sort: "eventName" };

  if (eventDate) {
    events = await eventRepository.getFilteredRecords({
      filter: {
        eventDate,
      },
      queryOptions,
    });
  } else if (eventMonth) {
    events = await eventRepository.getFilteredRecords({
      filter: {
        eventMonth,
      },
      queryOptions,
    });
  }

  return events;
};

module.exports = {
  addEvent,
  fetchAllEvents,
};
