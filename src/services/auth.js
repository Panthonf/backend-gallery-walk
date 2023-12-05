import oauthPlugin from "@fastify/oauth2";
import axios from "axios";

const CALLBACK_URI =
  process.env.CALLBACK_URI || "http://localhost:3000/login/google/callback";

export default async (fastify) => {
  const oauthOptions = {
    scope: ["profile", "email"],
    name: "googleOAuth2",
    credentials: {
      client: {
        id: "738108831158-7aj6kk3dltc4lckfma0jqg2scpr67vc5.apps.googleusercontent.com",
        secret: "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",
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    // register a fastify url to start the redirect flow
    startRedirectPath: "/login/google",
    // facebook redirect here after the user login
    callbackUri: CALLBACK_URI,
  };

  fastify.register(oauthPlugin, oauthOptions);

  fastify.get("/login/google/callback", async function (request, reply) {
    const { token } =
      await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

    console.log(token.access_token);

    reply.setCookie("token", token.access_token, {
      path: "/", // the cookie will be available for all routes in your app
      httpOnly: true, // prevent cookie from being accessed by client-side APIs
      secure: true, // cookie will only be sent over HTTPS
      expires: new Date(Date.now() + 120000), // cookie expires in 1 hour
    });

    // if later you need to refresh the token you can use
    // const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(token)

    reply.send({
      access_token: token.access_token,
      token_type: token.token_type,
      expire: token.expires_in,
    });
  });

  fastify.register(oauthPlugin, {
    name: "facebookOAuth2",
    scope: ["email"],
    credentials: {
      client: {
        id: "854047730061591",
        secret: "0d15ad5e104e3f5d85a3f925ddfca99b",
      },
      auth: oauthPlugin.FACEBOOK_CONFIGURATION,
    },
    startRedirectPath: "/login/facebook",
    callbackUri: "http://localhost:8080/login/facebook/callback",
  });

  fastify.get("/login/facebook/callback", async function (request, reply) {
    const { token } =
      await this.facebookOAuth2.getAccessTokenFromAuthorizationCodeFlow(
        request
      );

    reply.setCookie("token", token.access_token, {
      path: "/", // the cookie will be available for all routes in your app
      httpOnly: true, // prevent cookie from being accessed by client-side APIs
      secure: true, // cookie will only be sent over HTTPS
      expires: new Date(Date.now() + 120000), // cookie expires in 1 hour
    });

    reply.send({
      access_token: token.access_token,
      token_type: token.token_type,
      expire: token.expires_in,
    });
  });

  fastify.get(
    "/user",
    { preValidation: [fastify.isLoggedIn] },
    async (request, reply) => {
      try {
        const { token } = request.cookies;
        const { data } = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { name, email, picture } = data;
        reply.send({ name, email, picture });
      } catch (error) {
        console.error("Error fetching user info:", error);
        reply.code(500).send({ message: "Internal Server Error" });
      }
    }
  );

  fastify.get("/logout", async (request, reply) => {
    reply.clearCookie("token").send({ message: "You are logged out" });
  });
};
