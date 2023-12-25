import Fastify from "fastify";
import dotenv from "dotenv";
import { isLoggedIn } from "./middleware/isLoggedIn.js";
import { isGuestLoggedIn } from "./middleware/isGuestLoggedIn.js";
import { checkSessionMiddleware } from "./middleware/checkSessionMiddleware.js";

dotenv.config();
const server = Fastify({ logger: true });

server.register(import("@fastify/cors"), {
  origin: "http://localhost:5173", // Replace with your frontend URL
  // methods: ["GET", "POST", "PUT", "DELETE"],
  // allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

server.register(import("@fastify/multipart"));

server.register(import("@fastify/cookie"));
server.decorate("isLoggedIn", isLoggedIn);
server.decorate("checkSessionMiddleware", checkSessionMiddleware);
server.decorate("isGuestLoggedIn", isGuestLoggedIn);

server.register(import("@fastify/secure-session"), {
  secret: process.env.SECRET_KEY,
  cookie: {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use true in production
    sameSite: "lax", // Adjust sameSite based on your requirements
  },
  cookieName: "Set-Cookie",
  saveUninitialized: false,
  resave: false,
});

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
server.register(import("./features/projects/routes.js"), {
  prefix: "/projects",
});
server.register(import("./features/guests/routes.js"), { prefix: "/guests" });
// fastify.register(require('./routes/productRoutes'));

server.register(import("./middleware/auth.js"));

server.get("/healthcheck", async (req, res) => {
  return { status: "ok" };
});

export default server;
