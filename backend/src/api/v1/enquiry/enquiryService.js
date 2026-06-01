// Enquiry Service - Business Logic Layer
// Handles enquiry management business logic

import { ENQUIRY_STATUS } from '../../../constants/property.js';
import propertyRepository from '../../../repositories/propertyRepository.js';
import enquiryRepository from '../../../repositories/enquiryRepository.js';

class EnquiryService {
    /**
     * Create a new enquiry for a property.
     * - senderId is derived from the authenticated user
     * - receiverId is derived from the property's authorId
     * - prevents multiple open enquiries per (sender, property)
     */
    async createEnquiry({ propertyId, message, senderUser }) {
        const senderId = senderUser.id;

        // Ensure the property exists
        const property = await propertyRepository.findById(propertyId);
        if (!property) {
            throw new Error('Property not found');
        }

        const receiverId = property.authorId;

        if (receiverId === senderId) {
            throw new Error('You cannot send an enquiry to your own property');
        }

        // Prevent duplicate open enquiries for the same sender and property
        const existingOpen = await enquiryRepository.findOpenBySenderAndProperty(senderId, propertyId);
        if (existingOpen) {
            throw new Error('An open enquiry already exists for this property');
        }

        const enquiryPayload = {
            propertyId,
            senderId: senderId,
            receiverId: receiverId,
            status: ENQUIRY_STATUS.PENDING,
        };

        const enquiry = await enquiryRepository.create(enquiryPayload);

        // Create the initial message for the enquiry
        const messageData = await enquiryRepository.createEnquiryMessage({
            enquiryId: enquiry.id,
            senderId: senderId,
            message: message.trim(),
        });

        const enquiryWithMessage = { ...enquiry, messages: [messageData] };
        return enquiryWithMessage;
    }

    /**
     * Get all enquiries for the authenticated user (sent and/or received),
     * with optional filters (status, propertyId, type).
     */
    async getAllEnquiriesForUser(user, query = {}) {
        const { status, propertyId, type, includeProperty, includeSender, includeReceiver } = query;

        const options = {
            includeProperty: !!includeProperty,
            includeSender: !!includeSender,
            includeReceiver: !!includeReceiver,
        };

        const baseFilters = {
            ...(status && { status }),
            ...(propertyId && { propertyId }),
        };

        const enquiries = {};

        if (!type || type === 'sent') {
            const sent = await enquiryRepository.findAll({ ...baseFilters, senderId: user.id }, options);
            enquiries.sent = await Promise.all(sent.map(this.addMessagesForEnquiry));
        }

        if (!type || type === 'received') {
            const received = await enquiryRepository.findAll({ ...baseFilters, receiverId: user.id }, options);
            enquiries.received = await Promise.all(received.map(this.addMessagesForEnquiry));
        }

        return enquiries;
    }

    /**
     * Helper to add messages to an enquiry object
     */
    async addMessagesForEnquiry(enquiry) {
        const messages = await enquiryRepository.findAllMessagesByEnquiryId(enquiry.id, 2);
        return { ...enquiry, messages };
    }

    /**
     * Get enquiry by ID
     */
    async getEnquiryById(id) {
        const enquiry = await enquiryRepository.findById(id);

        if (!enquiry) {
            throw new Error('Enquiry not found');
        }

        return enquiry;
    }

    /**
     * Update enquiry (generic) - kept for backward compatibility
     */
    async updateEnquiry(id, updates) {
        // If status is being set to CLOSED, also set closedAt
        if (updates.status === ENQUIRY_STATUS.CLOSED) {
            updates.closedAt = new Date();
        }

        const enquiry = await enquiryRepository.update(id, updates);

        if (!enquiry) {
            throw new Error('Enquiry not found');
        }

        return enquiry;
    }

    /**
     * Delete enquiry
     */
    async deleteEnquiry(id) {
        const result = await enquiryRepository.delete(id);

        if (!result) {
            throw new Error('Enquiry not found');
        }

        return true;
    }

    /**
     * Sender closes an enquiry when resolved.
     */
    async closeEnquiry(id, senderUser) {
        const enquiry = await this.getEnquiryById(id);

        if (enquiry.senderId !== senderUser.id) {
            throw new Error('You are not allowed to close this enquiry');
        }

        if (enquiry.status === ENQUIRY_STATUS.CLOSED) {
            throw new Error('Enquiry is already closed');
        }

        const updates = {
            status: ENQUIRY_STATUS.CLOSED,
            closedAt: new Date(),
        };

        return await enquiryRepository.update(id, updates);
    }

    /**
     * Receiver responds to an enquiry with a message.
     */
    async respondToEnquiry(id, receiverUser, message) {
        const enquiry = await this.getEnquiryById(id);

        if (enquiry.receiverId !== receiverUser.id) {
            throw new Error('You are not allowed to respond to this enquiry');
        }

        if (enquiry.status === ENQUIRY_STATUS.CLOSED) {
            throw new Error('Cannot respond to a closed enquiry');
        }

        // Create the response message
        const messageData = await enquiryRepository.createEnquiryMessage({
            enquiryId: enquiry.id,
            senderId: receiverUser.id,
            message: message.trim(),
        });

        // If enquiry was pending, mark it as responded
        if (enquiry.status === ENQUIRY_STATUS.PENDING) {
            await enquiryRepository.update(id, { status: ENQUIRY_STATUS.RESPONDED });
        }

        // Return the response message
        return messageData;
    }

    /**
     * Update enquiry status (receiver only - can mark as responded/rejected/closed)
     */
    async updateEnquiryStatus(id, receiverUser, status) {
        const enquiry = await this.getEnquiryById(id);

        // Only receiver can update status
        if (enquiry.receiverId !== receiverUser.id) {
            throw new Error('Only the receiver can update the enquiry status');
        }

        // Validate allowed status transitions
        const allowedStatuses = [ENQUIRY_STATUS.RESPONDED, ENQUIRY_STATUS.REJECTED];
        if (!allowedStatuses.includes(status)) {
            throw new Error(`Invalid status. Allowed values: ${allowedStatuses.join(', ')}`);
        }

        const updates = { status };

        // Set closedAt if status is closed or rejected
        if (status === ENQUIRY_STATUS.CLOSED || status === ENQUIRY_STATUS.REJECTED) {
            updates.closedAt = new Date();
        }

        return await enquiryRepository.update(id, updates);
    }
}

export default new EnquiryService();
