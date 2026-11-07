import { ArrowRight, Check } from 'lucide-react@0.468.0';
import { PRICING_CONFIG } from '../../utils/config';
import '../../styles/c2-site.css';

interface PricingPreviewProps {
  onNavigate?: (section: string, plan?: 'basic' | 'premium') => void;
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li>
      <Check className="c2-ic" style={{ width: 18, height: 18 }} aria-hidden="true" />
      {children}
    </li>
  );
}

/** Home page pricing (C2, app repo BACKLOG P4.1). Prices and limits come from PRICING_CONFIG. */
export function PricingPreview({ onNavigate }: PricingPreviewProps) {
  const { basic, premium, trialDays } = PRICING_CONFIG;
  return (
    <section className="c2 c2-blk" style={{ paddingTop: 20 }} aria-labelledby="pricing-heading">
      <div className="c2-wrap">
        <h2 id="pricing-heading" className="c2-h2">Simple pricing that grows with you</h2>
        <p className="c2-lead">Every feature free for {trialDays} days, no card needed. Then pick a plan.</p>

        <div className="c2-plans">
          <div className="c2-plan">
            <h3>Basic</h3>
            <div className="c2-plan-for">For getting started</div>
            <div className="c2-price">${basic.monthly}<small> / month</small></div>
            <ul>
              <Feature>{basic.invoiceLimit} invoices and {basic.estimateLimit} estimates a month</Feature>
              <Feature>{basic.customerLimit} customers</Feature>
              <Feature>Stripe and Square payments</Feature>
              <Feature>iPhone, Android and web</Feature>
            </ul>
            <button onClick={() => onNavigate?.('signup', 'basic')} className="c2-btn c2-btn-line c2-btn-block" aria-label="Start free trial on the Basic plan">
              Start free trial
            </button>
          </div>

          <div className="c2-plan hl">
            <span className="c2-tag">Most popular</span>
            <h3>Premium</h3>
            <div className="c2-plan-for">For busy businesses</div>
            <div className="c2-price">${premium.monthly}<small> / month</small></div>
            <ul>
              <Feature>Unlimited invoices and estimates</Feature>
              <Feature>Unlimited customers</Feature>
              <Feature>Stripe and Square payments</Feature>
              <Feature>iPhone, Android and web</Feature>
            </ul>
            <button onClick={() => onNavigate?.('signup', 'premium')} className="c2-btn c2-btn-blue c2-btn-block" aria-label="Start free trial on the Premium plan">
              Start free trial
            </button>
          </div>
        </div>

        <p className="c2-fees">
          Transaction fees apply when you take payments through Stripe or Square.{' '}
          <button onClick={() => onNavigate?.('pricing')} className="c2-textlink" style={{ padding: 0, fontSize: 14 }}>
            Full pricing details
            <ArrowRight className="c2-ic" style={{ width: 14, height: 14 }} aria-hidden="true" />
          </button>
        </p>
      </div>
    </section>
  );
}

/** Home page closing call to action */
export function HomeCtaBand({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="c2" style={{ padding: '0 0 84px' }} aria-labelledby="cta-heading">
      <div className="c2-wrap">
        <div className="c2-cta">
          <div>
            <h2 id="cta-heading">Your next invoice could be paid today.</h2>
            <p>Try every feature free for {PRICING_CONFIG.trialDays} days. No card needed.</p>
          </div>
          <button onClick={onGetStarted} className="c2-btn c2-btn-teal">
            Start free trial
            <ArrowRight className="c2-ic" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
