import eventModel from "../models/eventModel.js";

export default {
  getAllEvents: async (request, reply) => {
    const events = await eventModel.getAllEvents();
    reply.send(events);
  },
  getEventById: async (request, reply) => {
    const event = await eventModel.getEventById(request.params.id);
    reply.send(event);
  },
  createEvent: async (request, reply) => {
    const event = await eventModel.createEvent(request.body);
    if (!event) {
      reply.status(500).send({ error: "Internal Server Error" });
    }

    reply.send({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  },
  updateEvent: async (request, reply) => {
    const event = await eventModel.updateEvent(request.params.id, request.body);
    reply.send(event);
  },
  deleteEvent: async (request, reply) => {
    const event = await eventModel.deleteEvent(request.params.id);
    reply.send(event);
  },

  getEventByUserId: async (request, reply) => {
    const events = await eventModel.getEventByUserId(request.params.userId);
    if(events.length === 0) {
      reply.status(404).send(
        {
          success: false,
          message: "User not found",
        }
      );
    }
    reply.send({
      success: true,
      message: "Event created successfully",
      length: events.length,
      data: events,
    })
  }
};
