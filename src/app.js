import Fastify from "fastify";
import dotenv from "dotenv";
import { isLoggedIn } from "./middleware/isLoggedIn.js";
import { isGuestLoggedIn } from "./middleware/isGuestLoggedIn.js";
import { checkSessionMiddleware } from "./middleware/checkSessionMiddleware.js";
dotenv.config();
const server = Fastify({ logger: true });
server.register(import("@fastify/cors"), {
  origin: ["https://frontend-gallery-walk.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

server.register(import("@fastify/cookie"));
server.register(import("@fastify/secure-session"), {
  secret: process.env.SECRET_KEY,
  cookieName: "Set-Cookie",
  cookie: {
    path: "/",
    httpOnly: true,
    secure: true, // Change to true if using HTTPS
    sameSite: "lax",
  },
  saveUninitialized: false,
  resave: true,
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
