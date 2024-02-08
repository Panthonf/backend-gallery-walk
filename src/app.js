import Fastify from "fastify";
import dotenv from "dotenv";
import { isLoggedIn } from "./middleware/isLoggedIn.js";
import { isGuestLoggedIn } from "./middleware/isGuestLoggedIn.js";
import { checkSessionMiddleware } from "./middleware/checkSessionMiddleware.js";
dotenv.config();
const server = Fastify({ logger: true });
server.register(import("@fastify/cors"), {
  origin: ["https://frontend-gallery-walk.vercel.app", "http://localhost:3000"], // Specify allowed origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});
const secureSession = import("@fastify/secure-session");
server.register(secureSession, {
  secret: process.env.SECRET_KEY,
  cookie: {
    path: "/",
    httpOnly: true,
    secure: true, // Change to true if using HTTPS
    sameSite: "lax",
  },
  saveUninitialized: false,
  resave: true,
  cookieName: "Set-Cookie",
});

server.register(import("@fastify/multipart"));
// server.register(import("@fastify/cookie"));
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
