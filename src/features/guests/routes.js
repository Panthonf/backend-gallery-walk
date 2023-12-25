import {
  googleAuthCallbackService,
  oauthConfig,
  guestLogin,
  guestLogout,
  setSession,
  getEventByEventIdService,
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

  fastify.get(
    "/events",
    { preValidation: [fastify.isGuestLoggedIn] },
    async (request, reply) => {
      const events = await getAllEvents();
      if (events.length === 0) {
        reply.status(404).send({
          success: false,
          message: "Data not found",
          data: null,
        });
      } else {
        reply.send({
          success: true,
          message: "Events fetched successfully",
          data: events,
        });
      }
    }
  );
};
