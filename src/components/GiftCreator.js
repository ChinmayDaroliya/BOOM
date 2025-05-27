'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Gift, Heart, Coins } from 'lucide-react'

export default function GiftCreator({ video, currentUser, onGiftSent }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const giftOptions = [
    { value: '10', label: '₹10', icon: '🎁' },
    { value: '25', label: '₹25', icon: '💝' },
    { value: '50', label: '₹50', icon: '🌟' },
    { value: '100', label: '₹100', icon: '💎' },
    { value: '250', label: '₹250', icon: '👑' },
    { value: '500', label: '₹500', icon: '🏆' }
  ]

  const handleSendGift = async () => {
    if (!selectedAmount) return

    setLoading(true)
    try {
      const response = await fetch('/api/gift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: video.id,
          amount: parseInt(selectedAmount),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsOpen(false)
        setSelectedAmount('')
        
        // Show success message
        alert(`🎉 Successfully gifted ₹${selectedAmount} to ${video.user.username}!`)
        
        // Callback to parent to update user balance
        if (onGiftSent) {
          onGiftSent(parseInt(selectedAmount))
        }
      } else {
        alert(data.error || 'Failed to send gift')
      }
    } catch (error) {
      console.error('Failed to send gift:', error)
      alert('Failed to send gift')
    } finally {
      setLoading(false)
    }
  }

  // Don't show gift button for own videos
  if (currentUser?.id === video.userId) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
          <Gift className="h-4 w-4" />
          <span>Gift Creator</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Gift className="h-5 w-5 text-purple-500" />
            <span>Gift {video.user.username}</span>
          </DialogTitle>
          <DialogDescription>
            Show your appreciation by sending a gift to the creator
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Creator info */}
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                {video.user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-semibold">{video.user.username}</h4>
                <p className="text-sm text-gray-600">Creator of &quot;{video.title}&quot;</p>
              </div>
            </div>
          </Card>

          {/* Gift amount selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Choose gift amount:</label>
            <div className="grid grid-cols-2 gap-3">
              {giftOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedAmount === option.value ? "default" : "outline"}
                  className={`h-12 flex items-center justify-center space-x-2 ${
                    selectedAmount === option.value 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'hover:bg-purple-50'
                  }`}
                  onClick={() => setSelectedAmount(option.value)}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Current balance */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-600">Your balance:</span>
            </div>
            <span className="font-semibold">₹{currentUser?.walletBalance || 0}</span>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendGift}
              disabled={!selectedAmount || loading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>Send Gift</span>
                </div>
              )}
            </Button>
          </div>

          {selectedAmount && (
            <div className="text-center text-sm text-gray-500">
              {parseInt(selectedAmount) > (currentUser?.walletBalance || 0) && (
                <p className="text-red-500">⚠️ Insufficient balance</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}