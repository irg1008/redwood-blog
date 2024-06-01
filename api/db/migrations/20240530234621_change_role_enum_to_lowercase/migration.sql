/*
  Warnings:

  - The values [MODERATOR,ADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('moderator', 'admin');
ALTER TABLE "User" ALTER COLUMN "roles" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "roles" TYPE "Role_new" USING ("roles"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "roles" SET DEFAULT 'moderator';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "roles" SET DEFAULT 'moderator';
