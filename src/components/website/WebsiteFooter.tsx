import { Facebook, Instagram, Mail } from 'lucide-react@0.468.0';
import type { SectionType } from '../../App';
import { BilltUpLogo } from '../BilltUpLogo';
import { Link } from 'react-router-dom';
import { TRADES } from '../../data/trades';
import { Wordmark } from './WebsiteHeader';

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/billtupapp/', Icon: Instagram },
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61596780094647', Icon: Facebook },
];

interface WebsiteFooterProps {
  onNavigate: (section: SectionType) => void;
}

/** Site footer: the original layout and links in the C3 navy theme (app repo BACKLOG P4.1) */
export function WebsiteFooter({ onNavigate }: WebsiteFooterProps) {
  const currentYear = new Date().getFullYear();
  const item = (section: SectionType, label: string) => (
    <li>
      <button onClick={() => onNavigate(section)}>{label}</button>
    </li>
  );

  return (
    <footer className="bt bt-footer" role="contentinfo">
      <div className="bt-wrap">
        <div className="bt-fgrid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <BilltUpLogo size={40} />
              <Wordmark dark />
              <span className="sr-only">BilltUp</span>
            </div>
            <p className="bt-blurb">
              The modern invoicing solution for service businesses. Get paid faster with professional invoices and instant payment processing.
            </p>
            <a href="mailto:support@billtup.com" className="bt-mail">
              <Mail className="bt-ic" style={{ width: 16, height: 16 }} aria-hidden="true" />
              support@billtup.com
            </a>
            {/* Social accounts (app repo BACKLOG M.7) */}
            <ul className="bt-social" aria-label="BilltUp on social media">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`BilltUp on ${label}`}>
                    <Icon className="bt-ic" style={{ width: 20, height: 20 }} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
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

        <div className="bt-bar">
          <p>© {currentYear} BilltUp. All rights reserved.</p>
          <a href="mailto:support@billtup.com" className="bt-mail" style={{ marginTop: 0 }}>
            <Mail className="bt-ic" style={{ width: 16, height: 16 }} aria-hidden="true" />
            support@billtup.com
          </a>
        </div>
      </div>
    </footer>
  );
}
