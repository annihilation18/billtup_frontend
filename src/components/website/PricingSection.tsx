import { Check, Zap, Crown, Star, CreditCard } from 'lucide-react@0.468.0';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useState } from 'react';
import type { SectionType } from '../App';

interface PricingSectionProps {
  onNavigate?: (section: SectionType, plan?: 'basic' | 'premium') => void;
}

export function PricingSection({ onNavigate }: PricingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Basic',
      price: billingCycle === 'monthly' ? 4.99 : 49.99,
      period: billingCycle === 'monthly' ? '/month' : '/year',
      savings: billingCycle === 'annual' ? 'Save $10/year' : null,
      description: 'Perfect for small businesses and freelancers just getting started',
      color: 'from-[#14B8A6] to-[#1E3A8A]',
      icon: Zap,
      features: [
        'Up to 10 invoices per month',
        'Up to 10 customers',
        'Optional Stripe or Square payments',
        'Automatic PDF receipts via email',
        'Basic customer management',
        'Add your business logo',
        'Mobile & web access',
        'Email support',
      ],
      cta: 'Start Basic Plan',
      popular: false,
    },
    {
      name: 'Premium',
      price: billingCycle === 'monthly' ? 9.99 : 99.99,
      period: billingCycle === 'monthly' ? '/month' : '/year',
      savings: billingCycle === 'annual' ? 'Save $20/year' : null,
      description: 'For growing businesses that need advanced features and priority support',
      color: 'from-[#F59E0B] to-[#1E3A8A]',
      icon: Crown,
      features: [
        'Unlimited invoices',
        'Unlimited customers',
        'Optional Stripe or Square payments',
        'Automatic PDF receipts via email',
        'Advanced customer management',
        'Sales analytics & reports',
        'Refund management',
        'Custom invoice templates & branding',
        'Mobile & web access',
        'Priority email support',
      ],
      cta: 'Start Premium Plan',
      popular: true,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#14B8A6]/10 rounded-full px-4 py-2 mb-4">
            <Zap className="w-4 h-4 text-[#14B8A6]" />
            <span className="text-sm text-[#14B8A6]">Simple Pricing</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Pricing That Makes Sense
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
            Choose the plan that fits your business needs.
            <br />
            All plans include secure payment processing.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 bg-gray-100 rounded-xl p-1.5">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-[#1E3A8A] shadow-sm'
                  : 'text-gray-600'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-lg transition-all ${
                billingCycle === 'annual'
                  ? 'bg-white text-[#1E3A8A] shadow-sm'
                  : 'text-gray-600'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Annual
              <span className="ml-2 text-xs bg-[#F59E0B] text-white px-2 py-0.5 rounded-full">
                Save
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative p-6 sm:p-8 border-2 transition-all hover:shadow-2xl flex flex-col ${
                plan.popular
                  ? 'border-[#F59E0B] shadow-xl scale-105'
                  : 'border-gray-200 hover:border-[#14B8A6]'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-[#F59E0B] to-[#1E3A8A] text-white px-4 py-1 rounded-full text-sm flex items-center gap-1">
                    <Crown className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                <plan.icon className="w-7 h-7 text-white" />
              </div>

              {/* Plan Name */}
              <h3 className="text-2xl sm:text-3xl mb-2 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl text-[#1E3A8A]" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                    ${plan.price}
                  </span>
                  <span className="text-xl text-gray-600">{plan.period}</span>
                </div>
                {plan.savings && (
                  <p className="text-sm text-green-600 mt-1">{plan.savings}</p>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                {plan.description}
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#14B8A6]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#14B8A6]" />
                    </div>
                    <span className="text-gray-700 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div>
                <Button
                  onClick={() => onNavigate?.('signup', plan.name.toLowerCase() as 'basic' | 'premium')}
                  className={`w-full h-12 rounded-xl text-base sm:text-lg ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#F59E0B] to-[#1E3A8A] hover:opacity-90'
                      : 'bg-[#1E3A8A] hover:bg-[#1E3A8A]/90'
                  }`}
                >
                  {plan.cta}
                </Button>
                <p className="text-center text-xs text-gray-500 mt-3">
                  14-day free trial • Cancel anytime
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Transaction Fee Note */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#1E3A8A] rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-lg text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Transaction Fees
              </h4>
            </div>
            <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              When you enable payment processing through Stripe or Square, a small transaction fee applies.
              Fees vary by payment method and processor.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-lg border border-blue-200">
                <p className="text-xs text-gray-500 mb-1">Online payments</p>
                <p className="text-sm font-mono text-gray-900">as low as 3.5% + $0.50</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-blue-200">
                <p className="text-xs text-gray-500 mb-1">In-person payments</p>
                <p className="text-sm font-mono text-gray-900">as low as 3.2% + $0.35</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            Have questions about pricing?{' '}
            <button 
              onClick={() => onNavigate?.('faq')}
              className="text-[#14B8A6] hover:underline"
            >
              Check our FAQ
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}