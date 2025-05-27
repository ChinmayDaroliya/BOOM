import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    // Verify authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { videoId } = await request.json();

    // Validation
    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Get video details
    const video = await prisma.video.findUnique({
      where: { id: parseInt(videoId) },
      include: {
        user: true
      }
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Check if video is free
    if (video.price === 0) {
      return NextResponse.json(
        { error: 'This video is free to watch' },
        { status: 400 }
      );
    }

    // Check if already purchased
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId: user.id,
        videoId: parseInt(videoId)
      }
    });

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'You have already purchased this video' },
        { status: 400 }
      );
    }

    // Check if user has enough balance
    if (user.walletBalance < video.price) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Create purchase record
    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        videoId: parseInt(videoId)
      }
    });

    // Update user's wallet balance
    await prisma.user.update({
      where: { id: user.id },
      data: {
        walletBalance: {
          decrement: video.price
        }
      }
    });

    // Update creator's wallet balance
    await prisma.user.update({
      where: { id: video.user.id },
      data: {
        walletBalance: {
          increment: video.price
        }
      }
    });

    return NextResponse.json({
      message: 'Video purchased successfully',
      purchase
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { error: 'Failed to purchase video' },
      { status: 500 }
    );
  }
}