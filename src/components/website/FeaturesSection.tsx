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
  Crown,
  BarChart3,
  Palette,
  ArrowRight
} from 'lucide-react@0.468.0';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface FeaturesSectionProps {
  onNavigate?: (section: string) => void;
}

export function FeaturesSection({ onNavigate }: FeaturesSectionProps) {
  const basicFeatures = [
    {
      icon: FileText,
      title: 'Professional Invoices',
      description: 'Create beautiful, branded invoices in seconds with customizable templates and automatic calculations.',
      color: 'from-[#1E3A8A] to-[#14B8A6]'
    },
    {
      icon: CreditCard,
      title: 'Instant Payments',
      description: 'Optionally accept credit cards, debit cards, and digital payments. Enable Stripe integration to get paid faster with secure online payment processing.',
      color: 'from-[#14B8A6] to-[#F59E0B]'
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Keep track of all your customers, their payment history, and contact information in one place.',
      color: 'from-[#F59E0B] to-[#1E3A8A]'
    },
    {
      icon: Mail,
      title: 'Email Receipts',
      description: 'Automatically send professional PDF receipts to your customers via email after payment.',
      color: 'from-[#14B8A6] to-[#1E3A8A]'
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'Bank-level encryption and PCI compliance ensure your data and payments are always protected.',
      color: 'from-[#F59E0B] to-[#14B8A6]'
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Native iOS and Android apps designed for service professionals on the go. Create and send invoices anywhere, anytime.',
      color: 'from-[#1E3A8A] to-[#14B8A6]'
    },
    {
      icon: Clock,
      title: 'Lightning Fast',
      description: 'From invoice creation to payment processing, everything happens in seconds, not minutes.',
      color: 'from-[#14B8A6] to-[#F59E0B]'
    },
    {
      icon: DollarSign,
      title: 'Transparent Pricing',
      description: 'Simple subscription pricing starting at $4.99/month. Optional payment processing available at 3.5% + $0.50 per transaction.',
      color: 'from-[#F59E0B] to-[#1E3A8A]'
    },
    {
      icon: Zap,
      title: 'Refund Management',
      description: 'Process refunds instantly with full or partial refund options directly from the invoice view.',
      color: 'from-[#1E3A8A] to-[#F59E0B]'
    }
  ];

  const premiumFeatures = [
    {
      icon: TrendingUp,
      title: 'Sales Analytics & Reports',
      description: 'Track your revenue, view payment trends, and monitor your business growth with detailed analytics and customizable reports.',
      color: 'from-[#1E3A8A] to-[#F59E0B]'
    },
    {
      icon: BarChart3,
      title: 'Advanced Customer Management',
      description: 'Unlock powerful customer insights, lifetime value tracking, segmentation, and detailed customer analytics to grow your business.',
      color: 'from-[#F59E0B] to-[#1E3A8A]'
    },
    {
      icon: Palette,
      title: 'Custom Invoice Templates & Branding',
      description: 'Choose from custom invoice templates and personalize your brand color scheme. Your logo is included on all plans, but Premium unlocks advanced design customization.',
      color: 'from-[#14B8A6] to-[#1E3A8A]'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#1E3A8A]/10 rounded-full px-4 py-2 mb-4">
            <Zap className="w-4 h-4 text-[#1E3A8A]" />
            <span className="text-sm text-[#1E3A8A]">Everything you need</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Powerful Features for
            <br />
            <span className="text-[#1E3A8A]">Service Businesses</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Built specifically for auto detailers, remodelers, photographers, and other service professionals
            who need to get paid on the go.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {basicFeatures.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer border-2 hover:border-[#14B8A6]/50">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-xl mb-2 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {feature.title}
              </h3>
              
              <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Premium Features Header */}
        <div className="text-center mt-20 mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F59E0B]/10 to-[#1E3A8A]/10 rounded-full px-4 py-2 mb-4">
            <Crown className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-sm bg-gradient-to-r from-[#F59E0B] to-[#1E3A8A] bg-clip-text text-transparent">Premium Features</span>
          </div>
          
          <h3 className="text-3xl lg:text-4xl mb-3 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Unlock Advanced Capabilities
          </h3>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Upgrade to Premium for powerful analytics, advanced customer insights, and custom branding
          </p>
        </div>

        {/* Premium Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {premiumFeatures.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer border-2 border-[#F59E0B]/30 hover:border-[#F59E0B] bg-gradient-to-br from-white to-[#F59E0B]/5 relative overflow-hidden">
              {/* Premium Badge */}
              <Badge className="absolute top-4 right-4 bg-gradient-to-r from-[#F59E0B] to-[#1E3A8A] text-white border-0">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
              
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-xl mb-2 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {feature.title}
              </h3>
              
              <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <Card className="mt-16 p-8 bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] text-white text-center">
          <h3 className="text-3xl mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Ready to Streamline Your Invoicing?
          </h3>
          <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Join thousands of service professionals who are getting paid faster with BilltUp.
            Start your 14-day free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate?.('signup')}
              size="lg"
              className="bg-white !text-black hover:bg-gray-100 rounded-xl h-14 px-8 text-lg group"
            >
              Start Your Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => onNavigate?.('pricing')}
              size="lg"
              variant="outline"
              className="border-2 border-white !text-white !bg-transparent hover:bg-white/10 rounded-xl h-14 px-8 text-lg"
            >
              View Pricing
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}