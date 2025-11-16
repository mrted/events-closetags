/**
 * SouvenirConfirmModal Component
 * Phase 3: Selective Souvenir Distribution
 * 
 * Preview and confirmation modal for souvenir distribution
 */

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface Guest {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface SouvenirConfirmModalProps {
  open: boolean;
  onClose: () => void;
  selectedGuests: Guest[];
  onConfirm: (forceResend?: boolean) => Promise<void>;
}

export function SouvenirConfirmModal({
  open,
  onClose,
  selectedGuests,
  onConfirm
}: SouvenirConfirmModalProps) {
  const [isDistributing, setIsDistributing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleConfirm = async (forceResend = false) => {
    setIsDistributing(true);
    setResult(null);
    
    try {
      await onConfirm(forceResend);
      setResult({
        success: true,
        message: selectedGuests.length === 0
          ? 'Successfully sent invitations to all guests (invitation QR only)'
          : `Successfully sent invitations to all guests. Souvenir QR codes sent to ${selectedGuests.length} selected ${selectedGuests.length === 1 ? 'guest' : 'guests'}`
      });
      
      setIsDistributing(false);
      
      // Auto-close after 2 seconds on success
      setTimeout(() => {
        onClose();
        setResult(null);
      }, 2000);
    } catch (error) {
      const errorObj = error as any;
      
      // Check if it's the already_sent warning
      if (errorObj?.isWarning && errorObj?.type === 'already_sent') {
        setIsDistributing(false);
        const alreadySentCount = errorObj.details?.count ?? 0;
        const proceed = window.confirm(
          alreadySentCount > 0
            ? `${alreadySentCount} ${alreadySentCount === 1 ? 'guest has' : 'guests have'} already received invitations. Send again anyway?`
            : 'Some guests have already received invitations. Send again anyway?'
        );
        
        if (proceed) {
          return handleConfirm(true);
        }
        
        setResult({
          success: false,
          message: 'Distribution cancelled. Guests already received invitations.'
        });
        return;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Distribution failed';
      setResult({
        success: false,
        message: errorMessage
      });
      setIsDistributing(false);
    }
    setIsDistributing(false);
  };

  const handleClose = () => {
    if (!isDistributing) {
      onClose();
      setResult(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-purple-500" />
            {selectedGuests.length === 0 
              ? 'Send Invitations to All Guests' 
              : 'Send Invitations with Selective Souvenirs'}
          </DialogTitle>
          <DialogDescription>
            {selectedGuests.length === 0
              ? 'All guests will receive invitation QR codes only (no souvenir QR codes).'
              : 'All guests will receive invitation QR codes. Only selected guests will also receive souvenir QR codes.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {result ? (
            <div className={`flex items-center gap-3 p-4 rounded-lg ${
              result.success 
                ? 'bg-green-50 text-green-900 border border-green-200' 
                : 'bg-red-50 text-red-900 border border-red-200'
            }`}>
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <p className="text-sm font-medium">{result.message}</p>
            </div>
          ) : (
            <>
              {selectedGuests.length === 0 ? (
                <div className="py-6 px-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900 mb-2">
                    <strong>No guests selected for souvenir distribution.</strong>
                  </p>
                  <p className="text-sm text-blue-800">
                    All guests will receive <strong>invitation QR codes only</strong> via their registered email and WhatsApp (if available).
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <Badge variant="secondary" className="text-sm">
                      {selectedGuests.length} {selectedGuests.length === 1 ? 'guest' : 'guests'} selected for souvenir QR
                    </Badge>
                  </div>
                  
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Note:</strong> All guests will receive invitation QR codes. Only the selected guests below will receive souvenir QR codes.
                    </p>
                  </div>

                  <div className="max-h-60 overflow-y-auto border rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="text-left p-2 font-medium text-gray-600">Name</th>
                          <th className="text-left p-2 font-medium text-gray-600">Contact</th>
                          <th className="text-left p-2 font-medium text-gray-600">Will Receive</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedGuests.map((guest, idx) => (
                          <tr key={guest.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="p-2">{guest.name}</td>
                            <td className="p-2 text-xs text-gray-600">
                              {guest.email || guest.phone || 'No contact'}
                            </td>
                            <td className="p-2 text-xs">
                              <span className="text-green-600 font-medium">Invitation + Souvenir</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          {!result && (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isDistributing}
              >
                Cancel
              </Button>
                <Button
                  onClick={() => handleConfirm(false)}
                disabled={isDistributing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isDistributing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Gift className="mr-2 h-4 w-4" />
                    Confirm & Send
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
