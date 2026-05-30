/*
  Warnings:

  - The values [CREDENTIALS,GOOGLE,FACEBOOK] on the enum `AuthProvider` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING,RESPONDED,REJECTED,CLOSED,EXPIRED] on the enum `EnquiryStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [FREE,BASIC,PREMIUM] on the enum `PlanType` will be removed. If these variants are still used in the database, this will fail.
  - The values [ADMIN,CUSTOMER,DEALER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AuthProvider_new" AS ENUM ('credentials', 'google', 'facebook');
ALTER TABLE "public"."User" ALTER COLUMN "provider" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "provider" TYPE "AuthProvider_new" USING ("provider"::text::"AuthProvider_new");
ALTER TYPE "AuthProvider" RENAME TO "AuthProvider_old";
ALTER TYPE "AuthProvider_new" RENAME TO "AuthProvider";
DROP TYPE "public"."AuthProvider_old";
ALTER TABLE "User" ALTER COLUMN "provider" SET DEFAULT 'credentials';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EnquiryStatus_new" AS ENUM ('pending', 'responded', 'rejected', 'closed', 'expired');
ALTER TABLE "public"."Enquiry" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Enquiry" ALTER COLUMN "status" TYPE "EnquiryStatus_new" USING ("status"::text::"EnquiryStatus_new");
ALTER TYPE "EnquiryStatus" RENAME TO "EnquiryStatus_old";
ALTER TYPE "EnquiryStatus_new" RENAME TO "EnquiryStatus";
DROP TYPE "public"."EnquiryStatus_old";
ALTER TABLE "Enquiry" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PlanType_new" AS ENUM ('free', 'basic', 'premium');
ALTER TABLE "public"."Subscription" ALTER COLUMN "planType" DROP DEFAULT;
ALTER TABLE "Subscription" ALTER COLUMN "planType" TYPE "PlanType_new" USING ("planType"::text::"PlanType_new");
ALTER TYPE "PlanType" RENAME TO "PlanType_old";
ALTER TYPE "PlanType_new" RENAME TO "PlanType";
DROP TYPE "public"."PlanType_old";
ALTER TABLE "Subscription" ALTER COLUMN "planType" SET DEFAULT 'free';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('admin', 'dealer', 'customer');
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- AlterTable
ALTER TABLE "Enquiry" ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "planType" SET DEFAULT 'free';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "provider" SET DEFAULT 'credentials';
