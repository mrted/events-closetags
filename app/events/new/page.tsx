'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api';
import { ArrowLeft, Calendar, MapPin, Save, Sparkles, FileText, Clock } from 'lucide-react';
import Link from 'next/link';

export default function NewEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    venue: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiClient.request('/events/', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const event = await response.json();
        router.push(`/events/${event.id}`);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to create event');
      }
    } catch {
      setError('An error occurred while creating the event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B8DFD8] via-[#C8E6E0] to-[#D8EDE8] p-8">
      {/* Decorative Elements */}
      <div className="fixed top-20 right-20 w-72 h-72 bg-teal-300/30 rounded-full blur-3xl" />
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-900 transition-colors mb-6 group"
          >
            <div className="p-2 rounded-xl bg-white/80 backdrop-blur-sm group-hover:bg-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#4FD1C5] to-[#38B2AC] shadow-lg shadow-teal-500/30">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Create New Event</h1>
              <p className="text-gray-600 mt-1">Design a memorable experience for your guests</p>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-[40px] shadow-2xl shadow-teal-900/10 p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Event Name */}
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-teal-50">
                  <Sparkles className="h-4 w-4 text-teal-600" />
                </div>
                Event Name
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter a memorable name"
                  required
                  disabled={isLoading}
                  className="h-14 rounded-2xl bg-[#F7FAFC] border-0 text-base px-5 focus:ring-2 focus:ring-teal-400 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-50">
                  <FileText className="h-4 w-4 text-purple-600" />
                </div>
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your event in detail..."
                disabled={isLoading}
                rows={5}
                className="rounded-2xl bg-[#F7FAFC] border-0 text-base px-5 py-4 focus:ring-2 focus:ring-purple-400 transition-all resize-none disabled:opacity-50"
              />
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div className="space-y-3">
                <Label htmlFor="date" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-50">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  Date
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="h-14 rounded-2xl bg-[#F7FAFC] border-0 text-base px-5 focus:ring-2 focus:ring-blue-400 transition-all disabled:opacity-50"
                />
              </div>

              {/* Time */}
              <div className="space-y-3">
                <Label htmlFor="time" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-50">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                  Time
                </Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="h-14 rounded-2xl bg-[#F7FAFC] border-0 text-base px-5 focus:ring-2 focus:ring-orange-400 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Venue */}
            <div className="space-y-3">
              <Label htmlFor="venue" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-pink-50">
                  <MapPin className="h-4 w-4 text-pink-600" />
                </div>
                Venue
              </Label>
              <Input
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Where will it take place?"
                required
                disabled={isLoading}
                className="h-14 rounded-2xl bg-[#F7FAFC] border-0 text-base px-5 focus:ring-2 focus:ring-pink-400 transition-all disabled:opacity-50"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-[#4FD1C5] to-[#38B2AC] hover:from-[#38B2AC] hover:to-[#319795] text-white font-semibold text-base shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Creating Event...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-5 w-5" />
                    <span>Create Event</span>
                  </div>
                )}
              </Button>
              
              <Link href="/dashboard" className="flex-shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  className="h-14 px-8 rounded-2xl border-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold transition-all disabled:opacity-50"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>

        {/* Helpful Tips Card */}
        <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/50">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Quick Tips</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Choose a clear, descriptive event name</li>
                <li>• Include all important details in the description</li>
                <li>• Double-check date and time for accuracy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
