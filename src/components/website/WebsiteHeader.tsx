import { ChevronDown, Menu, X } from 'lucide-react@0.468.0';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { SectionType } from '../../App';
import { BilltUpLogo } from '../BilltUpLogo';
import { TRADES } from '../../data/trades';
import '../../styles/c2-site.css';

interface WebsiteHeaderProps {
  currentSection: string;
  onNavigate: (section: SectionType) => void;
}

/** "Billt" + gradient "Up". `light` is for white backgrounds (navy "Billt", teal "Up"). */
export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className={`c2-word${light ? ' on-light' : ''}`} aria-hidden="true">
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

/**
 * Site header (C2, app repo BACKLOG P4.1). On the home page it sits transparent over the navy
 * hero with white text and turns solid navy once the page scrolls; on every other page it is
 * a white sticky bar.
 */
export function WebsiteHeader({ currentSection, onNavigate }: WebsiteHeaderProps) {
  const location = useLocation();
  // pathToSection() maps unknown paths (e.g. trade pages) to 'home', so check the path itself
  const isHome = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tradesOpen, setTradesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const tradesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

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

  const tradeActive = location.pathname.startsWith('/invoice-app-for-');
  const headerClass = [
    'c2 c2-header',
    isHome ? 'is-dark' : 'is-light',
    scrolled ? 'is-scrolled' : '',
    mobileMenuOpen ? 'is-open' : '',
  ].join(' ');

  return (
    <header className={headerClass} role="banner">
      <div className="c2-wrap">
        <div className="c2-nav">
          <button onClick={() => go('home')} className="c2-brand" aria-label="BilltUp home">
            <BilltUpLogo size={40} />
            <Wordmark light={!isHome} />
          </button>

          {/* Desktop navigation */}
          <nav className="c2-links" aria-label="Main navigation">
            {NAV_ITEMS.slice(0, 2).map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className="c2-link"
                aria-current={currentSection === item.id && !isHome ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
            <div className="c2-dd" ref={tradesRef}>
              <button
                className="c2-link"
                onClick={() => setTradesOpen((v) => !v)}
                aria-expanded={tradesOpen}
                aria-controls="trades-menu"
                aria-current={tradeActive ? 'page' : undefined}
              >
                Trades
                <ChevronDown className="c2-ic" style={{ width: 16, height: 16 }} aria-hidden="true" />
              </button>
              {tradesOpen && (
                <div id="trades-menu" className="c2-dd-panel">
                  {TRADES.map((trade) => (
                    <Link key={trade.slug} to={`/invoice-app-for-${trade.slug}`}>
                      For {trade.name.toLowerCase()}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {NAV_ITEMS.slice(2).map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className="c2-link"
                aria-current={currentSection === item.id && !isHome ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="c2-actions">
            <button onClick={() => go('signin')} className="c2-signin" aria-label="Sign in to your account">
              Sign in
            </button>
            <button
              onClick={() => go('signup')}
              className="c2-btn c2-btn-sm c2-btn-teal"
              aria-label="Start your free trial of BilltUp"
            >
              Start free trial
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="c2-menu-btn"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="c2-ic" style={{ width: 24, height: 24 }} /> : <Menu className="c2-ic" style={{ width: 24, height: 24 }} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav id="mobile-menu" className="c2-mobile" aria-label="Mobile navigation">
            {NAV_ITEMS.slice(0, 2).map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className="c2-mlink"
                aria-current={currentSection === item.id && !isHome ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
            <div className="c2-mhead">Trades</div>
            {TRADES.map((trade) => (
              <Link
                key={trade.slug}
                to={`/invoice-app-for-${trade.slug}`}
                className="c2-mlink c2-msub"
                onClick={() => setMobileMenuOpen(false)}
                aria-current={location.pathname === `/invoice-app-for-${trade.slug}` ? 'page' : undefined}
              >
                For {trade.name.toLowerCase()}
              </Link>
            ))}
            {NAV_ITEMS.slice(2).map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className="c2-mlink"
                aria-current={currentSection === item.id && !isHome ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
            <div className="c2-mobile-ctas">
              <button onClick={() => go('signin')} className="c2-btn c2-btn-line c2-btn-block" aria-label="Sign in to your account">
                Sign in
              </button>
              <button onClick={() => go('signup')} className="c2-btn c2-btn-teal c2-btn-block" aria-label="Start your free trial of BilltUp">
                Start free trial
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
