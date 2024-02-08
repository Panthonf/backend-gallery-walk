import axios from "axios";
import oauthPlugin from "@fastify/oauth2";
import {
  checkGuest,
  getEventByEventId,
  getGuestData,
  addVirtualMoney,
  saveVirtualMoney,
  addProjectVirtualMoney,
  updateGuestVirtualMoney,
  addProjectComment,
  getProjectComments,
} from "./models.js";
import { createGuest } from "./models.js";
import { parse } from "dotenv";

const oauthConfig = {
  scope: ["profile", "email"],
  name: "googleOAuth2",
  credentials: {
    client: {
      id: "738108831158-lpavi3bicat1n0p1fkrar8si7ct2c6bg.apps.googleusercontent.com",
      secret: "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",
    },
    auth: oauthPlugin.GOOGLE_CONFIGURATION,
  },
  startRedirectPath: "/login/google",
  callbackUri: process.env.CALLBACK_URI_GUEST,
};

async function googleAuthCallbackService(request, reply, done) {
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
  };

  const guest = await checkGuest(userInfo.email);

  const eventId = request.session.get("eventId");

  if (guest.length >= 1) {
    request.session.set("guest", guest[0].id);
    const virtualMoneySaved = saveVirtualMoney(guest[0].id, parseInt(eventId));
    if (!virtualMoneySaved) {
      reply.send({
        success: false,
        message: "Cannot save virtual money",
        data: null,
      });
    }
    reply.redirect(
      `${
        process.env.FRONTEND_URL
      }/guest/event/${eventId}?guestId=${await request.session.get("guest")}`
    );
  } else {
    const newGuest = await createGuest(user);
    if (newGuest) {
      request.session.set("guest", newGuest.id);
      const virtualMoneySaved = saveVirtualMoney(
        newGuest.id,
        parseInt(eventId)
      );
      if (!virtualMoneySaved) {
        reply.send({
          success: false,
          message: "Cannot save virtual money",
          data: null,
        });
      }
      reply.redirect(
        `${process.env.FRONTEND_URL}/guest/event/${eventId}?guestId=${newGuest.id}`
      );
    } else {
      reply.send({
        success: false,
        message: "Cannot create new guest",
        data: null,
      });
    }
  }
}

async function guestLogin(request, reply) {
  const data = request.session.get("guest");
  if (data) {
    reply.send({
      success: true,
      message: "Guest logged in successfully",
      data: data,
    });
  }

  reply.send({
    success: false,
    message: "Guest not logged in",
    data: null,
  });
}

async function guestLogout(request, reply) {
  try {
    request.session.delete();
    reply.send({
      success: true,
      message: "Guest logged out successfully",
      data: null,
    });
  } catch (error) {
    reply.code(500).send({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
}

async function setSession(request, reply) {
  request.session.set("guest", { id: 1, name: "John Doe" });
  if (request.session.get("guest")) {
    reply.send({
      status: "success",
      data: request.session.get("guest"),
    });
  }

  reply.send({
    status: "fail",
    data: null,
  });
}

async function getEventByEventIdService(request, reply) {
  const eventId = parseInt(request.params.eventId);

  const event = await getEventByEventId(eventId);
  if (!event) {
    reply.status(404).send({
      success: false,
      message: `Event with id ${eventId} not found`,
      data: null,
    });
  }
  reply.send({
    success: true,
    message: "Lists fetched successfully",
    data: event,
  });
}

async function isLoggedInService(request, reply) {
  const user = await request.session.get("guest");
  if (user) {
    reply.send({ authenticated: true, user });
  } else {
    reply.send({ authenticated: false, user: null });
  }
}

async function getGuestDataService(req, rep, done) {
  const guestId = req.session.get("guest");
  if (req.session.get("guest")) {
    const data = await getGuestData(guestId);
    if (data) {
      rep.send({
        success: true,
        message: "Guest data fetched successfully",
        data: data,
      });
    } else {
      rep.send({
        success: false,
        message: "Guest data not found",
        data: null,
      });
    }
  } else {
    rep.send({
      success: false,
      message: "User not logged in",
      data: null,
    });
  }
}

async function addVirtualMoneyService(req, rep, done) {
  const virtualMoney = req.params.total;
  const guestId = req.session.get("guest");
  if (virtualMoney < 0 || virtualMoney == 0) {
    rep.send({
      success: false,
      message: "Virtual money must be more than 0",
      data: null,
    });
  } else {
    const newVirtualMoney = await addVirtualMoney(virtualMoney, guestId);
    if (newVirtualMoney) {
      rep.send({
        success: true,
        message: "Virtual money added successfully",
        data: newVirtualMoney,
      });
    } else {
      rep.send({
        success: false,
        message: "Cannot add virtual money",
        data: null,
      });
    }
  }
}

async function giveVirtualMoneyService(req, rep, done) {
  const virtualMoney = req.body.amount;
  const guestId = parseInt(req.query.guestId);
  const projectId = parseInt(req.query.projectId);

  if (!virtualMoney) {
    rep.send({
      success: false,
      message: "Virtual money not found",
      data: virtualMoney,
    });
  }

  if (!projectId) {
    rep.send({
      success: false,
      message: "Project id not found",
      data: null,
    });
  }

  if (virtualMoney < 0 || virtualMoney == 0) {
    rep.send({
      success: false,
      message: "Virtual money must be more than 0",
      data: null,
    });
  } else {
    const newVirtualMoney = await addProjectVirtualMoney(
      virtualMoney,
      projectId
    );

    if (!newVirtualMoney) {
      rep.send({
        success: false,
        message: "Cannot add project virtual money",
        data: null,
      });
    }

    const updateSuccessful = await updateGuestVirtualMoney(
      virtualMoney,
      guestId
    );

    if (updateSuccessful) {
      rep.send({
        success: true,
        message: "Guest virtual money updated successfully",
        data: newVirtualMoney,
      });
    } else {
      rep.send({
        success: false,
        message: "Cannot update guest virtual money",
        data: null,
      });
    }

    rep.send({
      success: true,
      message: "Virtual money added successfully",
      data: newVirtualMoney,
    });
  }
}

async function addProjectCommentService(req, rep, done) {
  const projectId = parseInt(req.body.projectId);
  const comment = req.body.comment;

  if (!projectId) {
    rep.send({
      success: false,
      message: "Project id not found",
      data: null,
    });
  }

  if (!comment) {
    rep.send({
      success: false,
      message: "Comments not found",
      data: null,
    });
  }

  const newProjectComment = await addProjectComment(projectId, comment);
  if (!newProjectComment) {
    rep.send({
      success: false,
      message: "Cannot add project comment",
      data: null,
    });
  }

  rep.send({
    success: true,
    message: "Project comment added successfully",
    data: newProjectComment,
  });
}

async function getProjectCommentsService(req, rep, done) {
  const { projectId } = req.query;

  if (!projectId) {
    rep.send({
      success: false,
      message: "Project id not found",
      data: null,
    });
  }

  const projectComments = await getProjectComments(parseInt(projectId));
  if (!projectComments) {
    rep.send({
      success: false,
      message: "Cannot get project comments",
      data: null,
    });
  }

  rep.send({
    success: true,
    message: "Project comments fetched successfully",
    data: projectComments,
  });
}

export {
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
};
