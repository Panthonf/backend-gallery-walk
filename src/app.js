import Fastify from "fastify";
import dotenv from "dotenv";
import isLoggedIn from "./middleware/isLoggedIn.js";
dotenv.config();
const server = Fastify({ logger: true });

server.register(import("@fastify/cookie"));
server.decorate("isLoggedIn", isLoggedIn);

server.get(
  "/demo",
  { preValidation: [server.isLoggedIn] },
  async (req, reply) => {
    reply.send({ message: "You are logged in" });
  }
);

await server.register(import("@fastify/swagger"));
await server.register(import("@fastify/swagger-ui"), {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
  exposeRoute: true,
});

// Include your routes
server.register(import("./features/users/routes.js"), { prefix: "/users" });
server.register(import("./features/events/routes.js"), { prefix: "/events" });
// fastify.register(require('./routes/productRoutes'));

server.register(import("./middleware/auth.js"));

export default server;
