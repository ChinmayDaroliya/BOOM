'use client'

// Import necessary dependencies
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Upload, Users, Zap } from 'lucide-react'

/**
 * HomePage Component
 * This is the landing page of the BOOM Platform that handles:
 * 1. Authentication check and redirection
 * 2. Display of platform features and benefits
 * 3. Call-to-action buttons for registration and login
 */
export default function HomePage() {
  // State to manage loading state during authentication check
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check for existing authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // If token exists, verify it with the backend
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        // If token is valid, redirect to feed page
        if (data.success) {
          router.push('/feed')
        }
      })
      .catch(() => {})
    }
    setLoading(false)
  }, [router])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Hero Section - Main landing area with platform introduction */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          {/* Welcome banner */}
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Welcome to the Future of Entertainment
          </div>
          
          {/* Platform name with gradient effect */}
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-6">
            BOOM Platform
          </h1>
          
          {/* Platform description */}
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover, create, and monetize video content on the world&apos;s most impactful 
            decentralized entertainment ecosystem. Where creators earn fairly and power is returned to the people.
          </p>
          
          {/* Call-to-action buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register">
              <Button size="lg" className="px-8 py-3 text-lg">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid - Highlighting key platform features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Unified Content Feature */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Unified Content</CardTitle>
              <CardDescription>
                Experience both short-form and long-form videos in one seamless feed
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Creator Economy Feature */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Creator Economy</CardTitle>
              <CardDescription>
                Monetize your content directly with built-in payments and gifting
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Community First Feature */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
              <CardTitle>Community First</CardTitle>
              <CardDescription>
                Quality content discovery based on merit, not follower count
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats Section - Platform metrics and achievements */}
        <div className="bg-white/70 backdrop-blur rounded-2xl p-8 mb-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10M+</div>
              <div className="text-muted-foreground">Videos Uploaded</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500K+</div>
              <div className="text-muted-foreground">Active Creators</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">₹50M+</div>
              <div className="text-muted-foreground">Creator Earnings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>

        {/* Final CTA Section - Encouraging user registration */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the Revolution?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already building the future of entertainment. 
            Start your journey today.
          </p>
          <Link href="/register">
            <Button size="lg" className="px-12 py-4 text-lg">
              Start Creating Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}