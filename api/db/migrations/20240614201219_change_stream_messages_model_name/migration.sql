/*
  Warnings:

  - You are about to drop the `StreamMessages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StreamMessages" DROP CONSTRAINT "StreamMessages_streamId_fkey";

-- DropForeignKey
ALTER TABLE "StreamMessages" DROP CONSTRAINT "StreamMessages_userId_fkey";

-- DropTable
DROP TABLE "StreamMessages";

-- CreateTable
CREATE TABLE "StreamMessage" (
    "id" TEXT NOT NULL,
    "streamId" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "StreamMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StreamMessage" ADD CONSTRAINT "StreamMessage_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamMessage" ADD CONSTRAINT "StreamMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
