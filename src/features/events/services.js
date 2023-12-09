import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventByUserId,
} from "./models.js";

async function getAllEventsController(request, reply) {
  try {
    const events = await getAllEvents();
    reply.send(events);
  } catch (error) {
    console.error(error);
    reply.status(500).send({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

async function createEventController(request, reply, done) {
  try {
    const eventData = request.body;
    const event = await createEvent(eventData);
    if (event) {
      reply.status(201).send({
        success: true,
        message: "Event created successfully",
        data: event,
      });
    } else {
      reply.status(500).send({
        success: false,
        message: "Internal Server Error",
        data: null,
      });
    }
  } catch (error) {
    console.error(error);
    reply.status(500).send({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

async function updateEventController(request, reply, done) {
  const eventId = parseInt(request.params.id);
  const updatedEventData = request.body;
  try {
    const event = await updateEvent(eventId, updatedEventData);
    if (event) {
      reply.send(event);
    } else {
      reply.status(404).send({
        success: false,
        message: "Event not found",
        data: null,
      });
    }
  } catch (error) {
    console.error(error);
    reply.status(500).send({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

async function deleteEventController(request, reply, done) {
  const eventId = parseInt(request.params.id);
  try {
    const deletedEvent = await deleteEvent(eventId);
    if (deletedEvent) {
      reply.send({
        success: true,
        message: `Event "${deletedEvent.event_name}" deleted successfully`,
        data: null,
      });
    } else {
      reply.status(404).send({
        success: false,
        message: `Event with id ${eventId} not found`,
        data: null,
      });
    }
  } catch (error) {
    console.error(error);
    reply.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
}

async function getEventByUserIdController(request, reply, done) {
  const userId = parseInt(request.params.userId);
  try {
    const events = await getEventByUserId(userId);
    reply.send(events);
  } catch (error) {
    console.error(error);
    reply.status(500).send({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

export {
  getAllEventsController,
  createEventController,
  updateEventController,
  deleteEventController,
  getEventByUserIdController,
};
