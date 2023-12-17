import {
  createProject,
  addProjectMember,
  getProjectByUserId,
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

export {
  createProjectService,
  addProjectMemberService,
  getProjectByUserIdService,
};
