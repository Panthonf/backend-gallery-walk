import minioClient from "../../middleware/minio.js";
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventByUserId,
  uploadThumbnail,
  getThumbnailByEventId,
  getEventByEventId,
  updateEventPublish,
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
    const eventData = {
      ...req.body,
      user_id: userId,
    };

    const event = await createEvent(eventData);

    if (event) {
      try {
        reply.status(201).send({
          success: true,
          message: "Event created successfully",
          data: event,
        });
      } catch (uploadError) {
        console.error("Error uploading file:", uploadError);
        reply.status(500).send({
          success: false,
          message: "Error uploading file",
          data: null,
        });
      }
    } else {
      reply.status(500).send({
        success: false,
        message: "Internal Server Error",
        data: null,
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);
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
  const userId = request.session.get("user");
  try {
    const events = await getEventByUserId(userId);
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

async function uploadThumbnailService(request, reply, done) {
  const eventId = parseInt(request.params.id);
  const thumbnail = await request.file();
  const thumbnailName = `${eventId}-${thumbnail.filename}`;

  try {
    const upload = minioClient.putObject(
      "event-bucket",
      thumbnailName,
      thumbnail.file,
      function (err, etag) {
        if (err) {
          console.log(err);
          return reply.status(500).send({
            success: false,
            message: "Error uploading file",
            data: null,
          });
        }
        console.log("File uploaded successfully.");
      }
    );

    const thumbnailData = {
      event_id: eventId,
      thumbnail: thumbnailName,
      thumbnail_url: `${process.env.MINIO_ENDPOINT}/event-bucket/${thumbnailName}`,
    };

    const thumbnailUploaded = await uploadThumbnail(thumbnailData);
    if (thumbnailUploaded) {
      reply.send({
        success: true,
        message: "Thumbnail uploaded successfully",
        data: thumbnailUploaded,
      });
    } else {
      reply.status(500).send({
        success: false,
        message: "Internal Server Error",
        data: null,
      });
    }
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

async function getThumbnailByEventIdService(request, reply, done) {
  const eventId = parseInt(request.params.eventId);
  try {
    const thumbnail = await getThumbnailByEventId(eventId);
    if (thumbnail.length === 0) {
      reply.status(404).send({
        success: false,
        message: "Data not found",
        data: null,
      });
    } else {
      reply.send({
        success: true,
        message: "Thumbnail fetched successfully",
        data: thumbnail,
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

async function getEventByEventIdService(request, reply, done) {
  const eventId = parseInt(request.params.id);
  try {
    const event = await getEventByEventId(eventId);
    if (event.length === 0) {
      reply.status(404).send({
        success: false,
        message: "Data not found",
        data: null,
      });
    } else {
      reply.send({
        success: true,
        message: "Event fetched successfully",
        data: event,
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

async function updateEventPublishedService(request, reply, done) {
  const eventId = parseInt(request.params.id);

  const publishedEvent = await updateEventPublish(eventId);
  if (publishedEvent) {
    reply.send({
      success: true,
      message: `Event "${publishedEvent.event_name}" published successfully`,
      data: publishedEvent,
    });
  } else {
    reply.status(404).send({
      success: false,
      message: `Event with id ${eventId} not found`,
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
  getThumbnailByEventIdService,
  getEventByEventIdService,
  updateEventPublishedService,
};
