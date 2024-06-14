-- CreateTable
CREATE TABLE "Stream" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Stream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamMessages" (
    "id" TEXT NOT NULL,
    "streamId" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "StreamMessages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StreamMessages" ADD CONSTRAINT "StreamMessages_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamMessages" ADD CONSTRAINT "StreamMessages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
