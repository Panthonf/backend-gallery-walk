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

async function getProjectByUserId(userId) {
  const projects = await prisma.projects.findMany({
    where: {
      user_id: userId,
    },
  });
  return projects;
}

export { createProject, addProjectMember, getProjectByUserId };
