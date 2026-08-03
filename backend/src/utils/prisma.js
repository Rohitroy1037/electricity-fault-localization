import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * Prisma Client Singleton
 *
 * Configured with PrismaPg driver adapter for Prisma 7 compatibility.
 */
const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default prisma;
