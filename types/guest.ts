/**
 * Guest type definitions for the Event Management System
 * Updated for Phase 3: Selective Souvenir Distribution
 */

export interface Guest {
  id: number;
  name: string;
  email: string;
  phone: string;
  checked_in: boolean;
  souvenir_collected: boolean;
  invitation_qr_token: string;
  souvenir_qr_token: string;
  
  // Phase 3: Selective Souvenir Distribution tracking
  souvenir_sent?: boolean;
  souvenir_sent_at?: string | null;
}

export interface Event {
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
