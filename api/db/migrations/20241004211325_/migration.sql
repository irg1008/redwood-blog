/*
  Warnings:

  - You are about to drop the column `connectionId` on the `Stream` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Stream_connectionId_key";

-- AlterTable
ALTER TABLE "Stream" DROP COLUMN "connectionId";
