import { ChevronDown, Menu, X } from 'lucide-react@0.468.0';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { SectionType } from '../../App';
import { BilltUpLogo } from '../BilltUpLogo';
import { TRADES } from '../../data/trades';

interface WebsiteHeaderProps {
  currentSection: string;
  onNavigate: (section: SectionType) => void;
}

/** "Billt" + gradient "Up". `dark` is for navy backgrounds (white "Billt"). */
export function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`bt-word${dark ? ' on-dark' : ''}`} aria-hidden="true">
      Billt<span>Up</span>
    </span>
  );
}

const NAV_ITEMS: { id: SectionType; label: string }[] = [
  { id: 'features', label: 'Features' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'docs', label: 'Docs' },
  { id: 'help', label: 'Help' },
  { id: 'faq', label: 'FAQ' },
];

/** Site header on every public page (C3, app repo BACKLOG P4.1): white, sticky. */
export function WebsiteHeader({ currentSection, onNavigate }: WebsiteHeaderProps) {
  const location = useLocation();
  // pathToSection() maps unknown paths (e.g. trade pages) to 'home', so check the path itself
  const isHome = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tradesOpen, setTradesOpen] = useState(false);
  const tradesRef = useRef<HTMLDivElement>(null);

  // Close menus on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setTradesOpen(false);
  }, [location.pathname]);

  // Close the trades dropdown on outside click or Escape
  useEffect(() => {
    if (!tradesOpen) return;
    const onDown = (e: MouseEvent) => {
      if (tradesRef.current && !tradesRef.current.contains(e.target as Node)) setTradesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setTradesOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [tradesOpen]);

  const go = (section: SectionType) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  const current = (id: SectionType) => (currentSection === id && !isHome ? 'page' : undefined);
  const tradeActive = location.pathname.startsWith('/invoice-app-for-');

  const navButton = (item: { id: SectionType; label: string }, className: string) => (
    <button key={item.id} onClick={() => go(item.id)} className={className} aria-current={current(item.id)}>
      {item.label}
    </button>
  );

  return (
    <header className="bt bt-header" role="banner">
      <div className="bt-wrap">
        <div className="bt-nav">
          <button onClick={() => go('home')} className="bt-brand" aria-label="BilltUp home">
            <BilltUpLogo size={40} />
            <Wordmark />
          </button>

          {/* Desktop navigation */}
          <nav className="bt-links" aria-label="Main navigation">
            {NAV_ITEMS.slice(0, 2).map((item) => navButton(item, 'bt-link'))}
            <div className="bt-dd" ref={tradesRef}>
              <button
                className="bt-link"
                onClick={() => setTradesOpen((v) => !v)}
                aria-expanded={tradesOpen}
                aria-controls="trades-menu"
                aria-current={tradeActive ? 'page' : undefined}
              >
                Trades
                <ChevronDown className="bt-ic" style={{ width: 16, height: 16 }} aria-hidden="true" />
              </button>
              {tradesOpen && (
                <div id="trades-menu" className="bt-dd-panel">
                  {TRADES.map((trade) => (
                    <Link key={trade.slug} to={`/invoice-app-for-${trade.slug}`}>
                      For {trade.name.toLowerCase()}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {NAV_ITEMS.slice(2).map((item) => navButton(item, 'bt-link'))}
          </nav>

          <div className="bt-actions">
            <button onClick={() => go('signin')} className="bt-btn bt-btn-sm bt-btn-line" aria-label="Sign in to your account">
              Sign In
            </button>
            <button onClick={() => go('signup')} className="bt-btn bt-btn-sm bt-btn-blue" aria-label="Get started with BilltUp for free">
              Get Started Free
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="bt-menu-btn"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="bt-ic" style={{ width: 24, height: 24 }} /> : <Menu className="bt-ic" style={{ width: 24, height: 24 }} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav id="mobile-menu" className="bt-mobile" aria-label="Mobile navigation">
            {NAV_ITEMS.slice(0, 2).map((item) => navButton(item, 'bt-mlink'))}
            <div className="bt-mhead">Trades</div>
            {TRADES.map((trade) => (
              <Link
                key={trade.slug}
                to={`/invoice-app-for-${trade.slug}`}
                className="bt-mlink bt-msub"
                onClick={() => setMobileMenuOpen(false)}
                aria-current={location.pathname === `/invoice-app-for-${trade.slug}` ? 'page' : undefined}
              >
                For {trade.name.toLowerCase()}
              </Link>
            ))}
            {NAV_ITEMS.slice(2).map((item) => navButton(item, 'bt-mlink'))}
            <div className="bt-mobile-ctas">
              <button onClick={() => go('signin')} className="bt-btn bt-btn-line bt-btn-block" aria-label="Sign in to your account">
                Sign In
              </button>
              <button onClick={() => go('signup')} className="bt-btn bt-btn-blue bt-btn-block" aria-label="Get started with BilltUp for free">
                Get Started Free
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
