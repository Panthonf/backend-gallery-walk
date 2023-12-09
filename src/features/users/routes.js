import {
  getAllUsersController,
  createUserController,
  deleteUserController,
  getUserByIdController,
} from "./services.js";

export default async (fastify) => {
  fastify.get("/", getAllUsersController);
  fastify.get("/:id", getUserByIdController);
  fastify.post("/", createUserController);
  // fastify.put("/:id", userController.updateUser);
  fastify.delete("/:id", deleteUserController);
  fastify.get("/test", async (req, res) => {
    return {
      test: "test",
    };
  });
};
