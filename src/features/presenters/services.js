import {
  createProject,
  getProjectByEventId,
  getUserIdByEventId,
  getProjectVirtualMoney,
} from "./models.js";
async function createProjectService(req, rep) {
  try {
    const userId = req.session.get("user");
    const projectData = req.body;
    const eventId = parseInt(req.params.eventId);

    if (!userId) {
      rep.send({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    if (!eventId) {
      rep.send({
        success: false,
        message: "Event not found",
        data: null,
      });
    }

    const project = await createProject(userId, eventId, projectData);
    if (!project) {
      rep.send({
        success: false,
        message: "Project not created",
        data: null,
      });
    }

    rep.send({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    rep.send({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
}

async function getProjectByEventIdService(req, rep) {
  try {
    const eventId = parseInt(req.params.eventId);
    const { query, page, pageSize } = req.query;

    const start = (page - 1) * pageSize;
    const end = page * pageSize;


    if (!eventId) {
      rep.send({
        success: false,
        message: "event id not found",
        data: null,
      });
    }

    const userId = await getUserIdByEventId(eventId);
    if (!userId) {
      rep.send({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    const allProjects = await getProjectByEventId(eventId, query);
    if (allProjects.length < 1) {
      rep.send({
        success: false,
        message: "Project not found",
        data: null,
      });
    }

    const project = allProjects.slice(start, end);

    // Check if user is logged in
    const userSession = await req.session.get("user");

    if (userId.user_id !== userSession) {
      rep.send({
        success: true,
        message: "Project fetched successfully gg",
        data: project,
        // userSession: userSession,
        // userId: userId.user_id,
      });
    }

    for (let i = 0; i < project.length; i++) {
      const virtualMoney = await getProjectVirtualMoney(project[i].id);
      project[i].virtual_money = virtualMoney;
    }

    rep.send({
      success: true,
      message: "Project fetched successfully",
      data: project,
    });
  } catch (error) {
    rep.send({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
}

export { createProjectService, getProjectByEventIdService };
