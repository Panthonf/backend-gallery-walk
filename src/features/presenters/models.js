import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function createProject(userId, eventId, projectData) {
  const project = await prisma.projects.create({
    data: {
      title: projectData.title,
      description: projectData.description,
      user_id: userId,
      event_id: eventId,
    },
  });
  return project;
}

async function getProjectByEventId(eventId, query) {
  const projects = await prisma.projects.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
      event_id: eventId,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return projects;
}

async function getUserIdByEventId(eventId) {
  const userId = await prisma.events.findUnique({
    where: {
      id: eventId,
    },
    select: {
      user_id: true,
    },
  });
  return userId;
}

async function getProjectVirtualMoney(projectId) {
  try {
    const virtualMoney = await prisma.virtual_moneys.aggregate({
      where: {
        project_id: projectId,
      },
      _sum: {
        amount: true,
      },
    });

    return virtualMoney._sum.amount || 0;
  } catch (error) {
    console.error("Error fetching virtual money:", error);
    throw error;
  }
}

const uploadProjectImage = async (imageProjectData) => {
  const project = await prisma.project_images.create({
    data: {
      project_id: imageProjectData.project_id,
      project_image: imageProjectData.project_image,
      project_image_url: imageProjectData.project_image_url,
      created_at: imageProjectData.created_at,
      updated_at: imageProjectData.updated_at,
    },
  });
  return project;
};

const getProjectImages = async (projectId) => {
  const projectImages = await prisma.project_images.findMany({
    where: {
      project_id: projectId,
    },
  });
  return projectImages;
};

export {
  createProject,
  getProjectByEventId,
  getUserIdByEventId,
  getProjectVirtualMoney,
  uploadProjectImage,
  getProjectImages,
};
