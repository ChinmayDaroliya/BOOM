'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/Navigation'
import WalletBalance from '@/components/WalletBalance'
import { VideoCardSkeleton } from '@/components/LoadingSkeleton'
import { 
  Video, 
 
  Gift, 
  TrendingUp, 
  Eye, 

 
  Play,
  Upload
} from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalGifts: 0,
    totalEarnings: 0
  })
  const [recentVideos, setRecentVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchUserData()
    fetchDashboardStats()
    fetchRecentVideos()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      router.push('/login');
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const fetchRecentVideos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/videos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json()
        setRecentVideos(data.videos)
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation user={user} />
        <main className="md:ml-64 p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <VideoCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  const statsCards = [
    {
      title: 'Total Videos',
      value: stats.totalVideos,
      icon: Video,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      icon: Eye,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      title: 'Gifts Received',
      value: stats.totalGifts,
      icon: Gift,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50'
    },
    {
      title: 'Total Earnings',
      value: `₹${stats.totalEarnings}`,
      icon: TrendingUp,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} />
      
      <main className="md:ml-64 p-6 pb-20 md:pb-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-gray-600">
            Here&#39;s your creator dashboard overview

          </p>
        </div>

        {/* Wallet Balance */}
        <div className="mb-8">
          <WalletBalance userId={user?.id} balance={user?.walletBalance || 0} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className={`p-6 bg-gradient-to-r ${stat.bgColor} border-0`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-full`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Videos */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center space-x-2">
                  <Video className="h-5 w-5" />
                  <span>Recent Videos</span>
                </h2>
                <Link href="/upload">
                  <Button size="sm" className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload New</span>
                  </Button>
                </Link>
              </div>

              {recentVideos.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No videos yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Start creating content to see your videos here
                  </p>
                  <Link href="/upload">
                    <Button className="flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Upload Your First Video</span>
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentVideos.map((video) => (
                    <div key={video.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-shrink-0">
                        {video.videoType === 'short' ? (
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <Video className="h-6 w-6 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {video.title}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            video.videoType === 'short' 
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {video.videoType === 'short' ? 'Short-form' : 'Long-form'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(video.createdAt)}
                          </span>
                          {video.price && video.price > 0 && (
                            <span className="text-sm text-green-600 font-medium">
                              ₹{video.price}
                            </span>
                          )}
                        </div>
                      </div>
                      <Link href={`/watch/${video.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/upload" className="block">
                  <Button className="w-full justify-start space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload Video</span>
                  </Button>
                </Link>
                <Link href="/feed" className="block">
                  <Button variant="outline" className="w-full justify-start space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Browse Feed</span>
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Tips Card */}
            <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <h2 className="text-xl font-semibold mb-4 text-purple-800">
                Creator Tips 💡
              </h2>
              <div className="space-y-3 text-sm text-purple-700">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Upload consistently to grow your audience</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Engage with comments to build community</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Use compelling titles and descriptions</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Premium content can generate more revenue</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}