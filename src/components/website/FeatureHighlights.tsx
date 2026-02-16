import {
  FileText,
  CreditCard,
  Users,
  TrendingUp,
  Mail,
  Shield,
  Smartphone,
  Clock,
  DollarSign,
  Zap,
  ArrowRight
} from 'lucide-react@0.468.0';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface FeatureHighlightsProps {
  onNavigate?: (section: string) => void;
}

export function FeatureHighlights({ onNavigate }: FeatureHighlightsProps) {
  const highlights = [
    {
      icon: FileText,
      title: 'Create Invoices in Seconds',
      description: 'Professional, branded invoices with automatic calculations and customizable templates.',
      color: 'from-[#1E3A8A] to-[#14B8A6]'
    },
    {
      icon: CreditCard,
      title: 'Optional Payment Processing',
      description: 'Connect Stripe or Square to accept cards and get paid instantly, or keep it simple with invoice-only mode.',
      color: 'from-[#14B8A6] to-[#F59E0B]'
    },
    {
      icon: Smartphone,
      title: 'Work From Anywhere',
      description: 'Native mobile apps for iOS and Android, plus web dashboard access for complete flexibility.',
      color: 'from-[#F59E0B] to-[#1E3A8A]'
    },
    {
      icon: Users,
      title: 'Smart Customer Management',
      description: 'Track payment history, contact info, and customer relationships all in one place.',
      color: 'from-[#14B8A6] to-[#1E3A8A]'
    },
    {
      icon: TrendingUp,
      title: 'Business Analytics',
      description: 'Monitor revenue, track trends, and get insights to grow your business (Premium feature).',
      color: 'from-[#F59E0B] to-[#14B8A6]'
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'PCI DSS compliant with end-to-end encryption. Your data and payments are always protected.',
      color: 'from-[#1E3A8A] to-[#F59E0B]'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#14B8A6]/10 rounded-full px-4 py-2 mb-4">
            <Zap className="w-4 h-4 text-[#14B8A6]" />
            <span className="text-sm text-[#14B8A6]">Why BilltUp?</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Everything You Need to
            <br />
            <span className="text-[#1E3A8A]">Invoice & Get Paid</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Built for service professionals who need powerful invoicing without the complexity
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {highlights.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-[#14B8A6]/30">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-lg mb-2 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {feature.title}
              </h3>
              
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* CTA to Full Features */}
        <div className="text-center">
          <Button
            onClick={() => onNavigate?.('features')}
            variant="outline"
            size="lg"
            className="border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white rounded-xl h-12 px-8 group"
          >
            Explore All Features
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}