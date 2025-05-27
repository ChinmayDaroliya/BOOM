'use client'

export function VideoCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
      {/* Video thumbnail skeleton */}
      <div className="aspect-video bg-gray-300"></div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-5 bg-gray-300 rounded"></div>
        
        {/* Creator and metadata skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
        
        {/* Action button skeleton */}
        <div className="h-10 bg-gray-300 rounded"></div>
      </div>
    </div>
  )
}

export function FeedSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function PlayerSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Video player skeleton */}
      <div className="aspect-video bg-gray-300 rounded-lg"></div>
      
      {/* Video info skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-gray-300 rounded"></div>
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-32"></div>
            <div className="h-3 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
        <div className="h-16 bg-gray-300 rounded"></div>
      </div>
      
      {/* Comments skeleton */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-300 rounded w-32"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-3 bg-gray-300 rounded"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function WalletSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 border animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gray-300 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded w-20"></div>
            <div className="h-6 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded"></div>
      </div>
    </div>
  )
}