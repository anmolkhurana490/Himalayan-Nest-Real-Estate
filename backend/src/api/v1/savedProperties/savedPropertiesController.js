import savedPropertiesService from './savedPropertiesService.js';
import { HTTP_STATUS } from '../../../constants/httpStatus.js';

class SavedPropertiesController {
    /**
     * Get current user's saved properties
     * @route GET /api/v1/saved-properties
     * @query {number} page - Page number for pagination
     * @query {number} limit - Number of items per page
     */
    async getSavedProperties(req, res) {
        try {
            const properties = await savedPropertiesService.getSavedProperties(req.user.id);

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Saved properties fetched successfully',
                savedProperties: properties,
            });
        } catch (error) {
            console.error('Error fetching saved properties:', error.message);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * Add property to saved properties
     * @route POST /api/v1/saved-properties/:propertyId
     */
    async addSavedProperty(req, res) {
        const { propertyId } = req.params;

        try {
            await savedPropertiesService.addSavedProperty(req.user.id, propertyId);

            return res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: 'Property added to saved properties successfully',
            });
        } catch (error) {
            console.error('Error adding property to saved properties:', error.message);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * Remove property from saved properties
     * @route DELETE /api/v1/saved-properties/:propertyId
     */
    async removeSavedProperty(req, res) {
        const { propertyId } = req.params;

        try {
            await savedPropertiesService.removeSavedProperty(req.user.id, propertyId);

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Property removed from saved properties successfully',
            });
        } catch (error) {
            console.error('Error removing property from saved properties:', error.message);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * Clear all saved properties
     * @route DELETE /api/v1/saved-properties
     */
    async clearSavedProperties(req, res) {
        try {
            await savedPropertiesService.clearSavedProperties(req.user.id);

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'All saved properties cleared successfully',
            });
        } catch (error) {
            console.error('Error clearing saved properties:', error.message);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }
}

export default new SavedPropertiesController();