/*
  Warnings:

  - You are about to drop the column `hashedStreamKey` on the `Streamer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Streamer" DROP COLUMN "hashedStreamKey",
ADD COLUMN     "hashedStreamSecret" TEXT;
