/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Streamer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Streamer_userId_key" ON "Streamer"("userId");
