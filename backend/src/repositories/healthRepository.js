import prisma from '../config/prismaClient.js';

class HealthRepository {
	async pingDatabase() {
		await prisma.$executeRaw`SELECT 1`;
	}
}

export default new HealthRepository();