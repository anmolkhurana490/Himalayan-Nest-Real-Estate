// Property Model - Data model for properties
// Defines the structure and validation for property data

export class Property {
    constructor(data = {}) {
        this.id = data.id || data._id || null;
        this.title = data.title || '';
        this.description = data.description || '';
        this.category = data.category || '';
        this.purpose = data.purpose || 'Sale';
        this.location = data.location || '';
        this.price = data.price || 0;
        this.image = data.image || data.images?.[0] || '';
        this.images = data.images || [];
        this.owner = data.owner || null;
        this.createdAt = data.createdAt || null;
        this.updatedAt = data.updatedAt || null;
        this.featured = data.featured || false;
    }

    get formattedPrice() {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(this.price);
    }

    isFeatured() {
        return this.featured === true;
    }
}

export class PropertyFilter {
    constructor(filters = {}) {
        this.location = filters.location || '';
        this.category = filters.category || '';
        this.minPrice = filters.minPrice || '';
        this.maxPrice = filters.maxPrice || '';
        this.keywords = filters.keywords || '';
        this.purpose = filters.purpose || 'buy';
    }
}
