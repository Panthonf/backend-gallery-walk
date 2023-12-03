import userController from '../controllers/userController.js'

export default async (fastify) => {
  fastify.get('/users', userController.getAllUsers);
  fastify.get('/users/:id', userController.getUserById);
  fastify.post('/users', userController.createUser);
  fastify.put('/users/:id', userController.updateUser);
  fastify.delete('/users/:id', userController.deleteUser);
};
