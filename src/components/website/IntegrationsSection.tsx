import { Plug, Zap } from 'lucide-react@0.468.0';

export function IntegrationsSection() {
  return (
    <section className="py-20 bg-gray-50 min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[#14B8A6]/10 rounded-full px-4 py-2 mb-4">
          <Plug className="w-4 h-4 text-[#14B8A6]" />
          <span className="text-sm text-[#14B8A6]">Integrations</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Integrations
        </h1>
        
        <p className="text-xl text-gray-600 mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
          Connect BilltUp with your favorite tools.
        </p>
        
        <div className="bg-white rounded-xl p-12 shadow-lg">
          <Zap className="w-16 h-16 text-[#14B8A6] mx-auto mb-4" />
          <p className="text-gray-600">
            Integrations coming soon! We're working on connecting BilltUp with popular accounting, CRM, and productivity tools.
          </p>
        </div>
      </div>
    </section>
  );
}