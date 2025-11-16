'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { EventMediaUpload } from '@/components/EventMediaUpload';
import { apiClient } from '@/lib/api';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';

/**
 * T029: Event Media Upload Page
 * 
 * Dedicated page for uploading and managing event banners/flyers.
 */

interface Event {
  id: number;
  name: string;
  banner?: string | null;
  banner_url?: string | null;
  banner_uploaded_at?: string | null;
}

export default function EventMediaPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEventDetails = useCallback(async () => {
    try {
      const response = await apiClient.request(`/events/${eventId}/`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      } else if (response.status === 404) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, router]);

  useEffect(() => {
    if (!apiClient.isAuthenticated()) {
      router.push('/login');
      return;
    }

    fetchEventDetails();
  }, [eventId, router, fetchEventDetails]);

  const handleUploadSuccess = () => {
    fetchEventDetails();
  };

  const handleDeleteSuccess = () => {
    fetchEventDetails();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B8DFD8] via-[#C8E6E0] to-[#D8EDE8] p-8">
      {/* Decorative Elements */}
      <div className="fixed top-20 right-20 w-72 h-72 bg-teal-300/30 rounded-full blur-3xl" />
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto relative">
        {/* Back Button */}
        <Link 
          href={`/events/${eventId}`}
          className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-900 transition-colors mb-6 group"
        >
          <div className="p-2 rounded-xl bg-white/80 backdrop-blur-sm group-hover:bg-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </div>
          <span className="font-medium">Back to Event</span>
        </Link>

        {/* Page Header */}
        <div className="bg-white/90 backdrop-blur-md rounded-[40px] shadow-2xl shadow-teal-900/10 p-10 mb-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#4FD1C5] to-[#38B2AC] shadow-lg shadow-teal-500/30">
              <ImageIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Event Media</h1>
              <p className="text-gray-600 text-lg mt-1">{event.name}</p>
            </div>
          </div>
        </div>

        {/* Upload Component */}
        <div className="bg-white/90 backdrop-blur-md rounded-[40px] shadow-2xl shadow-teal-900/10 p-10">
          <EventMediaUpload
            eventId={eventId}
            currentBannerUrl={event.banner_url || event.banner}
            onUploadSuccess={handleUploadSuccess}
            onDeleteSuccess={handleDeleteSuccess}
          />

          {/* Upload Info */}
          {event.banner_uploaded_at && (
            <div className="mt-6 p-4 rounded-xl bg-teal-50 border border-teal-200">
              <p className="text-sm text-teal-800">
                <strong>Last updated:</strong>{' '}
                {new Date(event.banner_uploaded_at).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
