'use client'

import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Coins, Wallet, TrendingUp, TrendingDown } from 'lucide-react'

export default function WalletBalance({ balance, className = "" }) {
  const [currentBalance, setCurrentBalance] = useState(balance)
  const [lastTransaction, setLastTransaction] = useState(null)

  useEffect(() => {
    setCurrentBalance(balance)
  }, [balance])

  // Export the updateBalance function
  WalletBalance.updateBalance = (amount) => {
    setCurrentBalance(prev => prev + amount)
    setLastTransaction(amount)
    
    // Clear the transaction indicator after 3 seconds
    setTimeout(() => {
      setLastTransaction(null)
    }, 3000)
  }

  return (
    <Card className={`p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Wallet Balance</p>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-800">
                ₹{currentBalance.toLocaleString()}
              </span>
              {lastTransaction && (
                <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${
                  lastTransaction > 0 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {lastTransaction > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>
                    {lastTransaction > 0 ? '+' : ''}₹{Math.abs(lastTransaction)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <Coins className="h-8 w-8 text-yellow-500" />
      </div>
      
      {currentBalance < 100 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-700">
            ⚠️ Low balance. Consider adding funds to purchase premium content and send gifts.
          </p>
        </div>
      )}
    </Card>
  )
}