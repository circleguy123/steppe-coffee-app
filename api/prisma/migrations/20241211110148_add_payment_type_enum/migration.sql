/*
  Warnings:

  - Added the required column `allData` to the `EpayUserCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "EpayOrderType" ADD VALUE 'SaveCard';

-- AlterTable
ALTER TABLE "EpayUserCard" ADD COLUMN     "allData" JSONB NOT NULL;
