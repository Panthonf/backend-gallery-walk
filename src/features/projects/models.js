import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function createProject(projectData) {
  const project = await prisma.projects.create({
    data: {
      title: projectData.title,
      description: projectData.description,
      user_id: projectData.user_id,
      event_id: projectData.event_id,
    },
  });

  return project;
}

async function addProjectMember(memberData) {
  const member = await prisma.project_members.create({
    data: {
      name: memberData.name,
      email: memberData.email,
      project_id: memberData.project_id,
    },
  });

  return member;
}

async function getProjectByUserId(query, userId) {
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
      user_id: userId,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return projects;
}

async function getProjectsByEventId(eventId) {
  const projects = await prisma.projects.findMany({
    where: {
      event_id: eventId,
    },
  });
  return projects;
}

async function searchProjectByEventId(searchData, eventId) {
  const projects = await prisma.projects.findMany({
    where: {
      OR: [
        {
          title: {
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
      ],
      event_id: eventId,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return projects;
}

async function getProjectByProjectId(projectId) {
  const project = await prisma.projects.findUnique({
    where: {
      id: projectId,
    },
  });

  return project;
}

const updateProject = async (projectId, title) => {
  const project = await prisma.projects.update({
    where: {
      id: projectId,
    },
    data: {
      title: title,
    },
  });

  return project;
};

const updateProjectDescription = async (projectId, description) => {
  const project = await prisma.projects.update({
    where: {
      id: projectId,
    },
    data: {
      description: description,
    },
  });

  return project;
};

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

async function getProjectComments(projectId) {
  const comments = await prisma.comments.findMany({
    where: {
      project_id: projectId,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return comments;
}

const deleteProjectImage = async (projectId, projectImage) => {
  const image = await prisma.project_images.deleteMany({
    where: {
      project_id: projectId,
      project_image: projectImage,
    },
  });

  return image;
};

const addProjectDocument = async (documentData) => {
  const document = await prisma.documents.create({
    data: {
      project_id: documentData.project_id,
      document_name: documentData.document_name,
      document_url: documentData.document_url,
      created_at: documentData.created_at,
      updated_at: documentData.updated_at,
    },
  });

  return document;
};

const deleteProjectDocument = async (projectId, projectDocument) => {
  const document = await prisma.documents.deleteMany({
    where: {
      project_id: projectId,
      document_name: projectDocument,
    },
  });
  return document;
};

export {
  createProject,
  addProjectMember,
  getProjectByUserId,
  getProjectsByEventId,
  searchProjectByEventId,
  getProjectByProjectId,
  updateProject,
  updateProjectDescription,
  getProjectVirtualMoney,
  getProjectComments,
  deleteProjectImage,
  addProjectDocument,
  deleteProjectDocument,
};
