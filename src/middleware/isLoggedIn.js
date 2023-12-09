export default function isLoggedIn(request, reply, done) {
  const { token } = request.cookies;
  if (!token) {
    reply.code(401).send({ error: "Unauthorized" });
  }
  done();
}
