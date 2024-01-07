import {
  googleAuthCallbackService,
  oauthConfig,
  guestLogin,
  guestLogout,
  setSession,
  getEventByEventIdService,
  isLoggedInService,
  getGuestDataService,
  addVirtualMoneyService,
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

  fastify.post("/virtual-money/:total", addVirtualMoneyService);

  fastify.get("/data", getGuestDataService);

  fastify.get("/events", async (req, rep) => {
    try {
      const { eventId } = req.query;

      if (!eventId) {
        rep.send({
          message: "Missing eventId or projectId",
          success: false,
          data: null,
        });
      }

      // Set session variables
      req.session.set("eventId", eventId);
      const guestId = await req.session.get("user-guest");

      if (!req.session.get("user-guest")) {
        rep.redirect(`${process.env.FRONTEND_URL}/guest/login`);
      } else {
        rep.redirect(
          `${process.env.FRONTEND_URL}/guest/event/${eventId}?guestId=${guestId}`
        );
      }
    } catch (error) {
      console.error("Error in /events:", error);
      rep.code(500).send(error);
    }
  });

  fastify.get("/check-guest-session", async (req, rep) => {
    try {
      const guestIdSession = await req.session.get("user-guest");
      const guestIdQuery = req.query.guestId;
      const eventIdSession = await req.session.get("eventId");
      const { eventId } = req.query;
      if (parseInt(eventId) !== parseInt(eventIdSession)) {
        rep.send({
          message: "Event session not found",
          success: false,
          data: {
            eventIdSession: eventIdSession,
            eventId: eventId,
            guestIdSession: guestIdSession,
            guestIdQuery: guestIdQuery,
          },
        });
      }

      if (parseInt(guestIdQuery) !== parseInt(guestIdSession)) {
        rep.send({
          message: "Guest session not found",
          success: false,
        });
      }
      rep.send({
        message: "Guest session found",
        success: true,
      });
    } catch (error) {
      // Handle errors
      console.error("Error in /events:", error);
      rep.code(500).send(error);
    }
  });
};
