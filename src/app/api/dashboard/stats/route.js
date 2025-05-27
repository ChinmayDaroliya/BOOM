/**
 * Dashboard Stats API Route
 * Fetches user's content and earnings statistics
 * GET /api/dashboard/stats
 * 
 * Response:
 * {
 *   stats: {
 *     totalVideos: number,
 *     totalViews: number,
 *     totalGifts: number,
 *     totalEarnings: number
 *   }
 * }
 */

import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    // Verify user authentication
    const user = await verifyAuth(request)
    console.log('Full user object:', user)

    if (!user) {
      console.log('No user found - unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's uploaded videos
    const videos = await prisma.video.findMany({
      where: { userId: user.id }
    })
    console.log('All videos for user:', videos)

    const totalVideos = videos.length
    console.log('Total Videos:', totalVideos)

    // Fetch purchases of user's videos (used for view count)
    const purchases = await prisma.purchase.findMany({
      where: {
        video: {
          userId: user.id
        }
      },
      include: {
        video: true
      }
    })
    console.log('All purchases for user:', purchases)

    const totalViews = purchases.length
    console.log('Total Views:', totalViews)

    // Fetch gifts received by the user
    const gifts = await prisma.gift.findMany({
      where: { toUserId: user.id },
      include: {
        video: true
      }
    })
    console.log('All gifts for user:', gifts)

    const totalGifts = gifts.length
    console.log('Total Gifts:', totalGifts)

    // Calculate earnings from gifts
    const giftEarnings = await prisma.gift.aggregate({
      where: { toUserId: user.id },
      _sum: { amount: true }
    })
    console.log('Gift Earnings:', giftEarnings)

    // Calculate earnings from video purchases
    const purchaseEarnings = purchases.reduce((total, purchase) => {
      return total + (purchase.video.price || 0)
    }, 0)

    // Calculate total earnings from both gifts and purchases
    const totalEarnings = (giftEarnings._sum.amount || 0) + purchaseEarnings
    console.log('Total Earnings:', totalEarnings)

    // Compile all statistics
    const stats = {
      totalVideos,
      totalViews: totalViews + (totalVideos * 5), // Add simulated views for engagement
      totalGifts,
      totalEarnings
    }

    console.log('Final stats object:', stats)

    return NextResponse.json({ stats })
  } catch (error) {
    // Log error and return generic message
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}