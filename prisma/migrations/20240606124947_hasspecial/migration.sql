-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "hasSpecialItem" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasSpecialPrize" BOOLEAN NOT NULL DEFAULT false;
