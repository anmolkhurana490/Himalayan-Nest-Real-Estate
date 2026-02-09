// Enquiry Repository - Database Operations Layer
// Handles all CRUD operations for Enquiry model

import { Op } from 'sequelize';
import { Enquiry, Property, User } from '../config/db.js';
import { PROPERTY_ASSOCIATIONS_ATTRIBUTES } from '../constants/property.js';
import { USER_ASSOCIATIONS_ATTRIBUTES } from '../constants/user.js';

// Define Associations for Enquiry model
Enquiry.belongsTo(Property, { as: 'property', foreignKey: 'property_id' });
Enquiry.belongsTo(User, { as: 'sender', foreignKey: 'sender_id' });
Enquiry.belongsTo(User, { as: 'receiver', foreignKey: 'receiver_id' });

class EnquiryRepository {
    /**
     * Create a new enquiry
     * @param {Object} enquiryData - Enquiry data
     * @returns {Promise<Enquiry>}
     */
    async create(enquiryData) {
        return await Enquiry.create(enquiryData);
    }

    /**
     * Find enquiry by ID
     * @param {String} id - Enquiry ID
     * @returns {Promise<Enquiry|null>}
     */
    async findById(id) {
        return await Enquiry.findByPk(id);
    }

    /**
     * Get all enquiries
     * @param {Object} filters - Optional filter criteria
     * @returns {Promise<Array<Enquiry>>}
     */
    async findAll(filters = {}, options = {}) {
        const include = [];

        if (options.includeProperty) {
            include.push({
                model: Property,
                as: 'property',
                attributes: PROPERTY_ASSOCIATIONS_ATTRIBUTES
            });
        }
        if (options.includeSender) {
            include.push({
                model: User,
                as: 'sender',
                attributes: USER_ASSOCIATIONS_ATTRIBUTES
            });
        }
        if (options.includeReceiver) {
            include.push({
                model: User,
                as: 'receiver',
                attributes: USER_ASSOCIATIONS_ATTRIBUTES
            });
        }

        return await Enquiry.findAll({
            include: include.length > 0 ? include : undefined,
            where: filters,
            order: [['createdAt', 'DESC']],
        });
    }

    /**
     * Find an open enquiry for a given sender and property
     * (that is not closed or expired) - used to prevent spam enquiries
     * @param {String} senderId - Sender user ID
     * @param {String} propertyId - Property ID
     * @returns {Promise<Enquiry|null>}
     */
    async findOpenBySenderAndProperty(senderId, propertyId) {
        return await Enquiry.findOne({
            where: {
                sender_id: senderId,
                property_id: propertyId,
                status: {
                    [Op.notIn]: ['closed', 'expired'],
                },
            },
        });
    }

    /**
     * Update enquiry by ID
     * @param {String} id - Enquiry ID
     * @param {Object} updates - Data to update
     * @returns {Promise<Enquiry|null>}
     */
    async update(id, updates) {
        const enquiry = await this.findById(id);
        if (!enquiry) return null;

        return await enquiry.update(updates);
    }

    /**
     * Delete enquiry by ID
     * @param {String} id - Enquiry ID
     * @returns {Promise<Boolean>}
     */
    async delete(id) {
        const enquiry = await this.findById(id);
        if (!enquiry) return false;

        await enquiry.destroy();
        return true;
    }
}

export default new EnquiryRepository();
