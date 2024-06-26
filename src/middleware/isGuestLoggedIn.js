function isGuestLoggedIn(request, reply, done) {
  if (request.session.get("guest")) {
    done();
  } else {
    reply.status(401).send({
      success: false,
      message: "Guest Unauthorized",
      data: null,
    });
  }
}

export { isGuestLoggedIn };
