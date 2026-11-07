import { Send } from 'lucide-react@0.468.0';
import '../../styles/c2-site.css';

/** Home page: "From job done to paid, in three steps" (C2, app repo BACKLOG P4.1) */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="c2 c2-blk" aria-labelledby="how-heading" style={{ scrollMarginTop: 88 }}>
      <div className="c2-wrap">
        <h2 id="how-heading" className="c2-h2">From job done to paid, in three steps</h2>
        <p className="c2-lead">Made for owner-operators and small crews who bill from the truck, not the office.</p>

        <ol className="c2-steps" style={{ listStyle: 'none', padding: 0 }}>
          <li className="c2-step">
            <div className="c2-step-top" style={{ background: 'linear-gradient(160deg,#DBEAFE,#EFF6FF)' }} aria-hidden="true">
              <div className="c2-step-ui">
                <div className="c2-row"><b>Estimate EST-0217</b><span className="c2-pill c2-paid">Approved</span></div>
                <div style={{ color: '#64748B', marginTop: 4 }}>Maple Street HOA</div>
                <div className="c2-row" style={{ marginTop: 10 }}><span>Pressure wash, 4 driveways</span><b>$1,480.00</b></div>
                <div className="c2-row" style={{ marginTop: 6 }}><span>Gutter clean-out</span><b>$700.00</b></div>
              </div>
            </div>
            <div className="c2-step-txt">
              <h3><span className="c2-num" aria-hidden="true">1</span>Send an estimate</h3>
              <p>Pick the customer, add saved items and photos. They approve or decline from the email.</p>
            </div>
          </li>

          <li className="c2-step">
            <div className="c2-step-top" style={{ background: 'linear-gradient(160deg,#CCFBF1,#F0FDFA)' }} aria-hidden="true">
              <div className="c2-step-ui">
                <div className="c2-row"><b>INV-1052</b><span className="c2-pill c2-due">Unpaid</span></div>
                <div style={{ color: '#64748B', marginTop: 4 }}>Created from EST-0217 · 1 tap</div>
                <div style={{ marginTop: 12, fontWeight: 800, fontSize: 22 }}>$2,180.00</div>
                <span className="c2-mini-btn" style={{ marginTop: 10 }}>
                  <Send className="c2-ic" style={{ width: 14, height: 14 }} />Send invoice
                </span>
              </div>
            </div>
            <div className="c2-step-txt">
              <h3><span className="c2-num" aria-hidden="true">2</span>Turn it into an invoice</h3>
              <p>Approved estimates become invoices in one tap. Totals, tax and discounts are done for you.</p>
            </div>
          </li>

          <li className="c2-step">
            <div className="c2-step-top" style={{ background: 'linear-gradient(160deg,#E0E7FF,#F5F7FF)' }} aria-hidden="true">
              <div className="c2-step-ui">
                <b>Add a tip (optional)</b>
                <div className="c2-tips">
                  <span>No tip</span><span>10%</span><span className="on">15%</span><span>20%</span>
                </div>
                <div className="c2-row" style={{ marginTop: 10, fontWeight: 800, fontSize: 15 }}><span>Total</span><span>$1,476.41</span></div>
                <span className="c2-mini-btn" style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}>Charge $1,476.41</span>
              </div>
            </div>
            <div className="c2-step-txt">
              <h3><span className="c2-num" aria-hidden="true">3</span>Get paid on the spot</h3>
              <p>Email a pay link, share a QR code, or take a card in person. Customers can add an optional tip.</p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
