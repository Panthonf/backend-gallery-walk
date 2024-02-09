import Fastify from "fastify";
import dotenv from "dotenv";
import { isLoggedIn } from "./middleware/isLoggedIn.js";
import { isGuestLoggedIn } from "./middleware/isGuestLoggedIn.js";
import { checkSessionMiddleware } from "./middleware/checkSessionMiddleware.js";
import fastifyCookie from "@fastify/cookie";
import fastifySecureSession from "@fastify/secure-session";
dotenv.config();
const server = Fastify({ logger: true });
server.register(import("@fastify/cors"), {
  origin: ["https://frontend-gallery-walk.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

server.register(fastifyCookie);
server.register((fastifySecureSession), {
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

server.addHook("preHandler", async (request, reply) => {
  try {
    await request.session.get("user");
  } catch (err) {
    reply
      .code(401)
      .send({ message: "Unauthorized", success: false, data: null });
  }
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
