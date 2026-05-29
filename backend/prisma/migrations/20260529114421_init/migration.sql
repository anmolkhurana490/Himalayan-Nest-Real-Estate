/*
  Warnings:

  - You are about to drop the column `providerId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "providerId",
ADD COLUMN     "providerAccountId" TEXT;
