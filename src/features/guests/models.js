import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function getEventByEventId(eventId) {
  const event = await prisma.events.findUnique({
    where: {
      id: eventId,
      published: true,
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
    select: {
      id: true,
      first_name_th: true,
      last_name_th: true,
      first_name_en: true,
      last_name_en: true,
      email: true,
      profile_pic: true,
    },
  });
  return guest;
}

async function getGuestData(guestId) {
  const guest = await prisma.guests.findUnique({
    where: {
      id: guestId,
    },
    select: {
      id: true,
      first_name_th: true,
      last_name_th: true,
      first_name_en: true,
      last_name_en: true,
      email: true,
      profile_pic: true,
      virtual_money: true,
      last_activity_at: true,
    },
  });
  return guest;
}

async function addVirtualMoney(guestId, virtualMoney) {
  const guest = await prisma.guests.update({
    where: {
      id: guestId,
    },
    data: {
      virtual_money: virtualMoney,
    },
  });
  return guest;
}


export {
  getEventByEventId,
  getAllEvents,
  createGuest,
  checkGuest,
  getGuestData,
  addVirtualMoney,
};
