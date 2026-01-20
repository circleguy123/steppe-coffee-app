-- CreateEnum
CREATE TYPE "EpayOrderType" AS ENUM ('Membership', 'UserOrder');

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EpayOrderInvoice" (
    "id" SERIAL NOT NULL,
    "userOrderId" TEXT,
    "membershipId" TEXT,
    "type" "EpayOrderType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "EpayOrderInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EpayUserCard" (
    "id" TEXT NOT NULL,
    "cardMask" TEXT NOT NULL,
    "cardType" TEXT NOT NULL,
    "approvalCode" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "ip" TEXT,
    "ipCity" TEXT,
    "ipCountry" TEXT,
    "ipDistrict" TEXT,
    "ipLatitude" DOUBLE PRECISION,
    "ipLongitude" DOUBLE PRECISION,
    "ipRegion" TEXT,
    "issuer" TEXT,
    "language" TEXT,
    "name" TEXT,
    "phone" TEXT,
    "reason" TEXT,
    "reasonCode" INTEGER,
    "reference" TEXT,
    "secure" TEXT,
    "secureDetails" TEXT,
    "terminal" TEXT,
    "accountId" TEXT NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "EpayUserCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EpayOrderError" (
    "id" TEXT NOT NULL,
    "errorData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EpayOrderError_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EpayUserCard" ADD CONSTRAINT "EpayUserCard_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EpayUserCard" ADD CONSTRAINT "EpayUserCard_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "EpayOrderInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
