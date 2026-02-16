import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Mail, Lock, AlertCircle, CheckCircle, Loader2, Smartphone } from 'lucide-react@0.468.0';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { BilltUpLogo } from '../BilltUpLogo';
import { signIn as cognitoSignIn } from '../../utils/auth/cognito';
import { API_CONFIG } from '../../utils/config';

interface SignInSectionProps {
  onNavigateToSignUp: () => void;
  onSignIn: (plan: 'basic' | 'premium') => void;
}

export function SignInSection({ onNavigateToSignUp, onSignIn }: SignInSectionProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError('Please enter your email and password');
        setIsLoading(false);
        return;
      }

      console.log('[Sign In] Attempting to sign in with:', email);

      // Authenticate with Cognito
      const { session } = await cognitoSignIn(email.trim(), password);

      console.log('[Sign In] Successfully signed in:', session.user.email);

      // Fetch user plan from business profile
      try {
        const response = await fetch(
          `${API_CONFIG.baseUrl}/business`,
          {
            headers: {
              'Authorization': `Bearer ${session.idToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        let plan: 'basic' | 'premium' = 'basic';
        if (response.ok) {
          const businessData = await response.json();
          // Check planType first (newer field), then fall back to plan
          const userPlanType = businessData?.planType || businessData?.plan || 'basic';
          // Map 'trial' to 'basic' for UI purposes (trial users get premium features via the trial banner)
          plan = userPlanType === 'premium' ? 'premium' : 'basic';
        }

        console.log('[Sign In] User plan:', plan);
        onSignIn(plan);
      } catch (err) {
        console.error('[Sign In] Error fetching business profile:', err);
        // Default to basic plan if we can't fetch
        onSignIn('basic');
      }
      
      setIsLoading(false);
    } catch (err: any) {
      console.error('[Sign In] Error:', err);
      let errorMessage = 'Invalid email or password. Please try again.';
      if (err?.code === 'NotAuthorizedException') {
        errorMessage = 'Invalid email or password. If you don\'t have an account yet, please sign up first.';
      } else if (err?.code === 'UserNotFoundException') {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (err?.code === 'UserNotConfirmedException') {
        errorMessage = 'Please confirm your email address before signing in.';
      } else if (err?.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BilltUpLogo size={80} />
          </div>
          <h1 className="text-3xl lg:text-4xl mb-2 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Welcome Back
          </h1>
          <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Sign in to access your account
          </p>
        </div>

        {/* Sign In Form */}
        <Card className="p-8 shadow-lg border-gray-200">
          <form onSubmit={handleSignIn} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800">{error}</p>
                  {error.includes('don\'t have an account') && (
                    <Button
                      onClick={onNavigateToSignUp}
                      variant="outline"
                      className="mt-2 h-8 text-xs border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Create Account
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-gray-700 mb-2">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-gray-300"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 mb-2">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 border-gray-300"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-[#1E3A8A] hover:text-[#14B8A6]"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-lg"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <button
                onClick={onNavigateToSignUp}
                className="text-[#1E3A8A] hover:text-[#14B8A6]"
              >
                Sign up for free
              </button>
            </p>
          </div>
        </Card>

        {/* App Download Reminder */}
        <Card className="mt-6 p-6 bg-gradient-to-br from-[#1E3A8A]/5 to-[#14B8A6]/5 border-[#14B8A6]/20">
          <div className="flex items-start gap-4">
            <div className="bg-white rounded-lg p-2">
              <Smartphone className="w-6 h-6 text-[#14B8A6]" />
            </div>
            <div className="flex-1">
              <h3 className="text-base mb-2 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Download the Mobile App
              </h3>
              <p className="text-sm text-gray-600 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                BilltUp is a native mobile app. After signing in, download the app from the App Store or Google Play to start creating invoices.
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="h-10 text-sm border-gray-300 flex items-center gap-2"
                  onClick={() => window.open('https://apps.apple.com/app/billtup', '_blank')}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  App Store
                </Button>
                <Button 
                  variant="outline" 
                  className="h-10 text-sm border-gray-300 flex items-center gap-2"
                  onClick={() => window.open('https://play.google.com/store/apps/details?id=com.billtup', '_blank')}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  Google Play
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>Secured with bank-level encryption</span>
        </div>
      </div>
    </section>
  );
}