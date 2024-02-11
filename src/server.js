import server from "./app.js";

const PORT = process.env.PORT || 3000;

server.get("/api/", async (req, res) => {
  return {
    Welcome: "Welcome to the Fastify API",
  };
});

server.get("/api/isLoggedIn", async (request, reply) => {
  try {
    const loggedInUser = await request.session.get("user");
    if (loggedInUser) {
      reply.send({ authenticated: true, user: loggedInUser });
    } else {
      reply.send({ authenticated: false, user: null });
    }
  } catch (error) {
    reply.code(500).send({ error: "Internal Server Error" });
  }
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
