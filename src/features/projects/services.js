import minioClient from "../../middleware/minio.js";
import { getEventByEventId } from "../events/models.js";
import { getProjectDocuments, getProjectImages } from "../presenters/models.js";
import {
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

//  get project by user id
async function getProjectByUserIdService(req, reply) {
  try {
    const { query, page, pageSize } = req.query;
    const userId = req.session.get("user");
    const allProjects = await getProjectByUserId(query, userId);

    const start = (page - 1) * pageSize;
    const end = page * pageSize;

    const paginatedProjects = allProjects.slice(start, end);

    const projects = paginatedProjects.map(async (project) => {
      const virtualMoney = await getProjectVirtualMoney(project.id);
      const eventData = await getEventByEventId(project.event_id);
      return { ...project, virtual_money: virtualMoney, event_data: eventData };
    });

    if (projects.length === 0) {
      reply.send({
        success: false,
        message: "get projects failed",
        data: userId,
      });
    }
    reply.send({
      success: true,
      message: "get projects successfully",
      data: await Promise.all(projects),
      totalProjects: allProjects.length,
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

    for (let i = 0; i < allProjects.length; i++) {
      const projectImages = await getProjectImages(allProjects[i].id);
      allProjects[i].project_image = projectImages;
      const projectDocuments = await getProjectDocuments(allProjects[i].id);
      allProjects[i].project_document = projectDocuments;
    }

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
    const projectImages = await getProjectImages(projectId);
    data.project_image = projectImages;

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

async function updateProjectService(req, rep, done) {
  const projectId = parseInt(req.params.projectId);
  const projectData = req.body;

  try {
    const data = await updateProject(projectId, projectData.title);
    if (data == null) {
      rep.send({
        message: "not found project",
        success: false,
        data: null,
      });
    }
    rep.send({
      message: "updated project successfully",
      success: true,
      data: data,
    });
  } catch (error) {
    rep.send({
      success: false,
      message: err.message,
      data: null,
    });
  }
}

async function updateProjectDescriptionService(req, rep, done) {
  const projectId = parseInt(req.params.projectId);
  const projectData = req.body;

  // rep.send({
  //   message: "update project description successfully",
  //   projectData: projectData.description,
  //   projectId: projectId,
  // });
  // done();

  try {
    const data = await updateProjectDescription(
      projectId,
      projectData.description
    );
    if (data == null) {
      rep.send({
        message: "not found project",
        success: false,
        data: null,
      });
    }
    rep.send({
      message: "updated project successfully",
      success: true,
      data: data,
    });
  } catch (error) {
    rep.send({
      success: false,
      message: err.message,
      data: null,
    });
  }
}

async function getProjectVirtualMoneyService(req, rep, done) {
  const projectId = parseInt(req.params.projectId);

  try {
    const data = await getProjectVirtualMoney(projectId);
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
  } catch (err) {
    rep.send({
      success: false,
      message: err.message,
      data: null,
    });
  }
}

async function getProjectCommentsService(req, rep, done) {
  const projectId = parseInt(req.params.projectId);

  try {
    const data = await getProjectComments(projectId);
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
  } catch (err) {
    rep.send({
      success: false,
      message: err.message,
      data: null,
    });
  }
}

const deleteProjectImageService = async (req, rep) => {
  const projectId = parseInt(req.params.projectId);
  const projectImage = req.params.projectImage;

  try {
    const data = await deleteProjectImage(projectId, projectImage);
    minioClient.removeObject("project-bucket", projectImage).then((err) => {
      if (err) {
        rep.send({
          success: false,
          message: "delete project image failed",
          data: null,
        });
      }
    });
    if (data == null) {
      rep.send({
        message: "not found project",
        success: false,
        data: null,
      });
    }
    rep.send({
      message: "deleted project image successfully",
      success: true,
      data: data,
    });
  } catch (err) {
    rep.send({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

const addProjectDocumentService = async (req, rep) => {
  const projectId = parseInt(req.params.projectId);
  const parts = req.files();
  const files = [];

  const success = [];
  for await (const part of parts) {
    if (part.file) {
      const filename = `${projectId}-${part.filename}`;
      files.push({ filename: filename });
      minioClient.putObject(
        "document-bucket",
        filename,
        part.file,
        function (err, etag) {
          if (err) {
            success.push(false);
          }
        }
      );
      const documentData = {
        project_id: projectId,
        document_name: filename,
        document_url: `${process.env.MINIO_URL}/document-bucket/${filename}`,
      };

      const document = await addProjectDocument(documentData);
      if (!document) {
        success.push(false);
      }
      success.push(true);
    }
  }

  if (success.includes(false)) {
    rep.send({
      success: false,
      message: "add project document failed",
      data: null,
    });
  }
  rep.send({
    success: true,
    message: "add project document successfully",
    data: files,
  });
};

export {
  createProjectService,
  addProjectMemberService,
  getProjectByUserIdService,
  getProjectByEventIdService,
  searchProjectService,
  getProjectByProjectIdService,
  updateProjectService,
  updateProjectDescriptionService,
  getProjectVirtualMoneyService,
  getProjectCommentsService,
  deleteProjectImageService,
  addProjectDocumentService,
};
