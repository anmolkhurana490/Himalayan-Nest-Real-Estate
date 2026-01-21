// Property Service - Business Logic Layer
// Handles property management business logic

import propertyRepository from '../../../repositories/propertyRepository.js';
import { PROPERTY_MESSAGES } from '../../../constants/messages.js';
import { deleteCloudinaryImages } from '../../../middlewares/FileUploadMiddleware.js';

class PropertyService {
    /**
     * Get all properties with optional filters
     * @param {Object} query - Search and filter parameters
     * @returns {Promise<Object>} - Properties list
     */
    async getAllProperties(query) {
        // Build search filters from query parameters
        const filters = propertyRepository.buildSearchFilters(query);

        // Fetch properties with filters
        let properties = await propertyRepository.findAll(filters, {
            attributes: {
                exclude: ['dealer_id']
            },
            order: [['createdAt', 'DESC']]
        });

        // Transform properties for listing view - show only first image
        properties = properties.map(p => ({
            ...p.toJSON(),
            image: p.images?.[0] || null,
            images: null
        }));

        return {
            properties,
            totalCount: properties.length
        };
    }

    /**
     * Get single property by ID with dealer information
     * @param {String} id - Property ID
     * @returns {Promise<Object>} - Property details
     */
    async getPropertyById(id) {
        const property = await propertyRepository.findByIdWithDealer(id);

        if (!property) {
            throw new Error(PROPERTY_MESSAGES.PROPERTY_NOT_FOUND);
        }

        return property;
    }

    /**
     * Get properties by dealer
     * @param {String} dealerId - Dealer user ID
     * @returns {Promise<Array>} - Dealer's properties
     */
    async getUserProperties(dealerId) {
        let properties = await propertyRepository.findByDealerId(dealerId);

        // Transform for listing view
        properties = properties.map(p => ({
            ...p.toJSON(),
            image: p.images?.[0] || null,
            images: null
        }));

        return properties;
    }

    /**
     * Create new property
     * @param {Object} propertyData - Property data
     * @param {Array} files - Uploaded files
     * @param {String} dealerId - Dealer user ID
     * @returns {Promise<Object>} - Created property
     */
    async createProperty(propertyData, files, dealerId) {
        const { title, description, category, purpose, location, price } = propertyData;

        // Validate required fields
        if (!title || !category || !purpose || !location || !price) {
            // Clean up uploaded files if validation fails
            if (files && files.length > 0) {
                const cloudinaryUrls = files.map(file => file.path);
                await deleteCloudinaryImages(cloudinaryUrls);
            }
            throw new Error(PROPERTY_MESSAGES.MISSING_FIELDS);
        }

        // Extract image URLs from uploaded files
        let imageUrls = [];
        if (files && files.length > 0) {
            imageUrls = files.map(file => file.path);
        }

        // Prepare property data
        const data = {
            title,
            description: description || '',
            category,
            purpose,
            location,
            price: parseFloat(price),
            images: imageUrls,
            dealer_id: dealerId
        };

        try {
            const newProperty = await propertyRepository.create(data);
            return newProperty;
        } catch (error) {
            // Clean up uploaded files if database operation fails
            if (imageUrls.length > 0) {
                await deleteCloudinaryImages(imageUrls);
            }
            throw error;
        }
    }

    /**
     * Update property
     * @param {String} id - Property ID
     * @param {Object} updateData - Update data
     * @param {Array} files - New uploaded files
     * @param {String} dealerId - Dealer user ID
     * @returns {Promise<Object>} - Updated property
     */
    async updateProperty(id, updateData, files, dealerId) {
        const property = await propertyRepository.findById(id);

        if (!property) {
            throw new Error(PROPERTY_MESSAGES.PROPERTY_NOT_FOUND);
        }

        // Check ownership
        if (property.dealer_id !== dealerId) {
            throw new Error(PROPERTY_MESSAGES.UNAUTHORIZED_ACCESS);
        }

        const { imagesToDelete, ...propertyData } = updateData;

        // Prepare updates
        const updates = {};
        if (propertyData.title) updates.title = propertyData.title;
        if (propertyData.description !== undefined) updates.description = propertyData.description;
        if (propertyData.category) updates.category = propertyData.category;
        if (propertyData.location) updates.location = propertyData.location;
        if (propertyData.purpose) updates.purpose = propertyData.purpose;
        if (propertyData.price) updates.price = parseFloat(propertyData.price);
        if (propertyData.isActive !== undefined) updates.isActive = propertyData.isActive;

        // Handle image updates
        let currentImages = property.images || [];
        const imagesList = JSON.parse(imagesToDelete || '[]');

        // Remove images marked for deletion
        if (imagesList?.length > 0) {
            try {
                await deleteCloudinaryImages(imagesList);
                currentImages = currentImages.filter(img => !imagesList.includes(img));
            } catch (error) {
                console.error('Error deleting images:', error);
            }
        }

        // Add new images
        if (files && files.length > 0) {
            const newImageUrls = files.map(file => file.path);
            currentImages = [...currentImages, ...newImageUrls];
        }

        updates.images = currentImages;

        try {
            const updatedProperty = await propertyRepository.update(id, updates);
            return updatedProperty;
        } catch (error) {
            // Clean up uploaded files if database operation fails
            if (files && files.length > 0) {
                const cloudinaryUrls = files.map(file => file.path);
                await deleteCloudinaryImages(cloudinaryUrls);
            }
            throw error;
        }
    }

    /**
     * Delete property
     * @param {String} id - Property ID
     * @param {String} dealerId - Dealer user ID
     * @returns {Promise<Boolean>}
     */
    async deleteProperty(id, dealerId) {
        const property = await propertyRepository.findById(id);

        if (!property) {
            throw new Error(PROPERTY_MESSAGES.PROPERTY_NOT_FOUND);
        }

        // Check ownership
        if (property.dealer_id !== dealerId) {
            throw new Error(PROPERTY_MESSAGES.UNAUTHORIZED_ACCESS);
        }

        // Delete images from Cloudinary
        if (property.images && property.images.length > 0) {
            try {
                await deleteCloudinaryImages(property.images);
            } catch (cloudinaryError) {
                console.error('Error deleting images from Cloudinary:', cloudinaryError);
            }
        }

        await propertyRepository.delete(id);
        return true;
    }
}

export default new PropertyService();
