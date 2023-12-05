import eventController from "../controllers/eventController.js";

const schema = {
  body: {
    type: "object",
    required: [
      "eventName",
      "startDate",
      "endDate",
      "assistantEmail",
      "description",
      "submitStart",
      "submitEnd",
      "numberOfMember",
      "virtualMoney",
      "unitMoney",
      "createdByUserId",
    ],
    properties: {
      eventName: { type: "string" },
      description: { type: "string" },
      startDate: { type: "string" },
      endDate: { type: "string" },
      assistantEmail: { type: "string" },
      submitStart: { type: "string" },
      submitEnd: { type: "string" },
      numberOfMember: { type: "number" },
      virtualMoney: { type: "number" },
      unitMoney: { type: "string" },
      createdByUserId: { type: "string" },
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
