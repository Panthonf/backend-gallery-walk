// index.ts

import Fastify from "fastify";
import exampleRoutes from "./routes/test";
import { configureAuth } from "./routes/auth";
const fastify = Fastify({
  logger: true,
});

const port = 8080;
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
    await fastify.listen({ port: port, host: "0.0.0.0" });

    console.log(`Server listening at http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
