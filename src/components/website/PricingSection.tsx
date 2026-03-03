import { Check, Zap, Crown, Star, CreditCard } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import type { SectionType } from '../App';

interface PricingSectionProps {
  onNavigate?: (section: SectionType, plan?: 'basic' | 'premium') => void;
}

export function PricingSection({ onNavigate }: PricingSectionProps) {
  const plans = [
    {
      name: 'Basic',
      price: 4.99,
      period: '/month',
      description: 'Perfect for small businesses and freelancers just getting started',
      color: 'from-[#14B8A6] to-[#1E3A8A]',
      icon: Zap,
      features: [
        'Up to 10 invoices per month',
        'Up to 10 customers',
        'Stripe & Square payment processing',
        'Automatic PDF receipts via email',
        'Estimates & quotes',
        'Payment links',
        'Overdue invoice tracking',
        'Line item autocomplete',
        'Basic customer management',
        'Mobile & web access',
        'Email support',
      ],
      cta: 'Start Basic Plan',
      popular: false,
    },
    {
      name: 'Premium',
      price: 9.99,
      period: '/month',
      description: 'For growing businesses that need advanced features and priority support',
      color: 'from-[#F59E0B] to-[#1E3A8A]',
      icon: Crown,
      features: [
        'Unlimited invoices',
        'Unlimited customers',
        'Stripe & Square payment processing',
        'Automatic PDF receipts via email',
        'Estimates & quotes',
        'Payment links',
        'Overdue invoice tracking',
        'Line item autocomplete',
        'Advanced customer management',
        'Sales analytics & reports',
        'Custom branding & invoice templates',
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
              When you enable payment processing through Stripe or Square, transaction fees apply.
              Fees vary based on payment method (card, ACH, digital wallet, etc.) and processor.
              You can compare rates for each method in your payment settings.
            </p>
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