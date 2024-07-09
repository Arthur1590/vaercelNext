-- AlterTable
ALTER TABLE "Config" ADD COLUMN     "specials" TEXT[] DEFAULT ARRAY[]::TEXT[];
