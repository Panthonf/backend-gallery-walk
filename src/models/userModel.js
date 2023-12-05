import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default {
  getAllUsers: async () => {
    return prisma.user.findMany();
  },
  getUserById: async (userId) => {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  },
  createUser: async (userData) => {
    return prisma.user.create({
      data: userData,
    });
  },
  updateUser: async (userId, updatedUserData) => {
    return prisma.user.update({
      where: { id: userId },
      data: updatedUserData,
    });
  },
  deleteUser: async (userId) => {
    return prisma.user.delete({
      where: { id: userId },
    });
  },
};
