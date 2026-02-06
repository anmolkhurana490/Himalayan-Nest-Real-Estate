/**
 * Saved Property Model
 * Represents a property that has been saved/favorited by a user
 */

// This model is currently not used for backend interactions, as saved properties are of Property type and stored in localStorage. It can be expanded in the future if backend support is added.

// export class SavedProperty {
//     constructor(data = {}) {
//         this.id = data.id || data._id || null;
//         this.propertyId = data.propertyId || data.id || data._id;
//         this.title = data.title || '';
//         this.description = data.description || '';
//         this.price = data.price || 0;
//         this.formattedprice = data.formattedprice || '';
//         this.location = data.location || '';
//         this.category = data.category || '';
//         this.purpose = data.purpose || 'sale';
//         this.image = data.image || data.images?.[0] || '';
//         this.images = data.images || [];
//         this.featured = data.featured || false;
//         this.savedAt = data.savedAt || new Date().toISOString();
//     }

//     static fromJSON(json) {
//         return new SavedProperty(json);
//     }

//     toJSON() {
//         return {
//             id: this.id,
//             propertyId: this.propertyId,
//             title: this.title,
//             description: this.description,
//             price: this.price,
//             formattedprice: this.formattedprice,
//             location: this.location,
//             category: this.category,
//             purpose: this.purpose,
//             image: this.image,
//             images: this.images,
//             featured: this.featured,
//             savedAt: this.savedAt,
//         };
//     }
// }
