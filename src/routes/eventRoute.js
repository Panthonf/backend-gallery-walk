import eventController from "../controllers/eventController.js";

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
      "created_by_user_id",
    ],
    properties: {
      event_name: { type: "string", minLength: 1, maxLength: 255 },
      start_date: { type: "string" },
      end_date: { type: "string" },
      assistant_emails: { type: "array" },
      description: { type: "string" },
      submit_start: { type: "string" },
      submit_end: { type: "string" },
      number_of_member: { type: "number" },
      virtual_money: { type: "number" },
      unit_money: { type: "string" },
      created_by_user_id: { type: "number" },
    },
  },
};

export default async (fastify) => {
  fastify.get("/", eventController.getAllEvents);
  fastify.get("/:id", eventController.getEventById);
  fastify.get("/user/:userId", eventController.getEventByUserId);
  fastify.post("/", { schema }, eventController.createEvent);
  fastify.put("/:id", eventController.updateEvent);
  fastify.delete("/:id", eventController.deleteEvent);
};
