import { Shield } from 'lucide-react@0.468.0';

export function PrivacySection() {
  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#1E3A8A]/10 rounded-full px-4 py-2 mb-4">
            <Shield className="w-4 h-4 text-[#1E3A8A]" />
            <span className="text-sm text-[#1E3A8A]">Privacy Policy</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Privacy Policy
          </h1>
          
          <p className="text-gray-600">Last updated: November 2024</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          <h2 className="text-2xl text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>1. Information We Collect</h2>
          <p className="text-gray-700">
            We collect information you provide directly to us, such as when you create an account, use our services, or communicate with us. 
            This includes your name, email address, business information, and payment information.
          </p>

          <h2 className="text-2xl text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>2. How We Use Your Information</h2>
          <p className="text-gray-700">
            We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, 
            and respond to your comments and questions.
          </p>

          <h2 className="text-2xl text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>3. Information Sharing</h2>
          <p className="text-gray-700">
            We do not share your personal information with third parties except as described in this policy. We may share information with service providers 
            who perform services on our behalf, such as payment processing (Stripe or Square, only if you enable online payments), email delivery, and hosting services.
          </p>

          <h2 className="text-2xl text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>4. Data Security</h2>
          <p className="text-gray-700">
            We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
            All data is encrypted in transit and at rest.
          </p>

          <h2 className="text-2xl text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>5. Your Rights</h2>
          <p className="text-gray-700">
            You have the right to access, update, or delete your personal information at any time. You can do this through your account settings 
            or by contacting us at privacy@billtup.com.
          </p>

          <h2 className="text-2xl text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>6. Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy, please contact us at privacy@billtup.com.
          </p>
        </div>
      </div>
    </section>
  );
}