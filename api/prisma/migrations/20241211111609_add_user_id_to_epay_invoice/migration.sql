/*
  Warnings:

  - Added the required column `userId` to the `EpayOrderInvoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EpayOrderInvoice" ADD COLUMN     "userId" TEXT NOT NULL;
