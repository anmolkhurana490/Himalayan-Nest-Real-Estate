// Property Controller - Request Handler Layer
// Handles HTTP requests and responses for property endpoints

import propertyService from './propertyService.js';
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
                message: 'Properties fetched successfully',
                properties: result.properties,
                totalCount: result.totalCount
            });
        } catch (error) {
            console.error('Error fetching properties:', error.message);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Internal server error'
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
                message: 'Property fetched successfully',
                property
            });
        } catch (error) {
            console.error('Error fetching property:', error.message);
            res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: error.message || 'Internal server error'
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
                message: 'Properties fetched successfully',
                data: {
                    properties
                }
            });
        } catch (error) {
            console.error('Error fetching user properties:', error.message);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Internal server error'
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
                message: 'Property created successfully',
                data: {
                    property
                }
            });
        } catch (error) {
            console.error('Error creating property:', error);
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: error.message || 'Internal server error'
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
                message: 'Property updated successfully',
                data: {
                    property
                }
            });
        } catch (error) {
            console.error('Error updating property:', error);

            const statusCode = error.message === 'Property not found'
                ? HTTP_STATUS.NOT_FOUND
                : error.message === 'You are not authorized to perform this action'
                    ? HTTP_STATUS.FORBIDDEN
                    : HTTP_STATUS.INTERNAL_SERVER_ERROR;

            res.status(statusCode).json({
                success: false,
                message: error.message || 'Internal server error'
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
                message: 'Property deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting property:', error.message);

            const statusCode = error.message === 'Property not found'
                ? HTTP_STATUS.NOT_FOUND
                : error.message === 'You are not authorized to perform this action'
                    ? HTTP_STATUS.FORBIDDEN
                    : HTTP_STATUS.INTERNAL_SERVER_ERROR;

            res.status(statusCode).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }
}

export default new PropertyController();
