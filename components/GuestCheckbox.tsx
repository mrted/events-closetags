/**
 * GuestCheckbox Component
 * Phase 3: Selective Souvenir Distribution
 * 
 * Checkbox wrapper for individual guest selection
 */

'use client';

import { Checkbox } from '@/components/ui/checkbox';

interface GuestCheckboxProps {
  guestId: number;
  guestName: string;
  isSelected: boolean;
  onToggle: (guestId: number) => void;
  disabled?: boolean;
}

export function GuestCheckbox({
  guestId,
  guestName,
  isSelected,
  onToggle,
  disabled = false
}: GuestCheckboxProps) {
  return (
    <Checkbox
      id={`guest-${guestId}`}
      checked={isSelected}
      onCheckedChange={() => onToggle(guestId)}
      disabled={disabled}
      aria-label={`Select ${guestName}`}
    />
  );
}
