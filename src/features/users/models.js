import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getAllUsers() {
  const users = await prisma.users.findMany();
  return users;
}

async function getUserById(userId) {
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });
  return user;
}

async function checkUser(email) {
  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });
  return user;
}

async function createUser(userData) {
  const user = await prisma.users.create({
    data: {
      first_name_th: userData.first_name_th,
      last_name_th: userData.last_name_th,
      first_name_en: userData.first_name_en,
      last_name_en: userData.last_name_en,
      email: userData.email,
      affiliation: userData.affiliation,
      profile_pic: userData.profile_pic,
    },
  });

  return user;
}

async function deleteUser(userId) {
  const user = await prisma.users.delete({
    where: {
      id: userId,
    },
  });
  return user;
}

export { getUserById, getAllUsers, checkUser, createUser, deleteUser };
