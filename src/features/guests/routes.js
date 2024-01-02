import {
  googleAuthCallbackService,
  oauthConfig,
  guestLogin,
  guestLogout,
  setSession,
  getEventByEventIdService,
  isLoggedInService,
} from "./services.js";

import { getAllEvents } from "./models.js";
import oauthPlugin from "@fastify/oauth2";

export default async (fastify) => {
  fastify.register(oauthPlugin, oauthConfig);
  fastify.get("/login/google/callback", googleAuthCallbackService);
  fastify.get("/login", guestLogin);
  fastify.get("/set-session", setSession);
  fastify.get("/logout", guestLogout);

  fastify.get(
    "/events/:eventId",
    { preValidation: [fastify.isGuestLoggedIn] },
    getEventByEventIdService
  );

  fastify.get("/isLoggedIn", isLoggedInService);
};
