import { Check, Zap, Crown, ArrowRight, CreditCard } from 'lucide-react@0.468.0';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface PricingPreviewProps {
  onNavigate?: (section: string, plan?: 'basic' | 'premium') => void;
}

export function PricingPreview({ onNavigate }: PricingPreviewProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#1E3A8A]/10 rounded-full px-4 py-2 mb-4">
            <Zap className="w-4 h-4 text-[#1E3A8A]" />
            <span className="text-sm text-[#1E3A8A]">Simple Pricing</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Plans That Grow
            <br />
            <span className="text-[#1E3A8A]">With Your Business</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Start with our 14-day free trial. Choose the plan that fits your needs.
          </p>
        </div>

        {/* Pricing Cards - Compact Version */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Basic Plan */}
          <Card className="p-8 border-2 border-gray-200 hover:border-[#14B8A6] hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#14B8A6] to-[#1E3A8A] flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Basic
                </h3>
                <p className="text-sm text-gray-600">For small businesses</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl text-[#1E3A8A]" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                  $4.99
                </span>
                <span className="text-xl text-gray-600">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {[
                'Up to 10 invoices/month',
                'Up to 10 customers',
                'Stripe & Square payments',
                'Email support',
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#14B8A6] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => onNavigate?.('signup', 'basic')}
              className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 rounded-xl h-12"
            >
              Start Basic Plan
            </Button>
          </Card>

          {/* Premium Plan */}
          <Card className="p-8 border-2 border-[#F59E0B] shadow-xl scale-105 hover:shadow-2xl transition-all relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-[#F59E0B] to-[#1E3A8A] text-white px-4 py-1 rounded-full text-sm flex items-center gap-1">
                <Crown className="w-4 h-4" />
                Most Popular
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#1E3A8A] flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Premium
                </h3>
                <p className="text-sm text-gray-600">For growing businesses</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl text-[#1E3A8A]" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                  $9.99
                </span>
                <span className="text-xl text-gray-600">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {[
                'Unlimited invoices',
                'Unlimited customers',
                'Sales analytics & reports',
                'Priority support',
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#14B8A6] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => onNavigate?.('signup', 'premium')}
              className="w-full bg-gradient-to-r from-[#F59E0B] to-[#1E3A8A] hover:opacity-90 rounded-xl h-12"
            >
              Start Premium Plan
            </Button>
          </Card>
        </div>

        {/* Transaction Fee Note - Compact */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-xl p-6 border-2 border-blue-200 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-[#1E3A8A]" />
              <h4 className="text-lg text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Transaction Fees
              </h4>
            </div>
            <p className="text-gray-600 mb-2">
              Competitive transaction fees when you enable Stripe or Square payments.
            </p>
            <p className="text-sm text-gray-500">
              Fees vary by payment method — see{' '}
              <button onClick={() => onNavigate?.('pricing')} className="text-[#14B8A6] hover:underline">full pricing</button>{' '}
              for details.
            </p>
          </div>
        </div>

        {/* CTA to Full Pricing */}
        <div className="text-center">
          <Button
            onClick={() => onNavigate?.('pricing')}
            variant="outline"
            size="lg"
            className="border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white rounded-xl h-12 px-8 group"
          >
            View Full Pricing Details
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}