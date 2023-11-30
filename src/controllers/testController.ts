// src/controllers/testController.ts

import { FastifyRequest, FastifyReply } from 'fastify';

export default class testController {
  static async getExample(req: FastifyRequest, reply: FastifyReply) {
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

  static async postExample(req: FastifyRequest, reply: FastifyReply) {
    try {
      // Your logic for handling the POST request
      const requestData = req.body;
      const response = { message: 'Received POST request', data: requestData };
      reply.send(response);
    } catch (error) {
      // Handle errors
      console.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  }
}
