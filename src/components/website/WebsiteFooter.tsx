import { Mail, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react@0.468.0';
import type { SectionType } from '../../App';
import { BilltUpLogo } from '../BilltUpLogo';

interface WebsiteFooterProps {
  onNavigate: (section: SectionType) => void;
}

export function WebsiteFooter({ onNavigate }: WebsiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-1 md:pr-8">
            <div className="flex items-center gap-3 mb-4">
              <BilltUpLogo size={48} />
              <span className="text-2xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                BilltUp
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              The modern invoicing solution for service businesses. Get paid faster with professional invoices and instant payment processing.
            </p>
            <div className="flex gap-3" role="group" aria-label="Social media links">
              <a 
                href="#" 
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-4 h-4" aria-hidden="true" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-4 h-4" aria-hidden="true" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" aria-hidden="true" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                aria-label="Connect with us on LinkedIn"
              >
                <Linkedin className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <nav className="md:col-span-1" aria-labelledby="footer-product-heading">
            <h3 id="footer-product-heading" className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Product
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('features')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Pricing
                </button>
              </li>
            </ul>
          </nav>

          {/* Resources Column */}
          <nav className="md:col-span-1" aria-labelledby="footer-resources-heading">
            <h3 id="footer-resources-heading" className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('docs')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Documentation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('help')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Help Center
                </button>
              </li>
            </ul>
          </nav>

          {/* Company Column */}
          <nav className="md:col-span-1" aria-labelledby="footer-company-heading">
            <h3 id="footer-company-heading" className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('security')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Security
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
              © {currentYear} BilltUp. All rights reserved.
            </p>
            
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Mail className="w-4 h-4" aria-hidden="true" />
              <a href="mailto:support@billtup.com" className="hover:text-white transition-colors">
                support@billtup.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}