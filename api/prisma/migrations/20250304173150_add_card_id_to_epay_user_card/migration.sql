/*
  Warnings:

  - Added the required column `cardId` to the `EpayUserCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EpayUserCard" ADD COLUMN     "cardId" TEXT NOT NULL;
