/*
  Warnings:

  - Added the required column `purpose` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `Property` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PropertyCategory" AS ENUM ('residential', 'commercial', 'land', 'industrial');

-- CreateEnum
CREATE TYPE "PropertyPurpose" AS ENUM ('sale', 'rent');

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "purpose" "PropertyPurpose" NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "PropertyCategory" NOT NULL;
