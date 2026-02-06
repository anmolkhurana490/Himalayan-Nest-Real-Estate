/**
 * CustomerPreferences Model
 * Represents user preferences and settings for customers
 */

export class CustomerPreferences {
    constructor(data = {}) {
        this.userId = data.userId || null;
        this.emailNotifications = data.emailNotifications !== undefined ? data.emailNotifications : true;
        this.pushNotifications = data.pushNotifications !== undefined ? data.pushNotifications : true;
        this.priceAlerts = data.priceAlerts !== undefined ? data.priceAlerts : false;
        this.newListingsAlert = data.newListingsAlert !== undefined ? data.newListingsAlert : false;
        this.savedSearches = data.savedSearches || [];
        this.preferredLocations = data.preferredLocations || [];
        this.priceRange = data.priceRange || { min: 0, max: null };
        this.propertyTypes = data.propertyTypes || [];
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    /**
     * Convert to JSON object for API requests
     */
    toJSON() {
        return {
            userId: this.userId,
            emailNotifications: this.emailNotifications,
            pushNotifications: this.pushNotifications,
            priceAlerts: this.priceAlerts,
            newListingsAlert: this.newListingsAlert,
            savedSearches: this.savedSearches,
            preferredLocations: this.preferredLocations,
            priceRange: this.priceRange,
            propertyTypes: this.propertyTypes,
        };
    }

    /**
     * Create instance from API response
     */
    static fromJSON(json) {
        return new CustomerPreferences(json);
    }
}

export default CustomerPreferences;
