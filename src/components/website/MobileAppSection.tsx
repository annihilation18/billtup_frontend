import { Card } from '../ui/card';
import { Smartphone, Download } from 'lucide-react@0.468.0';
import { Button } from '../ui/button';

export function MobileAppSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100" aria-labelledby="mobile-app-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#1E3A8A] via-[#14B8A6] to-[#F59E0B] rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 items-center p-8 lg:p-16">
            {/* Left Column - Content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Smartphone className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
                <span className="text-sm">Native Mobile Apps</span>
              </div>

              <h2 id="mobile-app-heading" className="text-4xl lg:text-5xl mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Download BilltUp
                <br />
                <span className="text-[#F59E0B]">For Your Device</span>
              </h2>

              <p className="text-xl text-white/90 mb-8 max-w-xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                Get the full BilltUp experience on your mobile device. Create invoices on-the-go, 
                manage customers, and track payments—all from the palm of your hand.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* App Store Button */}
                <button
                  className="bg-white text-gray-900 hover:bg-gray-100 rounded-xl h-16 px-6 flex items-center gap-3 transition-colors shadow-lg"
                  onClick={() => window.open('https://apps.apple.com/app/billtup', '_blank')}
                  aria-label="Download BilltUp on the App Store"
                >
                  <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-gray-600">Download on the</div>
                    <div className="text-base font-semibold">App Store</div>
                  </div>
                </button>

                {/* Google Play Button */}
                <button
                  className="bg-white text-gray-900 hover:bg-gray-100 rounded-xl h-16 px-6 flex items-center gap-3 transition-colors shadow-lg"
                  onClick={() => window.open('https://play.google.com/store/apps/details?id=com.billtup', '_blank')}
                  aria-label="Get BilltUp on Google Play"
                >
                  <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-gray-600">GET IT ON</div>
                    <div className="text-base font-semibold">Google Play</div>
                  </div>
                </button>
              </div>

              {/* Features list */}
              <ul className="mt-8 grid grid-cols-2 gap-4" role="list" aria-label="Mobile app features">
                {[
                  'Offline Mode',
                  'Push Notifications',
                  'Quick Actions',
                  'Secure & Fast'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column - App Preview */}
            <div className="relative lg:block hidden" aria-label="Mobile app interface preview" role="img">
              <div className="relative z-10 mx-auto max-w-sm">
                <div className="bg-white rounded-3xl shadow-2xl p-4 border-8 border-gray-800 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 aspect-[9/19]">
                    {/* Mock app screen showing download/welcome */}
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] mb-6 flex items-center justify-center">
                        <Smartphone className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        BilltUp
                      </h3>
                      <p className="text-sm text-gray-600 mb-6">
                        Invoice on the go
                      </p>
                      <div className="space-y-3 w-full">
                        <div className="h-10 bg-[#1E3A8A] rounded-xl flex items-center justify-center text-white text-sm">
                          Download Now
                        </div>
                        <div className="h-10 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center text-gray-700 text-sm">
                          Learn More
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating download icon */}
                <div className="absolute -right-4 top-20 bg-white rounded-full p-4 shadow-xl animate-bounce">
                  <Download className="w-6 h-6 text-[#14B8A6]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}