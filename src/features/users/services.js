import {
  getAllUsers,
  deleteUser,
  getUserById,
} from "./models.js";

async function getAllUsersController(request, reply, done) {
  try {
    const users = await getAllUsers();
    if (users) {
      reply.send({
        success: true,
        message: "Users fetched successfully",
        data: users,
      });
    } else {
      reply.status(404).send({
        success: false,
        message: "Users not found",
        data: null,
      });
    }
  } catch (error) {
    console.error(error);
    reply.status(500).send({
      success: false,
      message: error.message,
      data: null,
    });
  }
}

async function deleteUserController(request, reply) {
  const userId = parseInt(request.params.userId);
  try {
    const deletedUser = await deleteUser(userId);
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
}

async function getUserByIdController(request, reply) {
  try {
    const userId = request.session.get("user");
    const user = await getUserById(userId);
    if (user) {
      reply.send(user);
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
}

async function getUserByUserIdService(request, reply) {
  const userId = parseInt(request.params.userId);
  try {
    const user = await getUserById(userId);
    if (user) {
      reply.send(user);
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
}



export {
  getAllUsersController,
  deleteUserController,
  getUserByIdController,
  getUserByUserIdService,
};
