// Property Service - Business Logic Layer
// Handles property management business logic

import propertyRepository from '../../../repositories/propertyRepository.js';
import { deleteCloudinaryImages, uploadPropertyImages } from '../files/fileService.js';
import { validateCreateFilesCount, validateUpdateImagesCount } from '../files/fileValidation.js';

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
                exclude: ['author_id']
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
     * Get single property by ID with author information
     * @param {String} id - Property ID
     * @returns {Promise<Object>} - Property details
     */
    async getPropertyById(id) {
        const property = await propertyRepository.findByIdWithAuthor(id);

        if (!property) {
            throw new Error('Property not found');
        }

        return property;
    }

    /**
     * Get properties by author
     * @param {String} authorId - Author user ID
     * @returns {Promise<Array>} - Author's properties
     */
    async getUserProperties(authorId) {
        let properties = await propertyRepository.findByAuthorId(authorId);

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
     * @param {Array} files - Uploaded files (buffers from multer)
     * @param {String} authorId - Author user ID
     * @returns {Promise<Object>} - Created property
     */
    async createProperty(propertyData, files, authorId) {
        const { title, description, category, property_subtype, purpose, location, price } = propertyData;

        // Validate file count
        const validation = validateCreateFilesCount(files);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        // Upload images to Cloudinary (only after validation passes)
        const imageUrls = await uploadPropertyImages(files);

        // Prepare property data
        const data = {
            title,
            description: description || '',
            category,
            property_subtype: property_subtype || '',
            purpose,
            location,
            price: parseFloat(price),
            images: imageUrls,
            author_id: authorId
        };

        try {
            const newProperty = await propertyRepository.create(data);
            return newProperty;
        } catch (error) {
            // If database creation fails, clean up uploaded images
            if (imageUrls.length > 0) {
                await deleteCloudinaryImages(imageUrls).catch(err =>
                    console.error('Failed to cleanup images after error:', err)
                );
            }
            throw error;
        }
    }

    /**
     * Update property
     * @param {String} id - Property ID
     * @param {Object} updateData - Update data
     * @param {Array} files - New uploaded files (buffers from multer)
     * @param {String} authorId - Author user ID
     * @returns {Promise<Object>} - Updated property
     */
    async updateProperty(id, updateData, files, authorId) {
        const property = await propertyRepository.findById(id);

        if (!property) {
            throw new Error('Property not found');
        }

        // Check ownership
        if (property.author_id !== authorId) {
            throw new Error('You are not authorized to perform this action');
        }

        const { imagesToDelete, ...propertyData } = updateData;

        // Prepare updates
        const updates = {
            title: propertyData.title || property.title,
            description: propertyData.description || property.description,
            category: propertyData.category || property.category,
            property_subtype: propertyData.property_subtype || property.property_subtype,
            purpose: propertyData.purpose || property.purpose,
            location: propertyData.location || property.location,
            price: propertyData.price ? parseFloat(propertyData.price) : property.price
        };

        // Handle image updates
        let currentImages = property.images || [];
        const deleteImageList = imagesToDelete || [];
        const uploadedFiles = files || [];

        // Image count validation (before uploading new files)
        const validation = validateUpdateImagesCount(
            currentImages.length,
            uploadedFiles.length,
            deleteImageList.length
        );
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        let newImageUrls = [];
        try {
            // Upload new images to Cloudinary (only after validation passes)
            if (uploadedFiles.length > 0) {
                newImageUrls = await uploadPropertyImages(uploadedFiles);
            }

            // Remove images marked for deletion
            if (deleteImageList.length > 0) {
                await deleteCloudinaryImages(deleteImageList);
                currentImages = currentImages.filter(img => !deleteImageList.includes(img));
            }

            // Combine current and new images
            currentImages = [...currentImages, ...newImageUrls];
            updates.images = currentImages;

            const updatedProperty = await propertyRepository.update(id, updates);
            return updatedProperty;
        } catch (error) {
            // If update fails and we uploaded new images, clean them up
            if (newImageUrls.length > 0) {
                await deleteCloudinaryImages(newImageUrls).catch(err =>
                    console.error('Failed to cleanup newly uploaded images after error:', err)
                );
            }
            throw error;
        }
    }

    /**
     * Delete property
     * @param {String} id - Property ID
     * @param {String} authorId - Author user ID
     * @returns {Promise<Boolean>}
     */
    async deleteProperty(id, authorId) {
        const property = await propertyRepository.findById(id);

        if (!property) {
            throw new Error('Property not found');
        }

        // Check ownership
        if (property.author_id !== authorId) {
            throw new Error('You are not authorized to perform this action');
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
