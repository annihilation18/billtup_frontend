import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, AlertCircle, Briefcase } from 'lucide-react@0.468.0';
import { Card } from '../ui/card';
import { STORE_LINKS, TRADES, type TradeContent } from '../../data/trades';

interface TradePageProps {
  trade: TradeContent;
}

/**
 * "Invoice app for <trade>" landing page (app repo BACKLOG M.6). Content lives in
 * src/data/trades.ts. Uses only classes present in the pre-built src/index.css.
 */
export function TradePage({ trade }: TradePageProps) {
  const others = TRADES.filter((t) => t.slug !== trade.slug);

  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#1E3A8A]/10 rounded-full px-4 py-2 mb-4">
            <Briefcase className="w-4 h-4 text-[#1E3A8A]" />
            <span className="text-sm text-[#1E3A8A]">BilltUp for {trade.name}</span>
          </div>
          <h1 className="text-4xl lg:text-5xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {trade.headline}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
            {trade.intro}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl h-14 px-8 text-lg transition-colors"
            >
              Start your free trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={STORE_LINKS.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-gray-300 hover:bg-gray-100 rounded-xl h-14 px-6 text-gray-900 transition-colors"
            >
              Download on the App Store
            </a>
            <a
              href={STORE_LINKS.googlePlay}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-gray-300 hover:bg-gray-100 rounded-xl h-14 px-6 text-gray-900 transition-colors"
            >
              Get it on Google Play
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            14-day free trial of every feature. No card needed.
          </p>
        </div>

        {/* Pain points */}
        <div className="mb-16">
          <h2 className="text-3xl mb-8 text-gray-900 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Sound familiar?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {trade.painPoints.map((p) => (
              <Card key={p.title} className="p-6">
                <AlertCircle className="w-8 h-8 text-[#F59E0B] mb-3" />
                <h3 className="text-xl mb-2 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>{p.title}</h3>
                <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>{p.text}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl mb-8 text-gray-900 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
            How BilltUp helps {trade.name.toLowerCase()}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {trade.features.map((f) => (
              <Card key={f.title} className="p-6">
                <CheckCircle2 className="w-8 h-8 text-[#14B8A6] mb-3" />
                <h3 className="text-xl mb-2 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>{f.title}</h3>
                <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>{f.text}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* A typical job + example line items */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="p-8 bg-blue-50 border-blue-200">
            <h2 className="text-2xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              A typical job with BilltUp
            </h2>
            <ol className="space-y-3">
              {trade.workflow.map((step, i) => (
                <li key={step} className="flex items-start gap-3 text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className="w-6 h-6 rounded-full bg-[#1E3A8A] text-white text-sm flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </Card>
          <Card className="p-8">
            <h2 className="text-2xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Line items you can save
            </h2>
            <ul className="space-y-2">
              {trade.lineItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-500 mt-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Saved items fill in as you type, with tax and discounts worked out for you.
            </p>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-3xl mb-8 text-gray-900 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Questions from {trade.name.toLowerCase()}
          </h2>
          <div className="space-y-4">
            {trade.faqs.map((f) => (
              <Card key={f.q} className="p-6">
                <h3 className="text-lg mb-2 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>{f.q}</h3>
                <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>{f.a}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Closing call to action */}
        <Card className="p-8 bg-blue-50 border-blue-200 text-center mb-12">
          <h2 className="text-2xl mb-2 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Send your next invoice from the job
          </h2>
          <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            Try every feature free for 14 days. Then $4.99 or $9.99 a month. <Link to="/pricing" className="text-[#14B8A6] hover:underline">See pricing</Link>
          </p>
          {/* Wrapped: Card is a flex column, which would stretch the button full width */}
          <div>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl h-14 px-8 text-lg transition-colors"
            >
              Start your free trial
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </Card>

        {/* Links to the other trade pages */}
        <nav className="text-center" aria-label="BilltUp for other businesses">
          <p className="text-sm text-gray-500 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>BilltUp is also built for</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {others.map((t) => (
              <Link key={t.slug} to={`/invoice-app-for-${t.slug}`} className="text-[#14B8A6] hover:underline">
                {t.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </section>
  );
}
