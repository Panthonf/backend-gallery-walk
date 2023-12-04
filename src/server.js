import server from "./app.js";

server.get("/", async (req, res) => {
  return {
    Welcome: "Welcome to the Fastify API",
  };
});

const start = async () => {
  try {
    await server.listen({
      port: process.env.PORT || 3000,
      host: process.env.HOST || "localhost",
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
