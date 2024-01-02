import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function getEventByEventId(eventId) {
  const event = await prisma.events.findUnique({
    where: {
      id: eventId,
    },
  });
  return event;
}

async function getAllEvents() {
  const events = await prisma.events.findMany();
  return events;
}

export { getEventByEventId, getAllEvents };
