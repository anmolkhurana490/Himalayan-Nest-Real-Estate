/*
  Warnings:

  - A unique constraint covering the columns `[dealerId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Enquiry_propertyId_idx" ON "Enquiry"("propertyId");

-- CreateIndex
CREATE INDEX "Enquiry_propertyId_senderId_idx" ON "Enquiry"("propertyId", "senderId");

-- CreateIndex
CREATE INDEX "EnquiryMessage_enquiryId_idx" ON "EnquiryMessage"("enquiryId");

-- CreateIndex
CREATE INDEX "Property_purpose_category_price_location_idx" ON "Property"("purpose", "category", "price", "location");

-- CreateIndex
CREATE INDEX "Property_authorId_idx" ON "Property"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_dealerId_key" ON "Subscription"("dealerId");

-- CreateIndex
CREATE INDEX "Subscription_dealerId_idx" ON "Subscription"("dealerId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_provider_providerAccountId_idx" ON "User"("provider", "providerAccountId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
