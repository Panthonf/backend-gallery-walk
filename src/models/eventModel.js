import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default {
    getAllEvents: async () => {
        return prisma.event.findMany();
    },
    getEventById: async (eventId) => {
        return prisma.event.findUnique({
        where: { id: eventId },
        });
    },
    createEvent: async (eventData) => {
        return prisma.event.create({
        data: eventData,
        });
    },
    updateEvent: async (eventId, updatedEventData) => {
        return prisma.event.update({
        where: { id: eventId },
        data: updatedEventData,
        });
    },
    deleteEvent: async (eventId) => {
        return prisma.event.delete({
        where: { id: eventId },
        });
    },
}