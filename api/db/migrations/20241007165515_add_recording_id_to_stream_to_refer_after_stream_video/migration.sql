/*
  Warnings:

  - A unique constraint covering the columns `[recordingId]` on the table `Stream` will be added. If there are existing duplicate values, this will fail.
  - The required column `recordingId` was added to the `Stream` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "recordingId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stream_recordingId_key" ON "Stream"("recordingId");
