/*
  Warnings:

  - You are about to drop the column `live` on the `Streamer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[liveStreamId]` on the table `Streamer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Streamer" DROP COLUMN "live",
ADD COLUMN     "liveStreamId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Streamer_liveStreamId_key" ON "Streamer"("liveStreamId");

-- AddForeignKey
ALTER TABLE "Streamer" ADD CONSTRAINT "Streamer_liveStreamId_fkey" FOREIGN KEY ("liveStreamId") REFERENCES "Stream"("id") ON DELETE SET NULL ON UPDATE CASCADE;
