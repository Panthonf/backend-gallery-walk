import fastifyMultipart from "@fastify/multipart";
import {
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
  deleteProjectDocumentService,
  deleteProjectService,
} from "./services.js";

export default async (fastify) => {
  fastify.post(
    "/",
    { preValidation: [fastify.checkSessionMiddleware] },
    createProjectService
  );

  fastify.post(
    "/add-member",
    { preValidation: [fastify.checkSessionMiddleware] },
    addProjectMemberService
  );

  fastify.get(
    "/by-user",
    { preValidation: [fastify.checkSessionMiddleware] },
    getProjectByUserIdService
  );

  fastify.get("/:eventId", getProjectByEventIdService);

  fastify.get("/:eventId/search", searchProjectService);

  fastify.get("/get-data/:projectId", getProjectByProjectIdService);

  fastify.put("/update-title/:projectId", updateProjectService);

  fastify.put(
    "/update-description/:projectId",
    updateProjectDescriptionService
  );

  fastify.get("/get-virtual-money/:projectId", getProjectVirtualMoneyService);

  fastify.get("/get-comments/:projectId", getProjectCommentsService);

  fastify.delete(
    "/delete-project-image/:projectId/:projectImage",
    deleteProjectImageService
  );

  fastify.delete(
    "/delete-project-document/:projectId/:projectDocument",
    deleteProjectDocumentService
  );

  fastify.post("/upload-documents/:projectId", addProjectDocumentService);

  fastify.delete("/:projectId", deleteProjectService);
};
