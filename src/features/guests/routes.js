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
  giveVirtualMoneyService,
  addProjectCommentService,
  getProjectCommentsService,
} from "./services.js";

import { getAllEvents } from "./models.js";
import oauthPlugin from "@fastify/oauth2";
import { deleteGuestVirtualMoneyService } from "./models.js";

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

  fastify.get("/access/event/:eventId", async (req, rep) => {
    try {
      const eventId = parseInt(req.params.eventId);

      if (!eventId) {
        rep.send({
          message: "Missing eventId or projectId",
          success: false,
          data: null,
        });
      }

      // Check if guest is logged in
      const guestId = await req.session.get("guest");
      if (!guestId) {
        req.session.set("eventId", eventId);
        rep.redirect(
          `${process.env.FRONTEND_URL}/guest/login?eventId=${eventId}`
        );
      }

      // Check if guest is logged in to the same event
      const eventIdSession = await req.session.get("eventId");
      if (eventIdSession && eventIdSession !== eventId) {
        await deleteGuestVirtualMoneyService(guestId, parseInt(eventId));
      }

      // Set session variables
      req.session.set("eventId", eventId);

      // Get all events
      if (!req.session.get("guest")) {
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
      const guestIdSession = await req.session.get("guest");
      const guestIdQuery = req.query.guestId;
      const eventIdSession = await req.session.get("eventId");
      const { eventId } = req.query;
      await req.session.set("eventId", eventId);
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

  fastify.get("/get-guest-data", getGuestDataService);

  fastify.post("/give-virtual-money", giveVirtualMoneyService);

  fastify.post("/add-comment", addProjectCommentService);

  fastify.get("/get-project-comments", getProjectCommentsService);
};
