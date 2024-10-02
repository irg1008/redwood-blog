/*
  Warnings:

  - You are about to drop the column `liveStreamId` on the `Streamer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Streamer" DROP CONSTRAINT "Streamer_liveStreamId_fkey";

-- DropIndex
DROP INDEX "Streamer_liveStreamId_key";

-- AlterTable
ALTER TABLE "Streamer" DROP COLUMN "liveStreamId",
ADD COLUMN     "live" BOOLEAN NOT NULL DEFAULT false;
