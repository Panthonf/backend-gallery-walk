import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function getEventByEventId(eventId) {
  const event = await prisma.events.findUnique({
    where: {
      id: eventId,
      published: true,
    },
  });
  return event;
}

async function getAllEvents() {
  const events = await prisma.events.findMany();
  return events;
}

async function createGuest(guestData) {
  const guest = await prisma.guests.create({
    data: {
      first_name_th: guestData.first_name_th,
      last_name_th: guestData.last_name_th,
      first_name_en: guestData.first_name_en,
      last_name_en: guestData.last_name_en,
      email: guestData.email,
      profile_pic: guestData.profile_pic,
    },
  });
  return guest;
}

async function checkGuest(email) {
  const guest = await prisma.guests.findMany({
    where: {
      email: email,
    },
  });
  return guest;
}

async function getGuestData(guestId) {
  const guest = await prisma.guests.findUnique({
    where: {
      id: guestId,
    },
    select: {
      id: true,
      first_name_th: true,
      last_name_th: true,
      first_name_en: true,
      last_name_en: true,
      email: true,
      profile_pic: true,
      virtual_money: true,
      last_activity_at: true,
    },
  });
  return guest;
}

async function addVirtualMoney(guestId, virtualMoney) {
  const guest = await prisma.guests.update({
    where: {
      id: guestId,
    },
    data: {
      virtual_money: virtualMoney,
    },
  });
  return guest;
}

const saveVirtualMoney = async (guestId, eventId) => {
  const guest = await prisma.guests.findUnique({
    where: {
      id: guestId,
      virtual_money: { not: null },
    },
    select: {
      virtual_money: true,
    },
  });

  if (!guest) {
    const event = await prisma.events.findUnique({
      where: {
        id: eventId,
      },
      select: {
        virtual_money: true,
      },
    });

    const addGuestVirtualMoney = await prisma.guests.update({
      where: {
        id: guestId,
      },
      data: {
        virtual_money: event.virtual_money,
      },
      select: {
        virtual_money: true,
      },
    });

    return addGuestVirtualMoney;
  }
  return guest;
};

async function addProjectVirtualMoney(
  virtualMoney,
  projectId,
  eventId,
  guestId
) {
  try {
    const existingProject = await prisma.virtual_moneys.findFirst({
      where: {
        project_id: projectId,
        event_id: eventId,
        guest_id: guestId,
      },
      select: {
        amount: true,
        id: true,
      },
    });

    if (!existingProject) {
      const newVirtualMoney = await prisma.virtual_moneys.create({
        data: {
          project_id: projectId,
          amount: virtualMoney,
          event_id: eventId,
          guest_id: guestId,
        },
        select: {
          amount: true,
          project_id: true,
        },
      });
      return newVirtualMoney.amount;
    } else {
      const newAmount = existingProject.amount + virtualMoney;
      const updatedVirtualMoney = await prisma.virtual_moneys.update({
        where: {
          id: existingProject.id,
          event_id: eventId,
          guest_id: guestId,
        },
        data: {
          amount: newAmount,
        },
        select: {
          amount: true,
          project_id: true,
          event_id: true,
        },
      });
      return updatedVirtualMoney.amount;
    }
  } catch (error) {
    console.error("Error in addProjectVirtualMoney:", error);
    throw error;
  }
}

async function updateGuestVirtualMoney(virtualMoney, guestId) {
  try {
    const guest = await prisma.guests.findUnique({
      where: {
        id: guestId,
      },
      select: {
        virtual_money: true,
      },
    });

    const newVirtualMoney = Math.max(0, guest.virtual_money - virtualMoney);

    await prisma.guests.update({
      where: {
        id: guestId,
      },
      data: {
        virtual_money: newVirtualMoney,
      },
    });

    return true; // Update successful
  } catch (error) {
    console.error("Error updating virtual money:", error);
    // Handle the error appropriately (e.g., log it, throw a custom error, etc.)
    return false; // Update failed
  }
}

async function addProjectComment(projectId, comment) {
  const newComment = await prisma.comments.create({
    data: {
      comment_like: comment.comment_like,
      comment_better: comment.comment_better,
      comment_idea: comment.comment_idea,
      project_id: projectId,
    },
  });
  return newComment;
}

async function getProjectComments(projectId) {
  const comments = await prisma.comments.findMany({
    where: {
      project_id: projectId,
    },
    select: {
      id: true,
      comment_like: true,
      comment_better: true,
      comment_idea: true,
      created_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return comments;
}

async function deleteGuestVirtualMoneyService(guestId, eventId) {
  const event = await prisma.events.findUnique({
    where: {
      id: eventId,
    },
    select: {
      virtual_money: true,
    },
  });

  const updatedGuest = await prisma.guests.update({
    where: {
      id: guestId,
    },
    data: {
      virtual_money: event.virtual_money,
    },
    select: {
      virtual_money: true,
    },
  });

  return updatedGuest;
}

async function getAlreadyGivenVirtualMoney(projectId, guestId, eventId) {
  const virtualMoney = await prisma.virtual_moneys.findFirst({
    where: {
      project_id: projectId,
      event_id: eventId,
      guest_id: guestId,
    },
    select: {
      amount: true,
    },
  });
  return virtualMoney;
}

export {
  getEventByEventId,
  getAllEvents,
  createGuest,
  checkGuest,
  getGuestData,
  addVirtualMoney,
  saveVirtualMoney,
  updateGuestVirtualMoney,
  addProjectVirtualMoney,
  addProjectComment,
  getProjectComments,
  deleteGuestVirtualMoneyService,
  getAlreadyGivenVirtualMoney,
};
