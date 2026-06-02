import prisma from '../config/prismaClient.js';

class SavedPropertiesRepository {
  /**
   * Find saved properties by user ID
   * @param {number} userId - ID of the user whose saved properties are to be fetched
   * @return {Promise<Array>} - List of saved properties for the user
   */
  async findByUserId(userId) {
    return await prisma.savedProperty.findMany({
      where: { userId },
      include: { property: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByUserAndPropertyId(userId, propertyId) {
    return await prisma.savedProperty.findFirst({
      where: { userId, propertyId }
    });
  }

  /**
   * Create a saved property entry for a user
   * @param {number} userId - ID of the user who wants to save the property
   * @param {number} propertyId - ID of the property to be added to saved properties
   * @return {Promise<void>}
   */
  async create(userId, propertyId) {
    await prisma.savedProperty.create({
      data: {
        userId,
        propertyId,
      },
    });
  }

  /**
   * Delete a saved property entry for a user
   * @param {number} userId - ID of the user who wants to remove the saved property
   * @param {number} propertyId - ID of the property to be removed from saved properties
   * @return {Promise<void>}
   */
  async delete(userId, propertyId) {
    await prisma.savedProperty.deleteMany({
      where: {
        userId,
        propertyId,
      },
    });
  }

  /**
   * Delete all saved properties for a user
   * @param {number} userId - ID of the user whose saved properties are to be cleared
   * @return {Promise<void>}
   */
  async deleteAll(userId) {
    await prisma.savedProperty.deleteMany({
      where: { userId },
    });
  }
}

export default new SavedPropertiesRepository();