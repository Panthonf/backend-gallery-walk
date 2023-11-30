import fastifyOAuth2 from "@fastify/oauth2";
import fastifyCookie from "@fastify/cookie";
import { FastifyRequest, FastifyReply } from "fastify";
import { FastifyInstance } from "fastify/types/instance";

async function configureAuth(fastify: FastifyInstance) {
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
    startRedirectPath: "/google-login",
    // Google redirect here after the user login
    callbackUri: "https://backend-gallery-walk-panthonf.vercel.app/google-login/callback",
  });

  fastify.get(
    "/google-login/callback",
    async function (req: FastifyRequest, reply: FastifyReply) {
      try {
        const { token } = await (
          this as any
        ).google.getAccessTokenFromAuthorizationCodeFlow(req);

        console.log(token.access_token);
        // if later you need to refresh the token you can use
        // const { token: newToken } = await this.google.getNewAccessTokenUsingRefreshToken(token)

        // Store the access token in a cookie
        reply.setCookie("access_token", token.access_token, { httpOnly: true });

        reply.send({ access_token: token.access_token });
      } catch (error) {
        console.error("Error in callback:", error);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );

  return fastify;
}

export { configureAuth };
