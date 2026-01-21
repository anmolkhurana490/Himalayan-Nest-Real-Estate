// Property Controller - CRUD operations for real estate listings
// Handles property creation, updates, deletion, and filtering with image management

import { Op } from 'sequelize';
import { Property, User } from '../config/db.js';
import { deleteCloudinaryImages } from '../middlewares/FileUploadMiddleware.js';

// Helper function to build dynamic query filters from request parameters
const createFilterQuery = (query) => {
    const filters = {};

    // Basic filters - direct mapping
    if (query.location) filters.location = query.location;
    if (query.category) filters.category = query.category;
    if (query.purpose) filters.purpose = query.purpose === 'buy' ? 'sale' : 'rent'; // Normalize buy to sale

    // Price range filtering
    if (query.minPrice || query.maxPrice || query.budget) {
        filters.price = {};
        if (query.budget) {
            // Budget provides a range around the specified value
            filters.price['$gte'] = Number(query.budget / 10);
            filters.price['$lte'] = Number(query.budget);
        }
        if (query.minPrice) filters.price['$gte'] = Number(query.minPrice);
        if (query.maxPrice) filters.price['$lte'] = Number(query.maxPrice);
    }

    // Keyword search in title and description
    if (query.keywords) {
        const list = query.keywords.replace(/\s{2,}/g, " ").split(' '); // Clean and split keywords
        // Build OR conditions for each keyword across title and description fields
        filters[Op.or] = list.map(keyword => ({
            [Op.or]: [
                { title: { [Op.like]: `%${keyword}%` } },
                { description: { [Op.like]: `%${keyword}%` } }
            ]
        }));
    }

    return filters;
}

// Get all properties with optional filtering and search
export const getAllProperties = async (req, res) => {
    const query = req.query; // Extract query parameters for filtering

    // Build dynamic filters based on search criteria
    const filters = createFilterQuery(query);
    // console.log('filter parameters:', query, filters);

    try {
        // Fetch properties with applied filters, excluding sensitive dealer_id
        let properties = await Property.findAll({
            where: filters,
            attributes: {
                exclude: ['dealer_id'] // Hide dealer_id for privacy
            },
            order: [['createdAt', 'DESC']] // Show newest properties first
        });

        // Transform properties for listing view - show only first image
        properties = properties.map(p => ({
            ...p.toJSON(),
            image: p.images?.[0] || null, // Use first image as thumbnail
            images: null // Remove full images array to reduce payload size
        }));

        res.status(200).json({
            success: true,
            message: 'Properties fetched successfully',
            properties: properties,
            totalCount: properties.length
        });
    } catch (error) {
        console.error('Error fetching properties:', error.message);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
}

// Get single property by ID with dealer information
export const getPropertyById = async (req, res) => {
    const { id } = req.params;
    try {
        let property = await Property.findByPk(id);

        // Include dealer contact information if property has a dealer
        if (property.dealer_id) {
            const dealer = await User.findByPk(property.dealer_id, {
                attributes: ['id', 'name', 'email', 'phone'] // Only include necessary dealer info
            });
            property = { ...property.toJSON(), dealer: dealer }; // Merge dealer info with property
        }

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Property fetched successfully',
            property: property
        });
    } catch (error) {
        console.error('Error fetching property:', error.message);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
}

