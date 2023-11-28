import Fastify from "fastify";
const fastify = Fastify({
  logger: true,
});

await fastify.register(import('@fastify/swagger'))

fastify.register(import("@fastify/swagger-ui"), {
  exposeRoute: true,
  routePrefix: "/docs",
  swagger: {
    info: { title: "Gallery Walk Api" },
  },
});

fastify.register(import("./routes/items.js"));

const PORT = process.env.PORT || 3000;
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
