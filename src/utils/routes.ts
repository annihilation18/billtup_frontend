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

const sectionPathMap: Record<SectionType, string> = {
  'home': '/',
  'features': '/features',
  'pricing': '/pricing',
  'docs': '/docs',
  'faq': '/faq',
  'signup': '/signup',
  'signin': '/signin',
  'dashboard': '/dashboard',
  'integrations': '/integrations',
  'about': '/about',
  'contact': '/contact',
  'privacy': '/privacy',
  'terms': '/terms',
  'security': '/security',
  'roadmap': '/roadmap',
  'changelog': '/changelog',
  'help': '/help',
  'reset-password': '/reset-password',
  'logo-export': '/logo-export',
};

const pathSectionMap = Object.fromEntries(
  Object.entries(sectionPathMap).map(([section, path]) => [path, section as SectionType])
) as Record<string, SectionType>;

export function sectionToPath(section: SectionType): string {
  return sectionPathMap[section] || '/';
}

export function pathToSection(pathname: string): SectionType {
  return pathSectionMap[pathname] || 'home';
}

export type DashboardTab = 'overview' | 'customers' | 'invoices' | 'estimates' | 'analytics' | 'settings';

const tabPathMap: Record<DashboardTab, string> = {
  'overview': '/dashboard',
  'customers': '/dashboard/customers',
  'invoices': '/dashboard/invoices',
  'estimates': '/dashboard/estimates',
  'analytics': '/dashboard/analytics',
  'settings': '/dashboard/settings',
};

export function tabToPath(tab: DashboardTab): string {
  return tabPathMap[tab] || '/dashboard';
}

export function pathToTab(pathname: string): DashboardTab {
  const segment = pathname.replace('/dashboard', '').replace(/^\//, '');
  if (segment === 'customers' || segment === 'invoices' || segment === 'estimates' || segment === 'analytics' || segment === 'settings') {
    return segment;
  }
  return 'overview';
}
