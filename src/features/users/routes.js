import {
  getAllUsersController,
  deleteUserController,
  getUserByIdController,
  getUserByUserIdService,
} from "./services.js";

export default async (fastify) => {
  fastify.get("/", getAllUsersController);
  fastify.get("/profile", getUserByIdController);
  fastify.get("/:userId", getUserByUserIdService);
  fastify.delete("/:userId", deleteUserController);
  fastify.get("/get-session", async (request, reply) => {
    const userId = await request.session.get("user");
    if (await request.session.get("user")) {
      reply.send({
        success: true,
        message: "User logged in successfully",
        data: request.session.get("user"),
      });
    } else {
      reply.send({
        success: false,
        message: "User not logged in",
        data: userId || null,
      });
    }
  });

  fastify.get("/logout", async (request, reply) => {
    request.session.set("user", null);
    reply.send({
      success: true,
      message: "User logged out successfully",
      data: null,
    });
  });
};
