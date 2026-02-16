import { Building2, Users, Target, Heart, Zap, Shield, Globe, TrendingUp, Award, CheckCircle2, Lightbulb, Clock, DollarSign } from 'lucide-react@0.468.0';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { SectionType } from '../../App';

interface AboutSectionProps {
  onNavigate?: (section: SectionType) => void;
}

export function AboutSection({ onNavigate }: AboutSectionProps) {
  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#1E3A8A]/10 rounded-full px-4 py-2 mb-4">
            <Building2 className="w-4 h-4 text-[#1E3A8A]" />
            <span className="text-sm text-[#1E3A8A]">About Us</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Making Invoicing Simple for Everyone
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            BilltUp was founded with a simple mission: to help service businesses get paid faster with professional, easy-to-use invoicing tools that work anywhere.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          <Card className="p-6 text-center bg-gradient-to-br from-[#14B8A6]/5 to-white border-[#14B8A6]/20">
            <Users className="w-12 h-12 text-[#14B8A6] mx-auto mb-4" />
            <h3 className="text-3xl mb-2 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>10,000+</h3>
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>Active Users</p>
          </Card>

          <Card className="p-6 text-center bg-gradient-to-br from-[#1E3A8A]/5 to-white border-[#1E3A8A]/20">
            <DollarSign className="w-12 h-12 text-[#1E3A8A] mx-auto mb-4" />
            <h3 className="text-3xl mb-2 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>$5M+</h3>
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>Processed Monthly</p>
          </Card>

          <Card className="p-6 text-center bg-gradient-to-br from-[#F59E0B]/5 to-white border-[#F59E0B]/20">
            <Heart className="w-12 h-12 text-[#F59E0B] mx-auto mb-4" />
            <h3 className="text-3xl mb-2 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>4.9★</h3>
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>User Rating</p>
          </Card>

          <Card className="p-6 text-center bg-gradient-to-br from-purple-500/5 to-white border-purple-500/20">
            <Globe className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-3xl mb-2 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>50+</h3>
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>Countries Served</p>
          </Card>
        </div>

        {/* Our Story */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#1E3A8A]">Our Story</Badge>
            <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Built by Service Professionals, for Service Professionals
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                BilltUp was born from a real need. I built it because a family member with a small business was struggling with invoicing apps that were either poorly designed or overwhelming with too many options.
              </p>
              
              <p className="text-gray-700 text-lg leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Most invoicing software felt inelegant—cluttered interfaces, confusing workflows, and features buried under endless menus. Small business owners don't need complexity; they need simplicity and speed.
              </p>

              <p className="text-gray-700 text-lg leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                So I built BilltUp—a mobile-first invoicing platform that works beautifully on your phone, tablet, or computer. Clean design, focused features, and an interface that gets out of your way so you can focus on your business.
              </p>
            </div>

            <Card className="p-8 bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] text-white">
              <Lightbulb className="w-16 h-16 mb-6" />
              <h3 className="text-2xl mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Designed with Real Users
              </h3>
              <p className="text-white/90 text-lg mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                We didn't just build what we thought people needed—we talked to hundreds of service professionals to understand their daily challenges and pain points.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>200+ user interviews conducted</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>Every feature tested with real businesses</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>Continuous updates based on feedback</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Separator className="my-20" />

        {/* Our Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#14B8A6]">Our Values</Badge>
            <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              What Drives Us Every Day
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
              Our core principles guide every decision we make and every feature we build
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 border-2 hover:border-[#1E3A8A]/50 transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-[#1E3A8A] rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Simplicity First
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                We believe software should be intuitive, not intimidating. Every feature is designed to be understood in seconds, not hours.
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-[#14B8A6]/50 transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-[#14B8A6] rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Security Always
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Your data and your customers' payment information deserve bank-level security. We're PCI compliant and use end-to-end encryption.
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-[#F59E0B]/50 transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-[#F59E0B] rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Customer Obsessed
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                We're not just building software; we're building relationships. Your feedback directly shapes our roadmap.
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-purple-500/50 transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Affordable Pricing
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Quality tools shouldn't break the bank. We price our platform so any business—from freelancers to small teams—can afford it.
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-blue-500/50 transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <Lightbulb className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Innovation Minded
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                We're constantly exploring new technologies and approaches to make invoicing faster, smarter, and more efficient.
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-green-500/50 transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Quality Standards
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                We sweat the details. Every pixel, every interaction, every error message is crafted to provide the best experience.
              </p>
            </Card>
          </div>
        </div>

        <Separator className="my-20" />

        {/* Why Choose BilltUp */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#F59E0B]">Why BilltUp?</Badge>
            <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              What Makes Us Different
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <h3 className="text-2xl mb-6 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Traditional Invoicing Software
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Complex setup requiring hours of configuration</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Desktop-only or poorly designed mobile apps</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Expensive monthly fees ($30-$100+)</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Overwhelming features you'll never use</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Separate payment processing setup</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] text-white border-0">
              <h3 className="text-2xl mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                The BilltUp Way
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className="text-green-300 mt-1">✓</span>
                  <span>Start invoicing in under 2 minutes</span>
                </li>
                <li className="flex items-start gap-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className="text-green-300 mt-1">✓</span>
                  <span>Works beautifully on any device—phone, tablet, computer</span>
                </li>
                <li className="flex items-start gap-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className="text-green-300 mt-1">✓</span>
                  <span>Affordable plans starting at $4.99/month</span>
                </li>
                <li className="flex items-start gap-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className="text-green-300 mt-1">✓</span>
                  <span>Only the essentials—no bloat, no confusion</span>
                </li>
                <li className="flex items-start gap-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className="text-green-300 mt-1">✓</span>
                  <span>Built-in Stripe & Square payments—accept cards instantly</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        <Separator className="my-20" />

        {/* Who We Serve */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-500">Who We Serve</Badge>
            <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Built for Service Businesses of All Kinds
            </h2>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              'Freelancers',
              'Consultants',
              'Contractors',
              'Designers',
              'Developers',
              'Photographers',
              'Writers',
              'Coaches',
              'Trainers',
              'Plumbers',
              'Electricians',
              'Landscapers',
              'Event Planners',
              'Marketing Agencies',
              'Virtual Assistants',
              'Bookkeepers',
            ].map((industry, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-[#14B8A6] hover:shadow-md transition-all text-center"
              >
                <p className="text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {industry}
                </p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 mt-8 text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
            If you provide services and need to send invoices, BilltUp is for you.
          </p>
        </div>

        {/* CTA Section */}
        <Card className="p-12 bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] text-white text-center">
          <Target className="w-20 h-20 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl lg:text-4xl mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Join Thousands of Happy Users
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Start creating professional invoices and getting paid faster today. No credit card required to get started.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => onNavigate?.('signup')}
              className="px-8 py-4 bg-white text-[#1E3A8A] rounded-lg hover:bg-gray-100 transition-colors text-lg cursor-pointer"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Get Started Free
            </button>
            <button
              onClick={() => onNavigate?.('pricing')}
              className="px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-lg hover:bg-white/20 transition-colors text-lg cursor-pointer"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              View Pricing
            </button>
          </div>
        </Card>
      </div>
    </section>
  );
}