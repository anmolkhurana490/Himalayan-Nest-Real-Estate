// Property Controller - Request Handler Layer
// Handles HTTP requests and responses for property endpoints

import propertyService from './propertyService.js';
import { HTTP_STATUS } from '../../../constants/httpStatus.js';
import crypto from 'crypto';

class PropertyController {
    /**
     * Get all properties with optional filtering
     * @route GET /api/v1/properties
     */
    async getAllProperties(req, res, next) {
        try {
            const result = await propertyService.getAllProperties(req.validatedQuery);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Properties fetched successfully',
                properties: result.properties,
                totalPages: result.totalPages
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get single property by ID
     * @route GET /api/v1/properties/:id
     */
    async getPropertyById(req, res, next) {
        const { id } = req.params;

        const raw = `${req.ip}|${req.headers['user-agent'] || ''}`;
        const visitorId = crypto.createHash('sha256').update(raw).digest('hex');

        try {
            const property = await propertyService.getPropertyById(id, raw, req.query);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Property fetched successfully',
                property
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get current user's properties
     * @route GET /api/v1/properties/my-properties
     */
    async getUserProperties(req, res, next) {
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
            next(error);
        }
    }

    /**
     * Create new property
     * @route POST /api/v1/properties
     */
    async createProperty(req, res, next) {
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
            next(error);
        }
    }

    /**
     * Update property
     * @route PUT /api/v1/properties/:id
     */
    async updateProperty(req, res, next) {
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
            next(error);
        }
    }

    /**
     * Delete property
     * @route DELETE /api/v1/properties/:id
     */
    async deleteProperty(req, res, next) {
        const { id } = req.params;

        try {
            await propertyService.deleteProperty(id, req.user.id);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Property deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new PropertyController();
