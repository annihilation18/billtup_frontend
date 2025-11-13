# BilltUp Framework & Technology Stack

## Frontend Framework

**React** (Single Page Application) built with **Vite**

This application is built as a **React SPA** (Single Page Application) using modern React patterns, TypeScript, and **Vite** as the build tool.

---

## Core Technologies

### **Frontend**
- **Framework**: React 18+ (SPA)
- **Build Tool**: Vite
- **Language**: TypeScript (.tsx files)
- **Styling**: Tailwind CSS v4.0
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React hooks (useState, useEffect, useContext)
- **Routing**: Client-side routing (component-based navigation)
- **Icons**: lucide-react

### **Backend**
- **Platform**: Supabase
- **Edge Functions**: Deno runtime with Hono.js framework
- **Database**: PostgreSQL (Supabase)
- **Storage**: Supabase Storage (S3-compatible)
- **Authentication**: Supabase Auth (JWT tokens)
- **Key-Value Store**: Custom KV store implementation

### **Third-Party Services**
- **Payments**: Stripe (with Stripe Connect OAuth)
- **Email**: SMTP (configurable provider)
- **PDF Generation**: Server-side (HTML to PDF)

---

## Why React SPA with Vite?

### ✅ **Why Vite?**

1. **Lightning-Fast Development**
   - Instant server start (no bundling in dev)
   - Hot Module Replacement (HMR) under 50ms
   - Native ES modules for faster updates

2. **Optimized Production Builds**
   - Rollup-based bundling
   - Tree-shaking and code splitting
   - Smaller bundle sizes than CRA

3. **Modern Tooling**
   - TypeScript support out of the box
   - Fast CSS processing
   - Built-in asset handling

4. **Better DX than CRA**
   - No need to eject for customization
   - Faster builds (3-10x faster than webpack)
   - Better error messages

### ✅ **Advantages for BilltUp**

1. **Fast Client-Side Interactions**
   - Invoice builder requires real-time updates
   - No page reloads for smooth UX
   - Instant feedback for calculations and previews

2. **Simplified Deployment**
   - Single build output
   - Easy to host on CDN
   - No server-side rendering complexity

3. **Rich Component Ecosystem**
   - shadcn/ui provides production-ready components
   - Easy integration with Stripe Elements
   - Extensive React library support

4. **State Management**
   - Client-side state perfect for invoice drafts
   - Easy to manage authentication state
   - Simplified data flow with hooks

5. **Developer Experience**
   - Hot module replacement for fast development
   - Strong TypeScript support
   - Large community and resources

### ⚠️ **Not Using These Frameworks**

- **Not Next.js**: No need for SSR/SSG for this use case
- **Not Vue/Nuxt**: React chosen for ecosystem and team familiarity
- **Not SvelteKit**: React provides better Stripe/Supabase integrations
- **Not Remix**: SPA architecture sufficient for current needs

---

## Project Structure

```
/
├── main.tsx                   # Vite entry point
├── App.tsx                    # Main application component
├── index.html                 # HTML entry point (root-level for Vite)
├── index.css                  # Global CSS imports
├── styles/
│   └── globals.css           # Tailwind config & custom CSS variables
├── components/
│   ├── ui/                   # shadcn/ui components (Radix UI)
│   ├── SplashScreen.tsx      # Landing/marketing page
│   ├── LoginScreen.tsx       # Authentication
│   ├── Dashboard.tsx         # Main dashboard
│   ├── InvoiceBuilder.tsx    # Invoice creation
│   ├── PaymentScreen.tsx     # Payment processing
│   ├── CustomersScreen.tsx   # Customer management
│   ├── SettingsScreen.tsx    # Settings & Stripe connect
│   └── ...                   # Other feature components
├── utils/
│   ├── api.tsx               # API client (Supabase + custom endpoints)
│   └── supabase/
│       └── client.tsx        # Supabase client initialization
├── supabase/
│   └── functions/
│       └── server/
│           └── index.tsx     # Hono.js edge function (Deno runtime)
└── Guidelines.md             # Design system & color palette
```

---

## Build & Runtime

### **Vite Entry Point**
```typescript
// main.tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
```

### **Development**
```bash
# Local development with hot reload
npm run dev
# or
yarn dev

# Vite dev server starts instantly
# HMR updates in < 50ms
```

### **Production Build**
```bash
# Build optimized production bundle
npm run build
# Output: /dist directory (static files)

# Preview production build locally
npm run preview
```

### **Deployment**
- **Frontend**: Static hosting (Vercel, Netlify, Cloudflare Pages, etc.)
- **Backend**: Supabase Edge Functions (Deno runtime)
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage

---

## Key Dependencies

### **React Ecosystem**
```json
{
  "react": "^18.x",
  "react-dom": "^18.x"
}
```

### **UI & Styling**
```json
{
  "tailwindcss": "^4.0",
  "lucide-react": "latest",
  "recharts": "latest",
  "motion": "latest"
}
```

### **Forms & Validation**
```json
{
  "react-hook-form": "7.55.0",
  "zod": "latest"
}
```

### **Backend Integration**
```json
{
  "@supabase/supabase-js": "^2.x",
  "@stripe/stripe-js": "latest",
  "@stripe/react-stripe-js": "latest"
}
```

### **Utilities**
```json
{
  "sonner": "2.0.3",
  "react-slick": "latest",
  "react-responsive-masonry": "latest"
}
```

---

## Architecture Patterns

