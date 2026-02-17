import { useState, useEffect } from 'react';
import { DashboardSection } from './components/dashboard/DashboardSection';
import { WebsiteHeader } from './components/website/WebsiteHeader';
import { HeroSection } from './components/website/HeroSection';
import { FeaturesSection } from './components/website/FeaturesSection';
import { FeatureHighlights } from './components/website/FeatureHighlights';
import { PricingSection } from './components/website/PricingSection';
import { PricingPreview } from './components/website/PricingPreview';
import { WebsiteFooter } from './components/website/WebsiteFooter';
import { DocumentationSectionNew } from './components/website/DocumentationSectionNew';
import { FAQSection } from './components/website/FAQSection';
import { SignUpSection } from './components/website/SignUpSection';
import { SignInSection } from './components/website/SignInSection';
import { IntegrationsSection } from './components/website/IntegrationsSection';
import { AboutSection } from './components/website/AboutSection';
import { ContactSection } from './components/website/ContactSection';
import { PrivacySection } from './components/website/PrivacySection';
import { TermsSection } from './components/website/TermsSection';
import { SecuritySection } from './components/website/SecuritySection';
import { RoadmapSection } from './components/website/RoadmapSection';
import { ChangelogSection } from './components/website/ChangelogSection';
import { HelpCenterSection } from './components/website/HelpCenterSection';
import { MobileAppSection } from './components/website/MobileAppSection';
import { BilltUpLogoExport } from './components/BilltUpLogoExport';
import ResetPassword from './reset-password';
import { Toaster } from './components/ui/sonner';
import { getSession, signOut as cognitoSignOut, getUserId, getUserEmail } from './utils/auth/cognito';
import { API_CONFIG } from './utils/config';
import { setErrorUser, clearErrorUser } from './utils/errorReporter';
import { sessionTimeout } from './utils/sessionTimeout';

export type SectionType = 
  | 'home' 
  | 'features' 
  | 'pricing' 
  | 'docs' 
  | 'faq' 
  | 'signup' 
  | 'signin' 
  | 'dashboard'
  | 'integrations'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'security'
  | 'roadmap'
  | 'changelog'
  | 'help'
  | 'reset-password'
  | 'logo-export';

