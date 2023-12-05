import eventController from "../controllers/eventController.js";

const schema = {
  body: {
    type: "object",
    required: ["name", "description"],
    properties: {
      name: { type: "string" },
      description: { type: "string" },
      //   date: { type: "string" },
      //   location: { type: "string" },
    },
  },
};

export default async (fastify) => {
  fastify.get("/", eventController.getAllEvents);
  fastify.get("/:id", eventController.getEventById);
  fastify.post("/", { schema }, eventController.createEvent);
  fastify.put("/:id", eventController.updateEvent);
  fastify.delete("/:id", eventController.deleteEvent);
};
