// index.ts

import Fastify from "fastify";
import exampleRoutes from "./routes/test";
import { configureAuth } from "./routes/auth";
const fastify = Fastify({
  logger: true,
});

fastify.get("/", function (request, reply) {
  reply.send({ hello: "jjjjjjjjjjjjjjjjjjjjj" });
});

fastify.get("/test", function (request, reply) {
  reply.send({ hello: "test" });
});

fastify.register(exampleRoutes);

const start = async () => {
  try {
    // Register authentication configuration
    await configureAuth(fastify);

    // Start the server
    await fastify.listen({ port: 8080, host: "0.0.0.0" });

    console.log(`Server listening at http://localhost:8080`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
