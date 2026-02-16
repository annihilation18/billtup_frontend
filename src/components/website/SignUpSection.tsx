import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js@4.0.0';
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js@2.8.0';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
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
  CreditCard,
  Shield,
  LockKeyhole
} from 'lucide-react@0.468.0';
import { STRIPE_CONFIG } from '../../utils/config';

// Initialize Stripe with publishable key from config
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

interface SignUpSectionProps {
  onNavigateToSignIn?: () => void;
  onNavigate?: (section: SectionType) => void;
  initialPlan?: 'basic' | 'premium';
}

// Card element styling
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#374151',
      fontFamily: 'Inter, system-ui, sans-serif',
      '::placeholder': {
        color: '#9CA3AF',
      },
      padding: '12px',
    },
    invalid: {
      color: '#EF4444',
      iconColor: '#EF4444',
    },
  },
};

function SignUpForm({ onNavigateToSignIn, onNavigate, initialPlan = 'basic' }: SignUpSectionProps) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: '',
    password: '',
    confirmPassword: '',
    plan: initialPlan as 'basic' | 'premium',
    billingCycle: 'monthly' as 'monthly' | 'annual',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
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

    if (!stripe || !elements) {
      setError('Payment system not loaded. Please refresh and try again.');
      return;
    }

    if (!cardComplete) {
      setError('Please enter valid payment card information');
      return;
    }

    setLoading(true);

    try {
      console.log('[Sign Up] Starting secure account creation process...');

      // Get the CardElement
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create payment method with Stripe (this tokenizes the card - card data never touches our server)
      console.log('[Sign Up] Creating secure payment method token...');
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: formData.name,
          email: formData.email,
        },
      });

      if (stripeError) {
        console.error('[Sign Up] Payment method creation error:', stripeError);
        setError(stripeError.message || 'Failed to process payment information');
        setLoading(false);
        return;
      }

      console.log('[Sign Up] Payment method created successfully');

      // Create account with payment method (backend will create Stripe customer and subscription)
      console.log('[Sign Up] Creating account with secure payment information...');
      const { API_CONFIG } = await import('../../utils/config');
      const response = await fetch(
        `${API_CONFIG.baseUrl}/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
            name: formData.name.trim(),
            businessName: formData.businessName.trim(),
            plan: formData.plan,
            billingCycle: formData.billingCycle,
            paymentMethodId: paymentMethod.id, // Send the tokenized payment method
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error('[Sign Up] Error:', result);
        setError(result.error || 'Failed to create account. Please try again.');
        setLoading(false);
        return;
      }

      console.log('[Sign Up] Account created successfully with payment method attached');
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        businessName: '',
        password: '',
        confirmPassword: '',
        plan: 'basic' as 'basic' | 'premium',
        billingCycle: 'monthly' as 'monthly' | 'annual',
      });
      
      // Clear card element
      cardElement.clear();
    } catch (err) {
      console.error('[Sign Up] Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="py-20 bg-gradient-to-br from-[#1E3A8A] via-[#14B8A6] to-[#F59E0B] min-h-screen flex items-center">
        <div className="max-w-md mx-auto px-4 w-full">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="text-3xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Welcome to BilltUp! 🎉
            </h2>
            
            <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              Your account has been created successfully and your 14-day free trial has started!
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-blue-900 mb-3">
                <strong>Next Steps:</strong>
              </p>
              <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                <li>Complete your business profile</li>
                <li>Upload your business logo</li>
                <li>Create your first invoice</li>
                <li>Start accepting payments</li>
              </ol>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-green-900">
                ✅ <strong>Your payment method is secured and ready.</strong> You won't be charged until your 14-day trial ends.
              </p>
            </div>

            <Button className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 h-12 rounded-xl">
              Go to Dashboard
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
              <span className="text-sm">Join 10,000+ service businesses</span>
            </div>

            <h1 className="text-5xl mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Start Invoicing in
              <br />
              <span className="text-[#F59E0B]">Less Than 5 Minutes</span>
            </h1>

            <p className="text-xl text-white/90 mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
              Start your 14-day trial and send your first professional invoice today.
            </p>

            <div className="space-y-4">
              {[
                '14-day free trial, then paid',
                'Starting at $4.99/month',
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
                    Your payment information is encrypted and processed securely by Stripe. We never store your card details on our servers.
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
                  Start your 14-day free trial
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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

                {/* Plan Selection */}
                <div className="space-y-2">
                  <Label>Select Plan</Label>
                  
                  {/* Billing Cycle Toggle */}
                  <div className="flex items-center justify-center gap-3 mb-3 bg-gray-100 rounded-lg p-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, billingCycle: 'monthly' })}
                      className={`px-4 py-2 rounded-md text-sm transition-all ${
                        formData.billingCycle === 'monthly'
                          ? 'bg-white text-[#1E3A8A] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, billingCycle: 'annual' })}
                      className={`px-4 py-2 rounded-md text-sm transition-all ${
                        formData.billingCycle === 'annual'
                          ? 'bg-white text-[#1E3A8A] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span>Annual</span>
                      <span className="ml-1.5 text-xs text-green-600">(Save 17%)</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, plan: 'basic' })}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        formData.plan === 'basic'
                          ? 'border-[#1E3A8A] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm text-gray-600 mb-1">Basic</div>
                      <div className="text-2xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                        {formData.billingCycle === 'annual' ? '$49.99' : '$4.99'}
                      </div>
                      <div className="text-xs text-gray-500">/{formData.billingCycle === 'annual' ? 'year' : 'month'}</div>
                      {formData.billingCycle === 'annual' && (
                        <div className="text-xs text-green-600 mt-1">$4.17/month</div>
                      )}
                      <div className="text-xs text-gray-600 mt-2">Up to 50 invoices</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, plan: 'premium' })}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        formData.plan === 'premium'
                          ? 'border-[#1E3A8A] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm text-gray-600 mb-1">Premium</div>
                      <div className="text-2xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                        {formData.billingCycle === 'annual' ? '$99.99' : '$9.99'}
                      </div>
                      <div className="text-xs text-gray-500">/{formData.billingCycle === 'annual' ? 'year' : 'month'}</div>
                      {formData.billingCycle === 'annual' && (
                        <div className="text-xs text-green-600 mt-1">$8.33/month</div>
                      )}
                      <div className="text-xs text-gray-600 mt-2">Unlimited invoices</div>
                    </button>
                  </div>
                </div>

                <Separator />

                {/* Payment Information Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-700" />
                    <Label className="text-base">Payment Information</Label>
                    <div className="flex-1"></div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <LockKeyhole className="w-3 h-3" />
                      <span>Secured by Stripe</span>
                    </div>
                  </div>
                  
                  <div className="border-2 border-gray-200 rounded-lg p-4 bg-white focus-within:border-[#1E3A8A] transition-colors">
                    <CardElement 
                      options={cardElementOptions}
                      onChange={(e) => setCardComplete(e.complete)}
                    />
                  </div>
                  
                  <div className="flex items-start gap-2 text-xs text-gray-600">
                    <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p>
                      Your payment information is encrypted and secured. We use Stripe for PCI DSS Level 1 compliant payment processing. Your card details never touch our servers.
                    </p>
                  </div>
                </div>

                {/* Trial & Billing Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-900">
                    <strong>💳 Start Your Free Trial</strong> – You won't be charged today. Your{' '}
                    {formData.billingCycle === 'annual' ? (
                      <>
                        {formData.plan === 'premium' ? '$99.99/year' : '$49.99/year'} subscription will be charged annually
                      </>
                    ) : (
                      <>
                        {formData.plan === 'premium' ? '$9.99/month' : '$4.99/month'} subscription will be charged monthly
                      </>
                    )}{' '}
                    starting after your 14-day trial ends unless you cancel.
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
                  disabled={loading || !agreeToTerms || !stripe}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Securing Your Account...
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
                  '14-day free trial',
                  'Starting at $4.99/month',
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

export function SignUpSection(props: SignUpSectionProps) {
  return (
    <Elements stripe={stripePromise}>
      <SignUpForm {...props} />
    </Elements>
  );
}