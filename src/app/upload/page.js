'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function UploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [videoType, setVideoType] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoFile: null,
    videoUrl: '',
    price: ''
  });

  const MAX_DESCRIPTION_LENGTH = 1000;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'description' && value.length > MAX_DESCRIPTION_LENGTH) {
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      videoFile: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('videoType', videoType);

      if (videoType === 'short') {
        if (!formData.videoFile) {
          alert('Please select a video file');
          return;
        }
        submitData.append('videoFile', formData.videoFile);
      } else if (videoType === 'long') {
        if (!formData.videoUrl) {
          alert('Please enter a video URL');
          return;
        }
        submitData.append('videoUrl', formData.videoUrl);
        submitData.append('price', formData.price || '0');
      }

      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: submitData
      });

      const data = await response.json();

      if (response.ok) {
        alert('Video uploaded successfully!');
        router.push('/feed');
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Upload Video</CardTitle>
            <CardDescription>
              Share your content with the Boom community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter video title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your video"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoType">Video Type *</Label>
                <Select value={videoType} onValueChange={setVideoType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select video type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short-Form</SelectItem>
                    <SelectItem value="long">Long-Form</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {videoType === 'short' && (
                <div className="space-y-2">
                  <Label htmlFor="videoFile">Video File *</Label>
                  <Input
                    id="videoFile"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Max file size: 10MB. Supported formats: MP4
                  </p>
                </div>
              )}

              {videoType === 'long' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">Video URL *</Label>
                    <Input
                      id="videoUrl"
                      name="videoUrl"
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={formData.videoUrl}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      placeholder="0 (Free)"
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-gray-500">
                      Set to 0 for free content
                    </p>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload Video'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}