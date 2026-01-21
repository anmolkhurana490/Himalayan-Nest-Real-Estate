// Property Controller - Request Handler Layer
// Handles HTTP requests and responses for property endpoints

import propertyService from './propertyService.js';
import { PROPERTY_MESSAGES, GENERAL_MESSAGES } from '../../../constants/messages.js';
import { HTTP_STATUS } from '../../../constants/httpStatus.js';

class PropertyController {
    /**
     * Get all properties with optional filtering
     * @route GET /api/v1/properties
     */
    async getAllProperties(req, res) {
        try {
            const result = await propertyService.getAllProperties(req.query);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: PROPERTY_MESSAGES.PROPERTIES_FETCHED,
                properties: result.properties,
                totalCount: result.totalCount
            });
        } catch (error) {
            console.error('Error fetching properties:', error.message);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || GENERAL_MESSAGES.INTERNAL_ERROR
            });
        }
    }

    /**
     * Get single property by ID
     * @route GET /api/v1/properties/:id
     */
    async getPropertyById(req, res) {
        const { id } = req.params;

        try {
            const property = await propertyService.getPropertyById(id);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: PROPERTY_MESSAGES.PROPERTY_FETCHED,
                property
            });
        } catch (error) {
            console.error('Error fetching property:', error.message);
            res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: error.message || GENERAL_MESSAGES.INTERNAL_ERROR
            });
        }
    }

    /**
     * Get current user's properties
     * @route GET /api/v1/properties/my-properties
     */
    async getUserProperties(req, res) {
        try {
            const properties = await propertyService.getUserProperties(req.user.id);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: PROPERTY_MESSAGES.PROPERTIES_FETCHED,
                data: {
                    properties
                }
            });
        } catch (error) {
            console.error('Error fetching user properties:', error.message);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || GENERAL_MESSAGES.INTERNAL_ERROR
            });
        }
    }

    /**
     * Create new property
     * @route POST /api/v1/properties
     */
    async createProperty(req, res) {
        try {
            const property = await propertyService.createProperty(
                req.body,
                req.files,
                req.user.id
            );

            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: PROPERTY_MESSAGES.PROPERTY_CREATED,
                data: {
                    property
                }
            });
        } catch (error) {
            console.error('Error creating property:', error.message);
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: error.message || GENERAL_MESSAGES.INTERNAL_ERROR
            });
        }
    }

    /**
     * Update property
     * @route PUT /api/v1/properties/:id
     */
    async updateProperty(req, res) {
        const { id } = req.params;

        try {
            const property = await propertyService.updateProperty(
                id,
                req.body,
                req.files,
                req.user.id
            );

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: PROPERTY_MESSAGES.PROPERTY_UPDATED,
                data: {
                    property
                }
            });
        } catch (error) {
            console.error('Error updating property:', error);

            const statusCode = error.message === PROPERTY_MESSAGES.PROPERTY_NOT_FOUND
                ? HTTP_STATUS.NOT_FOUND
                : error.message === PROPERTY_MESSAGES.UNAUTHORIZED_ACCESS
                    ? HTTP_STATUS.FORBIDDEN
                    : HTTP_STATUS.INTERNAL_SERVER_ERROR;

            res.status(statusCode).json({
                success: false,
                message: error.message || GENERAL_MESSAGES.INTERNAL_ERROR
            });
        }
    }

    /**
     * Delete property
     * @route DELETE /api/v1/properties/:id
     */
    async deleteProperty(req, res) {
        const { id } = req.params;

        try {
            await propertyService.deleteProperty(id, req.user.id);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: PROPERTY_MESSAGES.PROPERTY_DELETED
            });
        } catch (error) {
            console.error('Error deleting property:', error.message);

            const statusCode = error.message === PROPERTY_MESSAGES.PROPERTY_NOT_FOUND
                ? HTTP_STATUS.NOT_FOUND
                : error.message === PROPERTY_MESSAGES.UNAUTHORIZED_ACCESS
                    ? HTTP_STATUS.FORBIDDEN
                    : HTTP_STATUS.INTERNAL_SERVER_ERROR;

            res.status(statusCode).json({
                success: false,
                message: error.message || GENERAL_MESSAGES.INTERNAL_ERROR
            });
        }
    }
}

export default new PropertyController();
