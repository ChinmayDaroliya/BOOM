'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Gift, MessageCircle, Send, History } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function WatchPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params.id;

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [giftHistory, setGiftHistory] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [giftAmount, setGiftAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [giftCount, setGiftCount] = useState(0);

  useEffect(() => {
    fetchUser();
    fetchVideo();
    fetchComments();
    fetchGiftCount();
    fetchGiftHistory();
  }, [videoId]);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        console.log('User data received:', data.user);
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchVideo = async () => {
    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Video data received:', data.video);
        setVideo(data.video);
      } else if (response.status === 401) {
        router.push('/login');
      } else {
        router.push('/feed');
      }
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?videoId=${videoId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchGiftCount = async () => {
    try {
      const response = await fetch(`/api/videos/${videoId}/gifts`);
      if (response.ok) {
        const data = await response.json();
        setGiftCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching gift count:', error);
    }
  };

  const fetchGiftHistory = async () => {
    try {
      const response = await fetch(`/api/videos/${videoId}/gifts/history`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setGiftHistory(data.gifts);
      }
    } catch (error) {
      console.error('Error fetching gift history:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          videoId: parseInt(videoId),
          content: newComment.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setComments(prev => [data.comment, ...prev]);
        setNewComment('');
      } else {
        alert(data.error || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Comment error:', error);
      alert('Failed to add comment');
    }
  };

  const handleGift = async () => {
    if (!giftAmount || parseInt(giftAmount) <= 0) {
      alert('Please enter a valid gift amount');
      return;
    }

    try {
      const response = await fetch('/api/gift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          videoId: parseInt(videoId),
          amount: parseInt(giftAmount)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setGiftAmount('');
        // Update gift count
        setGiftCount(prev => prev + 1);
        // Update gift history
        fetchGiftHistory();
        // Update user wallet balance
        setUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            walletBalance: prev.walletBalance - parseInt(giftAmount)
          };
        });
      } else {
        alert(data.error || 'Failed to send gift');
      }
    } catch (error) {
      console.error('Gift error:', error);
      alert('Failed to send gift');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading video...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Video not found</p>
          <Button onClick={() => router.push('/feed')}>
            Back to Feed
          </Button>
        </div>
      </div>
    );
  }

  // Check if user can watch this video
  const canWatch = video.canWatch; // Use the canWatch flag from the API

  console.log('Video access check:', {
    videoType: video.videoType,
    price: video.price,
    isPurchased: video.isPurchased,
    isCreator: video.isCreator,
    canWatch
  });

  if (!canWatch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <h2 className="text-xl font-semibold mb-4">{video.title}</h2>
            <p className="text-gray-600 mb-6">
              {video.price === 0 ? (
                'This video is free to watch.'
              ) : (
                `This video costs ₹${video.price}. Please purchase it to watch.`
              )}
            </p>
            <div className="space-y-4">
              {video.price > 0 && (
                <Button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/purchase', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({
                          videoId: parseInt(videoId)
                        })
                      });
                      
                      const data = await response.json();
                      
                      if (response.ok) {
                        alert('Video purchased successfully!');
                        router.refresh(); // Refresh the page to show the video
                      } else {
                        alert(data.error || 'Failed to purchase video');
                      }
                    } catch (error) {
                      console.error('Purchase error:', error);
                      alert('Failed to purchase video');
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Purchase Video (₹{video.price})
                </Button>
              )}
              <Button 
                onClick={() => router.push('/feed')}
                variant="outline"
                className="w-full"
              >
                Back to Feed
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show video player for both creators and purchasers
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              onClick={() => router.push('/feed')}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Feed
            </Button>
            {user && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">{user.username}</span>
                <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  ₹{user.walletBalance}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden aspect-video">
              {video.videoType === 'short' && video.filePath ? (
                <video
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                >
                  <source src={video.filePath} type="video/mp4" />
                </video>
              ) : video.videoType === 'long' && video.videoUrl ? (
                <iframe
                  className="w-full h-full"
                  src={getEmbedUrl(video.videoUrl)}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <p>Video not available</p>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="mt-6">
              <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600">
                    by {video.user.username} • {formatDate(video.createdAt)}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{comments.length}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Gift className="w-4 h-4" />
                      <span className="text-sm">{giftCount}</span>
                    </div>
                  </div>
                </div>
                
                {/* Gift Creator - Only show if not the creator */}
                {!video.isCreator && (
                  <div className="flex items-center space-x-2">
                    <Select value={giftAmount} onValueChange={setGiftAmount}>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="₹" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">₹10</SelectItem>
                        <SelectItem value="50">₹50</SelectItem>
                        <SelectItem value="100">₹100</SelectItem>
                        <SelectItem value="500">₹500</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleGift}
                      disabled={!giftAmount}
                      className="bg-pink-600 hover:bg-pink-700"
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      Gift
                    </Button>
                  </div>
                )}
              </div>
              
              <p className="text-gray-700">{video.description}</p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <Tabs defaultValue="comments" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="comments" className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Comments ({comments.length})
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center">
                      <History className="w-4 h-4 mr-2" />
                      History
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="comments">
                    <CardContent>
                      {/* Add Comment */}
                      <form onSubmit={handleAddComment} className="mb-6">
                        <div className="flex space-x-2">
                          <Input
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1"
                          />
                          <Button type="submit" size="sm">
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </form>

                      {/* Comments List */}
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {comments.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">
                            No comments yet. Be the first to comment!
                          </p>
                        ) : (
                          comments.map((comment) => (
                            <div key={comment.id} className="border-b pb-3">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-sm">
                                  {comment.user.username}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.content}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="history">
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        <div className="space-y-4">
                          {/* Gift History */}
                          <div>
                            <h3 className="font-semibold mb-2 flex items-center">
                              <Gift className="w-4 h-4 mr-2" />
                              Gift History
                            </h3>
                            {giftHistory.length === 0 ? (
                              <p className="text-gray-500 text-center py-4">
                                No gifts yet. Be the first to gift!
                              </p>
                            ) : (
                              giftHistory.map((gift) => (
                                <div key={gift.id} className="border-b pb-3">
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-sm">
                                      {gift.fromUser.username}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {formatDate(gift.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-green-600">
                                    Gifted ₹{gift.amount} to {gift.toUser.username}
                                  </p>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Comment History */}
                          <div>
                            <h3 className="font-semibold mb-2 flex items-center">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Comment History
                            </h3>
                            {comments.length === 0 ? (
                              <p className="text-gray-500 text-center py-4">
                                No comments yet. Be the first to comment!
                              </p>
                            ) : (
                              comments.map((comment) => (
                                <div key={comment.id} className="border-b pb-3">
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-sm">
                                      {comment.user.username}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {formatDate(comment.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">{comment.content}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </TabsContent>
                </Tabs>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}