import { NextResponse } from 'next/server';

/**
 * Middleware Function
 * Handles authentication and route protection for the application.
 * This middleware runs on every request and manages:
 * 1. Route protection (authentication required)
 * 2. Public route access
 * 3. Redirects based on authentication status
 */
export function middleware(request) {
  // Get authentication token from cookies
  const token = request.cookies.get('token')?.value;

  // Define route categories
  // Protected routes require authentication
  const protectedRoutes = ['/feed', '/upload', '/watch', '/dashboard'];
  // Public routes are accessible without authentication
  const publicRoutes = ['/login', '/register'];
  
  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // Authentication Logic:
  // 1. Redirect to login if trying to access protected route without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Redirect to feed if trying to access public route with valid token
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  // 3. Special handling for root path (/)
  if (request.nextUrl.pathname === '/') {
    if (token) {
      // If user is authenticated, redirect to feed
      return NextResponse.redirect(new URL('/feed', request.url));
    }
    // If not authenticated, allow access to landing page
    return NextResponse.next();
  }

  // Allow the request to proceed for all other cases
  return NextResponse.next();
}

/**
 * Middleware Configuration
 * Specifies which routes the middleware should run on
 * Uses path matching patterns to determine route coverage
 */
export const config = {
  matcher: [
    '/',                    // Root path
    '/feed/:path*',        // Feed and its sub-routes
    '/upload/:path*',      // Upload and its sub-routes
    '/watch/:path*',       // Watch and its sub-routes
    '/dashboard/:path*',   // Dashboard and its sub-routes
    '/login',              // Login page
    '/register'            // Registration page
  ]
};