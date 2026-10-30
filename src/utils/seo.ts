/**
 * Page titles, descriptions and canonical addresses for search engines
 * (app repo BACKLOG M.6). The site is a single-page app, so these are set when
 * the route changes; Google renders JavaScript and reads them. Public pages are
 * also listed in public/sitemap.xml: keep the two in step.
 */

export const SITE_URL = 'https://billtup.com';

interface PageMeta {
  title: string;
  description: string;
  /** Keep out of search results (account pages, password reset) */
  noindex?: boolean;
}

const DEFAULT_DESCRIPTION =
  'Send invoices and estimates from your phone and get paid by card on the spot. Built for contractors and service businesses. Free 14-day trial, no card needed.';

const PAGES: Record<string, PageMeta> = {
  '/': { title: 'BilltUp: Invoice & Estimate App for Contractors', description: DEFAULT_DESCRIPTION },
  '/features': {
    title: 'Features: Invoices, Estimates & Card Payments | BilltUp',
    description: 'Invoices in seconds, estimates customers approve by email, card payments through Stripe or Square, offline mode, analytics and custom branding.',
  },
  '/pricing': {
    title: 'Pricing: Basic $4.99, Premium $9.99 a Month | BilltUp',
    description: 'Start with a free 14-day trial of every feature, no card needed. Basic $4.99/month or Premium $9.99/month for unlimited invoices, estimates and customers.',
  },
  '/integrations': {
    title: 'Stripe & Square Payments for Invoices | BilltUp',
    description: 'Connect your own Stripe or Square account. Customers pay invoices by card, Apple Pay or Google Pay from a link or QR code, and BilltUp marks them paid.',
  },
  '/docs': {
    title: 'How to Use BilltUp: Invoicing Guide',
    description: 'Step-by-step guides for creating invoices and estimates, connecting Stripe or Square, getting paid, and managing customers in BilltUp.',
  },
  '/help': {
    title: 'Help Center | BilltUp',
    description: 'Answers about invoices, estimates, payments, subscriptions and your BilltUp account, and how to contact support.',
  },
  '/faq': {
    title: 'Frequently Asked Questions | BilltUp',
    description: 'Common questions about BilltUp: pricing, the free trial, payment processing fees, Stripe and Square, offline mode and your data.',
  },
  '/about': {
    title: 'About BilltUp: Invoicing for Service Businesses',
    description: 'BilltUp is a mobile invoicing app for contractors and service businesses who bill customers from the field.',
  },
  '/contact': { title: 'Contact BilltUp', description: 'Questions or feedback? Contact the BilltUp team.' },
  '/security': {
    title: 'Security | BilltUp',
    description: 'How BilltUp protects your data: encryption, secure sign-in, and card payments handled by Stripe and Square.',
  },
  '/privacy': { title: 'Privacy Policy | BilltUp', description: 'How BilltUp collects, uses and protects your information.' },
  '/terms': { title: 'Terms of Service | BilltUp', description: 'The terms for using BilltUp, including plans, billing, cancellation and account deletion.' },
  '/changelog': { title: "What's New | BilltUp", description: 'Recent improvements and fixes to the BilltUp app and website.' },
  '/roadmap': { title: 'Roadmap | BilltUp', description: "What's coming next to BilltUp." },
  '/signup': {
    title: 'Start Your Free Trial | BilltUp',
    description: 'Create your BilltUp account and try every feature free for 14 days. No card needed.',
  },
  '/signin': { title: 'Sign In | BilltUp', description: DEFAULT_DESCRIPTION, noindex: true },
  '/reset-password': { title: 'Reset Password | BilltUp', description: DEFAULT_DESCRIPTION, noindex: true },
  '/logo-export': { title: 'BilltUp', description: DEFAULT_DESCRIPTION, noindex: true },
};

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Sets the title, description, canonical address and indexing rule for the current route. */
export function applyPageMeta(pathname: string) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/';
  // A business's customer paying, signing or approving: private to that customer
  if (/^\/(pay|sign|estimate)\//.test(path)) {
    setMeta('name', 'robots', 'noindex, nofollow');
    return;
  }
  const dashboard = path.startsWith('/dashboard');
  const meta = PAGES[path] || (dashboard ? { title: 'Dashboard | BilltUp', description: DEFAULT_DESCRIPTION, noindex: true } : PAGES['/']);

  document.title = meta.title;
  setMeta('name', 'description', meta.description);
  setMeta('name', 'robots', meta.noindex ? 'noindex, nofollow' : 'index, follow');
  setMeta('property', 'og:title', meta.title);
  setMeta('property', 'og:description', meta.description);
  setMeta('property', 'og:url', `${SITE_URL}${path === '/' ? '' : path}`);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  // Always the main domain, so www.billtup.com and billtup.com count as one site
  canonical.href = `${SITE_URL}${path === '/' ? '/' : path}`;
}
