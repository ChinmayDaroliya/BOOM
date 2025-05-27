import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's recent videos
    const videos = await prisma.video.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        _count: {
          select: {
            comments: true,
            purchases: true,
            gifts: true
          }
        }
      }
    })

    return NextResponse.json({ videos })
  } catch (error) {
    console.error('Dashboard videos error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard videos' },
      { status: 500 }
    )
  }
}