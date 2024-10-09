-- CreateEnum
CREATE TYPE "StreamState" AS ENUM ('empty', 'full', 'dry', 'reover');

-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "state" "StreamState";
