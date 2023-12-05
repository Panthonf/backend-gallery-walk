-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "eventName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "assistantEmail" TEXT[],
    "description" TEXT NOT NULL,
    "submitStart" TIMESTAMP(3) NOT NULL,
    "submitEnd" TIMESTAMP(3) NOT NULL,
    "numberOfMember" INTEGER NOT NULL,
    "virtualMoney" INTEGER NOT NULL,
    "unitMoney" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
