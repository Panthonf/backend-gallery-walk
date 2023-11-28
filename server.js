import Fastify from "fastify";
const PORT = process.env.PORT || 5000;
const fastify = Fastify({
  logger: true,
});

import { items } from "./Items.js";

// Declare a route
fastify.get("/items", (request, reply) => {
  reply.send(items);
});

fastify.get("/:id", (request, reply) => {
  const { id } = request.params;
  const item = items.find((item) => item.id === Number(id));
  reply.send(item);
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
