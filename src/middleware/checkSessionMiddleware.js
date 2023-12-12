// Middleware to check session cookie and set session data in request object
const checkSessionMiddleware = async (request, reply) => {
  const sessionData = request.session.get("user");

  // Check if the session data exists
  if (!sessionData) {
    return reply
      .status(401)
      .send({ error: "Unauthorized: Session data not present" });
  }

  // Set the session data in the request object for later use in route handlers
  request.sessionData = sessionData;
};

export { checkSessionMiddleware };
