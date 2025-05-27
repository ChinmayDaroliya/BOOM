import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    // Verify authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Fetch videos with pagination
    const videos = await prisma.video.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        },
        purchases: {
          where: {
            userId: user.userId
          },
          select: {
            id: true
          }
        },
        _count: {
          select: {
            comments: true,
            gifts: true
          }
        }
      }
    });

    // Add purchase status to each video
    const videosWithPurchaseStatus = videos.map(video => ({
      ...video,
      isPurchased: video.purchases.length > 0,
      purchases: undefined // Remove purchases array from response
    }));

    // Get total count for pagination
    const totalCount = await prisma.video.count();
    const hasMore = skip + videos.length < totalCount;

    return NextResponse.json({
      videos: videosWithPurchaseStatus,
      pagination: {
        page,
        limit,
        total: totalCount,
        hasMore
      }
    });

  } catch (error) {
    console.error('Feed fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}