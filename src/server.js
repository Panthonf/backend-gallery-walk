import server from "./app.js";
import cors from "@fastify/cors";

const PORT = process.env.PORT || 3000;

server.get("/", async (req, res) => {
  return {
    Welcome: "Welcome to the Fastify API",
  };
});

server.get(
  "/test",
  {
    preValidation: [server.isLoggedIn],
  },
  async (req, res) => {
    return {
      test: "test",
    };
  }
);

server.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

const start = async () => {
  try {
    await server.listen({
      port: PORT,
      host: "0.0.0.0",
    });
    console.log(
      `Server listening on port http://localhost:${
        server.server.address().port
      }`
    );
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
