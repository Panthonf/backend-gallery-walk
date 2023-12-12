import {
  getAllUsers,
  deleteUser,
  createUser,
  getUserById,
  getUserByEmail,
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

async function createUserController(request, reply, done) {
  const userData = request.body;

  if ((await getUserByEmail(userData.email)) != null) {
    reply.status(409).send({
      success: false,
      message: "User already exists",
      data: null,
    });
    done();
  }
  try {
    const newUser = await createUser(userData);
    reply.status(201).send({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch ({ name, message }) {
    reply.status(500).send({
      success: false,
      message: name + ": " + message,
      data: null,
    });
  }
}

async function deleteUserController(request, reply) {
  const userId = parseInt(request.params.id);
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

export {
  getAllUsersController,
  createUserController,
  deleteUserController,
  getUserByIdController,
};
