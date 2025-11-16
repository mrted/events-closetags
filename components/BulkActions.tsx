/**
 * BulkActions Component
 * Phase 4: User Story 2 - Bulk Selection with Filters
 * 
 * Provides bulk selection actions:
 * - Select All on Page
 * - Select All Filtered
 * - Clear Selection
 */

'use client';

import { Button } from '@/components/ui/button';
import { CheckSquare, Square, X } from 'lucide-react';

interface BulkActionsProps {
  currentPageCount: number;
  filteredCount: number;
  selectedCount: number;
  onSelectAllOnPage: () => void;
  onSelectAllFiltered: () => void;
  onClearSelection: () => void;
}

export function BulkActions({
  currentPageCount,
  filteredCount,
  selectedCount,
  onSelectAllOnPage,
  onSelectAllFiltered,
  onClearSelection
}: BulkActionsProps) {
  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
      <span className="text-sm text-gray-600 font-medium mr-2">Bulk Actions:</span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onSelectAllOnPage}
        className="h-8 text-xs"
        disabled={currentPageCount === 0}
      >
        <CheckSquare className="h-3 w-3 mr-1" />
        Select All on Page ({currentPageCount})
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onSelectAllFiltered}
        className="h-8 text-xs"
        disabled={filteredCount === 0}
      >
        <CheckSquare className="h-3 w-3 mr-1" />
        Select All Filtered ({filteredCount})
      </Button>
      
      {selectedCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <X className="h-3 w-3 mr-1" />
          Clear All
        </Button>
      )}
    </div>
  );
}
