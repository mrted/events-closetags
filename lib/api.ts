// API client utilities for frontend-admin with JWT token refresh logic

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

if (process.env.NODE_ENV !== 'production') {
  console.log('Frontend Admin API_BASE_URL:', API_BASE_URL);
}

interface AuthTokens {
  access: string;
  refresh: string;
}

class APIClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
      this.refreshToken = localStorage.getItem('refresh_token');
    }
  }

  setTokens(tokens: AuthTokens) {
    this.accessToken = tokens.access;
    this.refreshToken = tokens.refresh;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
    }
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: this.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.accessToken = data.access;
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', data.access);
        }
        return true;
      }
      
      // Refresh token expired, clear all tokens
      this.clearTokens();
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      return false;
    }
  }

  async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Only add Content-Type if not FormData (FormData needs browser to set multipart boundary)
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    let response = await fetch(url, { ...options, headers });

    // If unauthorized and we have a refresh token, try refreshing
    if (response.status === 401 && this.refreshToken) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        // Retry request with new access token
        headers['Authorization'] = `Bearer ${this.accessToken}`;
        response = await fetch(url, { ...options, headers });
      }
    }

    return response;
  }

  async login(username: string, password: string) {
    const url = `${API_BASE_URL}/auth/login/`;
    console.log('Attempting login to:', url);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Login response status:', response.status);
      console.log('Login response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful, received tokens');
        this.setTokens({ access: data.access, refresh: data.refresh });
        return data;
      }

      const errorData = await response.text();
      console.log('Login failed with status:', response.status, 'Response:', errorData);
      
      if (response.status === 401) {
        throw new Error('Invalid username or password');
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(`Login failed: ${errorData}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Please check your network connection and ensure the server is running.');
      }
      throw error;
    }
  }

  async logout() {
    this.clearTokens();
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // T030: Event Media API Methods
  async uploadEventBanner(eventId: string, file: File): Promise<Response> {
    const formData = new FormData();
    formData.append('banner', file);
    
    return this.request(`/events/${eventId}/media/`, {
      method: 'POST',
      body: formData,
    });
  }

  async getEventMedia(eventId: string): Promise<Response> {
    return this.request(`/events/${eventId}/media/`);
  }

  async deleteEventBanner(eventId: string): Promise<Response> {
    return this.request(`/events/${eventId}/media/`, {
      method: 'DELETE',
    });
  }

  // T060: Unified Multi-Channel Distribution
  async distributeUnified(eventId: string, channels: string[], guestIds?: number[]): Promise<any> {
    const response = await this.request(`/events/${eventId}/guests/distribute/`, {
      method: 'POST',
      body: JSON.stringify({
        channels,
        guest_ids: guestIds || []
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Distribution failed');
    }
    
    return response.json();
  }

  // T067: Delivery Report API
  async getDeliveryReport(eventId: number): Promise<any> {
    const response = await this.request(`/events/${eventId}/delivery-report/`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch delivery report');
    }
    
    return response.json();
  }

  // Phase 3: Selective Souvenir Distribution
  async selectiveDistribution(
    eventId: string, 
    guestIds: number[], 
    forceResend: boolean = false
  ): Promise<any> {
    const payload = {
      guest_ids: guestIds,
      force_resend: forceResend
    };

    const response = await this.request(
      `/events/${eventId}/guests/distribute-souvenirs-selective/`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();

      let parsed: any = null;
      try {
        parsed = JSON.parse(errorText);
      } catch {
        parsed = null;
      }

      if (parsed?.warning === 'already_sent') {
        // Return a special object instead of throwing to avoid console errors
        return Promise.reject({ 
          isWarning: true,
          type: 'already_sent',
          details: parsed 
        });
      }

      const errorMessage = parsed?.error || parsed?.message || 'Selective distribution failed';
      const error: any = new Error(errorMessage);
      if (parsed) {
        error.details = parsed;
      }
      throw error;
    }
    
    return response.json();
  }
}

export const apiClient = new APIClient();
export default apiClient;
