// src/routes/exampleRoutes.ts

import { FastifyInstance } from 'fastify';
import testController from '../controllers/testController';

export default function exampleRoutes(fastify: FastifyInstance, options: any, done: () => void) {
  fastify.get('/example', testController.getExample);
  // You can add more routes as needed
  done();
}
