-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE "Config" (
    "id" SERIAL NOT NULL,
    "specialItemChance" INTEGER NOT NULL DEFAULT 5,
    "specialPrizeChance" INTEGER NOT NULL DEFAULT 3,
    "checkerEnabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);
