// Enquiry Controller - Request Handler Layer
// Handles HTTP requests and responses for enquiry endpoints

import enquiryService from './enquiryService.js';
import { HTTP_STATUS } from '../../../constants/httpStatus.js';

class EnquiryController {
    /**
     * Create a new enquiry
     * @route POST /api/v1/enquiries
     */
    async createEnquiry(req, res, next) {
        try {
            const { property_id, message } = req.body;

            const enquiry = await enquiryService.createEnquiry({
                propertyId: property_id,
                message,
                senderUser: req.user,
            });

            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: 'Enquiry created successfully',
                data: enquiry
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all enquiries
     * @route GET /api/v1/enquiries
     */
    async getEnquiries(req, res, next) {
        try {
            const enquiries = await enquiryService.getAllEnquiriesForUser(req.user, req.query);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Enquiries fetched successfully',
                data: enquiries
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get enquiry by ID
     * @route GET /api/v1/enquiries/:id
     */
    async getEnquiryById(req, res, next) {
        const { id } = req.params;

        try {
            const enquiry = await enquiryService.getEnquiryById(id, req.user.id);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: enquiry
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update enquiry
     * @route PUT /api/v1/enquiries/:id
     */
    async updateEnquiry(req, res, next) {
        const { id } = req.params;

        try {
            const enquiry = await enquiryService.updateEnquiry(id, req.body);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Enquiry updated successfully',
                data: enquiry
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete enquiry
     * @route DELETE /api/v1/enquiries/:id
     */
    async deleteEnquiry(req, res, next) {
        const { id } = req.params;

        try {
            await enquiryService.deleteEnquiry(id, req.user.id);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Enquiry deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Close an enquiry (sender only)
     * @route POST /api/v1/enquiries/:id/close
     */
    async closeEnquiry(req, res, next) {
        const { id } = req.params;

        try {
            const enquiry = await enquiryService.closeEnquiry(id, req.user);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Enquiry closed successfully',
                data: enquiry,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Receiver responds to an enquiry with a message
     * @route POST /api/v1/enquiries/:id/respond
     */
    async respondToEnquiry(req, res, next) {
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
            next(error);
        }
    }

    /**
     * Update enquiry status (receiver only)
     * @route PUT /api/v1/enquiries/:id/status
     */
    async updateEnquiryStatus(req, res, next) {
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
            next(error);
        }
    }
}

export default new EnquiryController();
