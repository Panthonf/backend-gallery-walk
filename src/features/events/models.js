import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function getAllEvents() {
  const events = await prisma.events.findMany();
  return events;
}

async function createEvent(eventData) {
  const event = await prisma.events.create({
    data: {
      event_name: eventData.event_name,
      start_date: eventData.start_date,
      end_date: eventData.end_date,
      description: eventData.description,
      submit_start: eventData.submit_start,
      submit_end: eventData.submit_end,
      number_of_member: eventData.number_of_member,
      virtual_money: eventData.virtual_money,
      unit_money: eventData.unit_money,
      organization: eventData.organization,
      video_link: eventData.video_link,
      user_id: eventData.user_id,
      created_at: eventData.created_at,
      updated_at: eventData.updated_at,
    },
  });
  return event;
}

async function updateEvent(eventId, updatedEventData) {
  const event = await prisma.events.update({
    where: {
      id: eventId,
    },
    data: {
      event_name: updatedEventData.event_name,
      start_date: updatedEventData.start_date,
      end_date: updatedEventData.end_date,
      description: updatedEventData.description,
      submit_start: updatedEventData.submit_start,
      submit_end: updatedEventData.submit_end,
      number_of_member: updatedEventData.number_of_member,
      virtual_money: updatedEventData.virtual_money,
      unit_money: updatedEventData.unit_money,
      organization: updatedEventData.organization,
      video_link: updatedEventData.video_link,
      user_id: updatedEventData.user_id,
      created_at: updatedEventData.created_at,
      updated_at: updatedEventData.updated_at,
    },
  });
  return event;
}

async function deleteEvent(eventId) {
  const event = await prisma.events.delete({
    where: {
      id: eventId,
    },
  });
  return event;
}

async function getEventByUserId(userId) {
  const events = await prisma.events.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return events;
}

async function uploadThumbnail(thumbnailData) {
  const thumbnail = await prisma.thumbnails.create({
    data: {
      event_id: thumbnailData.event_id,
      thumbnail: thumbnailData.thumbnail,
      thumbnail_url: thumbnailData.thumbnail_url,
      created_at: thumbnailData.created_at,
      updated_at: thumbnailData.updated_at,
    },
  });
  return thumbnail;
}

async function getThumbnailByEventId(eventId) {
  const thumbnail = await prisma.thumbnails.findMany({
    where: {
      event_id: eventId,
    },
  });
  return thumbnail;
}

async function getEventByEventId(eventId) {
  const event = await prisma.events.findUnique({
    where: {
      id: eventId,
    },
  });
  return event;
}

async function updateEventPublish(eventId) {
  const isPublish = await prisma.events.findUnique({
    where: {
      id: eventId,
    },
    select: {
      published: true,
    },
  });

  const event = await prisma.events.update({
    where: {
      id: eventId,
    },
    data: {
      published: !isPublish.published,
    },
  });

  return event;
}

export {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventByUserId,
  uploadThumbnail,
  getThumbnailByEventId,
  getEventByEventId,
  updateEventPublish,
};
