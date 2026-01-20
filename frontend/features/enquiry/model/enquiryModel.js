// Enquiry Model - Data model for enquiries
// Defines the structure for enquiry data

export class Enquiry {
    constructor(data = {}) {
        this.id = data.id || data._id || null;
        this.name = data.name || '';
        this.email = data.email || '';
        this.phone = data.phone || '';
        this.message = data.message || '';
        this.propertyId = data.propertyId || data.property?._id || null;
        this.property = data.property || null;
        this.status = data.status || 'pending';
        this.createdAt = data.createdAt || null;
        this.updatedAt = data.updatedAt || null;
    }

    isPending() {
        return this.status === 'pending';
    }

    isResolved() {
        return this.status === 'resolved';
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
