import Fastify from "fastify";
import dotenv from "dotenv";
import { isLoggedIn } from "./middleware/isLoggedIn.js";
import { checkSessionMiddleware } from "./middleware/checkSessionMiddleware.js";
import minioClient from "./middleware/minio.js";

dotenv.config();
const server = Fastify({ logger: true });

server.register(import("@fastify/multipart"));

server.post("/ttt", async (req, res, done) => {
  const data = await req.file();
  const image = {
    name: data.filename,
    data: data.file,
  };
  const save = await minioClient.putObject(
    "project-bucket",
    image.name,
    image.data,
    function (err, etag) {
      if (err) return console.log(err);
      console.log("File uploaded successfully.");
    }
  );
  res.send(save);
});

server.register(import("@fastify/cookie"));
server.decorate("isLoggedIn", isLoggedIn);
server.decorate("checkSessionMiddleware", checkSessionMiddleware);

server.register(import("@fastify/cors"), {
  origin: "*", // for development
  credentials: true,
});

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

server.get(
  "/demo",
  { preValidation: [server.checkSessionMiddleware] },
  async (req, res) => {
    const sessionData = req.session.get("user");
    return {
      sessionData,
    };
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
