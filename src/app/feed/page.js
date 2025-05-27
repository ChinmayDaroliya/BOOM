'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import VideoCard from '@/components/VideoCard';
import { LogOut } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

export default function FeedPage() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  // Use Intersection Observer for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px'
  });

  // Memoized fetch function
  const fetchVideos = useCallback(async (pageNum = 1) => {
    try {
      setError(null);
      const response = await fetch(`/api/feed?page=${pageNum}&limit=5`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      const data = await response.json();
      
      if (pageNum === 1) {
        setVideos(data.videos);
      } else {
        setVideos(prev => [...prev, ...data.videos]);
      }
      
      setHasMore(data.pagination.hasMore);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Failed to load videos. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch('/api/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.user);
        } else {
          router.push('/login');
          return;
        }

        // Fetch initial videos
        await fetchVideos(1);
      } catch (error) {
        console.error('Initial data fetch error:', error);
        setError('Failed to load initial data. Please refresh the page.');
      }
    };

    fetchInitialData();
  }, [router, fetchVideos]);

  // Load more when scrolling
  useEffect(() => {
    if (inView && !loadingMore && hasMore) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchVideos(nextPage);
    }
  }, [inView, loadingMore, hasMore, page, fetchVideos]);

  const handlePurchase = async (videoId, price) => {
    try {
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ videoId }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update video purchase status
        setVideos(prev => prev.map(video => 
          video.id === videoId 
            ? { ...video, isPurchased: true }
            : video
        ));

        // Update user wallet balance
        setUser(prev => ({
          ...prev,
          walletBalance: prev.walletBalance - price
        }));

        alert('Video purchased successfully!');
      } else {
        alert(data.error || 'Purchase failed');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCommentClick = (videoId) => {
    router.push(`/watch/${videoId}`);
  };

  const handleGiftClick = (videoId) => {
    router.push(`/watch/${videoId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Boom Feed</h1>
            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{user.username}</span>
                  <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    ₹{user.walletBalance}
                  </span>
                </div>
                <Button 
                  onClick={() => router.push('/dashboard')}
                  variant="outline"
                  size="sm"
                >
                  Dashboard
                </Button>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onPurchase={handlePurchase}
              onWatch={() => router.push(`/watch/${video.id}`)}
              onCommentClick={handleCommentClick}
              onGiftClick={handleGiftClick}
            />
          ))}
          
          {/* Loading indicator for infinite scroll */}
          <div ref={ref} className="h-20 flex items-center justify-center">
            {loadingMore && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}