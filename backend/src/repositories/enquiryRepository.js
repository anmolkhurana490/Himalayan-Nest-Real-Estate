// Enquiry Repository - Database Operations Layer
// Handles all CRUD operations for Enquiry model

import { Enquiry } from '../config/db.js';

class EnquiryRepository {
    /**
     * Create a new enquiry
     * @param {Object} enquiryData - Enquiry data
     * @returns {Promise<Enquiry>}
     */
    async create(enquiryData) {
        return await Enquiry.create(enquiryData);
    }

    /**
     * Find enquiry by ID
     * @param {String} id - Enquiry ID
     * @returns {Promise<Enquiry|null>}
     */
    async findById(id) {
        return await Enquiry.findByPk(id);
    }

    /**
     * Get all enquiries
     * @param {Object} filters - Optional filter criteria
     * @returns {Promise<Array<Enquiry>>}
     */
    async findAll(filters = {}) {
        return await Enquiry.findAll({
            where: filters,
            order: [['createdAt', 'DESC']]
        });
    }

    /**
     * Update enquiry by ID
     * @param {String} id - Enquiry ID
     * @param {Object} updates - Data to update
     * @returns {Promise<Enquiry|null>}
     */
    async update(id, updates) {
        const enquiry = await this.findById(id);
        if (!enquiry) return null;

        return await enquiry.update(updates);
    }

    /**
     * Delete enquiry by ID
     * @param {String} id - Enquiry ID
     * @returns {Promise<Boolean>}
     */
    async delete(id) {
        const enquiry = await this.findById(id);
        if (!enquiry) return false;

        await enquiry.destroy();
        return true;
    }
}

export default new EnquiryRepository();
