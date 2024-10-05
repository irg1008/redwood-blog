/*
  Warnings:

  - A unique constraint covering the columns `[streamerId,closedAt]` on the table `Stream` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Stream_streamerId_closedAt_key" ON "Stream"("streamerId", "closedAt");
