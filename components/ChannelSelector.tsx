'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageCircle } from 'lucide-react';

export type DeliveryChannel = 'email' | 'whatsapp' | 'both';

interface ChannelStats {
  emailEligible: number;
  whatsappEligible: number;
  bothEligible: number;
}

interface ChannelSelectorProps {
  stats: ChannelStats;
  selectedChannel: DeliveryChannel;
  onChannelChange: (channel: DeliveryChannel) => void;
  disabled?: boolean;
}

export default function ChannelSelector({
  stats,
  selectedChannel,
  onChannelChange,
  disabled = false
}: ChannelSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Distribution Channels</CardTitle>
        <CardDescription>
          Choose how to send invitations to your guests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email Only Option */}
        <div
          className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
            selectedChannel === 'email'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !disabled && onChannelChange('email')}
        >
          <input
            type="radio"
            id="channel-email"
            name="channel"
            value="email"
            checked={selectedChannel === 'email'}
            onChange={(e) => onChannelChange(e.target.value as DeliveryChannel)}
            disabled={disabled}
            className="mt-1"
          />
          <div className="flex-1">
            <Label htmlFor="channel-email" className="flex items-center gap-2 font-semibold cursor-pointer">
              <Mail className="h-5 w-5 text-blue-600" />
              Email Only
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              Send unified invitations via email
            </p>
            <p className="text-sm font-medium text-blue-600 mt-2">
              {stats.emailEligible} guests eligible (have email addresses)
            </p>
          </div>
        </div>

        {/* WhatsApp Only Option */}
        <div
          className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
            selectedChannel === 'whatsapp'
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 hover:border-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !disabled && onChannelChange('whatsapp')}
        >
          <input
            type="radio"
            id="channel-whatsapp"
            name="channel"
            value="whatsapp"
            checked={selectedChannel === 'whatsapp'}
            onChange={(e) => onChannelChange(e.target.value as DeliveryChannel)}
            disabled={disabled}
            className="mt-1"
          />
          <div className="flex-1">
            <Label htmlFor="channel-whatsapp" className="flex items-center gap-2 font-semibold cursor-pointer">
              <MessageCircle className="h-5 w-5 text-green-600" />
              WhatsApp Only
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              Send unified invitations via WhatsApp
            </p>
            <p className="text-sm font-medium text-green-600 mt-2">
              {stats.whatsappEligible} guests eligible (have phone numbers)
            </p>
          </div>
        </div>

        {/* Both Channels Option */}
        <div
          className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
            selectedChannel === 'both'
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 hover:border-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !disabled && onChannelChange('both')}
        >
          <input
            type="radio"
            id="channel-both"
            name="channel"
            value="both"
            checked={selectedChannel === 'both'}
            onChange={(e) => onChannelChange(e.target.value as DeliveryChannel)}
            disabled={disabled}
            className="mt-1"
          />
          <div className="flex-1">
            <Label htmlFor="channel-both" className="flex items-center gap-2 font-semibold cursor-pointer">
              <div className="flex gap-1">
                <Mail className="h-5 w-5 text-blue-600" />
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              Both Channels
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              Send via both Email and WhatsApp (where available)
            </p>
            <p className="text-sm font-medium text-purple-600 mt-2">
              {stats.bothEligible} guests eligible (have at least one contact method)
            </p>
            {stats.bothEligible > Math.max(stats.emailEligible, stats.whatsappEligible) && (
              <p className="text-xs text-gray-500 mt-1">
                Some guests will receive via only one channel based on available contact info
              </p>
            )}
          </div>
        </div>

        {/* Warnings for guests that will be skipped */}
        {selectedChannel === 'email' && stats.emailEligible < (stats.emailEligible + stats.whatsappEligible) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ {(stats.whatsappEligible - stats.bothEligible) || 0} guests without email addresses will be skipped
            </p>
          </div>
        )}

        {selectedChannel === 'whatsapp' && stats.whatsappEligible < (stats.emailEligible + stats.whatsappEligible) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ {(stats.emailEligible - stats.bothEligible) || 0} guests without phone numbers will be skipped
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
