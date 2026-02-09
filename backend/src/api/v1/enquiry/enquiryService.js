// Enquiry Service - Business Logic Layer
// Handles enquiry management business logic

import { ENQUIRY_STATUS } from '../../../constants/property.js';
import { Property } from '../../../config/db.js';
import enquiryRepository from '../../../repositories/enquiryRepository.js';
import enquiryMessageRepository from '../../../repositories/enquiryMessageRepository.js';

class EnquiryService {
    /**
     * Create a new enquiry for a property.
     * - sender_id is derived from the authenticated user
     * - receiver_id is derived from the property's author_id
     * - prevents multiple open enquiries per (sender, property)
     */
    async createEnquiry({ property_id, message, senderUser }) {
        const senderId = senderUser.id;

        // Ensure the property exists
        const property = await Property.findByPk(property_id);
        if (!property) {
            throw new Error('Property not found');
        }

        const receiverId = property.author_id;

        if (receiverId === senderId) {
            throw new Error('You cannot send an enquiry to your own property');
        }

        // Prevent duplicate open enquiries for the same sender and property
        const existingOpen = await enquiryRepository.findOpenBySenderAndProperty(senderId, property_id);
        if (existingOpen) {
            throw new Error('An open enquiry already exists for this property');
        }

        const enquiryPayload = {
            property_id,
            sender_id: senderId,
            receiver_id: receiverId,
            status: ENQUIRY_STATUS.PENDING,
        };

        const enquiry = await enquiryRepository.create(enquiryPayload);

        // Create the initial message for the enquiry
        const messageData = await enquiryMessageRepository.create({
            enquiry_id: enquiry.id,
            sender_id: senderId,
            message: message.trim(),
        });

        const enquiryWithMessage = { ...enquiry.toJSON(), messages: [messageData] };
        return enquiryWithMessage;
    }

    /**
     * Get all enquiries for the authenticated user (sent and/or received),
     * with optional filters (status, property_id, type).
     */
    async getAllEnquiriesForUser(user, query = {}) {
        const { status, property_id, type, includeProperty, includeSender, includeReceiver } = query;

        const options = {
            includeProperty: !!includeProperty,
            includeSender: !!includeSender,
            includeReceiver: !!includeReceiver,
        };

        const baseFilters = {
            ...(status && { status }),
            ...(property_id && { property_id }),
        };

        const enquiries = {};

        if (!type || type === 'sent') {
            const sent = await enquiryRepository.findAll({ ...baseFilters, sender_id: user.id }, options);
            enquiries.sent = await Promise.all(sent.map(this.addMessagesForEnquiry));
        }

        if (!type || type === 'received') {
            const received = await enquiryRepository.findAll({ ...baseFilters, receiver_id: user.id }, options);
            enquiries.received = await Promise.all(received.map(this.addMessagesForEnquiry));
        }

        return enquiries;
    }

    /**
     * Helper to add messages to an enquiry object
     */
    async addMessagesForEnquiry(enquiry) {
        const messages = await enquiryMessageRepository.findAllByEnquiryId(enquiry.id, 2);
        return { ...enquiry.toJSON(), messages };
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

        if (enquiry.sender_id !== senderUser.id) {
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

        if (enquiry.receiver_id !== receiverUser.id) {
            throw new Error('You are not allowed to respond to this enquiry');
        }

        if (enquiry.status === ENQUIRY_STATUS.CLOSED) {
            throw new Error('Cannot respond to a closed enquiry');
        }

        // Create the response message
        const messageData = await enquiryMessageRepository.create({
            enquiry_id: enquiry.id,
            sender_id: receiverUser.id,
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
        if (enquiry.receiver_id !== receiverUser.id) {
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
