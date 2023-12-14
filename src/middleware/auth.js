import oauthPlugin from "@fastify/oauth2";
import axios from "axios";
import { checkUser, createUser } from "../features/users/models.js";

const CALLBACK_URI =
  process.env.CALLBACK_URI || "http://localhost:3000/login/google/callback";

export default async (fastify) => {
  // Google login
  fastify.register(oauthPlugin, {
    scope: ["profile", "email"],
    name: "googleOAuth2",
    credentials: {
      client: {
        id: "738108831158-7aj6kk3dltc4lckfma0jqg2scpr67vc5.apps.googleusercontent.com",
        secret: "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",
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: "/login/google",
    callbackUri: CALLBACK_URI,
  });

  fastify.get("/login/google/callback", async function (request, reply, done) {
    const { token } =
      await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

    const { data } = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",

      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      }
    );

    var userInfo = JSON.parse(JSON.stringify(data));

    const user = {
      first_name_th: userInfo.given_name,
      last_name_th: userInfo.family_name,
      first_name_en: userInfo.given_name,
      last_name_en: userInfo.family_name,
      email: userInfo.email,
      profile_pic: userInfo.picture,
      affiliation: "",
    };

    // check if user exists in database or not and create new user if not exists
    const userCheck = await checkUser(userInfo.email);
    if (!userCheck) {
      const newUser = await createUser(user);
      if (newUser) {
        request.session.set("user", newUser.id);
        reply.redirect(process.env.FRONTEND_URL + "/login");
      } else {
        reply.redirect(process.env.FRONTEND_URL + "/login");
      }
    }

    request.session.set("user", userCheck.id);
    reply.redirect(process.env.FRONTEND_URL + "/login");
  });

  // Facebook login
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
    callbackUri: process.env.CALLBACK_URI_FACEBOOK,
  });

  fastify.get(
    "/login/facebook/callback",
    async function (request, reply, done) {
      const { token } =
        await this.facebookOAuth2.getAccessTokenFromAuthorizationCodeFlow(
          request
        );

      const { data } = await axios.get(
        "https://graph.facebook.com/v18.0/me?fields=id,name,email,picture,birthday,friends,first_name,last_name",

        {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        }
      );

      reply.send({
        data: data,
      });
      done();

      var userInfo = JSON.parse(JSON.stringify(data));

      const user = {
        first_name_th: userInfo.given_name,
        last_name_th: userInfo.family_name,
        first_name_en: userInfo.given_name,
        last_name_en: userInfo.family_name,
        email: userInfo.email,
        profile_pic: userInfo.picture,
        affiliation: "",
      };

      if (!(await checkUser(userInfo.email))) {
        const newUser = await createUser(user);
        if (newUser) {
          reply.send({
            success: true,
            message: "User created successfully",
            data: newUser,
            new_user: true,
          });
        } else {
          reply.send({ error: "Internal Server Error" });
        }
      }

      reply.setCookie("token", token.access_token, {
        path: "/", // the cookie will be available for all routes in your app
        httpOnly: true, // prevent cookie from being accessed by client-side APIs
        secure: true, // cookie will only be sent over HTTPS
        expires: new Date(Date.now() + 3600000), // cookie expires in 1 hour
      });

      reply.send({
        // access_token: token.access_token,
        // token_type: token.token_type,
        // expire: token.expires_in,
        userInfo: userInfo.data,
        profile_pic: profile_pic.data,
      });
    }
  );

  fastify.get(
    "/user",
    { preValidation: [fastify.isLoggedIn] },
    async (request, reply) => {
      try {
        const { token } = request.cookies;

        try {
          const { data } = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          reply.send({
            userInfo: data,
          });
        } catch (error) {
          const userInfo = await axios.get(
            "https://graph.facebook.com/v18.0/me?fields=id,name,email,picture,birthday,friends,first_name,last_name",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          reply.send({
            userInfo: userInfo.data,
            message: "Logged in with Facebook",
          });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        reply.code(500).send({ message: "Internal Server Error" });
      }
    }
  );

  fastify.get("/logout", async (request, reply) => {
    try {
      request.session.delete();
      reply.send({
        success: true,
        message: "User logged out successfully",
        data: null,
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: "Internal Server Error",
        data: null,
      });
    }
  });

  fastify.get("/set-session", async (request, reply) => {
    request.session.set("user", 2);
    if (request.session.get("user")) {
      reply.send({
        success: true,
        message: "User logged in successfully",
        data: request.session.get("user"),
      });
    } else {
      reply.send({
        success: false,
        message: "User not logged in",
        data: null,
      });
    }
  });

  fastify.get("/get-session", async (request, reply) => {
    const userId = request.session.get("user");
    if (request.session.get("user")) {
      reply.send({
        success: true,
        message: "User logged in successfully",
        data: request.session.get("user"),
      });
    } else {
      reply.send({
        success: false,
        message: "User not logged in",
        data: null,
      });
    }
  });

  fastify.get("/isLoggedIn", async (request, reply) => {
    const user = request.session.get("user");
    if (user) {
      reply.send({ authenticated: true, user });
    } else {
      reply.send({ authenticated: false, user: null });
    }
  });
};
