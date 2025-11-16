'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api';
import { Calendar, Lock, User, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting login with:', { username, password: '***' });
      await apiClient.login(username, password);
      console.log('Login successful, redirecting to dashboard');
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#B8DFD8] via-[#C8E6E0] to-[#D8EDE8] p-4">
      {/* Decorative circles */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl"></div>
      
      <div className="relative w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:block space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-md rounded-3xl px-6 py-4 shadow-xl shadow-teal-900/10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#2D3748]">Event Management</h1>
                <p className="text-sm text-[#718096]">Professional Dashboard</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-[40px] p-8 shadow-2xl shadow-teal-900/10">
            <h2 className="text-3xl font-bold text-[#2D3748] mb-4">
              Welcome back!
            </h2>
            <p className="text-[#718096] text-lg mb-6">
              Manage your events, track attendance, and distribute souvenirs with ease.
            </p>
            
            {/* Feature list */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#4FD1C5]/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-[#4FD1C5]" />
                </div>
                <div>
                  <p className="font-semibold text-[#2D3748]">Event Management</p>
                  <p className="text-sm text-[#A0AEC0]">Create and organize events</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F6AD55]/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-[#F6AD55]" />
                </div>
                <div>
                  <p className="font-semibold text-[#2D3748]">Guest Tracking</p>
                  <p className="text-sm text-[#A0AEC0]">Monitor attendance in real-time</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#667eea]/10 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-[#667eea]" />
                </div>
                <div>
                  <p className="font-semibold text-[#2D3748]">Secure Access</p>
                  <p className="text-sm text-[#A0AEC0]">Enterprise-grade security</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white/90 backdrop-blur-md rounded-[40px] p-10 shadow-2xl shadow-teal-900/10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#2D3748] mb-2">Sign In</h2>
            <p className="text-[#A0AEC0]">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-[#2D3748]">
                Username
              </Label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <User className="h-5 w-5 text-[#A0AEC0]" />
                </div>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-12 h-14 rounded-2xl border-gray-200 bg-[#F7FAFC] focus:bg-white focus:border-[#4FD1C5] transition-all"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-[#2D3748]">
                Password
              </Label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Lock className="h-5 w-5 text-[#A0AEC0]" />
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-12 h-14 rounded-2xl border-gray-200 bg-[#F7FAFC] focus:bg-white focus:border-[#4FD1C5] transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-14 bg-gradient-to-r from-[#4FD1C5] to-[#38B2AC] hover:from-[#38B2AC] hover:to-[#319795] text-white rounded-2xl font-semibold text-base shadow-lg shadow-teal-500/30 transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>

            {/* Footer */}
            <div className="text-center pt-4">
              <p className="text-sm text-[#A0AEC0]">
                Secure login powered by{' '}
                <span className="font-semibold text-[#4FD1C5]">Event Management Pro</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
