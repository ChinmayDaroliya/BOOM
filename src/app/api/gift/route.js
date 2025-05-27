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

    const { videoId, amount } = await request.json();

    // Validation
    if (!videoId || !amount) {
      return NextResponse.json(
        { error: 'Video ID and amount are required' },
        { status: 400 }
      );
    }

    const giftAmount = parseInt(amount);
    if (giftAmount <= 0) {
      return NextResponse.json(
        { error: 'Gift amount must be positive' },
        { status: 400 }
      );
    }

    // Get video and creator details
    const video = await prisma.video.findUnique({
      where: { id: parseInt(videoId) },
      include: {
        user: {
          select: {
            id: true,
            username: true
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

    // Check if user is trying to gift themselves
    if (video.userId === user.userId) {
      return NextResponse.json(
        { error: 'You cannot gift yourself' },
        { status: 400 }
      );
    }

    // Get current user's wallet balance
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { walletBalance: true }
    });

    if (currentUser.walletBalance < giftAmount) {
      return NextResponse.json(
        { error: 'Insufficient wallet balance' },
        { status: 400 }
      );
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Deduct amount from gifter's wallet
      await tx.user.update({
        where: { id: user.id },
        data: {
          walletBalance: {
            decrement: giftAmount
          }
        }
      });

      // Create gift record
      const gift = await tx.gift.create({
        data: {
          amount: giftAmount,
          fromUserId: user.id,
          toUserId: video.userId,
          videoId: parseInt(videoId)
        },
        include: {
          fromUser: {
            select: {
              id: true,
              username: true
            }
          },
          toUser: {
            select: {
              id: true,
              username: true
            }
          },
          video: {
            select: {
              id: true,
              title: true
            }
          }
        }
      });

      return gift;
    });

    return NextResponse.json(
      { 
        message: `Successfully gifted ₹${giftAmount} to ${video.user.username}`,
        gift: result
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Gift error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}