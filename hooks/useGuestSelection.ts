/**
 * useGuestSelection Hook
 * Phase 3: Selective Souvenir Distribution
 * 
 * Manages guest selection state with session storage persistence.
 * Provides functions for:
 * - Individual guest selection/deselection
 * - Select all on page
 * - Select all filtered guests
 * - Clear all selections
 */

'use client';

import { useState, useEffect } from 'react';

export interface UseGuestSelectionOptions {
  eventId: string;
  guests: Array<{ id: number }>;
  filteredGuests?: Array<{ id: number }>;
}

export interface UseGuestSelectionReturn {
  selectedGuests: Set<number>;
  toggleGuest: (guestId: number) => void;
  selectAllOnPage: () => void;
  selectAllFiltered: () => void;
  clearSelection: () => void;
  isSelected: (guestId: number) => boolean;
  selectedCount: number;
}

export function useGuestSelection({
  eventId,
  guests,
  filteredGuests
}: UseGuestSelectionOptions): UseGuestSelectionReturn {
  const storageKey = `selected-guests-event-${eventId}`;
  
  // Initialize state from session storage
  const [selectedGuests, setSelectedGuests] = useState<Set<number>>(() => {
    if (typeof window === 'undefined') return new Set();
    
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const ids = JSON.parse(stored);
        return new Set(ids);
      }
    } catch (error) {
      console.error('Failed to load selection from session storage:', error);
    }
    return new Set();
  });

  // Persist to session storage on changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify(Array.from(selectedGuests))
      );
    } catch (error) {
      console.error('Failed to save selection to session storage:', error);
    }
  }, [selectedGuests, storageKey]);

  // Toggle individual guest selection
  const toggleGuest = (guestId: number) => {
    setSelectedGuests(prev => {
      const newSet = new Set(prev);
      if (newSet.has(guestId)) {
        newSet.delete(guestId);
      } else {
        newSet.add(guestId);
      }
      return newSet;
    });
  };

  // Select all guests on current page
  const selectAllOnPage = () => {
    setSelectedGuests(prev => {
      const newSet = new Set(prev);
      guests.forEach(guest => newSet.add(guest.id));
      return newSet;
    });
  };

  // Select all filtered guests
  const selectAllFiltered = () => {
    const guestsToSelect = filteredGuests || guests;
    
    // For large selections, could add confirmation here
    if (guestsToSelect.length > 500) {
      const confirmed = window.confirm(
        `Select all ${guestsToSelect.length} guests? This may take a moment.`
      );
      if (!confirmed) return;
    }
    
    setSelectedGuests(prev => {
      const newSet = new Set(prev);
      guestsToSelect.forEach(guest => newSet.add(guest.id));
      return newSet;
    });
  };

  // Clear all selections
  const clearSelection = () => {
    setSelectedGuests(new Set());
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(storageKey);
    }
  };

  // Check if guest is selected
  const isSelected = (guestId: number): boolean => {
    return selectedGuests.has(guestId);
  };

  return {
    selectedGuests,
    toggleGuest,
    selectAllOnPage,
    selectAllFiltered,
    clearSelection,
    isSelected,
    selectedCount: selectedGuests.size
  };
}
