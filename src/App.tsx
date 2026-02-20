import { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import { sectionToPath, pathToSection } from './utils/routes';
import type { SectionType } from './utils/routes';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './components/ui/alert-dialog';

// Re-export so existing imports from '../../App' keep working
export type { SectionType } from './utils/routes';

function AuthGuard({
  isAuthenticated,
  authChecked,
  children,
}: {
  isAuthenticated: boolean;
  authChecked: boolean;
  children: React.ReactNode;
}) {
  const location = useLocation();
  if (!authChecked) return null;
  if (!isAuthenticated) return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userPlan, setUserPlan] = useState<'basic' | 'premium'>('basic');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const hasVisitedDashboard = useRef(false);

  // Derive current section from pathname (used by WebsiteHeader and other components)
  const currentSection = pathToSection(location.pathname);

  const navigateTo = useCallback((section: SectionType) => {
    navigate(sectionToPath(section));
  }, [navigate]);

  // Check session on mount; auto-redirect to dashboard only from public pages
  useEffect(() => {
    // Reset-password doesn't need a session check
    if (location.pathname === '/reset-password') {
      setAuthChecked(true);
      return;
    }

    (async () => {
      try {
        const session = await getSession();
        if (!session) {
          setAuthChecked(true);
          return;
        }

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
        setIsAuthenticated(true);

        // Only auto-redirect to dashboard from public pages
        if (!location.pathname.startsWith('/dashboard')) {
          navigate('/dashboard', { replace: true });
        }
      } catch {
        // No valid session
      } finally {
        setAuthChecked(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set favicon
  useEffect(() => {
    const setFavicon = () => {
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

      const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
      existingFavicons.forEach(favicon => favicon.remove());

      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      link.href = encodedSvg;
      document.head.appendChild(link);

      document.title = 'BilltUp - Modern Invoicing for Service Businesses';
    };

    setFavicon();
  }, []);

  // Session inactivity timeout -- start when on dashboard, stop otherwise
  useEffect(() => {
    if (location.pathname.startsWith('/dashboard')) {
      sessionTimeout.start(async () => {
        clearErrorUser();
        await cognitoSignOut();
        setIsAuthenticated(false);
        navigate('/signin');
      });
    } else {
      sessionTimeout.stop();
    }
    return () => {
      sessionTimeout.stop();
    };
  }, [location.pathname, navigate]);

  // Track dashboard visits; show logout confirmation when authenticated user
  // navigates back to any public page from the dashboard
  useEffect(() => {
    if (location.pathname.startsWith('/dashboard')) {
      hasVisitedDashboard.current = true;
      return;
    }
    if (
      isAuthenticated &&
      authChecked &&
      hasVisitedDashboard.current &&
      !location.pathname.startsWith('/dashboard') &&
      location.pathname !== '/reset-password'
    ) {
      setShowLogoutConfirm(true);
    }
  }, [isAuthenticated, authChecked, location.pathname]);

  // Scroll to top whenever pathname changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleSignIn = (plan: 'basic' | 'premium' = 'basic') => {
    setErrorUser(getUserId(), getUserEmail());
    setUserPlan(plan);
    setIsAuthenticated(true);
    const redirectTo = location.state?.from || '/dashboard';
    navigate(redirectTo, { replace: true });
  };

  const handleSignOut = async () => {
    sessionTimeout.stop();
    sessionTimeout.clear();
    clearErrorUser();
    await cognitoSignOut();
    setIsAuthenticated(false);
    navigate('/');
  };

  const handlePlanChange = (newPlan: 'basic' | 'premium') => {
    console.log('[App] Plan changed to:', newPlan);
    setUserPlan(newPlan);
  };

  const handleNavigateWithPlan = (section: SectionType, plan?: 'basic' | 'premium') => {
    if (plan) {
      setSelectedPlan(plan);
    }
    navigateTo(section);
  };

  return (
    <>
    {/* Logout confirmation when authenticated user visits home page */}
    <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle style={{ fontFamily: 'Poppins, sans-serif' }}>
            Leave Dashboard?
          </AlertDialogTitle>
          <AlertDialogDescription style={{ fontFamily: 'Inter, sans-serif' }}>
            You're currently logged in. Would you like to log out or return to your dashboard?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setShowLogoutConfirm(false);
              navigate('/dashboard');
            }}
          >
            Back to Dashboard
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white"
            onClick={() => {
              setShowLogoutConfirm(false);
              handleSignOut();
            }}
          >
            Log Out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <Routes>
      {/* Reset password — no header/footer */}
      <Route
        path="/reset-password"
        element={
          <>
            <ResetPassword onBackToSignIn={() => navigate('/signin')} />
            <Toaster />
          </>
        }
      />

      {/* Dashboard — auth-guarded, no website header/footer */}
      <Route
        path="/dashboard/*"
        element={
          <AuthGuard isAuthenticated={isAuthenticated} authChecked={authChecked}>
            <DashboardSection userPlan={userPlan} onSignOut={handleSignOut} onPlanChange={handlePlanChange} />
          </AuthGuard>
        }
      />

      {/* Public pages — with website header and footer */}
      <Route
        path="/*"
        element={
          <div className="min-h-screen bg-white">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-ring"
            >
              Skip to main content
            </a>

            <WebsiteHeader currentSection={currentSection} onNavigate={navigateTo} />

            <main id="main-content" role="main">
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <HeroSection onGetStarted={() => navigate('/signup')} />
                      <FeatureHighlights onNavigate={handleNavigateWithPlan} />
                      <MobileAppSection />
                      <PricingPreview onNavigate={handleNavigateWithPlan} />
                    </>
                  }
                />
                <Route path="/features" element={<FeaturesSection onNavigate={navigateTo} />} />
                <Route path="/pricing" element={<PricingSection onNavigate={handleNavigateWithPlan} />} />
                <Route path="/docs" element={<DocumentationSectionNew onNavigate={navigateTo} />} />
                <Route path="/faq" element={<FAQSection onNavigate={navigateTo} />} />
                <Route
                  path="/signup"
                  element={
                    <SignUpSection
                      onNavigateToSignIn={() => navigate('/signin')}
                      onNavigate={navigateTo}
                      initialPlan={selectedPlan}
                    />
                  }
                />
                <Route
                  path="/signin"
                  element={
                    <SignInSection
                      onNavigateToSignUp={() => navigate('/signup')}
                      onSignIn={handleSignIn}
                    />
                  }
                />
                <Route path="/integrations" element={<IntegrationsSection />} />
                <Route path="/roadmap" element={<RoadmapSection />} />
                <Route path="/changelog" element={<ChangelogSection />} />
                <Route path="/help" element={<HelpCenterSection onNavigate={navigateTo} />} />
                <Route path="/about" element={<AboutSection onNavigate={navigateTo} />} />
                <Route path="/contact" element={<ContactSection />} />
                <Route path="/privacy" element={<PrivacySection />} />
                <Route path="/terms" element={<TermsSection />} />
                <Route path="/security" element={<SecuritySection />} />
                <Route path="/logo-export" element={<BilltUpLogoExport />} />
                {/* Catch-all redirects to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <WebsiteFooter onNavigate={navigateTo} />
            <Toaster />
          </div>
        }
      />
    </Routes>
    </>
  );
}
