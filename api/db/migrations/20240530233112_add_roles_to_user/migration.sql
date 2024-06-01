-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MODERATOR', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" "Role" NOT NULL DEFAULT 'MODERATOR';
