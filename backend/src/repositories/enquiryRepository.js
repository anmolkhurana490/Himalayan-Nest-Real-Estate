// Enquiry Repository - Prisma Implementation
import prisma from '../config/prismaClient.js';
import { SELECT_PROPERTY_ASSOCIATIONS } from '../constants/property.js';
import { SELECT_USER_ASSOCIATIONS } from '../constants/user.js';

class EnquiryRepository {
    /**
     * Create a new enquiry
     * @param {Object} enquiryData - Enquiry data
     * @returns {Promise<Enquiry>}
     */
    async create(enquiryData) {
        return await prisma.enquiry.create({ data: enquiryData });
    }

    /**
     * Find enquiry by ID
     * @param {String} id - Enquiry ID
     * @returns {Promise<Enquiry|null>}
     */
    async findById(id) {
        return await prisma.enquiry.findUnique({ where: { id } });
    }

    /**
     * Get all enquiries
     * @param {Object} filters - Optional filter criteria
     * @returns {Promise<Array<Enquiry>>}
     */
    async findAll(filters = {}, options = {}) {
        const include = {};
        if (options.includeProperty) include.property = { select: SELECT_PROPERTY_ASSOCIATIONS };
        if (options.includeSender) include.sender = { select: SELECT_USER_ASSOCIATIONS };
        if (options.includeReceiver) include.receiver = { select: SELECT_USER_ASSOCIATIONS };

        return await prisma.enquiry.findMany({
            where: filters,
            ...(Object.keys(include).length ? { include } : {}),
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Find an open enquiry for a given sender and property
     * (that is not closed or expired) - used to prevent spam enquiries
     * @param {String} senderId - Sender user ID
     * @param {String} propertyId - Property ID
     * @returns {Promise<Enquiry|null>}
     */
    async findOpenBySenderAndProperty(senderId, propertyId) {
        return await prisma.enquiry.findFirst({
            where: {
                senderId,
                propertyId,
                status: { notIn: ['closed', 'expired'] }
            }
        });
    }

    /**
     * Update enquiry by ID
     * @param {String} id - Enquiry ID
     * @param {Object} updates - Data to update
     * @returns {Promise<Enquiry|null>}
     */
    async update(id, updates) {
        const existing = await this.findById(id);
        if (!existing) return null;
        return await prisma.enquiry.update({ where: { id }, data: updates });
    }

    /**
     * Delete enquiry by ID
     * @param {String} id - Enquiry ID
     * @returns {Promise<Boolean>}
     */
    async delete(id) {
        const existing = await this.findById(id);
        if (!existing) return false;
        await prisma.enquiry.delete({ where: { id } });
        return true;
    }

    // Enquiry Message specific methods

    /**
     * Create a new enquiry message
     * @param {Object} messageData - Enquiry message data
     * @returns {Promise<EnquiryMessage>}
     */
    async createEnquiryMessage(messageData) {
        return await prisma.enquiryMessage.create({ data: messageData });
    }

    /**
     * Get all messages for a given enquiry
     * @param {String} enquiryId - Enquiry ID
     * @param {Number} limit - Optional limit on number of messages to retrieve
     * @returns {Promise<Array<EnquiryMessage>>}
     */
    async findAllMessagesByEnquiryId(enquiryId, limit = null) {
        return await prisma.enquiryMessage.findMany({
            where: { enquiryId: enquiryId },
            orderBy: { createdAt: 'asc' },
            ...(limit ? { take: limit } : {})
        });
    }
}

export default new EnquiryRepository();
