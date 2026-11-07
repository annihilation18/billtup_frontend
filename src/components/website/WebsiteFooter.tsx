import { Mail } from 'lucide-react@0.468.0';
import type { SectionType } from '../../App';
import { BilltUpLogo } from '../BilltUpLogo';
import { Link } from 'react-router-dom';
import { TRADES } from '../../data/trades';
import { Wordmark } from './WebsiteHeader';
import '../../styles/c2-site.css';

interface WebsiteFooterProps {
  onNavigate: (section: SectionType) => void;
}

/** Site footer, light C2 style (app repo BACKLOG P4.1) */
export function WebsiteFooter({ onNavigate }: WebsiteFooterProps) {
  const currentYear = new Date().getFullYear();
  const item = (section: SectionType, label: string) => (
    <li>
      <button onClick={() => onNavigate(section)}>{label}</button>
    </li>
  );

  return (
    <footer className="c2 c2-footer" role="contentinfo">
      <div className="c2-wrap">
        <div className="c2-foot-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <BilltUpLogo size={40} />
              <Wordmark light />
              <span className="sr-only">BilltUp</span>
            </div>
            <p className="c2-foot-about">
              Invoices, estimates and payments for service businesses, on iPhone, Android and the web.
            </p>
            <a href="mailto:support@billtup.com" className="c2-mail">
              <Mail className="c2-ic" style={{ width: 16, height: 16 }} aria-hidden="true" />
              support@billtup.com
            </a>
          </div>

          <nav aria-labelledby="footer-product-heading">
            <h3 id="footer-product-heading">Product</h3>
            <ul>
              {item('features', 'Features')}
              {item('pricing', 'Pricing')}
              {/* "Invoice app for <trade>" pages (app repo BACKLOG M.6) */}
              {TRADES.map((trade) => (
                <li key={trade.slug}>
                  <Link to={`/invoice-app-for-${trade.slug}`}>For {trade.name.toLowerCase()}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-resources-heading">
            <h3 id="footer-resources-heading">Resources</h3>
            <ul>
              {item('docs', 'Documentation')}
              {item('faq', 'FAQ')}
              {item('help', 'Help Center')}
            </ul>
          </nav>

          <nav aria-labelledby="footer-company-heading">
            <h3 id="footer-company-heading">Company</h3>
            <ul>
              {item('about', 'About Us')}
              {item('contact', 'Contact')}
              {item('privacy', 'Privacy Policy')}
              {item('terms', 'Terms of Service')}
              {item('security', 'Security')}
            </ul>
          </nav>
        </div>

        <div className="c2-foot-bottom">
          <p>© {currentYear} BilltUp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
