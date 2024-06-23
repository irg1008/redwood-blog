/*
  Warnings:

  - A unique constraint covering the columns `[connectionId]` on the table `Stream` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `connectionId` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "connectionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stream_connectionId_key" ON "Stream"("connectionId");
