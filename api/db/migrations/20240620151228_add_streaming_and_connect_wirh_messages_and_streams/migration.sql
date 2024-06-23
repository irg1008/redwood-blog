/*
  Warnings:

  - Added the required column `streamerId` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "streamerId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Streamer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "timeout" TIMESTAMP(3),
    "streamPath" TEXT NOT NULL,
    "hashedStreamKey" TEXT,
    "live" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Streamer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Streamer_streamPath_key" ON "Streamer"("streamPath");

-- AddForeignKey
ALTER TABLE "Stream" ADD CONSTRAINT "Stream_streamerId_fkey" FOREIGN KEY ("streamerId") REFERENCES "Streamer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Streamer" ADD CONSTRAINT "Streamer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
