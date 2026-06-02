import savedPropertyRepository from "../../../repositories/savedPropertyRepository.js";
import propertyRepository from "../../../repositories/propertyRepository.js";

class SavedPropertiesService {
  /**
   * Fetch saved properties for a user
   * @param {number} userId - ID of the user whose saved properties are to be fetched
   * @return {Promise<Array>} - List of saved properties for the user
   */
  async getSavedProperties(userId) {
    const savedProperties = await savedPropertyRepository.findByUserId(userId);
    return savedProperties.map((s) => s.property);
  }

  /**
   * Add a property to the user's saved properties
   * @param {number} userId - ID of the user who wants to save the property
   * @param {number} propertyId - ID of the property to be added to saved properties
   * @return {Promise<void>}
   */
  async addSavedProperty(userId, propertyId) {
    // Check if the property exists and is already in the user's saved properties
    const property = await propertyRepository.findById(propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    const existingSavedProperty = await savedPropertyRepository.findByUserAndPropertyId(userId, propertyId);

    // if property already saved, no need to save again. return success
    if (existingSavedProperty) return;

    await savedPropertyRepository.create(userId, propertyId);
  }

  /**
   * Remove a property from the user's saved properties
   * @param {number} userId - ID of the user who wants to remove the saved property
   * @param {number} propertyId - ID of the property to be removed from saved properties
   * @return {Promise<void>}
   */
  async removeSavedProperty(userId, propertyId) {
    // Check if the property exists in the user's saved properties
    const property = await propertyRepository.findById(propertyId);
    if (!property) {
      throw new Error('Saved property not found');
    }

    const existingSavedProperty = await savedPropertyRepository.findByUserAndPropertyId(userId, propertyId);

    // if property already not saved, no need to unsave. return success
    if (!existingSavedProperty) return;

    await savedPropertyRepository.delete(userId, propertyId);
  }

  /**
   * Clear all saved properties for a user
   * @param {number} userId - ID of the user whose saved properties are to be cleared
   * @return {Promise<void>}
   */
  async clearSavedProperties(userId) {
    await savedPropertyRepository.deleteAll(userId);
  }
}

export default new SavedPropertiesService();