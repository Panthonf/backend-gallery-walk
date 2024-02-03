import minioClient from "../../middleware/minio.js";
import {
  createEvent,
  deleteEvent,
  uploadThumbnail,
  getThumbnailByEventId,
  getEventByEventId,
  updateEventPublish,
  searchEvent,
  getEventManagerInfo,
  getTotalProjectsByEventId,
  updateEvent,
} from "./models.js";

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

async function deleteEventService(request, reply, done) {
  const eventId = parseInt(request.params.eventId);
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

async function uploadThumbnailService(request, reply, done) {
  const eventId = parseInt(request.params.eventId);
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
  const eventId = parseInt(request.params.eventId);
  try {
    const event = await getEventByEventId(eventId);
    const totalProjects = await getTotalProjectsByEventId(eventId);
    if (!event) {
      reply.status(404).send({
        success: false,
        message: "Event not found",
        data: null,
      });
    } else {
      reply.send({
        success: true,
        message: "Event fetched successfully",
        data: event,
        totalProjects: totalProjects || 0,
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
  const eventId = parseInt(request.params.eventId);

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

async function searchEventService(request, reply, done) {
  try {
    const { query, page, pageSize } = request.query;
    const userId = request.session.get("user");

    // Fetch all events based on the search query
    const allEvents = await searchEvent(query, userId);

    // Calculate start and end based on the entire dataset
    const start = (page - 1) * pageSize;
    const end = page * pageSize;

    // Get the paginated subset from the entire dataset
    const paginatedEvents = allEvents.slice(start, end);

    if (paginatedEvents.length === 0) {
      reply.status(404).send({
        success: false,
        message: "Data not found",
        data: null,
      });
    } else {
      reply.send({
        success: true,
        message: "Events fetched successfully",
        data: paginatedEvents,
        totalEvents: allEvents.length,
      });
    }
  } catch (error) {
    console.error("Error in searchEventService:", error);
    reply.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
}

async function getEventManagerInfoService(request, reply, done) {
  const userId = parseInt(request.params.userId);
  try {
    const eventManagerInfo = await getEventManagerInfo(userId);
    if (!eventManagerInfo) {
      reply.status(404).send({
        success: false,
        message: "Event Manager not found",
        data: null,
      });
    } else {
      reply.send({
        success: true,
        message: "Event Manager fetched successfully",
        data: eventManagerInfo,
      });
    }
  } catch (error) {
    console.error("Error in getEventManagerInfoService:", error);
    reply.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
}

const checkEventRoleService = async (request, reply, done) => {
  const userId = request.session.get("user");
  const eventId = parseInt(request.params.eventId);
  if (!userId)
    reply
      .status(401)
      .send({ success: false, message: "Unauthorized", data: null });
  try {
    const event = await getEventByEventId(eventId);

    if (!event) {
      reply.status(404).send({
        success: false,
        message: "Event not found",
        data: null,
      });
    } else {
      if (event.user_id === userId) {
        reply.send({
          success: true,
          message: "Event Manager",
          role: "manager",
        });
      } else {
        reply.send({
          success: true,
          message: "Participant",
          role: "presenter",
        });
      }
    }
  } catch (error) {
    console.error("Error in checkEventRoleService:", error);
    reply.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
};

const updateEventService = async (request, reply, done) => {
  const eventId = parseInt(request.params.eventId);
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

export {
  createEventService,
  deleteEventService,
  uploadThumbnailService,
  getThumbnailByEventIdService,
  getEventByEventIdService,
  updateEventPublishedService,
  searchEventService,
  getEventManagerInfoService,
  checkEventRoleService,
  updateEventService
};
