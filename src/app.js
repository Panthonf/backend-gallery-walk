import Fastify from "fastify";
import dotenv from "dotenv";
import { isLoggedIn } from "./middleware/isLoggedIn.js";
import { isGuestLoggedIn } from "./middleware/isGuestLoggedIn.js";
import { checkSessionMiddleware } from "./middleware/checkSessionMiddleware.js";
import fastifyCookie from "@fastify/cookie";
import fastifySecureSession from "@fastify/session";
dotenv.config();
const server = Fastify({ logger: true });
server.register(import("@fastify/cors"), {
  origin: ["https://gwalk.cpe.eng.cmu.ac.th", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

server.register(fastifyCookie);

server.register(fastifySecureSession, {
  secret: "a secret with minimum length of 32 characters",
  // change to true for production
  cookie: { secure: false },
  saveUninitialized: true,
  cookieName: "sessionId",
  expires: 1800000,
});

server.register(import("@fastify/multipart"));
server.decorate("isLoggedIn", isLoggedIn);
server.decorate("checkSessionMiddleware", checkSessionMiddleware);
server.decorate("isGuestLoggedIn", isGuestLoggedIn);

// Include your routes with the /api prefix
server.register(import("./features/users/routes.js"), { prefix: "/api/users" });
server.register(import("./features/events/routes.js"), {
  prefix: "/api/events",
});
server.register(import("./features/projects/routes.js"), {
  prefix: "/api/projects",
});
server.register(import("./features/guests/routes.js"), {
  prefix: "/api/guests",
});
server.register(import("./features/presenters/routes.js"), {
  prefix: "/api/presenters",
});
server.register(import("./middleware/auth.js"));

export default server;
