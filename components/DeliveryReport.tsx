'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, MessageCircle, CheckCircle, XCircle, Clock, Download } from 'lucide-react';
import api from '@/lib/api';

interface DeliveryStatus {
  channel: 'email' | 'whatsapp';
  status: 'sent' | 'failed' | 'pending';
  attemptedAt?: string;
  errorMessage?: string;
}

interface GuestDeliveryStatus {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  emailStatus?: DeliveryStatus;
  whatsappStatus?: DeliveryStatus;
}

interface DeliveryReportProps {
  eventId: number;
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds
}

export default function DeliveryReport({
  eventId,
  autoRefresh = false,
  refreshInterval = 10000
}: DeliveryReportProps) {
  const [guests, setGuests] = useState<GuestDeliveryStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'sent' | 'failed' | 'pending'>('all');
  const [filterChannel, setFilterChannel] = useState<'all' | 'email' | 'whatsapp'>('all');

  const fetchDeliveryReport = useCallback(async () => {
    try {
      const data = await api.getDeliveryReport(eventId);
      setGuests((data.guests || []) as GuestDeliveryStatus[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch delivery report');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchDeliveryReport();

    if (autoRefresh) {
      const interval = setInterval(fetchDeliveryReport, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [eventId, autoRefresh, refreshInterval, fetchDeliveryReport]);

  const getStatusBadge = (status?: DeliveryStatus) => {
    if (!status) {
      return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
    }

    switch (status.status) {
      case 'sent':
        return <Badge variant="default" className="gap-1 bg-green-600"><CheckCircle className="h-3 w-3" /> Sent</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Failed</Badge>;
      default:
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
    }
  };

  const exportToCsv = () => {
    const headers = ['Guest Name', 'Email', 'Phone', 'Email Status', 'Email Error', 'WhatsApp Status', 'WhatsApp Error'];
    const rows = filteredGuests.map(guest => [
      guest.name,
      guest.email || 'N/A',
      guest.phone || 'N/A',
      guest.emailStatus?.status || 'pending',
      guest.emailStatus?.errorMessage || '',
      guest.whatsappStatus?.status || 'pending',
      guest.whatsappStatus?.errorMessage || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delivery-report-event-${eventId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredGuests = guests.filter(guest => {
    // Filter by status
    if (filterStatus !== 'all') {
      const emailMatch = guest.emailStatus?.status === filterStatus;
      const whatsappMatch = guest.whatsappStatus?.status === filterStatus;
      if (!emailMatch && !whatsappMatch) return false;
    }

    // Filter by channel
    if (filterChannel === 'email' && !guest.emailStatus) return false;
    if (filterChannel === 'whatsapp' && !guest.whatsappStatus) return false;

    return true;
  });

  const stats = {
    total: guests.length,
    emailSent: guests.filter(g => g.emailStatus?.status === 'sent').length,
    emailFailed: guests.filter(g => g.emailStatus?.status === 'failed').length,
    whatsappSent: guests.filter(g => g.whatsappStatus?.status === 'sent').length,
    whatsappFailed: guests.filter(g => g.whatsappStatus?.status === 'failed').length,
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Loading delivery report...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-red-500">{error}</p>
          <Button onClick={fetchDeliveryReport} className="mt-4 mx-auto block">Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Delivery Report</CardTitle>
            <CardDescription>Track invitation delivery status across all channels</CardDescription>
          </div>
          <Button onClick={exportToCsv} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Statistics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Email Sent</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.emailSent}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Email Failed</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.emailFailed}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">WhatsApp Sent</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.whatsappSent}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">WhatsApp Failed</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.whatsappFailed}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mr-2">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'sent' | 'failed' | 'pending')}
              className="border rounded px-3 py-1"
            >
              <option value="all">All</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mr-2">Channel:</label>
            <select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value as 'all' | 'email' | 'whatsapp')}
              className="border rounded px-3 py-1"
            >
              <option value="all">All</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
          <Button onClick={fetchDeliveryReport} variant="outline" size="sm" className="ml-auto">
            Refresh
          </Button>
        </div>

        {/* Delivery Status Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                    No guests match the selected filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredGuests.map(guest => (
                  <TableRow key={guest.id}>
                    <TableCell className="font-medium">{guest.name}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {guest.email && <div>{guest.email}</div>}
                      {guest.phone && <div>{guest.phone}</div>}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        {getStatusBadge(guest.emailStatus)}
                        {guest.emailStatus?.errorMessage && (
                          <p className="text-xs text-red-600 mt-1">{guest.emailStatus.errorMessage}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        {getStatusBadge(guest.whatsappStatus)}
                        {guest.whatsappStatus?.errorMessage && (
                          <p className="text-xs text-red-600 mt-1">{guest.whatsappStatus.errorMessage}</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
