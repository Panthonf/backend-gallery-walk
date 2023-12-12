function isLoggedIn(request, reply, done) {
  if (request.session.get("user")) {
    done();
  } else {
    reply.status(401).send({
      success: false,
      message: "Unauthorized",
      data: null,
    });
  }
}

export { isLoggedIn };
