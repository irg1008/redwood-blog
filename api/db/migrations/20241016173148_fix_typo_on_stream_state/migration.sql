/*
  Warnings:

  - The values [reover] on the enum `StreamState` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StreamState_new" AS ENUM ('empty', 'full', 'dry', 'recover');
ALTER TABLE "Stream" ALTER COLUMN "state" TYPE "StreamState_new" USING ("state"::text::"StreamState_new");
ALTER TYPE "StreamState" RENAME TO "StreamState_old";
ALTER TYPE "StreamState_new" RENAME TO "StreamState";
DROP TYPE "StreamState_old";
COMMIT;
