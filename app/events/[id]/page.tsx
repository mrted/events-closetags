'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { ArrowLeft, Upload, UserPlus, Gift, Camera, BarChart, Calendar, MapPin, Users, UserCheck, QrCode, Mail, Image as ImageIcon, MessageCircle } from 'lucide-react';
import { GuestCheckbox } from '@/components/GuestCheckbox';
import { SelectionSummary } from '@/components/SelectionSummary';
import { SouvenirConfirmModal } from '@/components/SouvenirConfirmModal';
import { BulkActions } from '@/components/BulkActions';
import { useGuestSelection } from '@/hooks/useGuestSelection';

interface Guest {
  id: number;
  name: string;
  email: string;
  phone: string;
  checked_in: boolean;
  souvenir_collected: boolean;
  invitation_qr_token: string;
  souvenir_qr_token: string;
  souvenir_sent?: boolean;
  souvenir_sent_at?: string | null;
}

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  guest_count: number;
  checked_in_count: number;
  banner?: string | null;
  banner_url?: string | null;
}

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Phase 3: Selective Souvenir Distribution state
  const [showSouvenirModal, setShowSouvenirModal] = useState(false);
  const guestSelection = useGuestSelection({
    eventId,
    guests,
    filteredGuests: guests // TODO: Update when filters are added
  });

  const fetchEventDetails = useCallback(async () => {
    try {
      const response = await apiClient.request(`/events/${eventId}/`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  const fetchGuests = useCallback(async () => {
    try {
      const response = await apiClient.request(`/events/${eventId}/guests/`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched guests data:', data);
        const items = Array.isArray(data)
          ? data
          : (data.guests || data.results || []);
        setGuests(items);
      }
    } catch (error) {
      console.error('Failed to fetch guests:', error);
    }
  }, [eventId]);

  useEffect(() => {
    if (!apiClient.isAuthenticated()) {
      router.push('/login');
      return;
    }

    fetchEventDetails();
    fetchGuests();
  }, [eventId, router, fetchEventDetails, fetchGuests]);

  // Add refresh when component mounts or becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchGuests();
        fetchEventDetails();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchEventDetails, fetchGuests]);

  // Phase 3: Selective Souvenir Distribution handler
  const handleSelectiveSouvenirDistribution = async (forceResend = false) => {
    const selectedGuestIds = Array.from(guestSelection.selectedGuests);
    
    try {
      await apiClient.selectiveDistribution(eventId, selectedGuestIds, forceResend);
      
      // Refresh guest list to show updated souvenir_sent status
      await fetchGuests();
      
      // Clear selection after successful distribution
      guestSelection.clearSelection();
      
      // Close modal
      setShowSouvenirModal(false);
    } catch (error) {
      // console.error('Selective distribution failed:', error);
      throw error; // Re-throw so modal can show error
    }
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

      <div className="max-w-7xl mx-auto relative">
        {/* Back Button */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-900 transition-colors mb-6 group"
        >
          <div className="p-2 rounded-xl bg-white/80 backdrop-blur-sm group-hover:bg-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </div>
          <span className="font-medium">Back to Dashboard</span>
        </Link>

        {/* Event Header Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-[40px] shadow-2xl shadow-teal-900/10 p-10 mb-6">
          {/* T031: Banner Preview with Decorative Elements */}
          {(event.banner_url || event.banner) && (
            <div className="mb-8 relative">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-100/80 via-purple-100/60 to-blue-100/80 rounded-3xl" />
              
              {/* Decorative circles */}
              <div className="absolute top-10 left-10 w-40 h-40 bg-teal-300/40 rounded-full blur-2xl" />
              <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-300/40 rounded-full blur-2xl" />
              <div className="absolute top-1/2 right-20 w-32 h-32 bg-blue-300/40 rounded-full blur-xl" />
              <div className="absolute bottom-1/3 left-20 w-36 h-36 bg-pink-300/30 rounded-full blur-2xl" />
              
              {/* Floating decorative elements */}
              <div className="absolute top-8 right-1/4 w-4 h-4 bg-teal-500/60 rounded-full animate-pulse" />
              <div className="absolute bottom-12 left-1/4 w-3 h-3 bg-purple-500/60 rounded-full animate-pulse delay-75" />
              <div className="absolute top-1/3 left-16 w-3.5 h-3.5 bg-blue-500/60 rounded-full animate-pulse delay-150" />
              <div className="absolute top-20 right-16 w-2.5 h-2.5 bg-pink-500/60 rounded-full animate-pulse delay-300" />
              <div className="absolute bottom-20 left-1/3 w-3 h-3 bg-teal-500/50 rounded-full animate-pulse delay-500" />
              
              {/* Banner image container */}
              <div className="relative z-10 flex justify-center items-center py-8">
                <div className="rounded-2xl overflow-hidden border-4 border-white shadow-2xl shadow-teal-900/30 bg-white w-fit">
                  <img
                    src={(event.banner_url || event.banner) as string}
                    alt={`${event.name} banner`}
                    className="h-80 w-auto object-contain"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#4FD1C5] to-[#38B2AC] shadow-lg shadow-teal-500/30">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800">{event.name}</h1>
                  <div className="flex items-center gap-4 mt-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <span>•</span>
                    <span>{event.time}</span>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {event.description && (
                <p className="text-gray-600 text-lg leading-relaxed pl-20">{event.description}</p>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-600">Total Guests</p>
              </div>
              <p className="text-3xl font-bold text-gray-800">{event.guest_count}</p>
            </div>

            <div className="bg-gradient-to-br from-[#4FD1C5]/20 to-[#38B2AC]/20 rounded-2xl p-6 border border-teal-200/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#4FD1C5] flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-600">Checked In</p>
              </div>
              <p className="text-3xl font-bold text-[#4FD1C5]">{event.checked_in_count}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 border border-orange-200/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
              </div>
              <p className="text-3xl font-bold text-orange-600">{event.guest_count - event.checked_in_count}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 border border-purple-200/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                  <BarChart className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-600">Attendance</p>
              </div>
              <p className="text-3xl font-bold text-purple-600">
                {event.guest_count > 0 ? Math.round((event.checked_in_count / event.guest_count) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-6">
          <Link href={`/events/${eventId}/media`}>
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-orange-500/20 transition-all border border-white/50 hover:border-orange-200 cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                  <ImageIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Media</h3>
                  <p className="text-sm text-gray-600">Upload banner</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">Upload event banner or flyer for invitations</p>
            </div>
          </Link>

          <Link href={`/events/${eventId}/check-in`}>
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-teal-500/20 transition-all border border-white/50 hover:border-teal-200 cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform">
                  <Camera className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Check-In</h3>
                  <p className="text-sm text-gray-600">Scan invitations</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">Open the QR scanner to check in guests arriving at your event</p>
            </div>
          </Link>

          <Link href={`/events/${eventId}/souvenirs`}>
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all border border-white/50 hover:border-purple-200 cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                  <Gift className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Souvenirs</h3>
                  <p className="text-sm text-gray-600">Manage distribution</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">View stats and distribute souvenir QR codes to guests</p>
            </div>
          </Link>

          <Link href={`/events/${eventId}/reports`}>
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-blue-500/20 transition-all border border-white/50 hover:border-blue-200 cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <BarChart className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Reports</h3>
                  <p className="text-sm text-gray-600">Analytics & insights</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">View detailed statistics and export attendance data</p>
            </div>
          </Link>
        </div>

        {/* Guest List Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-[40px] shadow-2xl shadow-teal-900/10 p-10">
          {/* Phase 3: Selection Summary */}
          <SelectionSummary
            selectedCount={guestSelection.selectedCount}
            totalCount={guests.length}
            onClear={guestSelection.clearSelection}
          />
          
          {/* Phase 4: Bulk Actions */}
          {guests.length > 0 && (
            <div className="mt-3">
              <BulkActions
                currentPageCount={guests.length}
                filteredCount={guests.length}
                selectedCount={guestSelection.selectedCount}
                onSelectAllOnPage={guestSelection.selectAllOnPage}
                onSelectAllFiltered={guestSelection.selectAllFiltered}
                onClearSelection={guestSelection.clearSelection}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between mb-8 mt-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Guest List</h2>
                <p className="text-gray-600">{guests.length} {guests.length === 1 ? 'guest' : 'guests'} registered</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              {/* Send Unified Invitation to Selected Button */}
              <Button 
                onClick={() => setShowSouvenirModal(true)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl px-6 font-medium shadow-lg shadow-purple-500/30"
                title={guestSelection.selectedCount === 0 
                  ? "Send invitations to ALL guests (no souvenir QR codes)" 
                  : "Send invitations to ALL guests, but include souvenir QR codes only for selected guests"}
              >
                <Mail className="mr-2 h-4 w-4" />
                <MessageCircle className="mr-2 h-4 w-4" />
                {guestSelection.selectedCount === 0 
                  ? 'Send Invitations to All' 
                  : `Send with Souvenir to Selected (${guestSelection.selectedCount})`}
              </Button>

              <Link href={`/events/${eventId}/guests/upload`}>
                <Button className="bg-[#4FD1C5] hover:bg-[#38B2AC] text-white rounded-2xl px-6 font-medium shadow-lg shadow-teal-500/30">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV
                </Button>
              </Link>
              <Link href={`/events/${eventId}/guests/new`}>
                <Button 
                  variant="outline"
                  className="rounded-2xl border-2 border-gray-200 hover:border-[#4FD1C5] hover:bg-teal-50 transition-all px-6"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Guest
                </Button>
              </Link>
            </div>
          </div>

          {guests.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-[#F7FAFC] mx-auto mb-4 flex items-center justify-center">
                <Users className="h-10 w-10 text-[#CBD5E0]" />
              </div>
              <p className="text-xl font-semibold text-[#2D3748] mb-2">No guests yet</p>
              <p className="text-[#A0AEC0] mb-6">Add guests individually or upload a CSV file to get started</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-100">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F7FAFC] hover:bg-[#F7FAFC]">
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="font-semibold text-gray-700">Name</TableHead>
                    <TableHead className="font-semibold text-gray-700">Email</TableHead>
                    <TableHead className="font-semibold text-gray-700">Phone</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">QR Codes</TableHead>
                    <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guests.map((guest) => (
                    <TableRow key={guest.id} className="hover:bg-teal-50/50 transition-colors">
                      <TableCell>
                        <GuestCheckbox
                          guestId={guest.id}
                          guestName={guest.name}
                          isSelected={guestSelection.isSelected(guest.id)}
                          onToggle={guestSelection.toggleGuest}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-gray-800">{guest.name}</TableCell>
                      <TableCell className="text-gray-600">
                        {guest.email ? (
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-gray-400" />
                            {guest.email}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600">{guest.phone || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          {guest.checked_in && (
                            <Badge className="bg-[#4FD1C5] hover:bg-[#38B2AC] text-white rounded-xl px-3">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Checked In
                            </Badge>
                          )}
                          {guest.souvenir_collected && (
                            <Badge className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl px-3">
                              <Gift className="h-3 w-3 mr-1" />
                              Collected
                            </Badge>
                          )}
                          {guest.souvenir_sent && (
                            <Badge className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-3">
                              <Mail className="h-3 w-3 mr-1" />
                              Sent
                            </Badge>
                          )}
                          {!guest.checked_in && !guest.souvenir_collected && !guest.souvenir_sent && (
                            <Badge variant="outline" className="text-gray-600 rounded-xl">
                              Pending
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            asChild
                            className="rounded-xl hover:bg-teal-50 hover:border-[#4FD1C5]"
                          >
                            <a href={`/api/qr/invitation/${guest.invitation_qr_token}`} download>
                              <QrCode className="h-4 w-4 mr-1" />
                              Invite
                            </a>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            asChild
                            className="rounded-xl hover:bg-purple-50 hover:border-purple-400"
                          >
                            <a href={`/api/qr/souvenir/${guest.souvenir_qr_token}`} download>
                              <QrCode className="h-4 w-4 mr-1" />
                              Gift
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
      
      {/* Phase 3: Souvenir Confirmation Modal */}
      <SouvenirConfirmModal
        open={showSouvenirModal}
        onClose={() => setShowSouvenirModal(false)}
        selectedGuests={guests.filter(g => guestSelection.isSelected(g.id))}
        onConfirm={handleSelectiveSouvenirDistribution}
      />
    </div>
  );
}
