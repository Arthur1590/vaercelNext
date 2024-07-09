-- AlterTable
ALTER TABLE "Config" ADD COLUMN     "wallets" TEXT[] DEFAULT ARRAY[]::TEXT[];
