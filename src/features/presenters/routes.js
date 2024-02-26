import { v4 as uuidv4 } from "uuid";
import {
  createProjectService,
  getProjectByEventIdService,
  uploadProjectImageService
} from "./services.js";
export default async (fastify) => {
  fastify.get("/:eventId", async (req, rep) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const userSession = await req.session.get("user");
      if (!userSession) {
        req.session.set("eventId", eventId);
        await req.session.set("presenter", uuidv4());
        rep.redirect(`${process.env.FRONTEND_URL}/login`);
      } else {
        rep.redirect(`${process.env.FRONTEND_URL}/event/${eventId}`);
      }
    } catch (error) {
      console.log("err", error);
      rep.redirect(`${process.env.FRONTEND_URL}/404`);
    }
  });

  fastify.post("/create-project/:eventId", createProjectService);

  fastify.post("/add-project-image/:projectId", uploadProjectImageService);

  fastify.get("/get-project/:eventId", getProjectByEventIdService);
};
