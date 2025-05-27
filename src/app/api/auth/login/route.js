/**
 * Login API Route
 * Handles user authentication and session creation
 * POST /api/auth/login
 * 
 * Request body:
 * {
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
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    // Extract credentials from request body
    const { email, password } = await request.json();

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password against stored hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token for authentication
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Prepare success response with user data
    const response = NextResponse.json(
      { 
        success: true,
        token,
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          walletBalance: user.walletBalance
        }
      },
      { status: 200 }
    );

    // Set authentication cookie
    response.cookies.set('token', token, {
      httpOnly: true, // Prevents JavaScript access to the cookie
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax', // CSRF protection
      maxAge: 60 * 60 * 24 * 7 // 7 days expiration
    });

    return response;

  } catch (error) {
    // Log error and return generic message for security
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}