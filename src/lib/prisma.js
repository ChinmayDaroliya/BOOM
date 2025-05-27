import { PrismaClient } from '@prisma/client'

/**
 * Prisma Client Configuration
 * This file sets up a singleton instance of PrismaClient to be used throughout the application.
 * The singleton pattern prevents multiple instances during development hot-reloading.
 */

// Use globalThis to store the Prisma instance
const globalForPrisma = globalThis

// Create a new PrismaClient instance if one doesn't exist
export const prisma = globalForPrisma.prisma || new PrismaClient()

// In development, store the instance in globalThis to prevent multiple instances
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma