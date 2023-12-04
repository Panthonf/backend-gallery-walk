import Fastify from "fastify";
import dotenv from "dotenv";
dotenv.config();
const server = Fastify({ logger: true });

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
server.register(import("./routes/userRoutes.js"), { prefix: "/api" });
// fastify.register(require('./routes/productRoutes'));

server.register(import("./services/auth.js"));

export default server;
