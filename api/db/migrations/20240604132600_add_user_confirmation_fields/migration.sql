-- AlterTable
ALTER TABLE "User" ADD COLUMN     "confirmToken" TEXT,
ADD COLUMN     "confirmTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "confirmed" BOOLEAN NOT NULL DEFAULT false;
