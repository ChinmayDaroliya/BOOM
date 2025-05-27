/**
 * Registration API Route
 * Handles new user registration and account creation
 * POST /api/auth/register
 * 
 * Request body:
 * {
 *   username: string,
 *   email: string,
 *   password: string
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   token: string,
 *   message: string,
 *   user: {
 *     id: string,
 *     username: string,
 *     email: string,
 *     walletBalance: number
 *   }
 * }
 */

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    // Extract registration data from request body
    const { username, email, password } = await request.json();

    // Input validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Password strength validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check for existing users with same email or username
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      );
    }

    // Securely hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create new user with initial wallet balance
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        walletBalance: 500 // Initial balance of ₹500
      },
      select: {
        id: true,
        username: true,
        email: true,
        walletBalance: true
      }
    });

    // Generate authentication token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );

    // Return success response with user data and token
    return NextResponse.json(
      { 
        success: true,
        token,
        message: 'User created successfully',
        user 
      },
      { status: 201 }
    );

  } catch (error) {
    // Log error and return generic message for security
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}