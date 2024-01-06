import {
  createProject,
  addProjectMember,
  getProjectByUserId,
  getProjectsByEventId,
  searchProjectByEventId,
  getProjectByProjectId,
} from "./models.js";

async function createProjectService(req, reply, done) {
  try {
    const userId = req.session.get("user");
    const projectData = { ...req.body, user_id: userId };
    createProject(projectData);
    reply.send({
      success: true,
      message: "created project successfully!",
      data: projectData,
    });
  } catch (err) {
    reply.send({
      success: false,
      message: err.message,
      data: null,
    });
  }
}

async function addProjectMemberService(req, reply) {
  try {
    const member = req.body;
    const addMember = await addProjectMember(member);
    if (!addMember) {
      reply.send({
        success: false,
        message: "add project member failed",
        data: null,
      });
    }
    reply.send({
      success: true,
      message: "add project member successfully",
      data: addMember,
    });
  } catch (err) {
    reply.send({
      success: false,
      message: err.message,
      data: null,
    });
  }
}

async function getProjectByUserIdService(req, reply) {
  try {
    const userId = req.session.get("user");
    const projects = await getProjectByUserId(userId);
    if (!projects) {
      reply.send({
        success: false,
        message: "get projects failed",
        data: null,
      });
    }
    reply.send({
      success: true,
      message: "get projects successfully",
      data: projects,
    });
  } catch (err) {
    reply.send({
      success: false,
      message: err.message,
      data: null,
    });
  }
}

async function getProjectByEventIdService(req, reply) {
  try {
    const eventId = parseInt(req.params.eventId);
    const project = await getProjectsByEventId(eventId);
    if (!project) {
      reply.send({
        success: false,
        message: "get project failed",
        data: null,
      });
    }
    reply.send({
      success: true,
      message: "get project successfully",
      projectsCount: project.length,
      data: project,
    });
  } catch (err) {
    reply.send({
      success: false,
      message: err.message,
      data: null,
    });
  }
}

async function searchProjectService(request, reply, done) {
  try {
    const { query, page, pageSize } = request.query;
    const eventId = parseInt(request.params.eventId);
    const allProjects = await searchProjectByEventId(query, eventId);

    const start = (page - 1) * pageSize;
    const end = page * pageSize;

    const paginatedEvents = allProjects.slice(start, end);

    if (paginatedEvents.length === 0) {
      reply.status(404).send({
        success: false,
        message: "No projects found",
        data: null,
      });
    } else {
      reply.send({
        success: true,
        message: "Projects fetched successfully",
        data: paginatedEvents,
        totalProjects: allProjects.length,
      });
    }
  } catch (err) {
    reply.send({
      success: false,
      message: err.message,
      data: null,
    });
  }
}

async function getProjectByProjectIdService(req, rep, done) {
  const projectId = parseInt(req.params.projectId);

  projectId === null
    ? rep.send({
        message: "not have project id, please provide project id",
        error: true,
        data: null,
      })
    : "";

  try {
    const data = await getProjectByProjectId(projectId);
    if (data == null) {
      rep.send({
        message: "not found project",
        success: false,
        data: null,
      });
    }
    rep.send({
      message: "fetched project successfully",
      success: true,
      data: data,
    });
  } catch {
    rep.send({
      success: false,
      message: err.message,
      data: null,
    });
  }
}

export {
  createProjectService,
  addProjectMemberService,
  getProjectByUserIdService,
  getProjectByEventIdService,
  searchProjectService,
  getProjectByProjectIdService,
};
