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
};
