-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "passedAddInviter" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passedTwitter" BOOLEAN NOT NULL DEFAULT false;
