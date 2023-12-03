import fastifyOAuth2 from "@fastify/oauth2";
import fastifyCookie from "@fastify/cookie";
import { FastifyRequest, FastifyReply } from "fastify";
import { FastifyInstance } from "fastify/types/instance";
import axios from "axios";
import { config } from "dotenv";
config();
const callbackUri = process.env.CALLBACK_URI as string;

if (!callbackUri) {
  console.error("Error: CALLBACK_URI is not set.");
  // Handle the error or provide a default callback URI
} else {
  // Use callbackUri as a string
  Example: console.log("Callback URI:", callbackUri);
}

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
    callbackUri: callbackUri,
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

        // Get user info
        const userInfo = await getUserInfo(token.access_token);

        // Set cookie
        reply.setCookie("token", token.access_token, {
          path: "/",
          domain: "localhost",
          secure: true,
          sameSite: "none",
        });

        reply.send({
          data: { userInfo: userInfo },
          token: token.access_token,
          message: "success",
        });
      } catch (error) {
        console.error("Error in callback:", error);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );

  return fastify;
}

const getUserInfo = async (token: string) => {
  const { data } = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export { configureAuth };
