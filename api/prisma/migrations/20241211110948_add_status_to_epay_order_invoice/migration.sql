-- CreateEnum
CREATE TYPE "EpayOrderStatus" AS ENUM ('new', 'paid', 'failed');

-- AlterTable
ALTER TABLE "EpayOrderInvoice" ADD COLUMN     "status" "EpayOrderStatus" NOT NULL DEFAULT 'new';
