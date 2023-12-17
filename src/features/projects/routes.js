import {
  createProjectService,
  addProjectMemberService,
  getProjectByUserIdService,
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
};
