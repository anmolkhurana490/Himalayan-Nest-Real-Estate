// Property Repository - Prisma Implementation
import prisma from '../config/prismaClient.js';
import { Op } from 'sequelize';
import { USER_ASSOCIATIONS_ATTRIBUTES } from '../constants/user.js';
import { PROPERTY_ASSOCIATIONS_ATTRIBUTES } from '../constants/property.js';

const toSelect = (arr) => arr ? arr.reduce((s, k) => { s[k] = true; return s }, {}) : undefined;

class PropertyRepository {
    /**
     * Create a new property
     * @param {Object} propertyData - Property data
     * @returns {Promise<Property>}
     */
    async create(propertyData) {
        return await prisma.property.create({ data: propertyData });
    }

    /**
     * Find property by ID, and increment view count
     * @param {String} id - Property ID
     * @param {Object} options - Optional query options (for including associations, etc.)
     * @returns {Promise<Property|null>}
     */
    async findById(id, options = {}) {
        const include = options.includeAuthor ? {
            author: { select: toSelect(USER_ASSOCIATIONS_ATTRIBUTES) }
        } : undefined;

        const property = await prisma.property.findUnique({ where: { id } });
        if (!property) return null;

        // increment viewCount
        const updated = await prisma.property.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
            ...(include ? { include } : {})
        });
        return updated;
    }

    /**
     * Get all properties with optional filters
     * @param {Object} filters - Filter criteria
     * @param {Object} options - Query options (order, limit, etc.)
     * @returns {Promise<Array<Property>>}
     */
    async findAll(filters = {}, options = {}) {
        const query = { where: filters };
        if (options.order) query.orderBy = options.order;
        if (options.limit) query.take = options.limit;
        if (options.offset) query.skip = options.offset;
        return await prisma.property.findMany(query);
    }

    /**
     * Get properties by author ID
     * @param {String} authorId - Author user ID
     * @returns {Promise<Array<Property>>}
     */
    async findByAuthorId(authorId) {
        return await prisma.property.findMany({
            where: { authorId },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Update property by ID
     * @param {String} id - Property ID
     * @param {Object} updates - Data to update
     * @returns {Promise<Property|null>}
     */
    async update(id, updates) {
        const existing = await prisma.property.findUnique({ where: { id } });
        if (!existing) return null;
        return await prisma.property.update({ where: { id }, data: updates });
    }

    /**
     * Delete property by ID
     * @param {String} id - Property ID
     * @returns {Promise<Boolean>}
     */
    async delete(id) {
        const existing = await prisma.property.findUnique({ where: { id } });
        if (!existing) return false;
        await prisma.property.delete({ where: { id } });
        return true;
    }

    /**
     * Build dynamic search filters from query parameters
     * @param {Object} query - Request query parameters
     * @returns {Object} - Sequelize where clause
     */
    buildSearchFilters(query) {
        const filters = {};

        if (query.category) filters.category = query.category;
        if (query.purpose) filters.purpose = query.purpose === 'buy' ? 'sale' : 'rent';

        if (query.minPrice || query.maxPrice || query.budget) {
            const price = {};
            if (query.budget) {
                price.gte = Number(query.budget / 10);
                price.lte = Number(query.budget);
            }
            if (query.minPrice) price.gte = Number(query.minPrice);
            if (query.maxPrice) price.lte = Number(query.maxPrice);
            filters.price = price;
        }

        if (query.keywords || query.location) filters.OR = []

        if (query.location) {
            // extract list of keywords
            const wordList = query.location.replace(/[\s,/;\s]{2,}/g, ' ').split(' ');

            for (const word of wordList) {
                filters.OR.push({ location: { contains: word, mode: 'insensitive' } });
            }
        }

        if (query.keywords) {
            // extract list of keywords
            const wordList = query.keywords.replace(/[\s,/;\s]{2,}/g, ' ').split(' ');

            for (const word of wordList) {
                filters.OR.push({ title: { contains: word, mode: 'insensitive' } });
                filters.OR.push({ description: { contains: word, mode: 'insensitive' } });
            }
        }

        return filters;
    }

    /**
     * Count properties matching filters
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Number>}
     */
    async count(filters = {}) {
        return await prisma.property.count({ where: filters });
    }
}

export default new PropertyRepository();
