// Enquiry Controller - Request Handler Layer
// Handles HTTP requests and responses for enquiry endpoints

import enquiryService from './enquiryService.js';
import { ENQUIRY_MESSAGES, GENERAL_MESSAGES } from '../../../constants/messages.js';
import { HTTP_STATUS } from '../../../constants/httpStatus.js';

class EnquiryController {
    /**
     * Create a new enquiry
     * @route POST /api/v1/enquiries
     */
    async createEnquiry(req, res) {
        try {
            const enquiry = await enquiryService.createEnquiry(req.body);

            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: ENQUIRY_MESSAGES.ENQUIRY_CREATED,
                data: enquiry
            });
        } catch (error) {
            console.error('Error creating enquiry:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: ENQUIRY_MESSAGES.ERROR_CREATING,
                error: error.message
            });
        }
    }

    /**
     * Get all enquiries
     * @route GET /api/v1/enquiries
     */
    async getEnquiries(req, res) {
        try {
            const enquiries = await enquiryService.getAllEnquiries(req.query);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: ENQUIRY_MESSAGES.ENQUIRIES_FETCHED,
                data: enquiries
            });
        } catch (error) {
            console.error('Error fetching enquiries:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: ENQUIRY_MESSAGES.ERROR_FETCHING,
                error: error.message
            });
        }
    }

    /**
     * Get enquiry by ID
     * @route GET /api/v1/enquiries/:id
     */
    async getEnquiryById(req, res) {
        const { id } = req.params;

        try {
            const enquiry = await enquiryService.getEnquiryById(id);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: enquiry
            });
        } catch (error) {
            console.error('Error fetching enquiry:', error);
            res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Update enquiry
     * @route PUT /api/v1/enquiries/:id
     */
    async updateEnquiry(req, res) {
        const { id } = req.params;

        try {
            const enquiry = await enquiryService.updateEnquiry(id, req.body);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Enquiry updated successfully',
                data: enquiry
            });
        } catch (error) {
            console.error('Error updating enquiry:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Delete enquiry
     * @route DELETE /api/v1/enquiries/:id
     */
    async deleteEnquiry(req, res) {
        const { id } = req.params;

        try {
            await enquiryService.deleteEnquiry(id);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Enquiry deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting enquiry:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default new EnquiryController();
