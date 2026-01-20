-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "loginCode" TEXT,
    "verificationId" TEXT,
    "loginCodeIssuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "iikoId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoyaltyAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "deviceId" TEXT,
    "balance" INTEGER NOT NULL,
    "cardId" TEXT NOT NULL,

    CONSTRAINT "LoyaltyAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOrder" (
    "id" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "iikoStatus" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "terminalGroupId" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,

    CONSTRAINT "UserOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOrderItem" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productSizeId" TEXT,
    "userOrderId" TEXT NOT NULL,

    CONSTRAINT "UserOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "LoyaltyAccount" ADD CONSTRAINT "LoyaltyAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyAccount" ADD CONSTRAINT "LoyaltyAccount_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrder" ADD CONSTRAINT "UserOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrderItem" ADD CONSTRAINT "UserOrderItem_userOrderId_fkey" FOREIGN KEY ("userOrderId") REFERENCES "UserOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
