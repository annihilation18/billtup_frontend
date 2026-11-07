import { Download, Smartphone } from 'lucide-react@0.468.0';
import { BilltUpLogo } from '../BilltUpLogo';
import { StoreBadges } from './HeroSection';

const APP_FEATURES = ['Offline mode', 'Estimates & invoices', 'Payment links', 'Biometric security'];

/** Home page: "Download BilltUp For Your Device" card (C3, app repo BACKLOG P4.1) */
export function MobileAppSection() {
  return (
    <section className="bt" style={{ padding: '0 0 84px' }} aria-labelledby="mobile-app-heading">
      <div className="bt-wrap">
        <div className="bt-dl">
          <div>
            <span className="bt-eyebrow dark">
              <Smartphone className="bt-ic" style={{ width: 15, height: 15 }} aria-hidden="true" />
              Native Mobile Apps
            </span>
            <h2 id="mobile-app-heading" className="bt-ph">
              Download BilltUp
              <br />
              <span className="bt-acc-l">For Your Device</span>
            </h2>
            <p style={{ fontSize: 17, marginTop: 16, color: 'rgba(255,255,255,.85)', lineHeight: 1.55, maxWidth: 460 }}>
              Create invoices on the go, manage customers and take payments, all from the palm of your hand.
            </p>
            <StoreBadges solid />
            <ul className="bt-dl-bul" aria-label="Mobile app features">
              {APP_FEATURES.map((f) => (
                <li key={f}>
                  <Download className="bt-ic" style={{ width: 16, height: 16 }} aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="bt-dl-art" aria-hidden="true">
            <div className="bt-tilt">
              <div className="bt-tilt-in">
                <BilltUpLogo size={72} />
                <div style={{ fontWeight: 800, fontSize: 20, color: '#1E3A8A' }}>Billt<span style={{ color: '#14B8A6' }}>Up</span></div>
                <div style={{ color: '#64748B', fontSize: 14 }}>Invoice on the go</div>
                <span className="bt-btn bt-btn-sm bt-btn-blue" style={{ marginTop: 8, pointerEvents: 'none' }}>Download now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