### **Component Architecture**
- **Functional Components**: All components use function syntax
- **Hooks**: useState, useEffect, custom hooks for reusable logic
- **Composition**: Small, focused components composed together
- **Props**: Type-safe props with TypeScript interfaces

### **State Management**
- **Local State**: useState for component-specific state
- **Shared State**: Props drilling (app is not large enough to need Context/Redux)
- **Server State**: Fetched from Supabase/API, stored in component state
- **Auth State**: Managed by Supabase Auth SDK

### **Data Flow**
```
User Action
    ↓
Component Event Handler
    ↓
API Call (utils/api.tsx)
    ↓
Supabase Edge Function (Hono.js)
    ↓
Database/Storage/External API
    ↓
Response to Component
    ↓
State Update
    ↓
Re-render UI
```

### **Routing Pattern**
```typescript
// Component-based routing in App.tsx
const [currentScreen, setCurrentScreen] = useState<string>('splash');

// Navigation handlers
const showDashboard = () => setCurrentScreen('dashboard');
const showInvoiceBuilder = () => setCurrentScreen('invoice-builder');
// etc.

// Conditional rendering
{currentScreen === 'dashboard' && <Dashboard />}
{currentScreen === 'invoice-builder' && <InvoiceBuilder />}
```

---

## Security Architecture

### **Frontend Security**
- **No sensitive data in client**: All secrets on server
- **HTTPS only**: Enforced in production
- **CSP headers**: Content Security Policy configured
- **XSS protection**: React's built-in escaping + security headers

### **Backend Security** (Supabase Edge Functions)
- **Rate limiting**: Multi-tier throttling
- **DDoS protection**: Automatic IP blocking
- **Authentication**: JWT token validation
- **Encryption**: TLS in transit, AES-256 at rest
- **PCI compliance**: Stripe handles card data

### **API Security**
- **Authentication required**: Protected endpoints check JWT
- **CORS configured**: Proper origin validation
- **Request validation**: Content-type and payload checks
- **Query limits**: Max 100 rows per request
- **Response limits**: Max 5MB per response

---

## Performance Optimizations

### **React Optimizations**
- **Code splitting**: Dynamic imports for heavy components
- **Memoization**: React.memo for expensive renders
- **Lazy loading**: Images and heavy assets loaded on demand
- **Debouncing**: Input handlers debounced for API calls

### **Network Optimizations**
- **Pagination**: All list endpoints paginated
- **Caching**: Rate limit store with auto-cleanup
- **Compression**: Gzip/Brotli on static assets
- **CDN**: Static assets served from edge

### **Bundle Optimizations**
- **Tree shaking**: Unused code eliminated
- **Minification**: Production builds minified
- **Asset optimization**: Images compressed, SVGs inlined
- **CSS purging**: Unused Tailwind classes removed

---

## Development Guidelines

### **Component Creation**
```typescript
// Always use TypeScript
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  const [state, setState] = useState<string>('');
  
  return (
    <div className="p-4">
      {/* Component JSX */}
    </div>
  );
}
```

### **API Calls**
```typescript
// Use centralized API utility
import { invoiceApi } from '../utils/api';

const invoices = await invoiceApi.getAll();
```

### **Styling**
```typescript
// Use Tailwind classes, avoid custom CSS
<div className="flex items-center gap-4 p-6 bg-card rounded-lg">
  {/* Content */}
</div>

// Use design tokens from globals.css
<div className="bg-primary text-primary-foreground">
  {/* Uses --color-primary */}
</div>
```

### **Error Handling**
```typescript
try {
  const result = await apiCall();
  toast.success('Success!');
} catch (error) {
  console.error('Error:', error);
  toast.error('Something went wrong');
}
```

---

## Future Considerations

### **Possible Framework Migrations**

**If the app grows significantly, consider:**

1. **Next.js App Router**
   - **When**: Need SEO for public invoice pages
   - **Benefits**: SSR, better SEO, file-based routing
   - **Effort**: Moderate (structure change)

2. **React Router**
   - **When**: Need deep linking and URL-based navigation
   - **Benefits**: Browser history, bookmarkable URLs
   - **Effort**: Low (drop-in routing)

3. **State Management Library**
   - **When**: State becomes too complex to prop-drill
   - **Options**: Zustand (lightweight), Redux Toolkit, Jotai
   - **Effort**: Low to Moderate

4. **Monorepo Structure**
   - **When**: Multiple apps (mobile, admin panel, etc.)
   - **Tools**: Turborepo, Nx
   - **Effort**: High (infrastructure change)

---

## Conclusion

**BilltUp uses React SPA with Vite** because it provides:
- ✅ Fast, interactive invoice building experience
- ✅ Lightning-fast development with instant HMR
- ✅ Simple deployment and hosting
- ✅ Rich ecosystem for Stripe and Supabase integration
- ✅ Excellent developer experience with TypeScript
- ✅ Production-ready UI components (shadcn/ui)
- ✅ Optimized production builds (smaller bundles than CRA)

The architecture is optimized for a **financial SaaS application** with bank-level security, real-time updates, and seamless payment processing.

---

## Deployment

**Web Hosting:** See [../deployment/WEB_HOSTING.md](../deployment/WEB_HOSTING.md) for deploying to Vercel, Netlify, or Cloudflare Pages.

**Mobile Apps:** See [../deployment/MOBILE_APPS.md](../deployment/MOBILE_APPS.md) for building Android and iOS apps using Capacitor.

---

*Last Updated: November 11, 2025*
