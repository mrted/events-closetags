'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { Calendar, Users, LogOut, Plus, QrCode, Gift, TrendingUp, UserCheck, MapPin } from 'lucide-react';

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  venue: string;
  guest_count: number;
  checked_in_count: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'events' | 'guests' | 'reports'>('events');
  const [activeView, setActiveView] = useState<'overview' | 'reports'>('overview');

  useEffect(() => {
    if (!apiClient.isAuthenticated()) {
      router.push('/login');
      return;
    }

    fetchEvents();
  }, [router]);

  const fetchEvents = async () => {
    try {
      const response = await apiClient.request('/events/');
      if (response.ok) {
        const data = await response.json();
        console.log('Events API response:', data);
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];
        console.log('Processed events:', items);
        setEvents(items);
      } else {
        console.error('Events API failed:', response.status, await response.text());
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await apiClient.logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B8DFD8] via-[#C8E6E0] to-[#D8EDE8]">
      {/* Main Container with white rounded card */}
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="bg-white/90 backdrop-blur-md rounded-[40px] shadow-2xl shadow-teal-900/10 p-8 min-h-[calc(100vh-4rem)]">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              
              {/* Navigation */}
              <nav className="flex items-center gap-8">
                <button 
                  onClick={() => setActiveView('overview')}
                  className={`font-semibold text-base pb-2 border-b-2 transition-colors ${
                    activeView === 'overview' 
                      ? 'text-[#2D3748] border-[#2D3748]' 
                      : 'text-[#A0AEC0] border-transparent hover:text-[#2D3748]'
                  }`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveView('reports')}
                  className={`font-semibold text-base pb-2 border-b-2 transition-colors ${
                    activeView === 'reports' 
                      ? 'text-[#2D3748] border-[#2D3748]' 
                      : 'text-[#A0AEC0] border-transparent hover:text-[#2D3748]'
                  }`}
                >
                  Reports
                </button>
              </nav>
            </div>

            {/* Right Side - Profile & Logout */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="text-[#718096] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-2xl px-4"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-semibold">
                AD
              </div>
            </div>
          </div>

          {/* Main Dashboard Title */}
          {activeView === 'overview' && (
          <div>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-[#2D3748]">Main Dashboard</h1>
                <Link href="/events/new">
                  <Button className="bg-[#4FD1C5] hover:bg-[#38B2AC] text-white rounded-2xl px-6 font-medium shadow-lg shadow-teal-500/30">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Event
                  </Button>
                </Link>
              </div>

              {/* Tab-like navigation */}
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setActiveTab('events')}
                  className={`font-semibold text-sm pb-2 border-b-2 transition-colors ${
                    activeTab === 'events' 
                      ? 'text-[#4FD1C5] border-[#4FD1C5]' 
                      : 'text-[#A0AEC0] border-transparent hover:text-[#2D3748]'
                  }`}
                >
                  Events
                </button>
                <button 
                  onClick={() => setActiveTab('guests')}
                  className={`font-semibold text-sm pb-2 border-b-2 transition-colors ${
                    activeTab === 'guests' 
                      ? 'text-[#4FD1C5] border-[#4FD1C5]' 
                      : 'text-[#A0AEC0] border-transparent hover:text-[#2D3748]'
                  }`}
                >
                  Guests
                </button>
                <button 
                  onClick={() => setActiveTab('reports')}
                  className={`font-semibold text-sm pb-2 border-b-2 transition-colors ${
                    activeTab === 'reports' 
                      ? 'text-[#4FD1C5] border-[#4FD1C5]' 
                      : 'text-[#A0AEC0] border-transparent hover:text-[#2D3748]'
                  }`}
                >
                  Reports
                </button>
              </div>
            </div>

          {/* Stats Cards Row */}
          <div className="grid gap-6 md:grid-cols-5 mb-8">
            {/* Today's Events */}
            <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-50">
              <p className="text-sm text-[#A0AEC0] mb-2">Today&apos;s Events</p>
              <p className="text-4xl font-bold text-[#2D3748] mb-4">
                {events.filter(event => {
                  const eventDate = new Date(event.date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  eventDate.setHours(0, 0, 0, 0);
                  return eventDate.getTime() === today.getTime();
                }).length}
              </p>
              <div className="flex items-center text-xs text-[#48BB78]">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>Live</span>
              </div>
            </div>

            {/* Past Events */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-6 shadow-lg shadow-gray-300/30">
              <p className="text-sm text-gray-600 mb-2">Past Events</p>
              <p className="text-4xl font-bold text-gray-800">
                {events.filter(event => {
                  const eventDate = new Date(event.date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  eventDate.setHours(0, 0, 0, 0);
                  return eventDate < today;
                }).length}
              </p>
              <div className="flex items-center text-xs text-gray-600 mt-2">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Completed</span>
              </div>
            </div>

            {/* Demographics Card (Yellow) */}
            <div className="bg-gradient-to-br from-[#FFD93D] to-[#F6B93B] rounded-3xl p-6 shadow-lg shadow-yellow-500/30">
              <p className="text-sm text-gray-700 mb-2">Total Guests</p>
              <p className="text-5xl font-bold text-gray-900">
                {events.reduce((sum, event) => sum + event.guest_count, 0)}
              </p>
            </div>

            {/* Promotional Card (Teal) */}
            <div className="bg-gradient-to-br from-[#2D7A89] to-[#1E5A68] rounded-3xl p-6 shadow-lg shadow-teal-900/30 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-2xl font-bold text-white mb-1">Check-ins</p>
                <p className="text-xs text-teal-100 mb-3">Real-time tracking</p>
                <p className="text-3xl font-bold text-white">
                  {events.reduce((sum, event) => sum + event.checked_in_count, 0)}
                </p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="absolute -right-8 top-0 w-24 h-24 bg-white/5 rounded-full"></div>
            </div>

            {/* Total Events Card */}
            <div className="bg-gradient-to-br from-[#1E5A68] to-[#0D3D47] rounded-3xl p-6 shadow-lg shadow-teal-900/40 flex flex-col justify-between">
              <div>
                <p className="text-sm text-teal-100 mb-1">Total</p>
                <p className="text-base font-semibold text-white mb-3">Events</p>
              </div>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-900">
                  {events.length}
                </div>
              </div>
            </div>
          </div>

          {/* Active Events Section */}
          {activeTab === 'events' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#2D3748]">Active Events</h2>
                <button className="text-[#4FD1C5] font-medium text-sm hover:text-[#38B2AC] transition-colors">
                  Check All →
                </button>
              </div>

            {events.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 rounded-full bg-[#F7FAFC] mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="h-10 w-10 text-[#CBD5E0]" />
                </div>
                <p className="text-xl font-semibold text-[#2D3748] mb-2">No events yet</p>
                <p className="text-[#A0AEC0] mb-6">Create your first event to get started</p>
                <Link href="/events/new">
                  <Button className="bg-[#4FD1C5] hover:bg-[#38B2AC] text-white rounded-2xl px-8 font-medium">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Event
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {events.map((event, index) => {
                  // Determine event status
                  const eventDate = new Date(event.date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  eventDate.setHours(0, 0, 0, 0);
                  
                  const isToday = eventDate.getTime() === today.getTime();
                  const isPast = eventDate < today;
                  const isFuture = eventDate > today;
                  
                  return (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <div className="group relative bg-white rounded-3xl p-6 shadow-xl shadow-gray-300/50 hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-300 border-2 border-gray-100 hover:border-teal-300 overflow-hidden">
                      {/* Decorative gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 via-purple-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Decorative corner accent */}
                      <div className={`absolute top-0 right-0 w-24 h-24 ${
                        index % 3 === 0 ? 'bg-teal-200/30' : 
                        index % 3 === 1 ? 'bg-purple-200/30' : 'bg-blue-200/30'
                      } rounded-bl-full transition-all duration-300 group-hover:w-32 group-hover:h-32`} />
                      
                      {/* Content */}
                      <div className="relative z-10">
                        {/* Event Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#2D3748] mb-2 group-hover:text-[#4FD1C5] transition-colors">
                              {event.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-[#718096]">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {event.time}
                              </span>
                            </div>
                          </div>
                          <div className={`w-3 h-3 rounded-full shadow-lg ${
                            index % 3 === 0 ? 'bg-teal-400 shadow-teal-400/50' : 
                            index % 3 === 1 ? 'bg-purple-400 shadow-purple-400/50' : 
                            'bg-blue-400 shadow-blue-400/50'
                          } animate-pulse`}></div>
                        </div>

                        {/* Tags - Conditional based on event date */}
                        <div className="flex items-center gap-2 mb-4">
                          {isToday && (
                            <span className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-600 rounded-full text-xs font-semibold border border-orange-200 shadow-sm">
                              🔴 Live
                            </span>
                          )}
                          {isFuture && (
                            <span className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-600 rounded-full text-xs font-semibold border border-purple-200 shadow-sm">
                              📅 Upcoming
                            </span>
                          )}
                          {isPast && (
                            <span className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 rounded-full text-xs font-semibold border border-gray-200 shadow-sm">
                              ✓ Completed
                            </span>
                          )}
                        </div>

                        {/* Venue */}
                        <div className="flex items-start gap-2 mb-5 p-3 bg-gray-50 rounded-xl">
                          <MapPin className="h-4 w-4 text-[#4FD1C5] flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-[#2D3748] font-medium">{event.venue}</p>
                        </div>

                        {/* Attendees & Actions */}
                        <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100 group-hover:border-teal-100 transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-3">
                              {[...Array(Math.min(3, event.guest_count))].map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`w-10 h-10 rounded-full border-3 border-white shadow-lg ${
                                    i === 0 ? 'bg-gradient-to-br from-pink-400 to-pink-600' :
                                    i === 1 ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                                    'bg-gradient-to-br from-purple-400 to-purple-600'
                                  }`}
                                ></div>
                              ))}
                              {event.guest_count > 3 && (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-3 border-white shadow-lg flex items-center justify-center">
                                  <span className="text-xs font-bold text-gray-700">+{event.guest_count - 3}</span>
                                </div>
                              )}
                            </div>
                            <span className="text-xs font-semibold text-[#718096] ml-2">
                              {event.guest_count} {event.guest_count === 1 ? 'Guest' : 'Guests'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 flex items-center justify-center transition-all shadow-md hover:shadow-lg border border-gray-200">
                              <QrCode className="h-5 w-5 text-[#718096]" />
                            </button>
                            <button className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#4FD1C5] to-[#38B2AC] hover:from-[#38B2AC] hover:to-[#2C9A8F] flex items-center justify-center transition-all shadow-lg hover:shadow-xl">
                              <UserCheck className="h-5 w-5 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  );
                })}
              </div>
            )}
          </div>
          )}

          {/* Guests Tab Content */}
          {activeTab === 'guests' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#2D3748]">All Guests</h2>
                <p className="text-[#A0AEC0] text-sm">
                  {events.reduce((sum, event) => sum + event.guest_count, 0)} total guests across all events
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-200/50">
                <div className="space-y-4">
                  {events.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 text-[#CBD5E0] mx-auto mb-4" />
                      <p className="text-xl font-semibold text-[#2D3748] mb-2">No guests yet</p>
                      <p className="text-[#A0AEC0]">Create events and add guests to see them here</p>
                    </div>
                  ) : (
                    events.map((event) => (
                      <Link key={event.id} href={`/events/${event.id}`}>
                        <div className="group p-6 rounded-2xl bg-[#F7FAFC] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-[#4FD1C5]/20">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-[#2D3748] mb-1 group-hover:text-[#4FD1C5] transition-colors">
                                {event.name}
                              </h3>
                              <p className="text-sm text-[#A0AEC0]">
                                {new Date(event.date).toLocaleDateString()} · {event.venue}
                              </p>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-center">
                                <p className="text-2xl font-bold text-[#2D3748]">{event.guest_count}</p>
                                <p className="text-xs text-[#A0AEC0]">Total Guests</p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold text-[#4FD1C5]">{event.checked_in_count}</p>
                                <p className="text-xs text-[#A0AEC0]">Checked In</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab Content */}
          {activeTab === 'reports' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#2D3748]">Reports & Analytics</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 mb-6">
                {/* Attendance Overview */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-3xl p-8 border border-blue-200/50">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#2D3748]">Attendance Rate</h3>
                      <p className="text-sm text-[#718096]">Overall check-in statistics</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-4xl font-bold text-blue-600 mb-2">
                      {events.reduce((sum, event) => sum + event.guest_count, 0) > 0
                        ? Math.round((events.reduce((sum, event) => sum + event.checked_in_count, 0) / 
                            events.reduce((sum, event) => sum + event.guest_count, 0)) * 100)
                        : 0}%
                    </p>
                    <p className="text-sm text-[#718096]">
                      {events.reduce((sum, event) => sum + event.checked_in_count, 0)} of{' '}
                      {events.reduce((sum, event) => sum + event.guest_count, 0)} guests
                    </p>
                  </div>
                </div>

                {/* Event Performance */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-3xl p-8 border border-purple-200/50">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#2D3748]">Total Events</h3>
                      <p className="text-sm text-[#718096]">All time events</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-4xl font-bold text-purple-600 mb-2">{events.length}</p>
                    <p className="text-sm text-[#718096]">Active events in system</p>
                  </div>
                </div>
              </div>

              {/* Event-wise Reports */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-200/50">
                <h3 className="text-xl font-bold text-[#2D3748] mb-6">Event Performance</h3>
                <div className="space-y-4">
                  {events.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-[#CBD5E0] mx-auto mb-4" />
                      <p className="text-xl font-semibold text-[#2D3748] mb-2">No reports available</p>
                      <p className="text-[#A0AEC0]">Create events to see performance analytics</p>
                    </div>
                  ) : (
                    events.map((event) => (
                      <Link key={event.id} href={`/events/${event.id}/reports`}>
                        <div className="group p-6 rounded-2xl bg-[#F7FAFC] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-[#4FD1C5]/20">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="font-bold text-[#2D3748] mb-1 group-hover:text-[#4FD1C5] transition-colors">
                                {event.name}
                              </h4>
                              <p className="text-sm text-[#A0AEC0]">
                                {new Date(event.date).toLocaleDateString()}
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="rounded-xl"
                            >
                              View Report →
                            </Button>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-[#718096]">Check-in Progress</span>
                              <span className="font-semibold text-[#2D3748]">
                                {event.guest_count > 0 
                                  ? Math.round((event.checked_in_count / event.guest_count) * 100) 
                                  : 0}%
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#4FD1C5] to-[#38B2AC] rounded-full transition-all"
                                style={{ 
                                  width: `${event.guest_count > 0 
                                    ? (event.checked_in_count / event.guest_count) * 100 
                                    : 0}%` 
                                }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-[#A0AEC0]">
                              <span>{event.checked_in_count} checked in</span>
                              <span>{event.guest_count} total guests</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          </div>
          )}

          {/* Reports View */}
          {activeView === 'reports' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-[#2D3748] mb-2">Analytics & Reports</h1>
                  <p className="text-[#A0AEC0]">Comprehensive insights across all events</p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-6 md:grid-cols-4 mb-8">
                {/* Total Events */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 shadow-lg shadow-purple-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm text-purple-100 font-medium">Total Events</p>
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">{events.length}</p>
                  <p className="text-xs text-purple-100">All time</p>
                </div>

                {/* Total Guests */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 shadow-lg shadow-blue-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm text-blue-100 font-medium">Total Guests</p>
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">
                    {events.reduce((sum, event) => sum + event.guest_count, 0)}
                  </p>
                  <p className="text-xs text-blue-100">Across all events</p>
                </div>

                {/* Total Check-ins */}
                <div className="bg-gradient-to-br from-[#4FD1C5] to-[#38B2AC] rounded-3xl p-6 shadow-lg shadow-teal-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <UserCheck className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm text-teal-100 font-medium">Total Check-ins</p>
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">
                    {events.reduce((sum, event) => sum + event.checked_in_count, 0)}
                  </p>
                  <p className="text-xs text-teal-100">Guests attended</p>
                </div>

                {/* Attendance Rate */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 shadow-lg shadow-orange-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm text-orange-100 font-medium">Attendance Rate</p>
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">
                    {events.reduce((sum, event) => sum + event.guest_count, 0) > 0
                      ? Math.round((events.reduce((sum, event) => sum + event.checked_in_count, 0) / 
                          events.reduce((sum, event) => sum + event.guest_count, 0)) * 100)
                      : 0}%
                  </p>
                  <p className="text-xs text-orange-100">Overall performance</p>
                </div>
              </div>

              {/* Event-wise Performance */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg shadow-gray-200/50 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#2D3748]">Event Performance</h2>
                  <p className="text-sm text-[#A0AEC0]">Detailed analytics by event</p>
                </div>

                {events.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-[#F7FAFC] mx-auto mb-4 flex items-center justify-center">
                      <Calendar className="h-10 w-10 text-[#CBD5E0]" />
                    </div>
                    <p className="text-xl font-semibold text-[#2D3748] mb-2">No events yet</p>
                    <p className="text-[#A0AEC0] mb-6">Create your first event to see analytics</p>
                    <Link href="/events/new">
                      <Button className="bg-[#4FD1C5] hover:bg-[#38B2AC] text-white rounded-2xl px-8 font-medium">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Event
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {events.map((event, index) => {
                      const attendanceRate = event.guest_count > 0 
                        ? Math.round((event.checked_in_count / event.guest_count) * 100) 
                        : 0;
                      
                      return (
                        <div key={event.id} className="group p-6 rounded-2xl bg-[#F7FAFC] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-[#4FD1C5]/20">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-[#2D3748] group-hover:text-[#4FD1C5] transition-colors">
                                  {event.name}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  attendanceRate >= 75 
                                    ? 'bg-green-100 text-green-700' 
                                    : attendanceRate >= 50 
                                    ? 'bg-yellow-100 text-yellow-700' 
                                    : 'bg-orange-100 text-orange-700'
                                }`}>
                                  {attendanceRate >= 75 ? 'High' : attendanceRate >= 50 ? 'Medium' : 'Low'} Attendance
                                </span>
                              </div>
                              <p className="text-sm text-[#A0AEC0]">
                                {new Date(event.date).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })} · {event.time} · {event.venue}
                              </p>
                            </div>
                            <Link href={`/events/${event.id}/reports`}>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="rounded-xl hover:bg-[#4FD1C5] hover:text-white hover:border-[#4FD1C5]"
                              >
                                Full Report →
                              </Button>
                            </Link>
                          </div>

                          {/* Stats Row */}
                          <div className="grid grid-cols-3 gap-6 mb-4">
                            <div className="text-center p-4 rounded-xl bg-white/80">
                              <p className="text-sm text-[#A0AEC0] mb-1">Total Guests</p>
                              <p className="text-3xl font-bold text-[#2D3748]">{event.guest_count}</p>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-white/80">
                              <p className="text-sm text-[#A0AEC0] mb-1">Checked In</p>
                              <p className="text-3xl font-bold text-[#4FD1C5]">{event.checked_in_count}</p>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-white/80">
                              <p className="text-sm text-[#A0AEC0] mb-1">Pending</p>
                              <p className="text-3xl font-bold text-[#F6AD55]">
                                {event.guest_count - event.checked_in_count}
                              </p>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-[#718096] font-medium">Check-in Progress</span>
                              <span className="font-bold text-[#2D3748]">{attendanceRate}%</span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all ${
                                  attendanceRate >= 75 
                                    ? 'bg-gradient-to-r from-green-400 to-green-500' 
                                    : attendanceRate >= 50 
                                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                                    : 'bg-gradient-to-r from-orange-400 to-orange-500'
                                }`}
                                style={{ width: `${attendanceRate}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-3xl p-8 border border-teal-200/50">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#2D3748]">Need Insights?</h3>
                      <p className="text-sm text-[#718096]">View detailed event reports</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#718096] mb-4">
                    Click on any event above to access comprehensive analytics including guest lists, 
                    check-in timelines, and souvenir distribution stats.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-3xl p-8 border border-purple-200/50">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500 flex items-center justify-center">
                      <Gift className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#2D3748]">Export Data</h3>
                      <p className="text-sm text-[#718096]">Download reports as CSV</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#718096] mb-4">
                    Visit individual event reports to export attendance data, guest information, 
                    and souvenir collection records.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
