/** Home page: "Stand Out Without the Paperwork" and the two circle + story sections (C3, app repo BACKLOG P4.1) */
export function StorySections() {
  return (
    <section className="bt" style={{ padding: '20px 0 64px' }} aria-labelledby="statement-heading">
      <div className="bt-wrap">
        <div className="bt-statement">
          <h2 id="statement-heading" className="bt-ph">
            Stand Out <span className="bt-acc">Without the Paperwork</span>
          </h2>
          <p className="bt-lead" style={{ maxWidth: 820 }}>
            Look professional from the first estimate to the final receipt. Your logo and colours on every invoice,
            payments your customers already use, and records you never have to dig for.
          </p>
        </div>

        <div className="bt-story">
          <div className="bt-circle" role="img" aria-label="Payment screen for $1,476.41 with an optional tip of 15% selected">
            <div className="bt-mini" aria-hidden="true">
              <div style={{ textAlign: 'center', color: '#64748B' }}>INV-1048 · Jordan Ellis</div>
              <div style={{ textAlign: 'center', fontWeight: 800, fontSize: 26, marginTop: 2 }}>$1,476.41</div>
              <div style={{ fontWeight: 700, color: '#64748B', fontSize: 11, marginTop: 12 }}>ADD A TIP (OPTIONAL)</div>
              <div className="bt-tips">
                <span>No tip</span><span>10%</span><span className="on">15%</span><span>20%</span>
              </div>
              <div style={{ height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#1E3A8A,#2563EB)', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                Charge $1,476.41
              </div>
            </div>
          </div>
          <div>
            <h3>Get Paid Faster With <span className="bt-acc">Card, Apple Pay &amp; Google Pay</span></h3>
            <p>Cash-only businesses are rare, and your customers expect to pay by card. Connect Stripe or Square once, and every invoice can be paid online in a few taps.</p>
            <p>On the job, take payment in person on your phone. Customers can add an optional tip, and the invoice marks itself paid. Prefer cash or check? Mark it paid yourself.</p>
          </div>
        </div>

        <div className="bt-story flip">
          <div className="bt-circle" role="img" aria-label="Synced across phone, tablet and web">
            <div style={{ position: 'relative', color: '#fff', textAlign: 'center' }} aria-hidden="true">
              <svg viewBox="0 0 24 24" style={{ width: 120, height: 120 }} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                <path d="m9 14 2 2 4-4" />
              </svg>
              <div style={{ fontWeight: 700, fontSize: 18, marginTop: 8 }}>Synced</div>
              <div style={{ opacity: 0.8, fontSize: 14 }}>Phone · Tablet · Web</div>
            </div>
          </div>
          <div>
            <h3>Work Offline. <span className="bt-acc">Sync When You're Back.</span></h3>
            <p>No signal in the basement or out on a rural job? Keep creating invoices and estimates. BilltUp saves them on your phone and syncs as soon as you're back online.</p>
            <p>Everything is stored safely in the cloud, so a lost or broken phone never means lost records. Sign in on another phone or the web dashboard and pick up where you left off.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