// Create new property listing with image uploads
export const createProperty = async (req, res) => {
    try {
        const { title, description, category, purpose, location, price } = req.body;

        // Validate required fields before processing
        if (!title || !category || !purpose || !location || !price) {
            // Clean up uploaded files if validation fails to prevent orphaned images
            if (req.files && req.files.length > 0) {
                const cloudinaryUrls = req.files.map(file => file.path); // Cloudinary returns full URL in file.path
                await deleteCloudinaryImages(cloudinaryUrls);
            }
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: title, category, purpose, location, and price are required'
            });
        }

        // Extract image URLs from uploaded files
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => {
                // Cloudinary middleware stores full URL in file.path
                return file.path;
            });
        }

        // Prepare property data for database insertion
        const propertyData = {
            title,
            description: description || '', // Default to empty string if not provided
            category,
            purpose,
            location,
            price: parseFloat(price), // Ensure price is stored as number
            images: imageUrls, // Array of Cloudinary URLs
            dealer_id: req.user.id // Associate with authenticated dealer
        };

        // Create property in database
        const newProperty = await Property.create(propertyData);

        res.status(201).json({
            success: true,
            message: 'Property created successfully',
            data: {
                property: newProperty
            }
        });
    } catch (error) {
        console.error('Error creating property:', error.message);

        // Clean up uploaded files if database operation fails
        if (req.files && req.files.length > 0) {
            const cloudinaryUrls = req.files.map(file => file.path);
            await deleteCloudinaryImages(cloudinaryUrls);
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
}

export const updateProperty = async (req, res) => {
    const { id } = req.params;
    const { imagesToDelete, ...propertyData } = req.body;

    try {
        const property = await Property.findByPk(id);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Check if user owns this property
        if (property.dealer_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this property'
            });
        }

        // Update property fields
        if (propertyData.title) property.title = propertyData.title;
        if (propertyData.description !== undefined) property.description = propertyData.description;
        if (propertyData.category) property.category = propertyData.category;
        if (propertyData.location) property.location = propertyData.location;
        if (propertyData.purpose) property.purpose = propertyData.purpose;
        if (propertyData.price) property.price = parseFloat(propertyData.price);
        if (propertyData.isActive !== undefined) property.isActive = propertyData.isActive;

        // Handle image updates
        let currentImages = property.images || [];

        const imagesList = JSON.parse(imagesToDelete || '[]');

        // Remove images marked for deletion
        if (imagesList?.length > 0) {
            try {
                await deleteCloudinaryImages(imagesList);
                currentImages = currentImages.filter(img => !imagesList.includes(img));
                // console.log('Images deleted successfully');
            } catch (error) {
                console.error('Error deleting images:', error);
                // Continue with update even if some images couldn't be deleted
            }
        }

        // Add new images
        if (req.files && req.files.length > 0) {
            const newImageUrls = req.files.map(file => file.path);
            currentImages = [...currentImages, ...newImageUrls];
        }

        // Update images array
        property.images = currentImages;

        await property.save();

        res.status(200).json({
            success: true,
            message: 'Property updated successfully',
            data: {
                property: property
            }
        });
    } catch (error) {
        console.error('Error updating property:', error);

        // Clean up uploaded files if database operation fails
        if (req.files && req.files.length > 0) {
            const cloudinaryUrls = req.files.map(file => file.path);
            await deleteCloudinaryImages(cloudinaryUrls);
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
}

export const deleteProperty = async (req, res) => {
    const { id } = req.params;
    try {
        const property = await Property.findByPk(id);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Check if user owns this property
        if (property.dealer_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this property'
            });
        }

        // Delete images from Cloudinary before deleting property
        if (property.images && property.images.length > 0) {
            try {
                await deleteCloudinaryImages(property.images);
                console.log('Images deleted from Cloudinary successfully');
            } catch (cloudinaryError) {
                console.error('Error deleting images from Cloudinary:', cloudinaryError);
                // Continue with property deletion even if image deletion fails
            }
        }

        await property.destroy();
        res.status(200).json({
            success: true,
            message: 'Property deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting property:', error.message);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
}

export const getUserProperties = async (req, res) => {
    try {
        let properties = await Property.findAll({
            where: {
                dealer_id: req.user.id
            },
            order: [['createdAt', 'DESC']]
        });

        properties = properties.map(p => ({
            ...p.toJSON(),
            image: p.images?.[0] || null,
            images: null
        }));

        res.status(200).json({
            success: true,
            message: 'Your properties fetched successfully',
            data: {
                properties: properties
            }
        });
    } catch (error) {
        console.error('Error fetching user properties:', error.message);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
}
