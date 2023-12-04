import server from "./app.js";

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

server.get("/", async (req, res) => {
  return {
    Welcome: "Welcome to the Fastify API",
  };
});

const start = async () => {
  try {
    await server.listen({ port: PORT, host: HOST });
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
