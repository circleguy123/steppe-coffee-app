-- CreateTable
CREATE TABLE "IikoTerminal" (
    "id" TEXT NOT NULL,
    "terminalGroupId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IikoTerminal_pkey" PRIMARY KEY ("id")
);
