import {
  getAllUsersController,
  createUserController,
  deleteUserController,
  getUserByIdController,
} from "../controllers/userController.js";

export default async (fastify) => {
  fastify.get("/", getAllUsersController);
  fastify.get("/:id", getUserByIdController);
  fastify.post("/", createUserController);
  // fastify.put("/:id", userController.updateUser);
  fastify.delete("/:id", deleteUserController);
};
