import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, MessageCircle, Gift } from 'lucide-react';

export default function VideoCard({ video, onPurchase, onWatch }) {
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef(null);
  const cardRef = useRef(null);

  // Intersection observer for auto-play
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-play short videos when visible
  useEffect(() => {
    if (videoRef.current && video.videoType === 'short') {
      if (isVisible) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVisible, video.videoType]);

  const handlePurchase = () => {
    onPurchase(video.id, video.price);
  };

  const handleWatch = () => {
    onWatch(video.id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const canWatch = video.videoType === 'short' || 
                   video.price === 0 || 
                   video.isPurchased;

  return (
    <Card ref={cardRef} className="overflow-hidden max-w-2xl mx-auto">
      <CardContent className="p-0">
        {/* Video Preview */}
        <div className="relative bg-black aspect-[16/9]">
          {video.videoType === 'short' && video.filePath ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              loop
              onClick={handleWatch}
              style={{ cursor: 'pointer' }}
            >
              <source src={video.filePath} type="video/mp4" />
            </video>
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center bg-gray-800 cursor-pointer"
              onClick={canWatch ? handleWatch : undefined}
            >
              {video.videoType === 'long' && video.videoUrl ? (
                <div className="text-center text-white">
                  <Play className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Long-form Video</p>
                </div>
              ) : (
                <div className="text-center text-white">
                  <div className="w-12 h-12 bg-gray-600 rounded mx-auto mb-2 flex items-center justify-center">
                    <Play className="w-6 h-6" />
                  </div>
                  <p className="text-sm">Video Thumbnail</p>
                </div>
              )}
            </div>
          )}

          {/* Play overlay for non-auto-playing videos */}
          {video.videoType === 'long' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full p-3">
                <Play className="w-8 h-8 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="p-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-base line-clamp-2 mb-1">
                {video.title}
              </h3>
              <p className="text-gray-600 text-xs mb-1">
                by {video.user.username} • {formatDate(video.createdAt)}
              </p>
              <p className="text-gray-700 text-xs line-clamp-2">
                {video.description}
              </p>
            </div>
            
            {video.videoType === 'long' && video.price > 0 && (
              <div className="ml-3 text-right">
                <span className="text-base font-bold text-green-600">
                  ₹{video.price}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-3 text-gray-500">
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span className="text-xs">{video._count.comments}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Gift className="w-3 h-3" />
                <span className="text-xs">{video._count.gifts}</span>
              </div>
              <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">
                {video.videoType === 'short' ? 'Short' : 'Long'}
              </span>
            </div>

            <div className="flex space-x-2">
              {video.videoType === 'long' && video.price > 0 && !video.isPurchased ? (
                <Button 
                  onClick={handlePurchase}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  Buy for ₹{video.price}
                </Button>
              ) : (
                <Button 
                  onClick={handleWatch}
                  variant="outline"
                  size="sm"
                >
                  {video.videoType === 'short' ? 'View' : 'Watch'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}