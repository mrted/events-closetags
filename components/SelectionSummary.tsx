/**
 * SelectionSummary Component
 * Phase 3: Selective Souvenir Distribution
 * 
 * Displays selection count and clear button
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SelectionSummaryProps {
  selectedCount: number;
  totalCount?: number;
  onClear: () => void;
}

export function SelectionSummary({
  selectedCount,
  totalCount,
  onClear
}: SelectionSummaryProps) {
  if (selectedCount === 0) return null;

  const displayText = totalCount 
    ? `${selectedCount} of ${totalCount} ${selectedCount === 1 ? 'guest' : 'guests'} selected`
    : `${selectedCount} ${selectedCount === 1 ? 'guest' : 'guests'} selected`;

  return (
    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <Badge variant="secondary" className="text-sm font-medium">
        {displayText}
      </Badge>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
        className="h-6 px-2 text-xs"
      >
        <X className="h-3 w-3 mr-1" />
        Clear
      </Button>
    </div>
  );
}
