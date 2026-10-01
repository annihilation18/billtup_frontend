import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import type { SectionType } from '../../App';
import {
  Mail,
  Lock,
  User,
  Building2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
} from 'lucide-react';

interface SignUpSectionProps {
  onNavigateToSignIn?: () => void;
  onNavigate?: (section: SectionType) => void;
  /** Kept for callers; no plan is chosen at signup — the free trial includes everything */
  initialPlan?: 'basic' | 'premium';
}

/**
 * Website signup: name, business, email and password only. No payment info — every
 * account starts with the 14-day free trial and chooses a plan when it ends.
 */
export function SignUpSection({ onNavigateToSignIn, onNavigate }: SignUpSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<'created' | 'restored' | null>(null);
  const [trialUsedBefore, setTrialUsedBefore] = useState(false);
  const [showReactivation, setShowReactivation] = useState(false);
  const [reactivating, setReactivating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      const { API_CONFIG } = await import('../../utils/config');
      const response = await fetch(`${API_CONFIG.baseUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          name: formData.name.trim(),
          businessName: formData.businessName.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409 && result.error === 'account_cancelled' && result.reactivationAvailable) {
          setShowReactivation(true);
          return;
        }
        setError(result.error || 'Failed to create account. Please try again.');
        return;
      }

      setTrialUsedBefore(result.subscription?.isLocked === true);
      setSuccess('created');
      setFormData({ name: '', email: '', businessName: '', password: '', confirmPassword: '' });
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReactivation = async () => {
    setReactivating(true);
    setError('');
    try {
      const { API_CONFIG } = await import('../../utils/config');
      // Restores the account (read-only); a plan is chosen after signing in
      const response = await fetch(`${API_CONFIG.baseUrl}/auth/reactivate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Failed to reactivate account');
        return;
      }

      setSuccess('restored');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setReactivating(false);
    }
  };

  if (showReactivation && !success) {
    return (
      <section className="py-20 bg-gradient-to-br from-[#1E3A8A] via-[#14B8A6] to-[#F59E0B] min-h-screen flex items-center">
        <div className="max-w-md mx-auto px-4 w-full">
          <Card className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Welcome Back!
              </h2>
              <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                Your account was previously cancelled. Restore it to see your invoices and customers again, then choose a plan to keep creating.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Button
              className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 h-12 rounded-xl"
              onClick={handleReactivation}
              disabled={reactivating}
            >
              {reactivating ? 'Restoring...' : 'Restore Account'}
            </Button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowReactivation(false)}
                className="text-sm text-gray-500 hover:underline"
              >
                Back to sign up
              </button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  if (success) {
    return (
      <section className="py-20 bg-gradient-to-br from-[#1E3A8A] via-[#14B8A6] to-[#F59E0B] min-h-screen flex items-center">
        <div className="max-w-md mx-auto px-4 w-full">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>

            <h2 className="text-3xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {success === 'restored' ? 'Welcome back!' : 'Welcome to BilltUp! 🎉'}
            </h2>

            <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              {success === 'restored'
                ? 'Your account has been restored. Sign in to see your invoices and choose a plan to keep creating.'
                : trialUsedBefore
                  ? 'Your account has been created. This email already used a free trial, so choose a plan after signing in to start creating invoices.'
                  : 'Your account has been created and your 14-day free trial has started — every feature is unlocked.'}
            </p>

            {success === 'created' && !trialUsedBefore && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm text-green-900">
                  ✅ <strong>No credit card needed.</strong> When your trial ends, choose a plan to keep creating invoices. Everything you make during the trial stays yours.
                </p>
              </div>
            )}

            <Button className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 h-12 rounded-xl" onClick={onNavigateToSignIn}>
              Sign In
            </Button>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-[#1E3A8A] via-[#14B8A6] to-[#F59E0B] min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Benefits */}
          <div className="text-white hidden lg:block">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-sm">Built for service businesses</span>
            </div>

            <h1 className="text-5xl mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Start Invoicing in
              <br />
              <span className="text-[#F59E0B]">Less Than 5 Minutes</span>
            </h1>

            <p className="text-xl text-white/90 mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
              Start your 14-day free trial and send your first professional invoice today.
            </p>

            <div className="space-y-4">
              {[
                '14-day free trial — no credit card required',
                'Plans from $4.99/month after your trial',
                'Cancel anytime',
                'Bank-level security (PCI DSS compliant)',
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white/90">
                    <strong>Secure Payment Processing</strong>
                  </p>
                  <p className="text-xs text-white/70 mt-1">
                    When you subscribe, your payment information is encrypted and processed securely by Stripe. We never store your card details on our servers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sign Up Form */}
          <div>
            <Card className="p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl mb-2 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Create Your Account
                </h2>
                <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  14-day free trial — no credit card required
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* Business Name */}
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="businessName"
                      type="text"
                      placeholder="Your Business LLC"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10"
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pl-10 pr-10"
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Trial info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-900">
                    <strong>Free for 14 days, no card needed.</strong> Every feature is unlocked during your trial.
                    When it ends, choose a plan (from $4.99/month) to keep creating invoices — anything you've made stays yours either way.
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {/* Terms of Service Agreement */}
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="agreeToTerms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                      className="mt-1"
                    />
                    <label htmlFor="agreeToTerms" className="text-sm text-gray-700 cursor-pointer" style={{ fontFamily: 'Inter, sans-serif' }}>
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate?.('terms');
                        }}
                        className="text-[#1E3A8A] hover:underline font-medium"
                      >
                        Terms of Service
                      </button>
                      {' '}and{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate?.('privacy');
                        }}
                        className="text-[#1E3A8A] hover:underline font-medium"
                      >
                        Privacy Policy
                      </button>
                    </label>
                  </div>
                  {!agreeToTerms && error === 'You must agree to the terms and conditions' && (
                    <p className="text-xs text-red-600 mt-2 ml-8">
                      You must agree to continue
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 h-12 rounded-xl text-lg"
                  disabled={loading || !agreeToTerms}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Creating Your Account...
                    </span>
                  ) : (
                    'Start 14-Day Free Trial'
                  )}
                </Button>

                {/* Sign In Link */}
                <div className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <button type="button" className="text-[#14B8A6] hover:underline" onClick={onNavigateToSignIn}>
                    Sign in
                  </button>
                </div>
              </form>
            </Card>

            {/* Mobile Benefits */}
            <div className="lg:hidden mt-8 text-white text-center">
              <div className="space-y-3">
                {[
                  '14-day free trial — no card required',
                  'Plans from $4.99/month',
                  'Cancel anytime',
                  'Bank-level security',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#F59E0B]" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
