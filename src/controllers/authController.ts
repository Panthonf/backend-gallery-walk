import { FastifyRequest, FastifyReply } from 'fastify';

export default class authController {
  static async googleLogin(req: FastifyRequest, reply: FastifyReply) {
    try {
      // Your logic for handling the GET request
      const data = { message: 'Hello, this is an example!' };
      reply.send(data);
    } catch (error) {
      // Handle errors
      console.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  }
}
