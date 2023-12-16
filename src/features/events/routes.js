import {
  createEventService,
  updateEventService,
  deleteEventService,
  getEventByUserIdService,
  uploadThumbnailService,
  getAllEventsService,
  getThumbnailByEventIdService,
} from "./services.js";

const schema = {
  body: {
    type: "object",
    properties: {
      event_name: { type: "string" },
      start_date: { type: "string" },
      end_date: { type: "string" },
      description: { type: "string" },
      submit_start: { type: "string" },
      submit_end: { type: "string" },
      number_of_member: { type: "number" },
      virtual_money: { type: "number" },
      unit_money: { type: "string" },
      organization: { type: "string" },
      video_link: { type: "string" },
    },
    required: [
      "event_name",
      "start_date",
      "end_date",
      "description",
      "submit_start",
      "submit_end",
      "number_of_member",
      "virtual_money",
      "unit_money",
    ],
  },
};

export default async (fastify) => {
  fastify.post(
    "/",
    {
      preValidation: [fastify.checkSessionMiddleware],
      schema,
    },
    createEventService
  );

  fastify.get(
    "/by-user",
    { preValidation: [fastify.checkSessionMiddleware] },
    getEventByUserIdService
  );

  fastify.get("/", getAllEventsService);

  fastify.put("/:id", updateEventService);
  fastify.delete("/:id", deleteEventService);
  fastify.post("/upload/thumbnail/:id", uploadThumbnailService);

  fastify.get("/thumbnail/:eventId", getThumbnailByEventIdService);
};
