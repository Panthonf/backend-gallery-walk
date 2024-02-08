import server from "./app.js";

const PORT = process.env.PORT || 3000;

server.get("/", async (req, res) => {
  return {
    Welcome: "Welcome to the Fastify API",
  };
});

server.get("/isLoggedIn", async (request, reply) => {
  const user = await request.session.get("user");
  if (user) {
    reply.send({ authenticated: true, user });
  } else {
    reply.send({ authenticated: false, user: null });
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
