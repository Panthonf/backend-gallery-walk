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
  origin: ["https://frontend-gallery-walk.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

server.register(fastifyCookie);

server.register(fastifySecureSession, {
  secret: process.env.SECRET,
  cookie: { secure: true },
  saveUninitialized: true,
  cookieName: "sessionId",
  expires: 1800000,
});

server.register(import("@fastify/multipart"));
server.decorate("isLoggedIn", isLoggedIn);
server.decorate("checkSessionMiddleware", checkSessionMiddleware);
server.decorate("isGuestLoggedIn", isGuestLoggedIn);

// Include your routes
server.register(import("./features/users/routes.js"), { prefix: "/users" });
server.register(import("./features/events/routes.js"), { prefix: "/events" });
server.register(import("./features/projects/routes.js"), {
  prefix: "/projects",
});
server.register(import("./features/guests/routes.js"), { prefix: "/guests" });
// fastify.register(require('./routes/productRoutes'));
server.register(import("./features/presenters/routes.js"), {
  prefix: "/presenters",
});
server.register(import("./middleware/auth.js"));

export default server;
