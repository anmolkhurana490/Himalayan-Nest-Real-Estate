// Property Model - Data model for properties
// Defines the structure and validation for property data

import { formatPrice } from "@/utils/helpers";
import { fa } from "zod/v4/locales";

export class Property {
    constructor(data = {}) {
        this.id = data.id || data._id || null;
        this.title = data.title || '';
        this.description = data.description || '';
        this.category = data.category || '';
        this.purpose = data.purpose || 'Sale';
        this.location = data.location || '';

        this.price = data.price || 0;
        this.formattedprice = formatPrice(data.price) || 0;
        this.pricepersqft = data.area ? data.price / data.area : null;
        this.formattedpricepersqft = this.pricepersqft ? formatPrice(this.pricepersqft) : null;

        this.image = data.image || data.images?.[0] || '';
        this.images = data.images || [];

        this.owner = data.owner || null;
        this.createdAt = data.createdAt || null;
        this.updatedAt = data.updatedAt || null;
        this.featured = data.featured || false;
        this.isActive = data.isActive || false;
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
