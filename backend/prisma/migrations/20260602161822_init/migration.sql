-- DropForeignKey
ALTER TABLE "Enquiry" DROP CONSTRAINT "Enquiry_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Enquiry" DROP CONSTRAINT "Enquiry_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Enquiry" DROP CONSTRAINT "Enquiry_senderId_fkey";

-- DropForeignKey
ALTER TABLE "EnquiryMessage" DROP CONSTRAINT "EnquiryMessage_enquiryId_fkey";

-- DropForeignKey
ALTER TABLE "EnquiryMessage" DROP CONSTRAINT "EnquiryMessage_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_authorId_fkey";

-- DropForeignKey
ALTER TABLE "SavedProperty" DROP CONSTRAINT "SavedProperty_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "SavedProperty" DROP CONSTRAINT "SavedProperty_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_dealerId_fkey";

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnquiryMessage" ADD CONSTRAINT "EnquiryMessage_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnquiryMessage" ADD CONSTRAINT "EnquiryMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedProperty" ADD CONSTRAINT "SavedProperty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedProperty" ADD CONSTRAINT "SavedProperty_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
