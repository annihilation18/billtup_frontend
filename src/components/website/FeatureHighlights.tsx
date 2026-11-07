import { ClipboardList, CreditCard, FileText, Shield, Smartphone, Users, Zap } from 'lucide-react@0.468.0';
import { Link } from 'react-router-dom';
import { TRADES } from '../../data/trades';

interface FeatureHighlightsProps {
  onNavigate?: (section: string) => void;
}

const HIGHLIGHTS = [
  { icon: FileText, title: 'Create invoices in seconds', text: 'Branded invoices with automatic totals, tax and discounts, from 15 templates.' },
  { icon: CreditCard, title: 'Optional payment processing', text: 'Connect Stripe or Square to take cards and get paid instantly, or keep it simple.' },
  { icon: ClipboardList, title: 'Estimates that turn into invoices', text: 'Customers approve or decline by email; approved estimates become invoices in one tap.' },
  { icon: Users, title: 'Customers in one place', text: 'Contact details and payment history for every customer, on your phone and the web.' },
  { icon: Smartphone, title: 'Work from anywhere', text: 'Apps for iPhone and Android, plus a web dashboard. Works offline and syncs later.' },
  { icon: Shield, title: 'Bank-level security', text: 'Payments are handled by Stripe and Square; your data is encrypted.' },
];

/** Home page: "Why BilltUp?" features and links to the trade pages (C3, app repo BACKLOG P4.1) */
export function FeatureHighlights(_props: FeatureHighlightsProps) {
  return (
    <section className="bt bt-blk" aria-labelledby="features-heading">
      <div className="bt-wrap">
        <div className="bt-head">
          <span className="bt-eyebrow"><Zap className="bt-ic" style={{ width: 14, height: 14 }} aria-hidden="true" />Why BilltUp?</span>
          <h2 id="features-heading" className="bt-ph bt-h2">
            Everything You Need to
            <br />
            <span className="bt-acc">Invoice &amp; Get Paid</span>
          </h2>
          <p className="bt-lead">Built for owner-operators and small crews who bill from the truck, not the office.</p>
        </div>

        <div className="bt-grid3">
          {HIGHLIGHTS.map((f) => (
            <div key={f.title} className="bt-feat">
              <div className="bt-feat-ic" aria-hidden="true"><f.icon className="bt-ic" /></div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>

        <ul className="bt-trades" aria-label="Invoice app for your trade">
          {TRADES.map((trade) => (
            <li key={trade.slug}>
              <Link to={`/invoice-app-for-${trade.slug}`} className="bt-trade" aria-label={`Invoice app for ${trade.name.toLowerCase()}`}>
                {trade.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
