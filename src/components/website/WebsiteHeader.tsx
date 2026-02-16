import { Menu, X } from 'lucide-react@0.468.0';
import { Button } from '../ui/button';
import { useState } from 'react';
import type { SectionType } from '../../App';
import { BilltUpLogo } from '../BilltUpLogo';

interface WebsiteHeaderProps {
  currentSection: string;
  onNavigate: (section: SectionType) => void;
}

export function WebsiteHeader({ currentSection, onNavigate }: WebsiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'docs', label: 'Documentation' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label="BilltUp home"
          >
            <BilltUpLogo size={40} />
            <span className="text-2xl text-[#1E3A8A]" style={{ fontFamily: 'Poppins, sans-serif' }} aria-hidden="true">
              BilltUp
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as any)}
                className={`transition-colors ${
                  currentSection === item.id
                    ? 'text-[#1E3A8A]'
                    : 'text-gray-600 hover:text-[#1E3A8A]'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
                aria-current={currentSection === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              onClick={() => onNavigate('signin')}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
              aria-label="Sign in to your account"
            >
              Sign In
            </Button>
            <Button
              onClick={() => onNavigate('signup')}
              className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-lg"
              aria-label="Get started with BilltUp for free"
            >
              Get Started Free
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-[#1E3A8A]"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            id="mobile-menu" 
            className="md:hidden py-4 border-t border-gray-200"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 px-4 rounded-lg transition-colors ${
                    currentSection === item.id
                      ? 'bg-[#1E3A8A]/10 text-[#1E3A8A]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  aria-current={currentSection === item.id ? 'page' : undefined}
                >
                  {item.label}
                </button>
              ))}
              <Button
                onClick={() => {
                  onNavigate('signin');
                  setMobileMenuOpen(false);
                }}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg w-full"
                aria-label="Sign in to your account"
              >
                Sign In
              </Button>
              <Button
                onClick={() => {
                  onNavigate('signup');
                  setMobileMenuOpen(false);
                }}
                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-lg w-full"
                aria-label="Get started with BilltUp for free"
              >
                Get Started Free
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}