import {
  getAllEventsService,
  createEventService,
  updateEventService,
  deleteEventService,
  getEventByUserIdService,
  uploadThumbnailService
} from "./services.js";

const schema = {
  body: {
    type: "object",
    required: [
      "event_name",
      "start_date",
      "end_date",
      "assistant_emails",
      "description",
      "submit_start",
      "submit_end",
      "number_of_member",
      "virtual_money",
      "unit_money",
      // "published",
      // "organization",
      // "video_link",
      // "user_id",
    ],
    properties: {
      event_name: { type: "string", minLength: 1, maxLength: 255 },
      start_date: { type: "string" },
      end_date: { type: "string" },
      description: { type: "string" },
      submit_start: { type: "string" },
      submit_end: { type: "string" },
      number_of_member: { type: "number" },
      virtual_money: { type: "number" },
      unit_money: { type: "string" },
      published: { type: "boolean" },
      organization: { type: "string" },
      video_link: { type: "string" },
      // user_id: { type: "number" },
    },
  },
};

export default async (fastify) => {
  fastify.post("/", { schema }, createEventService);
  fastify.get("/", getAllEventsService);
  fastify.get("/user/:userId", getEventByUserIdService);
  fastify.put("/:id", updateEventService);
  fastify.delete("/:id", deleteEventService);
  fastify.post("/upload-thumbnail", uploadThumbnailService);
};
