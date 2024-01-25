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
  getProjectCommentsService
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
};
