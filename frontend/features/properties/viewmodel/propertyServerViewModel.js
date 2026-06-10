import { Property } from '../model/propertyModel';
import * as propertyRepo from '../repositories';

const usePropertyServerViewModel = () => {
    /**
     * Get All Properties with Filters
     */
    const getProperties = async (filters = {}, options = {}) => {
        try {
            const params = {};
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== '') {
                    params[key] = value;
                }
            });

            const data = await propertyRepo.getPropertiesAPI({ ...params, ...options });
            const properties = (data.properties || []).map(p => new Property(p));
            const totalPages = data.totalPages || 1;

            return {
                success: true,
                properties: properties.map(p => ({ ...p })),
                totalPages,
                message: data.message || 'Properties fetched successfully'
            };
        } catch (error) {
            // console.error('Get properties error:', error);
            const errorMessage = error.message || 'Failed to fetch properties';
            return {
                success: false,
                message: errorMessage,
            };
        }
    }

    /**
     * Get Featured Properties
     */
    const getFeaturedProperties = async (limit = 6) => {
        try {
            const data = await propertyRepo.getFeaturedPropertiesAPI(limit);
            const featuredProperties = (data.properties || data.data || []).map(p => new Property(p));

            return {
                success: true,
                properties: featuredProperties.map(p => ({ ...p })),
                message: data.message || 'Featured properties fetched successfully'
            };
        } catch (error) {
            console.error('Get featured properties error:', error);
            const errorMessage = error.message || 'Failed to fetch featured properties';
            return {
                success: false,
                message: errorMessage,
            };
        }
    }

    /**
     * Get Property By ID
     */
    const getPropertyById = async (id) => {
        try {
            const data = await propertyRepo.getPropertyByIdAPI(id, { includeAuthor: true });
            const property = new Property(data.property || data.data?.property);

            return {
                success: true,
                property: { ...property },
                message: data.message || 'Property fetched successfully'
            };
        } catch (error) {
            console.error('Get property error:', error);
            const errorMessage = error.message || 'Failed to fetch property';
            return {
                success: false,
                message: errorMessage,
            };
        }
    }

    return {
        getProperties,
        getFeaturedProperties,
        getPropertyById
    }
}

export default usePropertyServerViewModel;