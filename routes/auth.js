import fastifyOAuth2 from "@fastify/oauth2";
import fastifyCookie from "@fastify/cookie";

async function configureAuth(fastify) {
  fastify.register(fastifyCookie);

  // Configure Google OAuth
  await fastify.register(fastifyOAuth2, {
    name: "google",
    scope: ["profile", "email"],
    credentials: {
      client: {
        id: "738108831158-7aj6kk3dltc4lckfma0jqg2scpr67vc5.apps.googleusercontent.com",
        secret: "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",
      },
      auth: fastifyOAuth2.GOOGLE_CONFIGURATION,
    },
    cookie: {
      secure: true,
      sameSite: "none",
    },
    // register a fastify url to start the redirect flow
    startRedirectPath: "/login",
    // facebook redirect here after the user login
    callbackUri: "http://localhost:3000/login/google/callback",
  });

  fastify.get("/login/google/callback", async function (request, reply) {
    const { token } = await this.google.getAccessTokenFromAuthorizationCodeFlow(
      request
    );


    console.log(token.access_token);

    // if later you need to refresh the token you can use
    // const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(token)

    // Store the access token in a cookie
    reply.setCookie("access_token", token.access_token, { httpOnly: true });

    reply.send({ access_token: token.access_token });
  });
  return fastify;
}

export { configureAuth };
