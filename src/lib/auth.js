import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

/**
 * Authentication Configuration
 * JWT secret key for token signing and verification
 * Uses environment variable with fallback for development
 */
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'

/**
 * Password Hashing
 * Securely hashes passwords using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password) {
  return await bcrypt.hash(password, 12)
}

/**
 * Password Verification
 * Compares a plain text password with a hashed password
 * @param {string} password - Plain text password to verify
 * @param {string} hashedPassword - Stored hashed password
 * @returns {Promise<boolean>} True if passwords match
 */
export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

/**
 * Token Generation
 * Creates a JWT token for user authentication
 * @param {string} userId - User's unique identifier
 * @returns {string} JWT token
 */
export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

/**
 * Token Verification
 * Verifies the authenticity of a JWT token
 * @param {string} token - JWT token to verify
 * @returns {object|null} Decoded token payload or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

/**
 * User Retrieval from Token
 * Fetches user data using a verified token
 * @param {string} token - JWT token
 * @returns {Promise<object|null>} User object or null if not found
 */
export async function getUserFromToken(token) {
  try {
    const decoded = verifyToken(token)
    if (!decoded) return null

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        walletBalance: true,
        createdAt: true
      }
    })

    return user
  } catch (error) {
    console.error('Error fetching user from token:', error)
    return null
  }
}

/**
 * Request Authentication Extraction
 * Extracts and validates authentication token from request headers
 * @param {Request} request - HTTP request object
 * @returns {Promise<object|null>} User object or null if not authenticated
 */
export async function getAuthFromRequest(request) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  if (!token) return null
  
  return await getUserFromToken(token)
}

/**
 * Authentication Verification
 * Verifies authentication for API routes
 * @param {Request} request - HTTP request object
 * @returns {Promise<object|null>} User object or null if not authenticated
 */
export async function verifyAuth(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.replace('Bearer ', '');
  return await getUserFromToken(token);
}