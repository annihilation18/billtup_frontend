import { ArrowRight, Check, Smartphone } from 'lucide-react@0.468.0';
import { PRICING_CONFIG } from '../../utils/config';
import { STORE_LINKS } from '../../data/trades';
import '../../styles/c2-site.css';

interface HeroSectionProps {
  onGetStarted: () => void;
}

/** Sample data for the phone mockup (not real customers) */
const SAMPLE_INVOICES: { name: string; meta: string; amount: string; status: 'over' | 'due' | 'paid'; label: string }[] = [
  { name: 'Jordan Ellis', meta: 'INV-1048 · Due Nov 3', amount: '$1,240.00', status: 'over', label: 'Overdue' },
  { name: 'Maple Street HOA', meta: 'INV-1052 · Due Nov 20', amount: '$2,180.00', status: 'due', label: 'Unpaid' },
  { name: 'Priya Natarajan', meta: 'INV-1051 · Due Nov 18', amount: '$389.50', status: 'due', label: 'Unpaid' },
  { name: 'Blue Fern Café', meta: 'INV-1050 · Paid Nov 5', amount: '$640.00', status: 'paid', label: 'Paid' },
  { name: 'Hector Ruiz', meta: 'INV-1049 · Paid Nov 4', amount: '$295.00', status: 'paid', label: 'Paid' },
];

function PhoneMockup() {
  return (
    <div className="c2-stage" role="img" aria-label="BilltUp app home screen showing $3,809.50 outstanding, a list of invoices with paid, unpaid and overdue status, a payment received notice and an approved estimate">
      <div className="c2-phone" aria-hidden="true">
        <div className="c2-scr">
          <div className="c2-app-head">
            <div style={{ fontSize: 15, fontWeight: 700 }}>Ridgeline Detailing</div>
            <div style={{ fontSize: 13, opacity: 0.75, marginTop: 14 }}>Outstanding</div>
            <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>$3,809.50</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <div className="c2-app-stat">
                <div style={{ fontSize: 12, opacity: 0.75 }}>Paid in November</div>
                <div style={{ fontWeight: 700, color: '#5EEAD4' }}>$1,940.00</div>
              </div>
              <div className="c2-app-stat">
                <div style={{ fontSize: 12, opacity: 0.75 }}>Overdue · 1</div>
                <div style={{ fontWeight: 700, color: '#FCA5A5' }}>$1,240.00</div>
              </div>
            </div>
          </div>
          <div className="c2-app-list">
            {SAMPLE_INVOICES.map((r) => (
              <div className="c2-app-row" key={r.meta}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{r.name}</div>
                  <div style={{ color: '#64748B', fontSize: 13, marginTop: 2 }}>{r.meta}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{r.amount}</div>
                  <div style={{ marginTop: 4 }}><span className={`c2-pill c2-${r.status}`}>{r.label}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="c2-float c2-float-pay" aria-hidden="true">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="c2-float-icon" style={{ width: 44, height: 44, borderRadius: 12, background: '#E0F5F2', color: '#0F766E', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <Check className="c2-ic" />
          </div>
          <div>
            <div className="c2-float-meta" style={{ fontSize: 14, color: '#64748B' }}>Payment received</div>
            <div className="c2-float-amt" style={{ fontWeight: 800, fontSize: 20 }}>$1,240.00</div>
          </div>
        </div>
        <div className="c2-float-meta" style={{ fontSize: 14, color: '#64748B', marginTop: 8 }}>Jordan Ellis · INV-1048 · + $186.00 tip</div>
      </div>

      <div className="c2-float c2-float-est" aria-hidden="true">
        <div style={{ fontSize: 14, color: '#64748B' }}>Estimate EST-0217</div>
        <div style={{ fontWeight: 800, fontSize: 19, marginTop: 2, lineHeight: 1.2 }}>Approved by customer</div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="c2-pill c2-paid" style={{ fontSize: 13, padding: '3px 10px' }}>Approved</span>
          <b style={{ fontSize: 15 }}>$2,180.00</b>
        </div>
      </div>
    </div>
  );
}

const PAYMENT_METHODS = ['Stripe', 'Square', 'Apple Pay', 'Google Pay', 'Visa', 'Mastercard'];

/** "Take payments with" badges under the hero */
export function PaymentMethodsStrip() {
  return (
    <div className="c2 c2-wrap c2-strip">
      <ul className="c2-strip-row" aria-label="Payment methods">
        <li className="c2-strip-label">Take payments with</li>
        {PAYMENT_METHODS.map((m) => (
          <li key={m} className="c2-badge">{m}</li>
        ))}
      </ul>
    </div>
  );
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const trialDays = PRICING_CONFIG.trialDays;
  const scrollToSteps = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="c2 c2-hero" aria-labelledby="hero-heading">
      <div className="c2-dots" aria-hidden="true" />
      <div className="c2-wrap c2-hero-grid">
        <div className="c2-hero-copy">
          <span className="c2-eyebrow">
            <Smartphone className="c2-ic" style={{ width: 15, height: 15 }} aria-hidden="true" />
            For service businesses · iPhone, Android and web
          </span>

          <h1 id="hero-heading" className="c2-h1">
            Send the invoice.
            <br />
            <span className="c2-grad-text">Get paid on the spot.</span>
          </h1>

          <p className="c2-sub">
            Create invoices and estimates in under a minute, take card, Apple Pay or Google Pay through
            Stripe or Square, and always know who still owes you.
          </p>

          <div className="c2-ctas">
            <button onClick={onGetStarted} className="c2-btn c2-btn-teal" aria-label={`Start your ${trialDays}-day free trial`}>
              Start your {trialDays}-day free trial
              <ArrowRight className="c2-ic" aria-hidden="true" />
            </button>
            <button onClick={scrollToSteps} className="c2-btn c2-btn-ghost">
              See how it works
            </button>
          </div>

          <div className="c2-stores">
            <a
              href={STORE_LINKS.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className="c2-store"
              aria-label="Download BilltUp on the App Store"
            >
              <svg className="c2-ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <span>Download on the<b>App Store</b></span>
            </a>
            <a
              href={STORE_LINKS.googlePlay}
              target="_blank"
              rel="noopener noreferrer"
              className="c2-store"
              aria-label="Get BilltUp on Google Play"
            >
              <svg className="c2-ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              <span>Get it on<b>Google Play</b></span>
            </a>
          </div>

          <ul className="c2-fine" aria-label="Key benefits">
            <li><Check className="c2-ic" style={{ width: 16, height: 16 }} aria-hidden="true" />No card needed</li>
            <li><Check className="c2-ic" style={{ width: 16, height: 16 }} aria-hidden="true" />From ${PRICING_CONFIG.basic.monthly} a month</li>
            <li><Check className="c2-ic" style={{ width: 16, height: 16 }} aria-hidden="true" />Cancel anytime</li>
          </ul>
        </div>

        <PhoneMockup />
      </div>
    </section>
  );
}
