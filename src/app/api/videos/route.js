import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { verifyAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    // Verify authentication
    const user = await verifyAuth(request);
    console.log('User from verifyAuth:', user);
    console.log('Authorization header:', request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const videoType = formData.get('videoType');
    const videoFile = formData.get('videoFile');
    const videoUrl = formData.get('videoUrl');
    const price = formData.get('price');

    // Validation
    if (!title || !description || !videoType) {
      return NextResponse.json(
        { error: 'Title, description, and video type are required' },
        { status: 400 }
      );
    }

    let filePath = null;
    let finalVideoUrl = null;

    if (videoType === 'short') {
      // Handle short-form video file upload
      if (!videoFile || videoFile.size === 0) {
        return NextResponse.json(
          { error: 'Video file is required for short-form videos' },
          { status: 400 }
        );
      }

      // Check file size (10MB limit)
      if (videoFile.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Video file must be less than 10MB' },
          { status: 400 }
        );
      }

      // Check file type
      if (!videoFile.type.includes('video')) {
        return NextResponse.json(
          { error: 'Only video files are allowed' },
          { status: 400 }
        );
      }

      // Save file
      const bytes = await videoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileName = `${Date.now()}-${videoFile.name}`;
      const uploadPath = path.join(process.cwd(), 'public/uploads', fileName);
      
      await writeFile(uploadPath, buffer);
      filePath = `/uploads/${fileName}`;

    } else if (videoType === 'long') {
      // Handle long-form video URL
      if (!videoUrl) {
        return NextResponse.json(
          { error: 'Video URL is required for long-form videos' },
          { status: 400 }
        );
      }
      finalVideoUrl = videoUrl;
    }

    // Create video record
    const video = await prisma.video.create({
      data: {
        title,
        description,
        videoType,
        filePath,
        videoUrl: finalVideoUrl,
        price: videoType === 'long' ? parseInt(price) || 0 : null,
        userId: user.id
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    return NextResponse.json(
      { 
        message: 'Video uploaded successfully',
        video 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Video upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}