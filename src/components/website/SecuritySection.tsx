import { Shield, Lock, Eye, Server, CheckCircle2 } from 'lucide-react@0.468.0';
import { Card } from '../ui/card';

export function SecuritySection() {
  const securityFeatures = [
    { icon: Lock, title: 'Bank-Level Encryption', description: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.' },
    { icon: Shield, title: 'PCI DSS Compliant', description: 'If you enable payments, we are fully PCI DSS compliant through our integration with Stripe, a certified payment processor.' },
    { icon: Server, title: 'Secure Infrastructure', description: 'Hosted on enterprise-grade servers with 99.9% uptime and automatic backups.' },
    { icon: Eye, title: 'Privacy Protection', description: 'We never sell your data and only use it to provide our services.' },
  ];

  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#1E3A8A]/10 rounded-full px-4 py-2 mb-4">
            <Shield className="w-4 h-4 text-[#1E3A8A]" />
            <span className="text-sm text-[#1E3A8A]">Security</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Your Data is Safe with Us
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            We take security seriously. Your business data and customer information are protected with industry-leading security measures.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {securityFeatures.map((feature, index) => (
            <Card key={index} className="p-6">
              <feature.icon className="w-12 h-12 text-[#1E3A8A] mb-4" />
              <h3 className="text-xl mb-2 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {feature.title}
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-blue-50 border-blue-200">
          <h2 className="text-2xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Our Security Commitments
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Regular security audits and penetration testing',
              'Automatic security updates and patches',
              'Two-factor authentication available',
              'Role-based access control',
              'Comprehensive activity logging',
              'GDPR and CCPA compliant',
              'Data retention and deletion policies',
              'Incident response plan',
            ].map((commitment, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {commitment}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Have questions about security?{' '}
            <a href="mailto:security@billtup.com" className="text-[#14B8A6] hover:underline">
              Contact our security team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}