/*
  Warnings:

  - A unique constraint covering the columns `[accountId,cardId]` on the table `EpayUserCard` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EpayUserCard_accountId_cardId_key" ON "EpayUserCard"("accountId", "cardId");
