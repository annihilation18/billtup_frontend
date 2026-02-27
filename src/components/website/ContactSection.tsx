import { MessageCircle } from 'lucide-react@0.468.0';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { API_BASE_URL } from '../../utils/auth/config';

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/billtup-api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#14B8A6]/10 rounded-full px-4 py-2 mb-4">
            <MessageCircle className="w-4 h-4 text-[#14B8A6]" />
            <span className="text-sm text-[#14B8A6]">Contact Us</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Get in Touch
          </h1>
          
          <p className="text-xl text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Have a question? We'd love to hear from you
          </p>
        </div>

        <div>
          <h2 className="text-2xl mb-6 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Send us a message
          </h2>
          
          <Card className="p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="contact-name">Name</Label>
                <Input 
                  id="contact-name" 
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact-email">Email</Label>
                <Input 
                  id="contact-email" 
                  type="email" 
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact-subject">Subject</Label>
                <Input 
                  id="contact-subject" 
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact-message">Message</Label>
                <Textarea 
                  id="contact-message" 
                  placeholder="Tell us more..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Or email us directly at
            </p>
            <a 
              href="mailto:support@billtup.com" 
              className="text-[#14B8A6] hover:underline text-lg"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              support@billtup.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}