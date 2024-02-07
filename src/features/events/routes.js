import {
  createEventService,
  deleteEventService,
  uploadThumbnailService,
  getThumbnailByEventIdService,
  getEventByEventIdService,
  updateEventPublishedService,
  searchEventService,
  getEventManagerInfoService,
  checkEventRoleService,
  updateEventService,
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
  fastify.get("/", async (request, reply) => {
    reply.send({
      message: "/events",
    });
  });

  fastify.post(
    "/",
    {
      preValidation: [fastify.checkSessionMiddleware],
      schema,
    },
    createEventService
  );

  fastify.put(
    "/:eventId",
    {
      preValidation: [fastify.checkSessionMiddleware],
      // schema,
    },
    updateEventService
  );

  fastify.get(
    "/:eventId",
    { preValidation: [fastify.checkSessionMiddleware] },
    getEventByEventIdService
  );
  fastify.get(
    "/search",
    { preValidation: [fastify.checkSessionMiddleware] },
    searchEventService
  );

  fastify.delete("/:eventId", deleteEventService);

  fastify.put("/:eventId/publish", updateEventPublishedService);
  fastify.get("/event-manager-info/:userId", getEventManagerInfoService);

  fastify.post("/upload/thumbnail/:eventId", uploadThumbnailService);
  fastify.get("/thumbnail/:eventId", getThumbnailByEventIdService);

  fastify.get("/role/:eventId", checkEventRoleService);

};
