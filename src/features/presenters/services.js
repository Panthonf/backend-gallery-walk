import {
  createProject,
  getProjectByEventId,
  getUserIdByEventId,
  getProjectVirtualMoney,
  uploadProjectImage,
  getProjectImages,
  getProjectDocuments,
} from "./models.js";
import minioClient from "../../middleware/minio.js";
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

    for (let i = 0; i < project.length; i++) {
      const projectImages = await getProjectImages(project[i].id);
      const projectDocuments = await getProjectDocuments(project[i].id);
      project[i].project_image = projectImages;
      project[i].project_document = projectDocuments;
    }

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

const uploadProjectImageService = async (req, rep) => {
  const projectId = parseInt(req.params.projectId);

  try {
    // Extract files from request
    const parts = req.parts();

    const uploadTasks = [];

    for await (const part of parts) {
      console.log(part.filename); // Log each filename
      const projectImageName = `${projectId}-${part.filename}`;

      // Push each upload promise into the array
      uploadTasks.push(
        (async () => {
          try {
            const fileUploaded = await minioClient.putObject(
              "project-bucket",
              projectImageName,
              part.file // Use part.file to access file contents
            );

            if (fileUploaded) {
              const imageProjectData = {
                project_id: projectId,
                project_image: projectImageName,
                project_image_url: `${process.env.MINIO_URL}/project-bucket/${projectImageName}`,
              };

              return await uploadProjectImage(imageProjectData);
            } else {
              return null;
            }
          } catch (error) {
            console.error("Error uploading file:", error);
            return null;
          }
        })()
      );
    }

    // Wait for all upload promises to resolve
    const results = await Promise.all(uploadTasks);

    // Check results and send response accordingly
    const success = results.every((result) => result !== null);
    if (success) {
      rep.send({
        success: true,
        message: "All images saved successfully",
        data: results,
      });
    } else {
      rep.send({
        success: false,
        message: "Some images failed to save",
        data: results,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    rep.send({
      success: false,
      message: "Internal Server Error",
      data: error.message,
    });
  }
};

export {
  createProjectService,
  getProjectByEventIdService,
  uploadProjectImageService,
};
