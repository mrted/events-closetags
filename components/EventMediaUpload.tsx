'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

/**
 * T027-T028: EventMediaUpload Component
 * 
 * Handles event banner/flyer upload with:
 * - File picker with drag-and-drop
 * - Upload progress tracking
 * - Image preview
 * - Validation feedback
 */

interface EventMediaUploadProps {
  eventId: string;
  currentBannerUrl?: string | null;
  onUploadSuccess?: (bannerUrl: string) => void;
  onDeleteSuccess?: () => void;
}

export function EventMediaUpload({
  eventId,
  currentBannerUrl,
  onUploadSuccess,
  onDeleteSuccess,
}: EventMediaUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentBannerUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload JPEG, PNG, or WebP image.';
    }

    // Check file size
    if (file.size > MAX_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return `File size ${sizeMB}MB exceeds maximum 5MB`;
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('banner', selectedFile);

      // Simulate progress (real progress tracking would need XMLHttpRequest)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://fevent.pythonanywhere.com/api/v1'}/events/${eventId}/media/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: formData,
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.banner?.[0] || errorData.error || 'Upload failed');
      }

      const data = await response.json();
      
      // Success
      setSelectedFile(null);
      if (onUploadSuccess && data.banner_url) {
        onUploadSuccess(data.banner_url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete the banner?')) {
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://fevent.pythonanywhere.com/api/v1'}/events/${eventId}/media/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Delete failed');
      }

      setPreviewUrl(null);
      setSelectedFile(null);
      
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(currentBannerUrl || null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Event Banner</h3>
            <p className="text-sm text-gray-600">
              Upload a banner image (JPEG, PNG, or WebP, max 5MB)
            </p>
          </div>
        </div>

        {/* T028: Banner Preview */}
        {previewUrl ? (
          <div className="relative group">
            <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200">
              <img
                src={previewUrl}
                alt="Event banner preview"
                className="w-full h-64 object-cover"
              />
              {!selectedFile && currentBannerUrl && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    onClick={handleDelete}
                    disabled={isUploading}
                    variant="destructive"
                    className="rounded-xl"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Delete Banner
                  </Button>
                </div>
              )}
            </div>
            {selectedFile && (
              <div className="mt-4 flex gap-3">
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-[#4FD1C5] hover:bg-[#38B2AC] text-white rounded-xl flex-1"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Banner
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleClearSelection}
                  disabled={isUploading}
                  variant="outline"
                  className="rounded-xl"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* T027: File Picker with Drag & Drop */
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
              transition-all
              ${isDragging 
                ? 'border-[#4FD1C5] bg-teal-50' 
                : 'border-gray-300 hover:border-[#4FD1C5] hover:bg-teal-50/50'
              }
            `}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-[#4FD1C5]" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800 mb-1">
                  {isDragging ? 'Drop image here' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-gray-600">
                  JPEG, PNG or WebP (max 5MB)
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && uploadProgress > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Uploading...</span>
              <span className="text-[#4FD1C5] font-semibold">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* T032: Error Feedback */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Info Box */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Your banner will be automatically resized if larger than 2048x2048px
            and optimized for web delivery.
          </p>
        </div>
      </div>
    </Card>
  );
}
