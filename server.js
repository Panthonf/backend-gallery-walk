import Fastify from "fastify";
import { configureAuth } from "./routes/auth.js";

const fastify = Fastify({
  logger: true,
});

fastify.register(import("@fastify/swagger"));

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
    // Register authentication configuration
    await configureAuth(fastify);

    // Start the server
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
