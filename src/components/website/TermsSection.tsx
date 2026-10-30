import { FileText, Scale } from 'lucide-react@0.468.0';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';

export function TermsSection() {
  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#14B8A6]/10 rounded-full px-4 py-2 mb-4">
            <FileText className="w-4 h-4 text-[#14B8A6]" />
            <span className="text-sm text-[#14B8A6]">Legal</span>
          </div>

          <h1 className="text-4xl lg:text-5xl mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Terms of Service
          </h1>

          <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Last updated: October 29, 2026
          </p>
        </div>

        <Card className="p-8 mb-8 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-4">
            <Scale className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg mb-2 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Important Notice
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Please read these Terms of Service carefully before using BilltUp. By accessing or using our service, you agree to be bound by these terms. If you disagree with any part of these terms, you may not access the service.
              </p>
            </div>
          </div>
        </Card>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8" style={{ fontFamily: 'Inter, sans-serif' }}>
          {/* 1. Agreement to Terms */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              1. Agreement to Terms
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and Omniforge Technologies LLC, an Arizona limited liability company doing business as BilltUp ("Company," "we," "us," or "our"), governing your access to and use of the BilltUp platform, including our website (billtup.com), our mobile applications for Android and iOS, and related services (collectively, the "Service"). The Service allows you to create and send invoices and estimates, collect payments via integrated payment processors, generate payment links and QR codes, manage customer information, and view business analytics and reports.
              </p>
              <p>
                By creating an account, accessing, or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the Service.
              </p>
            </div>
          </section>

          <Separator />

          {/* 2. Eligibility */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              2. Eligibility
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                You must be at least 18 years old and capable of forming a binding contract to use the Service. By using the Service, you represent and warrant that you meet these eligibility requirements.
              </p>
              <p>
                If you are using the Service on behalf of a business or entity, you represent that you have the authority to bind that business or entity to these Terms.
              </p>
            </div>
          </section>

          <Separator />

          {/* 3. Account Registration and Security */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              3. Account Registration and Security
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                To access certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account credentials</li>
                <li>Immediately notify us of any unauthorized access or security breach</li>
                <li>Accept responsibility for all activities that occur under your account</li>
              </ul>
              <p>
                You may not share your account credentials with others or allow others to access your account. We reserve the right to suspend or terminate accounts that violate these security requirements.
              </p>
            </div>
          </section>

          <Separator />

          {/* 4. Subscription Plans, Billing and Cancellation */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              4. Subscription Plans, Billing and Cancellation
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                After the free trial described in Section 6, continued use of the Service to create and edit content requires a paid subscription. BilltUp offers the following monthly plans:
              </p>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Basic Plan: $4.99/month</p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Up to 10 invoices per billing period</li>
                  <li>Up to 10 estimates per billing period</li>
                  <li>Up to 10 customers</li>
                  <li>Email support</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Premium Plan: $9.99/month</p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Unlimited invoices, estimates and customers</li>
                  <li>Advanced customer management and reporting</li>
                  <li>Priority support</li>
                </ul>
              </div>

              <p className="pt-2">
                Prices are in U.S. dollars and do not include any sales or similar taxes, which are added where required by law. Current plan features are described on our pricing page and in the app.
              </p>

              <h3 className="font-semibold text-gray-900">4.1 How you are billed</h3>
              <p>
                You can subscribe in one of two ways. The way you subscribe determines who bills you and how you cancel:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>By card (Android app and website):</strong> we bill you through our payment processor, Stripe. Your subscription renews automatically each month, and you authorize us to charge your payment method monthly in advance until you cancel. If you subscribe during your free trial, the first charge is made when the trial ends.
                </li>
                <li>
                  <strong>Through the Apple App Store (iPhone and iPad):</strong> Apple bills you through your Apple Account. Payment is charged to your Apple Account when you confirm the purchase. The subscription renews automatically each month unless automatic renewal is turned off at least 24 hours before the end of the current period, and your account is charged for the renewal within the 24 hours before the current period ends. Apple's terms and refund policies apply to these purchases, and refunds can only be requested from Apple.
                </li>
              </ul>

              <h3 className="font-semibold text-gray-900">4.2 Cancelling</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Card subscriptions:</strong> cancel at any time on the subscription plans screen in the app (Settings → Subscription Plans) or in your account settings on our website.</li>
                <li><strong>App Store subscriptions:</strong> cancel in your Apple Account settings (Settings → your name → Subscriptions on iPhone or iPad). Deleting the app or your BilltUp account does not cancel an App Store subscription.</li>
              </ul>
              <p>
                When you cancel, your subscription stays active until the end of the period you have already paid for. After that, your account becomes read-only as described in Section 6 until you subscribe again. Deleting your account is different from cancelling; see Section 16.
              </p>

              <h3 className="font-semibold text-gray-900">4.3 Refunds, plan changes and price changes</h3>
              <p>
                Subscription fees are non-refundable except as required by law or as expressly stated in these Terms. If you change plans, the change takes effect as shown to you at the time of the change.
              </p>
              <p>
                We may change our prices with at least 30 days' advance notice. A price change applies from your next billing period after the notice period. If you do not agree to a new price, you may cancel before it takes effect. For App Store subscriptions, Apple's rules for price changes also apply.
              </p>
            </div>
          </section>

          <Separator />

          {/* 5. Transaction Fees */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              5. Transaction Fees (Payment Processing)
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Accepting payments through the Service is optional. You may use BilltUp for invoicing without enabling payment processing. To accept payments, you connect your own Stripe or Square account (see Section 11).
              </p>

              <p>
                When your customer pays an invoice online, a processing fee is added to the amount your customer pays, so that you receive the invoice amount. The processing fee covers the payment processor's fee and a BilltUp platform fee, and is shown to your customer before they pay. Fee rates vary by payment method and processor; current rates are shown in the app and on our pricing page. You are responsible for telling your customers about the processing fee where the law requires it.
              </p>

              <p>
                Processing fees are non-refundable, even if you later issue a refund to your customer.
              </p>

              <p>
                Disputed payments or chargebacks may result in additional fees as determined by your payment processor's terms of service. You are responsible for all chargeback fees and any negative balance in your payment processor account.
              </p>
            </div>
          </section>

          <Separator />

          {/* 6. Free Trial Period */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              6. Free Trial and Read-Only Accounts
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                New users receive a 14-day free trial with full access to all Premium features. No payment method is required to start the trial.
              </p>
              <p>
                To continue creating and editing invoices, estimates, customers and settings after the trial, you must subscribe to a paid plan. If you subscribe during the trial, billing begins when the trial ends (subscriptions purchased through the Apple App Store begin billing at purchase). If you do not subscribe, or if your paid subscription ends, your account becomes read-only: you can still view your existing data, send existing invoices and receive payments, but you cannot create or change content until you subscribe.
              </p>
              <p>
                The free trial is available once per person. If you delete your account and create a new one with the same email address, the new account starts without a trial. We reserve the right to limit or deny free trials to prevent abuse of the offer.
              </p>
            </div>
          </section>

          <Separator />

          {/* 7. Permitted Use */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              7. Permitted Use of Service
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Violate any laws, regulations, or third-party rights</li>
                <li>Transmit any viruses, malware, or malicious code</li>
                <li>Attempt to gain unauthorized access to the Service or related systems</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use automated systems (bots, scripts) to access the Service without permission</li>
                <li>Impersonate another person or entity</li>
                <li>Collect or harvest information about other users</li>
                <li>Use the Service to send spam or unsolicited communications</li>
                <li>Engage in fraudulent activities or money laundering</li>
                <li>Process payments for illegal goods or services</li>
              </ul>
            </div>
          </section>

          <Separator />

          {/* 8. Intellectual Property Rights */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              8. Intellectual Property Rights
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                The Service and its entire contents, features, and functionality (including but not limited to all information, software, code, text, displays, graphics, photographs, video, audio, design, presentation, selection, and arrangement) are owned by BilltUp and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p>
                You retain all rights to the content you create using the Service (invoices, customer data, business information). By using the Service, you grant us a limited license to host, store, and process your content solely for the purpose of providing the Service to you.
              </p>
              <p>
                You may not reproduce, distribute, modify, create derivative works of, publicly display, republish, download, store, or transmit any material from our Service, except as necessary to use the Service for its intended purpose.
              </p>
            </div>
          </section>

          <Separator />

          {/* 9. Data and Privacy */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              9. Data and Privacy
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Your privacy is important to us. Our collection and use of personal information is described in our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your customers' information and for complying with all applicable data protection laws. You must obtain all necessary consents from your customers before collecting, storing, or processing their information using our Service.
              </p>
              <p>
                We implement industry-standard security measures to protect your data, including encryption in transit and at rest. Card details are handled by PCI-compliant payment processors and are never stored by BilltUp. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>
          </section>

          <Separator />

          {/* 10. App Stores */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              10. Apps from the Apple App Store and Google Play
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                If you download BilltUp from the Google Play Store, Google Play's terms of service also apply to your download and use of the app.
              </p>
              <p>
                If you download BilltUp from the Apple App Store, the following also applies:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>These Terms are between you and us only, not with Apple Inc. ("Apple"). We, not Apple, are solely responsible for the app and its content.</li>
                <li>Your license to use the app is a non-transferable license to use it on Apple-branded products that you own or control, as permitted by the Usage Rules in the Apple Media Services Terms and Conditions.</li>
                <li>We, not Apple, are solely responsible for providing maintenance and support for the app. Apple has no obligation to provide any maintenance or support services for the app.</li>
                <li>If the app fails to conform to any applicable warranty, you may notify Apple, and Apple will refund the purchase price of the app (if any) to you. To the maximum extent permitted by law, Apple has no other warranty obligation with respect to the app, and any other claims, losses, liabilities, damages, costs or expenses attributable to any failure to conform to a warranty are our responsibility, to the extent not disclaimed in these Terms.</li>
                <li>We, not Apple, are responsible for addressing any claims by you or any third party relating to the app or your possession or use of it, including product liability claims, claims that the app fails to meet any legal or regulatory requirement, and claims under consumer protection, privacy or similar laws.</li>
                <li>If a third party claims that the app or your possession or use of it infringes their intellectual property rights, we, not Apple, are solely responsible for the investigation, defense, settlement and discharge of that claim.</li>
                <li>You represent that you are not located in a country subject to a U.S. Government embargo or designated by the U.S. Government as a "terrorist supporting" country, and that you are not listed on any U.S. Government list of prohibited or restricted parties.</li>
                <li>You must comply with any applicable third-party terms when using the app, such as your wireless data service agreement.</li>
                <li>Apple and its subsidiaries are third-party beneficiaries of these Terms. Once you accept these Terms, Apple has the right (and is deemed to have accepted the right) to enforce them against you as a third-party beneficiary.</li>
              </ul>
              <p>
                Questions, complaints or claims about the app should be directed to us using the contact details in Section 22.
              </p>
            </div>
          </section>

          <Separator />

          {/* 11. Third-Party Services */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              11. Third-Party Services
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                The Service integrates with third-party services, including Stripe and Square for payment processing and Apple for App Store subscriptions. Your use of these third-party services is subject to their respective terms of service and privacy policies.
              </p>
              <p>
                We are not responsible for the actions, content, or policies of third-party services. You agree that BilltUp shall not be liable for any damages or losses caused by your use of any third-party services.
              </p>
              <p>
                To use payment processing features, you must create an account with your chosen payment processor (Stripe or Square) and agree to their terms of service. You authorize us to share necessary information with your payment processor to facilitate payment processing.
              </p>
            </div>
          </section>

          <Separator />

          {/* 12. Service Availability */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              12. Service Availability and Modifications
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                We strive to provide reliable and uninterrupted service, but we do not guarantee that the Service will be available at all times or will be error-free. The Service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control.
              </p>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice. We may require you to update the app to keep using the Service, for example when an older version can no longer work with the Service. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.
              </p>
            </div>
          </section>

          <Separator />

          {/* 13. Limitation of Liability */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              13. Limitation of Liability
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p className="font-semibold uppercase">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:
              </p>
              <p>
                IN NO EVENT SHALL BILLTUP, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your access to or use of (or inability to access or use) the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Unauthorized access, use, or alteration of your content</li>
                <li>Any interruption or cessation of the Service</li>
                <li>Any bugs, viruses, or harmful code transmitted through the Service</li>
                <li>Any errors or omissions in any content</li>
                <li>Any loss or damage of any kind incurred as a result of your use of the Service</li>
              </ul>
              <p>
                WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), PRODUCT LIABILITY, OR ANY OTHER LEGAL THEORY, AND WHETHER OR NOT BILLTUP HAS BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE.
              </p>
              <p>
                OUR TOTAL AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE GREATER OF: (A) THE AMOUNT YOU PAID TO BILLTUP IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) $100.
              </p>
            </div>
          </section>

          <Separator />

          {/* 14. Disclaimer of Warranties */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              14. Disclaimer of Warranties
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
              </p>
              <p>
                WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICE OR THE SERVERS THAT MAKE IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
              </p>
              <p>
                YOU ASSUME ALL RISK FOR ANY DAMAGE THAT MAY RESULT FROM YOUR USE OF OR ACCESS TO THE SERVICE.
              </p>
            </div>
          </section>

          <Separator />

          {/* 15. Indemnification */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              15. Indemnification
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                You agree to defend, indemnify, and hold harmless BilltUp and its officers, directors, employees, agents, affiliates, and partners from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including but not limited to attorney's fees) arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use of and access to the Service</li>
                <li>Your violation of any term of these Terms</li>
                <li>Your violation of any third-party right, including intellectual property, privacy, or other proprietary rights</li>
                <li>Any claim that your content caused damage to a third party</li>
                <li>Your business practices or interactions with your customers</li>
              </ul>
            </div>
          </section>

          <Separator />

          {/* 16. Account Deletion and Termination */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              16. Account Deletion and Termination
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                You may delete your account at any time in the app's Settings or in your account settings on our website. Deleting your account:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cancels any card subscription immediately, without a refund for the rest of the current period</li>
                <li>Disconnects your Stripe or Square account from BilltUp</li>
                <li>Permanently deletes your business profile, customers, invoices, estimates, saved items, photos and documents. Deleted data cannot be recovered, so if you need a copy of your data, ask us for one at privacy@billtup.com before deleting</li>
                <li>Does not cancel an App Store subscription; cancel it with Apple as described in Section 4.2</li>
              </ul>
              <p>
                We keep a minimal record of a deleted account (the email address and whether the free trial was used) to apply the one-trial rule in Section 6, as described in our Privacy Policy.
              </p>
              <p>
                If your paid subscription ends and you do not subscribe again, we may permanently delete your account and its data one year after the subscription ended.
              </p>
              <p>
                We reserve the right to suspend or terminate your account and access to the Service immediately, without prior notice or liability, for any reason, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Breach of these Terms</li>
                <li>Fraudulent, abusive, or illegal activity</li>
                <li>Non-payment of fees</li>
                <li>Violation of applicable laws or regulations</li>
              </ul>
              <p>
                Upon termination, your right to use the Service will immediately cease. Provisions that by their nature should survive termination (including but not limited to limitation of liability, indemnification, and dispute resolution) shall survive termination of these Terms.
              </p>
            </div>
          </section>

          <Separator />

          {/* 17. Dispute Resolution */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              17. Dispute Resolution and Arbitration
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Please contact us first if you have any concerns. We'll do our best to resolve the issue. If we're unable to resolve your dispute through informal means, you agree to resolve any claims relating to these Terms or the Service through binding arbitration, except that either party may take claims to small claims court if they qualify.
              </p>
              <p>
                Any arbitration will be conducted by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. The arbitration will be held in the State of Arizona, or by video conference if both parties agree, and judgment on the arbitration award may be entered in any court having jurisdiction.
              </p>
              <p>
                You agree to waive your right to a jury trial and to participate in any class action lawsuits or class-wide arbitration. Each party may bring claims against the other only in an individual capacity.
              </p>
            </div>
          </section>

          <Separator />

          {/* 18. Governing Law */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              18. Governing Law
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of Arizona and applicable federal law of the United States, without regard to its conflict of law provisions.
              </p>
            </div>
          </section>

          <Separator />

          {/* 19. Changes to Terms */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              19. Changes to Terms
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                We reserve the right to modify or replace these Terms at any time at our sole discretion. If we make material changes, we will provide notice by posting the updated Terms on this page and updating the "Last Updated" date.
              </p>
              <p>
                For significant changes, we will provide at least 30 days' notice before the new terms take effect. Your continued use of the Service after the effective date of any changes constitutes acceptance of those changes.
              </p>
              <p>
                We encourage you to review these Terms periodically to stay informed of any updates.
              </p>
            </div>
          </section>

          <Separator />

          {/* 20. Severability */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              20. Severability
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law, and the remaining provisions will continue in full force and effect.
              </p>
            </div>
          </section>

          <Separator />

          {/* 21. Entire Agreement */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              21. Entire Agreement
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                These Terms, together with our Privacy Policy and any other legal notices published by us on the Service, constitute the entire agreement between you and BilltUp concerning the Service and supersede all prior agreements and understandings, whether written or oral.
              </p>
            </div>
          </section>

          <Separator />

          {/* 22. Contact Information */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              22. Contact Information
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Omniforge Technologies LLC (DBA BilltUp)</p>
                <p>Email: legal@billtup.com</p>
                <p>Email (General Support): support@billtup.com</p>
              </div>
            </div>
          </section>
        </div>

        <Card className="mt-8 p-6 bg-gray-100 border-gray-300">
          <p className="text-sm text-gray-600 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
            By creating an account or using BilltUp, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </Card>
      </div>
    </section>
  );
}
