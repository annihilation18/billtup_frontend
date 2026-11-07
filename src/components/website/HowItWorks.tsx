import { Banknote, Pencil, Send } from 'lucide-react@0.468.0';

const STEPS = [
  { icon: Pencil, title: 'Create', text: 'Invoices and estimates in under a minute, with your logo, saved items and photos.' },
  { icon: Send, title: 'Send', text: 'Email it, share a QR code, or take payment in person on the spot.' },
  { icon: Banknote, title: 'Get paid', text: 'Card, Apple Pay or Google Pay. Customers can add an optional tip.' },
];

/** Home page: three round icons, Create / Send / Get paid (C3, app repo BACKLOG P4.1) */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="bt" aria-label="How BilltUp works">
      <div className="bt-wrap">
        <ol className="bt-three">
          {STEPS.map((s) => (
            <li key={s.title} className="bt-tri">
              <div className="bt-circ" aria-hidden="true">
                <s.icon className="bt-ic" style={{ width: 34, height: 34 }} strokeWidth={2} />
              </div>
              <div>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
