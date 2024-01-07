import axios from "axios";
import oauthPlugin from "@fastify/oauth2";
import {
  checkGuest,
  getEventByEventId,
  getGuestData,
  addVirtualMoney,
} from "./models.js";
import { createGuest } from "./models.js";

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

  if (guest.length > 1) {
    request.session.set("user-guest", guest[0].id);

    reply.redirect(
      `${
        process.env.FRONTEND_URL
      }/guest/event/${eventId}?guestId=${request.session.get("user-guest")}`
    );
  } else {
    const newGuest = await createGuest(user);
    if (newGuest) {
      request.session.set("user-guest", newGuest.id);
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
  const data = request.session.get("user-guest");
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
  request.session.set("user-guest", { id: 1, name: "John Doe" });
  if (request.session.get("user-guest")) {
    reply.send({
      status: "success",
      data: request.session.get("user-guest"),
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
  const user = request.session.get("user-guest");
  if (user) {
    reply.send({ authenticated: true, user });
  } else {
    reply.send({ authenticated: false, user: null });
  }
}

async function getGuestDataService(req, rep, done) {
  const guestId = req.session.get("user-guest");
  if (req.session.get("user-guest")) {
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
  const guestId = req.session.get("user-guest");
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
};
