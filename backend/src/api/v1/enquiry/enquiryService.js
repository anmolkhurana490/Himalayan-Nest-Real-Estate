// Enquiry Service - Business Logic Layer
// Handles enquiry management business logic

import enquiryRepository from '../../../repositories/enquiryRepository.js';

class EnquiryService {
    /**
     * Create a new enquiry
     * @param {Object} enquiryData - Enquiry data
     * @returns {Promise<Object>} - Created enquiry
     */
    async createEnquiry(enquiryData) {
        const enquiry = await enquiryRepository.create(enquiryData);
        return enquiry;
    }

    /**
     * Get all enquiries
     * @param {Object} filters - Optional filter criteria
     * @returns {Promise<Array>} - List of enquiries
     */
    async getAllEnquiries(filters = {}) {
        const enquiries = await enquiryRepository.findAll(filters);
        return enquiries;
    }

    /**
     * Get enquiry by ID
     * @param {String} id - Enquiry ID
     * @returns {Promise<Object>} - Enquiry details
     */
    async getEnquiryById(id) {
        const enquiry = await enquiryRepository.findById(id);

        if (!enquiry) {
            throw new Error('Enquiry not found');
        }

        return enquiry;
    }

    /**
     * Update enquiry status
     * @param {String} id - Enquiry ID
     * @param {Object} updates - Update data
     * @returns {Promise<Object>} - Updated enquiry
     */
    async updateEnquiry(id, updates) {
        const enquiry = await enquiryRepository.update(id, updates);

        if (!enquiry) {
            throw new Error('Enquiry not found');
        }

        return enquiry;
    }

    /**
     * Delete enquiry
     * @param {String} id - Enquiry ID
     * @returns {Promise<Boolean>}
     */
    async deleteEnquiry(id) {
        const result = await enquiryRepository.delete(id);

        if (!result) {
            throw new Error('Enquiry not found');
        }

        return true;
    }
}

export default new EnquiryService();
