import userService from "../services/userService.js";

export default {
  getAllUsers: async (request, reply) => {
    try {
      const users = await userService.getAllUsers();
      reply.send(users);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  },
  getUserById: async (request, reply) => {
    const userId = parseInt(request.params.id);
    try {
      const user = await userService.getUserById(userId);
      if (user) {
        reply.send(user);
      } else {
        reply.status(404).send({ error: "User not found" });
      }
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  },
  createUser: async (request, reply) => {
    const userData = request.body;
    try {
      const newUser = await userService.createUser(userData);
      reply.status(201).send({
        success: true,
        message: "User created successfully",
        data: newUser,
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2002") {
        reply.status(409).send({
          error: `User with that ${error.meta.target} already exists`,
        });
      }
      reply.status(500).send({ error: "Internal Server Error" });
    }
  },
  updateUser: async (request, reply) => {
    const userId = parseInt(request.params.id);
    const updatedUserData = request.body;
    try {
      const updatedUser = await userService.updateUser(userId, updatedUserData);
      if (updatedUser) {
        reply.send({
          success: true,
          message: "User updated successfully",
          data: updatedUser,
        });
      } else {
        reply.status(404).send({ error: "User not found" });
      }
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        reply.status(409).send({
          success: false,
          message: `${error.meta.cause}`,
          data: null,
        });
      }
      reply.status(500).send({ error: "Internal Server Error" });
    }
  },
  deleteUser: async (request, reply) => {
    const userId = parseInt(request.params.id);
    try {
      const deletedUser = await userService.deleteUser(userId);
      if (deletedUser) {
        reply.send({
          success: true,
          message: "User deleted successfully",
          data: deletedUser,
        });
      } else {
        reply.status(404).send({
          success: false,
          message: "User not found",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      reply.status(500).send({
        success: false,
        message: "Internal Server Error",
        data: null,
      });
    }
  },
};
