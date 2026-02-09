// EnquiryMessage Repository - Database Operations Layer
// Handles CRUD operations for EnquiryMessage model

import { EnquiryMessage } from '../config/db.js';

class EnquiryMessageRepository {
    async create(messageData) {
        return await EnquiryMessage.create(messageData);
    }

    async findAllByEnquiryId(enquiryId, limit) {
        return await EnquiryMessage.findAll({
            where: { enquiry_id: enquiryId },
            order: [['createdAt', 'ASC']],
            limit
        });
    }
}

export default new EnquiryMessageRepository();