export default function App() {
  const [currentSection, setCurrentSection] = useState<SectionType>('home');
  const [userPlan, setUserPlan] = useState<'basic' | 'premium'>('basic');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic');

  // Check for reset password token or existing session on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token') || urlParams.get('reset-token');

    if (token) {
      setCurrentSection('reset-password');
      return;
    }

    // Restore session from stored tokens
    (async () => {
      try {
        const session = await getSession();
        if (!session) return;

        // Fetch user plan from business profile
        let plan: 'basic' | 'premium' = 'basic';
        try {
          const response = await fetch(`${API_CONFIG.baseUrl}/business`, {
            headers: {
              'Authorization': `Bearer ${session.idToken}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const businessData = await response.json();
            const userPlanType = businessData?.planType || businessData?.plan || 'basic';
            plan = userPlanType === 'premium' ? 'premium' : 'basic';
          }
        } catch {
          // Default to basic if profile fetch fails
        }

        setErrorUser(session.user.id, session.user.email);
        setUserPlan(plan);
        setCurrentSection('dashboard');
      } catch {
        // No valid session, stay on landing page
      }
    })();
  }, []);

  // Set favicon
  useEffect(() => {
    const setFavicon = () => {
      // Create SVG favicon with BilltUp brand colors
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#1E3A8A;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#14B8A6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#F59E0B;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" rx="12" fill="url(#grad)"/>
          <path d="M20 16h24a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V20a4 4 0 0 1 4-4z" fill="white" opacity="0.95"/>
          <path d="M28 24h-4v16h4V24z M40 24h-8v4h8v-4z M40 32h-8v4h8v-4z M40 40h-8v4h8v-4z" fill="url(#grad)"/>
        </svg>
      `.trim();
      
      const encodedSvg = `data:image/svg+xml,${encodeURIComponent(svg)}`;
      
      // Remove existing favicons
      const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
      existingFavicons.forEach(favicon => favicon.remove());
      
      // Add new favicon
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      link.href = encodedSvg;
      document.head.appendChild(link);
      
      // Set title
      document.title = 'BilltUp - Modern Invoicing for Service Businesses';
    };
    
    setFavicon();
  }, []);

  // Session inactivity timeout -- start when on dashboard, stop otherwise
  useEffect(() => {
    if (currentSection === 'dashboard') {
      sessionTimeout.start(async () => {
        clearErrorUser();
        await cognitoSignOut();
        setCurrentSection('signin');
      });
    } else {
      sessionTimeout.stop();
    }
    return () => {
      sessionTimeout.stop();
    };
  }, [currentSection]);

  // Scroll to top whenever section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSection]);

  const handleSignIn = (plan: 'basic' | 'premium' = 'basic') => {
    setErrorUser(getUserId(), getUserEmail());
    setUserPlan(plan);
    setCurrentSection('dashboard');
  };

  const handleSignOut = async () => {
    sessionTimeout.stop();
    sessionTimeout.clear();
    clearErrorUser();
    await cognitoSignOut();
    setCurrentSection('home');
  };

  const handlePlanChange = (newPlan: 'basic' | 'premium') => {
    console.log('[App] Plan changed to:', newPlan);
    setUserPlan(newPlan);
  };

  const handleNavigateWithPlan = (section: SectionType, plan?: 'basic' | 'premium') => {
    if (plan) {
      setSelectedPlan(plan);
    }
    setCurrentSection(section);
  };

  // If authenticated, show dashboard
  if (currentSection === 'dashboard') {
    return <DashboardSection userPlan={userPlan} onSignOut={handleSignOut} onPlanChange={handlePlanChange} />;
  }

  // If on reset password page, show without header/footer
  if (currentSection === 'reset-password') {
    return (
      <>
        <ResetPassword onBackToSignIn={() => setCurrentSection('signin')} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      <WebsiteHeader currentSection={currentSection} onNavigate={setCurrentSection} />
      
      <main id="main-content" role="main">
        {currentSection === 'home' && (
          <>
            <HeroSection onGetStarted={() => setCurrentSection('signup')} />
            <FeatureHighlights onNavigate={handleNavigateWithPlan} />
            <MobileAppSection />
            <PricingPreview onNavigate={handleNavigateWithPlan} />
          </>
        )}
        
        {currentSection === 'features' && <FeaturesSection onNavigate={setCurrentSection} />}
        {currentSection === 'pricing' && <PricingSection onNavigate={handleNavigateWithPlan} />}
        {currentSection === 'docs' && <DocumentationSectionNew onNavigate={setCurrentSection} />}
        {currentSection === 'faq' && <FAQSection onNavigate={setCurrentSection} />}
        {currentSection === 'signup' && <SignUpSection onNavigateToSignIn={() => setCurrentSection('signin')} onNavigate={setCurrentSection} initialPlan={selectedPlan} />}
        {currentSection === 'signin' && <SignInSection onNavigateToSignUp={() => setCurrentSection('signup')} onSignIn={handleSignIn} />}
        {currentSection === 'integrations' && <IntegrationsSection />}
        {currentSection === 'roadmap' && <RoadmapSection />}
        {currentSection === 'changelog' && <ChangelogSection />}
        {currentSection === 'help' && <HelpCenterSection onNavigate={setCurrentSection} />}
        {currentSection === 'about' && <AboutSection onNavigate={setCurrentSection} />}
        {currentSection === 'contact' && <ContactSection />}
        {currentSection === 'privacy' && <PrivacySection />}
        {currentSection === 'terms' && <TermsSection />}
        {currentSection === 'security' && <SecuritySection />}
        {currentSection === 'mobile-app' && <MobileAppSection />}
        {currentSection === 'logo-export' && <BilltUpLogoExport />}
      </main>
      
      <WebsiteFooter onNavigate={setCurrentSection} />
      <Toaster />
    </div>
  );
}