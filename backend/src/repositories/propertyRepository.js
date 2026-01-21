// Property Repository - Database Operations Layer
// Handles all CRUD operations for Property model

import { Property, User } from '../config/db.js';
import { Op } from 'sequelize';

class PropertyRepository {
    /**
     * Create a new property
     * @param {Object} propertyData - Property data
     * @returns {Promise<Property>}
     */
    async create(propertyData) {
        return await Property.create(propertyData);
    }

    /**
     * Find property by ID
     * @param {String} id - Property ID
     * @param {Object} options - Optional query options
     * @returns {Promise<Property|null>}
     */
    async findById(id, options = {}) {
        return await Property.findByPk(id, options);
    }

    /**
     * Find property by ID with dealer information
     * @param {String} id - Property ID
     * @returns {Promise<Object|null>}
     */
    async findByIdWithDealer(id) {
        const property = await Property.findByPk(id);
        if (!property) return null;

        if (property.dealer_id) {
            const dealer = await User.findByPk(property.dealer_id, {
                attributes: ['id', 'name', 'email', 'phone']
            });
            return { ...property.toJSON(), dealer };
        }

        return property;
    }

    /**
     * Get all properties with optional filters
     * @param {Object} filters - Filter criteria
     * @param {Object} options - Query options (order, limit, etc.)
     * @returns {Promise<Array<Property>>}
     */
    async findAll(filters = {}, options = {}) {
        const queryOptions = {
            where: filters,
            ...options
        };

        return await Property.findAll(queryOptions);
    }

    /**
     * Get properties by dealer ID
     * @param {String} dealerId - Dealer user ID
     * @returns {Promise<Array<Property>>}
     */
    async findByDealerId(dealerId) {
        return await Property.findAll({
            where: { dealer_id: dealerId },
            order: [['createdAt', 'DESC']]
        });
    }

    /**
     * Update property by ID
     * @param {String} id - Property ID
     * @param {Object} updates - Data to update
     * @returns {Promise<Property|null>}
     */
    async update(id, updates) {
        const property = await this.findById(id);
        if (!property) return null;

        return await property.update(updates);
    }

    /**
     * Delete property by ID
     * @param {String} id - Property ID
     * @returns {Promise<Boolean>}
     */
    async delete(id) {
        const property = await this.findById(id);
        if (!property) return false;

        await property.destroy();
        return true;
    }

    /**
     * Build dynamic search filters from query parameters
     * @param {Object} query - Request query parameters
     * @returns {Object} - Sequelize where clause
     */
    buildSearchFilters(query) {
        const filters = {};

        // Basic filters
        if (query.location) filters.location = query.location;
        if (query.category) filters.category = query.category;
        if (query.purpose) filters.purpose = query.purpose === 'buy' ? 'sale' : 'rent';

        // Price range filtering
        if (query.minPrice || query.maxPrice || query.budget) {
            filters.price = {};
            if (query.budget) {
                filters.price[Op.gte] = Number(query.budget / 10);
                filters.price[Op.lte] = Number(query.budget);
            }
            if (query.minPrice) filters.price[Op.gte] = Number(query.minPrice);
            if (query.maxPrice) filters.price[Op.lte] = Number(query.maxPrice);
        }

        // Keyword search in title and description
        if (query.keywords) {
            const list = query.keywords.replace(/\s{2,}/g, " ").split(' ');
            filters[Op.or] = list.map(keyword => ({
                [Op.or]: [
                    { title: { [Op.like]: `%${keyword}%` } },
                    { description: { [Op.like]: `%${keyword}%` } }
                ]
            }));
        }

        return filters;
    }

    /**
     * Count properties matching filters
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Number>}
     */
    async count(filters = {}) {
        return await Property.count({ where: filters });
    }
}

export default new PropertyRepository();
