import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const video = await prisma.video.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        purchases: {
          where: {
            userId: user.id
          }
        }
      }
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Check if the current user is the creator
    const isCreator = video.user.id === user.id;

    // Determine if user can watch the video
    // Creator can always watch their own video
    // For others, they can watch if it's free or they've purchased it
    const canWatch = isCreator || video.price === 0 || video.purchases.length > 0;

    const videoWithStatus = {
      ...video,
      isPurchased: video.purchases.length > 0,
      isCreator,
      canWatch
    };

    console.log('Video data being sent:', {
      videoId: video.id,
      videoUserId: video.user.id,
      currentUserId: user.id,
      isCreator,
      isPurchased: video.purchases.length > 0,
      canWatch,
      price: video.price
    });

    return NextResponse.json({ video: videoWithStatus });
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 