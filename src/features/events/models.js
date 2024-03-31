import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
      location: eventData.location,
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

async function deleteThumbnail(eventId) {
  const thumbnail = await prisma.thumbnails.deleteMany({
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

async function searchEvent(searchData, userId) {
  const events = await prisma.events.findMany({
    where: {
      OR: [
        {
          event_name: {
            contains: searchData,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchData,
            mode: "insensitive",
          },
        },
        {
          organization: {
            contains: searchData,
            mode: "insensitive",
          },
        },
      ],
      user_id: userId,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return events;
}

async function getEventManagerInfo(userId) {
  const eventManagerInfo = await prisma.users.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      first_name_en: true,
      last_name_en: true,
      first_name_th: true,
      last_name_th: true,
      email: true,
      profile_pic: true,
      affiliation: true,
    },
  });

  return eventManagerInfo;
}

async function getTotalProjectsByEventId(eventId) {
  const totalProjects = await prisma.projects.count({
    where: {
      event_id: eventId,
    },
  });
  return totalProjects;
}

const updateEvent = async (eventId, updatedEventData) => {
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
      updated_at: new Date(),
      location: updatedEventData.location,
    },
  });
  return event;
};

const getEventTotalVirtualMoney = async (eventId) => {
  const totalProjects = await prisma.virtual_moneys.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      event_id: eventId,
    },
  });
  return totalProjects._sum ? totalProjects._sum.amount : 0;
};

const getEventProjects = async (eventId) => {
  const projects = await prisma.projects.findMany({
    where: {
      event_id: eventId,
    },
  });
  return projects;
};

const getTotalGiveVirtualMoney = async (eventId) => {
  const totalGiveVirtualMoney = await prisma.virtual_moneys.groupBy({
    by: ["guest_id"],
    where: {
      event_id: eventId,
    },
  });
  return totalGiveVirtualMoney.length;
};

const getTotalGiveComments = async (eventId) => {
  const getProjectId = await prisma.projects.findMany({
    where: {
      event_id: eventId,
    },
    select: {
      id: true,
    },
  });

  const projectId = getProjectId.map((project) => project.id);

  const totalGiveComments = await prisma.comments.groupBy({
    by: ["project_id"],
    where: {
      project_id: {
        in: projectId,
      },
    },
  });

  return totalGiveComments.length;
};

const getTotalEventComments = async (eventId) => {
  const getProjectId = await prisma.projects.findMany({
    where: {
      event_id: eventId,
    },
    select: {
      id: true,
    },
  });

  const projectId = getProjectId.map((project) => project.id);

  const totalEventComments = await prisma.comments.count({
    where: {
      project_id: {
        in: projectId,
      },
    },
  });

  return totalEventComments;
};

const getProjectsRanking = async (eventId) => {
  const projectId = await prisma.projects.findMany({
    where: {
      event_id: eventId,
    },
    select: {
      id: true,
    },
  });

  const projectIds = projectId.map((project) => project.id);

  const projectsRanking = await prisma.virtual_moneys.groupBy({
    by: ["project_id"],
    where: {
      project_id: {
        in: projectIds,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const projectsRankingData = projectsRanking.map((project) => {
    return {
      project_id: project.project_id,
      amount: project._sum.amount,
    };
  });

  const projectData = await Promise.all(
    projectsRankingData.map(async (project) => {
      const projectInfo = await prisma.projects.findUnique({
        where: {
          id: project.project_id,
        },
        select: {
          id: true,
          title: true,
        },
      });

      return {
        ...project,
        title: projectInfo.title,
      };
    })
  );

  return projectData.sort((a, b) => b.amount - a.amount);
};

const getProjectsNotRanked = async (eventId) => {
  const projectId = await prisma.projects.findMany({
    where: {
      event_id: eventId,
    },
    select: {
      id: true,
    },
  });

  const projectIds = projectId.map((project) => project.id);

  const filterProjectRanking = await prisma.virtual_moneys.findMany({
    where: {
      project_id: {
        in: projectIds,
      },
    },
  });

  const filterNotRanked = projectIds.filter((project) => {
    return !filterProjectRanking.some(
      (rankedProject) => rankedProject.project_id === project
    );
  });


  const projectData = await Promise.all(
    filterNotRanked.map(async (project) => {
      const projectInfo = await prisma.projects.findUnique({
        where: {
          id: project,
        },
        select: {
          id: true,
          title: true,
        },
      });

      return {
        ...projectInfo,
      };
    })
  );

  return projectData;
};

export {
  createEvent,
  deleteEvent,
  uploadThumbnail,
  getThumbnailByEventId,
  getEventByEventId,
  updateEventPublish,
  searchEvent,
  getEventManagerInfo,
  getTotalProjectsByEventId,
  updateEvent,
  deleteThumbnail,
  getEventTotalVirtualMoney,
  getEventProjects,
  getTotalGiveVirtualMoney,
  getTotalGiveComments,
  getTotalEventComments,
  getProjectsRanking,
  getProjectsNotRanked,
};
