'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { apiClient } from '@/shared/services/api-client';
import { Shield, Eye, EyeOff, Lock, AlertCircle, CheckCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoginError('');
    try {
      const response = await apiClient.post('/auth/login', values);
      apiClient.setTokens(response.data.accessToken, response.data.refreshToken);
      window.location.href = '/dashboard';
    } catch {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:flex-col lg:w-1/2 p-12 relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #ffffff 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #ffffff 0px, transparent 1px, transparent 40px)',
          }} />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3 mb-auto">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">ShadowProtocol</p>
            <p className="text-white/40 text-xs">Crime Intelligence Platform</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative flex-1 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 mb-6 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-white/60">Karnataka Police CID System</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Intelligence-driven
            <br />
            crime management
          </h1>
          <p className="text-white/50 text-base leading-relaxed max-w-md">
            Unified platform for FIR management, criminal analytics, network analysis, and AI-powered crime intelligence for Karnataka Police.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            {['AI Assistant', 'Network Analysis', 'Crime Hotspot Maps', 'RBAC Security', 'Audit Trails'].map(
              (f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/60"
                >
                  <CheckCircle className="h-3 w-3 text-emerald-400" />
                  {f}
                </span>
              )
            )}
          </div>
        </div>

        {/* Karnataka Police badge */}
        <div className="relative flex items-center gap-3 mt-auto pt-8 border-t border-white/10">
          <Lock className="h-4 w-4 text-white/30" />
          <p className="text-xs text-white/30">
            Official system of Karnataka Police Department. Authorized access only.
          </p>
        </div>
      </div>

      {/* Right panel: login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-primary-700 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <p className="font-bold text-foreground text-lg">ShadowProtocol</p>
          </div>

          <h2 className="text-2xl font-bold text-foreground tracking-tight">Sign in</h2>
          <p className="text-sm text-secondary mt-1.5 mb-8">
            Use your Karnataka Police CID credentials
          </p>

          {loginError && (
            <div className="flex items-center gap-2 p-3 mb-5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 animate-slide-up">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {loginError}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input
              label="Email address"
              type="email"
              placeholder="officer@ksp.gov.in"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                error={errors.password?.message}
                {...register('password')}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="focus:outline-none pointer-events-auto"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary-700" />
                Remember me
              </label>
              <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              Sign in to dashboard
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              Having trouble? Contact your{' '}
              <a href="#" className="text-primary-600 hover:underline">
                system administrator
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
