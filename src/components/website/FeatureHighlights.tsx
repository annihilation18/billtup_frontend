import { ArrowRight, ClipboardList, CreditCard, FileText, Shield, Smartphone, Users, Wrench } from 'lucide-react@0.468.0';
import { Link } from 'react-router-dom';
import { TRADES } from '../../data/trades';
import '../../styles/c2-site.css';

interface FeatureHighlightsProps {
  onNavigate?: (section: string) => void;
}

const HIGHLIGHTS = [
  { icon: FileText, title: 'Create invoices in seconds', text: 'Branded invoices with automatic totals, tax and discounts, from 15 templates.' },
  { icon: CreditCard, title: 'Optional payment processing', text: 'Connect Stripe or Square to take cards and get paid instantly, or keep it simple with invoice-only.' },
  { icon: ClipboardList, title: 'Estimates that turn into invoices', text: 'Customers approve or decline by email; approved estimates become invoices in one tap.' },
  { icon: Users, title: 'Customers in one place', text: 'Contact details and payment history for every customer, on your phone and the web.' },
  { icon: Smartphone, title: 'Work from anywhere', text: 'Native apps for iPhone and Android, plus a web dashboard. Works offline and syncs later.' },
  { icon: Shield, title: 'Bank-level security', text: 'Payments are handled by Stripe and Square; your data is encrypted.' },
];

/** Home page: features on a tinted band, plus links to the trade pages (C2, app repo BACKLOG P4.1) */
export function FeatureHighlights({ onNavigate }: FeatureHighlightsProps) {
  return (
    <section className="c2 c2-blk c2-band" aria-labelledby="features-heading">
      <div className="c2-wrap">
        <h2 id="features-heading" className="c2-h2">Everything you need to invoice and get paid</h2>

        <div className="c2-grid3">
          {HIGHLIGHTS.map((f) => (
            <div key={f.title} className="c2-feat">
              <div className="c2-feat-ic" aria-hidden="true"><f.icon className="c2-ic" /></div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>

        <p className="c2-trades-label" id="trades-heading">Built for your trade</p>
        <ul className="c2-trades" aria-labelledby="trades-heading">
          {TRADES.map((trade) => (
            <li key={trade.slug}>
              <Link to={`/invoice-app-for-${trade.slug}`} className="c2-trade" aria-label={`Invoice app for ${trade.name.toLowerCase()}`}>
                <Wrench className="c2-ic" style={{ width: 16, height: 16 }} aria-hidden="true" />
                {trade.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="c2-more">
          <button onClick={() => onNavigate?.('features')} className="c2-textlink">
            Explore all features
            <ArrowRight className="c2-ic" style={{ width: 16, height: 16 }} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
