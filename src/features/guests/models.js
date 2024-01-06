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

async function createGuest(guestData) {
  const guest = await prisma.guests.create({
    data: {
      first_name_th: guestData.first_name_th,
      last_name_th: guestData.last_name_th,
      first_name_en: guestData.first_name_en,
      last_name_en: guestData.last_name_en,
      email: guestData.email,
      profile_pic: guestData.profile_pic,
    },
  });
  return guest;
}

async function checkGuest(email) {
  const guest = await prisma.guests.findMany({
    where: {
      email: email,
    },
  });
  return guest;
}

export { getEventByEventId, getAllEvents, createGuest, checkGuest };
