import { ArrowRight, Check, Smartphone } from 'lucide-react@0.468.0';
import { PRICING_CONFIG } from '../../utils/config';
import { STORE_LINKS } from '../../data/trades';

interface HeroSectionProps {
  onGetStarted: () => void;
}

/** Sample data for the phone mockup (not real customers) */
const SAMPLE_INVOICES: { name: string; meta: string; amount: string; status: 'over' | 'due' | 'paid'; label: string }[] = [
  { name: 'Jordan Ellis', meta: 'INV-1048 · Due Nov 3', amount: '$1,240.00', status: 'over', label: 'Overdue' },
  { name: 'Maple Street HOA', meta: 'INV-1052 · Due Nov 20', amount: '$2,180.00', status: 'due', label: 'Pending' },
  { name: 'Priya Natarajan', meta: 'INV-1051 · Due Nov 18', amount: '$389.50', status: 'due', label: 'Pending' },
  { name: 'Blue Fern Café', meta: 'INV-1050 · Paid Nov 5', amount: '$640.00', status: 'paid', label: 'Paid' },
  { name: 'Hector Ruiz', meta: 'INV-1049 · Paid Nov 4', amount: '$295.00', status: 'paid', label: 'Paid' },
];

const APPLE_PATH = 'M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z';
const PLAY_PATH = 'M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z';

/** App Store / Google Play badges with the real store links. `solid` = white badges. */
export function StoreBadges({ solid = false }: { solid?: boolean }) {
  const cls = `bt-store${solid ? ' solid' : ''}`;
  return (
    <div className="bt-stores">
      <a href={STORE_LINKS.appStore} target="_blank" rel="noopener noreferrer" className={cls} aria-label="Download BilltUp on the App Store">
        <svg className="bt-ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={APPLE_PATH} /></svg>
        <span>Download on the<b>App Store</b></span>
      </a>
      <a href={STORE_LINKS.googlePlay} target="_blank" rel="noopener noreferrer" className={cls} aria-label="Get BilltUp on Google Play">
        <svg className="bt-ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={PLAY_PATH} /></svg>
        <span>Get it on<b>Google Play</b></span>
      </a>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="bt-stage" role="img" aria-label="BilltUp app home screen showing $3,809.50 pending payment, a list of invoices with paid, pending and overdue status, a payment received notice and an approved estimate">
      <div className="bt-phone" aria-hidden="true">
        <div className="bt-scr">
          <div className="bt-app-head">
            <div style={{ fontSize: 15, fontWeight: 700 }}>Ridgeline Detailing</div>
            <div style={{ fontSize: 13, opacity: 0.75, marginTop: 12 }}>Pending Payment</div>
            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>$3,809.50</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <div className="bt-app-stat">
                <div style={{ fontSize: 12, opacity: 0.75 }}>November Sales</div>
                <div style={{ fontWeight: 700, color: '#5EEAD4' }}>$1,940.00</div>
              </div>
              <div className="bt-app-stat">
                <div style={{ fontSize: 12, opacity: 0.75 }}>Year-to-Date</div>
                <div style={{ fontWeight: 700 }}>$24,615.00</div>
              </div>
            </div>
          </div>
          <div className="bt-app-list">
            {SAMPLE_INVOICES.map((r) => (
              <div className="bt-app-row" key={r.meta}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{r.name}</div>
                  <div style={{ color: '#64748B', fontSize: 13, marginTop: 2 }}>{r.meta}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{r.amount}</div>
                  <div style={{ marginTop: 4 }}><span className={`bt-pill bt-${r.status}`}>{r.label}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bt-float bt-float-pay" aria-hidden="true">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="bt-float-icon" style={{ width: 44, height: 44, borderRadius: 12, background: '#E0F5F2', color: '#0F766E', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <Check className="bt-ic" />
          </div>
          <div>
            <div className="bt-float-meta" style={{ fontSize: 14, color: '#64748B' }}>Payment received</div>
            <div className="bt-float-amt" style={{ fontWeight: 800, fontSize: 20 }}>$1,240.00</div>
          </div>
        </div>
        <div className="bt-float-meta" style={{ fontSize: 14, color: '#64748B', marginTop: 8 }}>Jordan Ellis · INV-1048 · + $186.00 tip</div>
      </div>

      <div className="bt-float bt-float-est" aria-hidden="true">
        <div style={{ fontSize: 14, color: '#64748B' }}>Estimate EST-0217</div>
        <div style={{ fontWeight: 800, fontSize: 18, marginTop: 2, lineHeight: 1.2 }}>Approved by customer</div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="bt-pill bt-paid" style={{ fontSize: 13, padding: '3px 10px' }}>Approved</span>
          <b style={{ fontSize: 15 }}>$2,180.00</b>
        </div>
      </div>
    </div>
  );
}

const STATS = [
  { value: '15+', label: 'Invoice templates' },
  { value: 'Stripe & Square', label: 'Payment processing' },
  { value: 'Offline ready', label: 'Works anywhere' },
  { value: 'iOS & Android', label: 'Native apps' },
];

/** Home page hero (C3, app repo BACKLOG P4.1) */
export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const trialDays = PRICING_CONFIG.trialDays;
  const check = <Check className="bt-ic" style={{ width: 16, height: 16 }} aria-hidden="true" />;

  return (
    <section className="bt bt-hero" aria-labelledby="hero-heading">
      <div className="bt-dots" aria-hidden="true" />
      <div className="bt-wrap">
        <div className="bt-hero-grid">
          <div className="bt-hero-copy">
            <span className="bt-eyebrow dark">
              <Smartphone className="bt-ic" style={{ width: 15, height: 15 }} aria-hidden="true" />
              Available on iOS &amp; Android
            </span>

            <h1 id="hero-heading" className="bt-ph bt-h1">
              Invoice Smarter,
              <br />
              <span className="bt-acc-l">Get Paid Faster</span>
            </h1>

            <p className="bt-sub">
              The mobile invoicing app for service businesses. Create invoices and estimates in under a minute,
              take card, Apple Pay or Google Pay, and always know who still owes you.
            </p>

            <div className="bt-ctas">
              <button onClick={onGetStarted} className="bt-btn bt-btn-white">
                Start Your {trialDays}-Day Free Trial
                <ArrowRight className="bt-ic" aria-hidden="true" />
              </button>
            </div>

            <StoreBadges />

            <ul className="bt-fine" aria-label="Key benefits">
              <li>{check}No card needed</li>
              <li>{check}From ${PRICING_CONFIG.basic.monthly} a month</li>
              <li>{check}Cancel anytime</li>
            </ul>
          </div>

          <PhoneMockup />
        </div>

        <ul className="bt-stats" aria-label="BilltUp at a glance">
          {STATS.map((s) => (
            <li key={s.label}><b>{s.value}</b><span>{s.label}</span></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
