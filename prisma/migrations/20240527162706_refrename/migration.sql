/*
  Warnings:

  - You are about to drop the column `referral` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "referral",
ADD COLUMN     "inviter" TEXT;
