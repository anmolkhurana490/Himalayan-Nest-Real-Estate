// Enquiry Controller - Request Handler Layer
// Handles HTTP requests and responses for enquiry endpoints

import enquiryService from './enquiryService.js';
import { HTTP_STATUS } from '../../../constants/httpStatus.js';

class EnquiryController {
    /**
     * Create a new enquiry
     * @route POST /api/v1/enquiries
     */
    async createEnquiry(req, res) {
        try {
            const { property_id, message } = req.body;

            const enquiry = await enquiryService.createEnquiry({
                property_id,
                message,
                senderUser: req.user,
            });

            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: 'Enquiry created successfully',
                data: enquiry
            });
        } catch (error) {
            console.error('Error creating enquiry:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error creating enquiry',
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
            const enquiries = await enquiryService.getAllEnquiriesForUser(req.user, req.query);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Enquiries fetched successfully',
                data: enquiries
            });
        } catch (error) {
            console.error('Error fetching enquiries:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error fetching enquiries',
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

    /**
     * Close an enquiry (sender only)
     * @route POST /api/v1/enquiries/:id/close
     */
    async closeEnquiry(req, res) {
        const { id } = req.params;

        try {
            const enquiry = await enquiryService.closeEnquiry(id, req.user);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Enquiry closed successfully',
                data: enquiry,
            });
        } catch (error) {
            console.error('Error closing enquiry:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Receiver responds to an enquiry with a message
     * @route POST /api/v1/enquiries/:id/respond
     */
    async respondToEnquiry(req, res) {
        const { id } = req.params;
        const { message } = req.body;

        try {
            const responseMessage = await enquiryService.respondToEnquiry(id, req.user, message);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Enquiry responded successfully',
                data: responseMessage,
            });
        } catch (error) {
            console.error('Error responding to enquiry:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Update enquiry status (receiver only)
     * @route PUT /api/v1/enquiries/:id/status
     */
    async updateEnquiryStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body;

        try {
            const enquiry = await enquiryService.updateEnquiryStatus(id, req.user, status);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Enquiry status updated successfully',
                data: enquiry,
            });
        } catch (error) {
            console.error('Error updating enquiry status:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message,
            });
        }
    }
}

export default new EnquiryController();
