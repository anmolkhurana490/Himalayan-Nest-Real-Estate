// Enquiry Model - Data model for enquiries
// Defines the structure for enquiry data

export class Enquiry {
    constructor(data = {}) {
        this.id = data.id || data._id || null;
        this.sender_id = data.sender_id || null;
        this.receiver_id = data.receiver_id || null;
        this.property_id = data.property_id || null;
        this.sender = data.sender || null;
        this.receiver = data.receiver || null;
        this.property = data.property || null;

        // Handle messages array safely
        this.messages = data.messages || [];
        this.message = this.messages.length > 0 ? new Message(this.messages[0]) : null;
        this.response = this.messages.length > 1 ? new Message(this.messages[1]) : null;

        this.status = data.status || 'pending';
        this.createdAt = data.createdAt || null;
        this.closedAt = data.closedAt || null;
    }

    isOpenForChat() {
        return this.status === 'responded';
    }

    isPending() {
        return this.status === 'pending';
    }

    isResponded() {
        return this.status === 'responded';
    }

    isClosed() {
        return this.status === 'closed';
    }

    isRejected() {
        return this.status === 'rejected';
    }
}

export class EnquiryFormData {
    constructor(data = {}) {
        this.name = data.name || '';
        this.email = data.email || '';
        this.phone = data.phone || '';
        this.message = data.message || '';
        this.propertyId = data.propertyId || null;
    }
}

export class Message {
    constructor(data = {}) {
        this.id = data.id || data._id || null;
        this.message = data.message || '';
        this.createdAt = data.createdAt || null;
    }
}