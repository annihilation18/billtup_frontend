import { HelpCircle, BookOpen, MessageCircle, Mail } from 'lucide-react@0.468.0';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import type { SectionType } from '../../App';

interface HelpCenterSectionProps {
  onNavigate?: (section: SectionType) => void;
}

export function HelpCenterSection({ onNavigate }: HelpCenterSectionProps) {
  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#14B8A6]/10 rounded-full px-4 py-2 mb-4">
            <HelpCircle className="w-4 h-4 text-[#14B8A6]" />
            <span className="text-sm text-[#14B8A6]">Help Center</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            How Can We Help?
          </h1>
          
          <p className="text-xl text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Find answers, get support, and learn how to use BilltUp
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onNavigate?.('docs')}
          >
            <BookOpen className="w-12 h-12 text-[#1E3A8A] mb-4" />
            <h3 className="text-xl mb-2 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Documentation
            </h3>
            <p className="text-gray-600 text-sm">
              Comprehensive guides and tutorials to help you get started
            </p>
          </Card>

          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onNavigate?.('faq')}
          >
            <HelpCircle className="w-12 h-12 text-[#F59E0B] mb-4" />
            <h3 className="text-xl mb-2 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              FAQ
            </h3>
            <p className="text-gray-600 text-sm">
              Quick answers to frequently asked questions
            </p>
          </Card>
        </div>

        <Card className="p-8 bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] text-white text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Still Need Help?
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Our support team is here to help. Send us an email and we'll get back to you within 24 hours.
          </p>
          <Button 
            className="bg-white !text-black hover:bg-gray-100"
            onClick={() => onNavigate?.('contact')}
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </Card>
      </div>
    </section>
  );
}