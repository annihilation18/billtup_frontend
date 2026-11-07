import { ArrowRight, Check, Zap } from 'lucide-react@0.468.0';
import { PRICING_CONFIG } from '../../utils/config';

interface PricingPreviewProps {
  onNavigate?: (section: string, plan?: 'basic' | 'premium') => void;
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li>
      <Check className="bt-ic" style={{ width: 18, height: 18 }} aria-hidden="true" />
      {children}
    </li>
  );
}

/** Home page pricing (C3, app repo BACKLOG P4.1). Prices and limits come from PRICING_CONFIG. */
export function PricingPreview({ onNavigate }: PricingPreviewProps) {
  const { basic, premium, trialDays } = PRICING_CONFIG;
  return (
    <section className="bt bt-blk bt-soft" aria-labelledby="pricing-heading">
      <div className="bt-wrap">
        <div className="bt-head">
          <span className="bt-eyebrow"><Zap className="bt-ic" style={{ width: 14, height: 14 }} aria-hidden="true" />Simple Pricing</span>
          <h2 id="pricing-heading" className="bt-ph bt-h2">
            Plans That Grow
            <br />
            <span className="bt-acc">With Your Business</span>
          </h2>
          <p className="bt-lead">Every feature free for {trialDays} days, no card needed. Then pick a plan.</p>
        </div>

        <div className="bt-plans">
          <div className="bt-plan">
            <h3>Basic</h3>
            <div className="bt-plan-for">For getting started</div>
            <div className="bt-price">${basic.monthly}<small> / month</small></div>
            <ul>
              <Feature>{basic.invoiceLimit} invoices and {basic.estimateLimit} estimates a month</Feature>
              <Feature>{basic.customerLimit} customers</Feature>
              <Feature>Stripe and Square payments</Feature>
              <Feature>iPhone, Android and web</Feature>
            </ul>
            <button onClick={() => onNavigate?.('signup', 'basic')} className="bt-btn bt-btn-sm bt-btn-line bt-btn-block" aria-label="Start free trial on the Basic plan">
              Start free trial
            </button>
          </div>

          <div className="bt-plan hl">
            <span className="bt-tag">Most popular</span>
            <h3>Premium</h3>
            <div className="bt-plan-for">For busy businesses</div>
            <div className="bt-price">${premium.monthly}<small> / month</small></div>
            <ul>
              <Feature>Unlimited invoices and estimates</Feature>
              <Feature>Unlimited customers</Feature>
              <Feature>Stripe and Square payments</Feature>
              <Feature>iPhone, Android and web</Feature>
            </ul>
            <button onClick={() => onNavigate?.('signup', 'premium')} className="bt-btn bt-btn-sm bt-btn-blue bt-btn-block" aria-label="Start free trial on the Premium plan">
              Start free trial
            </button>
          </div>
        </div>

        <p className="bt-fees">
          Transaction fees apply when you take payments through Stripe or Square.{' '}
          <button onClick={() => onNavigate?.('pricing')} className="bt-textlink">
            Full pricing details
            <ArrowRight className="bt-ic" style={{ width: 14, height: 14 }} aria-hidden="true" />
          </button>
        </p>
      </div>
    </section>
  );
}

/** Home page closing call to action (centred, C3) */
export function HomeCtaBand({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="bt bt-close" aria-labelledby="cta-heading">
      <div className="bt-wrap">
        <h2 id="cta-heading" className="bt-ph">
          Your next invoice could be <span className="bt-acc">paid today</span>
        </h2>
        <p className="bt-lead" style={{ marginTop: 10 }}>Try every feature free for {PRICING_CONFIG.trialDays} days. No card needed.</p>
        <button onClick={onGetStarted} className="bt-btn bt-btn-blue" style={{ marginTop: 22 }}>
          Start Your Free Trial
          <ArrowRight className="bt-ic" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
