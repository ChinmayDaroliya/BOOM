'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

export default function VideoPlayer({ video, className = "" }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef(null)

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const updateProgress = () => {
      if (videoElement.duration) {
        const progress = (videoElement.currentTime / videoElement.duration) * 100
        setProgress(progress)
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration)
    }

    videoElement.addEventListener('timeupdate', updateProgress)
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      videoElement.removeEventListener('timeupdate', updateProgress)
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleProgressClick = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const newTime = (clickX / rect.width) * duration
      videoRef.current.currentTime = newTime
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (video.videoType === 'long' && video.videoUrl) {
    // For long-form videos with external URLs
    return (
      <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
        <iframe
          src={video.videoUrl}
          className="w-full aspect-video"
          allowFullScreen
          title={video.title}
        />
      </div>
    )
  }

  // For short-form videos
  return (
    <div className={`relative bg-black rounded-lg overflow-hidden group ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted={isMuted}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
      >
        <source src={video.filePath} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Controls overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-4 left-4 right-4">
          {/* Progress bar */}
          <div 
            className="w-full h-1 bg-white/30 rounded cursor-pointer mb-3"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-white rounded transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>

            <div className="text-white text-sm">
              {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      </div>

      {/* Play button overlay for when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="lg"
            variant="ghost"
            onClick={togglePlay}
            className="text-white bg-black/50 hover:bg-black/70 rounded-full p-4"
          >
            <Play className="h-8 w-8" />
          </Button>
        </div>
      )}
    </div>
  )
}