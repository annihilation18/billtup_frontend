import { Button } from '../ui/button';
import { ArrowRight, CheckCircle2, Smartphone, Zap, TrendingUp, Play } from 'lucide-react@0.468.0';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section 
      className="relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#14B8A6] to-[#F59E0B] py-20 lg:py-32"
      aria-labelledby="hero-heading"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Smartphone className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
              <span className="text-sm">Available on iOS & Android</span>
            </div>

            <h1 id="hero-heading" className="text-5xl lg:text-6xl mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Invoice Smarter,
              <br />
              <span className="text-[#F59E0B]">Get Paid Faster</span>
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-xl" style={{ fontFamily: 'Inter, sans-serif' }}>
              The mobile invoicing app for service businesses. Create professional invoices and estimates,
              accept payments via Stripe & Square, and manage customers—all from your Android or iOS device.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-white !text-black hover:bg-gray-100 rounded-xl h-14 px-8 text-lg group"
                aria-label="Start your 14-day free trial"
              >
                Start Your Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Button>
            </div>

            {/* Trust badges */}
            <ul className="flex flex-wrap gap-6 items-center" role="list" aria-label="Key benefits">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#F59E0B]" aria-hidden="true" />
                <span className="text-sm">Starting at $4.99/month</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#F59E0B]" aria-hidden="true" />
                <span className="text-sm">14-day free trial</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#F59E0B]" aria-hidden="true" />
                <span className="text-sm">Cancel anytime</span>
              </li>
            </ul>
          </div>

          {/* Right Column - App Preview */}
          <div className="relative" aria-label="BilltUp mobile app preview" role="img">
            {/* Floating cards */}
            <div className="relative">
              {/* Main phone mockup */}
              <div className="relative z-10 mx-auto max-w-sm">
                <div className="bg-white rounded-3xl shadow-2xl p-4 border-8 border-gray-800">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                    {/* Mock app screen */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6]" />
                      <div className="text-xs text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>BilltUp</div>
                    </div>

                    <div className="space-y-3">
                      {/* Invoice card - Paid */}
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Sarah Mitchell</span>
                          <span className="text-[10px] bg-[#14B8A6]/10 text-[#14B8A6] px-2 py-0.5 rounded-full font-medium">Paid</span>
                        </div>
                        <div className="text-lg text-[#1E3A8A]" style={{ fontFamily: 'Roboto Mono, monospace' }}>$1,250.00</div>
                        <div className="text-[10px] text-gray-400 mt-1">INV-0042 &middot; Feb 20, 2026</div>
                      </div>

                      {/* Invoice card - Pending */}
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>James Cooper</span>
                          <span className="text-[10px] bg-[#F59E0B]/10 text-[#F59E0B] px-2 py-0.5 rounded-full font-medium">Pending</span>
                        </div>
                        <div className="text-lg text-[#1E3A8A]" style={{ fontFamily: 'Roboto Mono, monospace' }}>$840.00</div>
                        <div className="text-[10px] text-gray-400 mt-1">INV-0043 &middot; Feb 22, 2026</div>
                      </div>

                      {/* Invoice card - Overdue */}
                      <div className="bg-white rounded-xl p-4 shadow-sm border-l-2 border-red-400">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Apex Renovations</span>
                          <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-medium">Overdue</span>
                        </div>
                        <div className="text-lg text-[#1E3A8A]" style={{ fontFamily: 'Roboto Mono, monospace' }}>$3,200.00</div>
                        <div className="text-[10px] text-gray-400 mt-1">INV-0038 &middot; Due Jan 15</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating stat cards */}
              <div className="absolute -left-4 top-20 bg-white rounded-xl shadow-xl p-4 max-w-[140px] hidden lg:block animate-float">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-[#14B8A6]" />
                  <span className="text-xs text-gray-600">Revenue</span>
                </div>
                <div className="text-2xl text-[#1E3A8A]" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                  $24,586
                </div>
                <div className="text-xs text-green-600">↑ 12% this month</div>
              </div>

              <div className="absolute -right-4 bottom-32 bg-white rounded-xl shadow-xl p-4 max-w-[160px] hidden lg:block animate-float-delayed">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="w-5 h-5 text-[#F59E0B]" />
                  <span className="text-xs text-gray-600">Quick Invoice</span>
                </div>
                <div className="text-sm text-gray-700">Created in 30 sec</div>
                <div className="flex gap-1 mt-2">
                  <div className="h-1 bg-[#14B8A6] rounded flex-1" />
                  <div className="h-1 bg-[#14B8A6] rounded flex-1" />
                  <div className="h-1 bg-gray-200 rounded flex-1" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '15+', label: 'Invoice Templates' },
            { value: 'Stripe & Square', label: 'Payment Processing' },
            { value: 'Offline Ready', label: 'Works Anywhere' },
            { value: 'iOS & Android', label: 'Native Apps' },
          ].map((stat, index) => (
            <div key={index} className="text-center text-white">
              <div className="text-3xl mb-2" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                {stat.value}
              </div>
              <div className="text-white/80 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite 1.5s;
        }
      `}</style>
    </section>
  );
}