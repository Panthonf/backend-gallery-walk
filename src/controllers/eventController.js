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
    reply.send(event);
  },
  updateEvent: async (request, reply) => {
    const event = await eventModel.updateEvent(request.params.id, request.body);
    reply.send(event);
  },
  deleteEvent: async (request, reply) => {
    const event = await eventModel.deleteEvent(request.params.id);
    reply.send(event);
  },
};
