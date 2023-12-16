import {
  getAllUsersController,
  createUserController,
  deleteUserController,
  getUserByIdController,
  getUserByEmailService
} from "./services.js";

export default async (fastify) => {
  fastify.get("/", getAllUsersController);
  fastify.get("/profile", getUserByIdController);
  fastify.post("/", createUserController);
  fastify.delete("/:id", deleteUserController);
  fastify.get("/:email", getUserByEmailService)
};
