import oauthPlugin from "@fastify/oauth2";

const CALLBACK_URI = process.env.CALLBACK_URI || "http://localhost:8080/login/google/callback";

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
      
        // if later you need to refresh the token you can use
        // const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(token)
      
        reply.send({ access_token: token.access_token });
      });
};
