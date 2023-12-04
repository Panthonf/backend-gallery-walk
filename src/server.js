import server from "./app.js";
import oauthPlugin from "@fastify/oauth2";

const PORT = process.env.PORT || 8080;

server.get("/", async (req, res) => {
  return {
    Welcome: "Welcome to the Fastify API",
  };
});

const start = async () => {
  try {
    await server.listen({ port: PORT, host: "0.0.0.0" });
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
