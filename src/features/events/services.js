import minioClient from "../../middleware/minio.js";
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventByUserId,
} from "./models.js";

async function getAllEventsService(request, reply) {
  try {
    const events = await getAllEvents();
    if (events.length === 0) {
      reply.status(404).send({
        success: false,
        message: "Data not found",
        data: null,
      });
    } else {
      reply.send({
        success: true,
        message: "Events fetched successfully",
        data: events,
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

async function createEventService(req, reply, done) {
  try {
    const userId = req.session.get("user");
    const eventData = req.body;
    eventData.user_id = userId;
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

async function updateEventService(request, reply, done) {
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

async function deleteEventService(request, reply, done) {
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

async function getEventByUserIdService(request, reply, done) {
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

async function uploadThumbnailService(request, reply, done) {
  const eventId = request.query.id;
  const thumbnail = await request.file();

  // Access the filename
  const thumbnailName = thumbnail.filename;

  await minioClient
    .putObject("event-bucket", thumbnailName, thumbnail.file)
    .then((res) => {
      console.log("File uploaded successfully.");
    })
    .catch((err) => {
      console.log(err);
    });

  reply.send({
    imageUrl: `${process.env.MINIO_ENDPOINT}/event-bucket/${thumbnailName}`,
    eventId: eventId,
  });

  done();
  reply.send({
    success: true,
    message: "Thumbnail uploaded successfully",
    data: {
      eventId: eventId,
      thumbnailName,
    },
  });
}

async function getThumbnail(request, reply, done) {
  const eventId = request.params.id;
  const thumbnailName = "PLoS_oral_cancer.png";

  try {
    const stream = await minioClient.getObject("event-bucket", thumbnailName);
    reply.send({
      success: true,
      message: "Thumbnail fetched successfully",
      data: stream,
    });
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
}

async function getAllUserEvents(req, reply, done){
  const userId = req.session.get("user");
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
  getAllEventsService,
  createEventService,
  updateEventService,
  deleteEventService,
  getEventByUserIdService,
  uploadThumbnailService,
  getThumbnail,
  getAllUserEvents
};
