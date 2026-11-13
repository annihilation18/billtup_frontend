import { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { DashboardSection } from './components/dashboard/DashboardSection';
import { WebsiteHeader } from './components/website/WebsiteHeader';
import { HeroSection } from './components/website/HeroSection';
import { HowItWorks } from './components/website/HowItWorks';
import { StorySections } from './components/website/StorySections';
import { MobileAppSection } from './components/website/MobileAppSection';
import { FeaturesSection } from './components/website/FeaturesSection';
import { FeatureHighlights } from './components/website/FeatureHighlights';
import { PricingSection } from './components/website/PricingSection';
import { PricingPreview, HomeCtaBand } from './components/website/PricingPreview';
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
import { DeleteAccountSection } from './components/website/DeleteAccountSection';
import { RoadmapSection } from './components/website/RoadmapSection';
import { ChangelogSection } from './components/website/ChangelogSection';
import { HelpCenterSection } from './components/website/HelpCenterSection';
import { BilltUpLogoExport } from './components/BilltUpLogoExport';
import ResetPassword from './reset-password';
import { OAuthCallbackPage } from './components/dashboard/OAuthCallbackPage';
import { PaymentPage } from './components/pay/PaymentPage';
import { PaymentSuccessPage } from './components/pay/PaymentSuccessPage';
import { EstimateApprovalPage } from './components/estimate/EstimateApprovalPage';
import { SignPage } from './components/sign/SignPage';
import { Toaster } from './components/ui/sonner';
import { getSession, signOut as cognitoSignOut, getUserId, getUserEmail } from './utils/auth/cognito';
import { API_CONFIG } from './utils/config';
import { setErrorUser, clearErrorUser } from './utils/errorReporter';
import { sessionTimeout } from './utils/sessionTimeout';
import { sectionToPath, pathToSection } from './utils/routes';
import { applyPageMeta } from './utils/seo';
import { TradePage } from './components/website/TradePage';
import { TRADES } from './data/trades';
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
  if (!isAuthenticated) {
    const redirectParam = encodeURIComponent(location.pathname);
    return <Navigate to={`/signin?redirect=${redirectParam}`} replace state={{ from: location.pathname }} />;
  }
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

  // Title, description and canonical address for search engines (utils/seo.ts)
  useEffect(() => {
    applyPageMeta(location.pathname);
  }, [location.pathname]);

  // Check session on mount; auto-redirect to dashboard only from public pages
  useEffect(() => {
    // Reset-password, payment, and sign pages don't need a session check
    if (location.pathname === '/reset-password' || location.pathname.startsWith('/pay/') || location.pathname.startsWith('/estimate/') || location.pathname.startsWith('/sign/')) {
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
            const userPlanType = businessData?.subscriptionStatus?.planType || businessData?.planType || businessData?.plan || 'basic';
            plan = (userPlanType === 'premium' || userPlanType === 'trial') ? 'premium' : 'basic';
          }
        } catch {
          // Default to basic if profile fetch fails
        }

        setErrorUser(session.user.id, session.user.email);
        setUserPlan(plan);
        setIsAuthenticated(true);

        // Only auto-redirect to dashboard from the landing and sign-in/up pages, so a signed-in
        // user can still open help, docs and legal pages
        if (['/', '/signin', '/signup'].includes(location.pathname)) {
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

  // Favicon: static files linked in index.html (public/favicon.svg, favicon-32.png, apple-touch-icon.png)

  // Safety net: redirect unauthenticated users away from dashboard paths
  useEffect(() => {
    if (authChecked && !isAuthenticated && location.pathname.startsWith('/dashboard')) {
      navigate(`/signin?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
    }
  }, [authChecked, isAuthenticated, location.pathname]);

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
      location.pathname !== '/reset-password' &&
      location.pathname !== '/signin' &&
      location.pathname !== '/signup'
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
    const params = new URLSearchParams(location.search);
    const redirectTo = location.state?.from || params.get('redirect') || '/dashboard';
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
            <div className="bt-theme bt-public">
              <ResetPassword onBackToSignIn={() => navigate('/signin')} />
            </div>
            <Toaster />
          </>
        }
      />

      {/* Public payment pages — no header/footer, branded by business */}
      {/* bt-customer: site fonts and button styles only (billtup-theme.css); the business's own
          brand colours and the payment logic are untouched */}
      <Route path="/pay/:token" element={<div className="bt-theme bt-customer"><PaymentPage /><Toaster /></div>} />
      <Route path="/pay/:token/success" element={<div className="bt-theme bt-customer"><PaymentSuccessPage /><Toaster /></div>} />

      {/* Public estimate approval page — no header/footer, branded by business */}
      <Route path="/estimate/:token" element={<div className="bt-theme bt-customer"><EstimateApprovalPage /><Toaster /></div>} />

      {/* Public signature collection page — no header/footer, branded by business */}
      <Route path="/sign/:token" element={<div className="bt-theme bt-customer"><SignPage /><Toaster /></div>} />

      {/* OAuth callback routes — auth-guarded, process code/state then redirect to dashboard */}
      <Route
        path="/dashboard/oauth/stripe/callback"
        element={
          <AuthGuard isAuthenticated={isAuthenticated} authChecked={authChecked}>
            <OAuthCallbackPage provider="stripe" />
          </AuthGuard>
        }
      />
      <Route
        path="/dashboard/oauth/square/callback"
        element={
          <AuthGuard isAuthenticated={isAuthenticated} authChecked={authChecked}>
            <OAuthCallbackPage provider="square" />
          </AuthGuard>
        }
      />

      {/* Dashboard — auth-guarded, no website header/footer */}
      <Route
        path="/dashboard/*"
        element={
          <AuthGuard isAuthenticated={isAuthenticated} authChecked={authChecked}>
            {/* bt-app: colours, fonts and buttons only (billtup-theme.css), no layout changes */}
            <div className="bt-theme bt-app">
              <DashboardSection userPlan={userPlan} onSignOut={handleSignOut} onPlanChange={handlePlanChange} />
            </div>
          </AuthGuard>
        }
      />

      {/* Public pages — with website header and footer */}
      <Route
        path="/*"
        element={
          <div className="min-h-screen bg-white bt-theme bt-public">
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
                    // Home page: C3 design (app repo BACKLOG P4.1)
                    <div className="bt-home">
                      <HeroSection onGetStarted={() => navigate('/signup')} />
                      <HowItWorks />
                      <FeatureHighlights onNavigate={handleNavigateWithPlan} />
                      <StorySections />
                      <MobileAppSection />
                      <PricingPreview onNavigate={handleNavigateWithPlan} />
                      <HomeCtaBand onGetStarted={() => navigate('/signup')} />
                    </div>
                  }
                />
                <Route path="/features" element={<FeaturesSection onNavigate={navigateTo} />} />
                {/* "Invoice app for <trade>" pages (src/data/trades.ts, app repo BACKLOG M.6) */}
                {TRADES.map((trade) => (
                  <Route key={trade.slug} path={`/invoice-app-for-${trade.slug}`} element={<TradePage trade={trade} />} />
                ))}
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
                <Route path="/delete-account" element={<DeleteAccountSection />} />
                <Route path="/logo-export" element={<BilltUpLogoExport />} />
                {/* Auth-guarded paths that slip through — redirect to signin */}
                <Route path="/dashboard/*" element={<Navigate to={`/signin?redirect=${encodeURIComponent(location.pathname)}`} replace />} />
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
