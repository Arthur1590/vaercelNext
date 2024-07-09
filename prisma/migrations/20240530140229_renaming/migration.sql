/*
  Warnings:

  - You are about to drop the column `specialItemChance` on the `Config` table. All the data in the column will be lost.
  - You are about to drop the column `specialPrizeChance` on the `Config` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Config" DROP COLUMN "specialItemChance",
DROP COLUMN "specialPrizeChance",
ADD COLUMN     "addWalletChance" DOUBLE PRECISION NOT NULL DEFAULT 5,
ADD COLUMN     "addWalletUsernameChance" DOUBLE PRECISION NOT NULL DEFAULT 3;

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "score",
ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 0;
