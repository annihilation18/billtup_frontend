# Custom Branding API Documentation for BilltUp

This document provides comprehensive information about the Custom Branding feature implementation in the BilltUp mobile app, including all APIs, data structures, and templates needed to replicate this functionality on the website.

---

## Table of Contents

1. [Overview](#overview)
2. [API Endpoints](#api-endpoints)
3. [Data Structure](#data-structure)
4. [Template Selection UI](#template-selection-ui)
5. [Invoice Templates](#invoice-templates)
6. [Color Extraction Algorithm](#color-extraction-algorithm)
7. [Frontend Implementation](#frontend-implementation)
8. [Premium Feature Gating](#premium-feature-gating)

---

## Overview

The Custom Branding feature allows Premium and Trial users to:

- Upload a custom logo for invoices
- Set primary brand color (used for headings, borders, and main elements)
- Set accent color (used for highlights, secondary elements, and bars)
- Choose from 3 invoice templates: Modern, Classic, or Minimal
- Automatically extract color palettes from uploaded logos

---

## API Endpoints

### Base URL

```
https://xrgywtdjdlqthpthyxwj.supabase.co/functions/v1/make-server-dce439b6
```

### 1. Get Business Data (includes branding settings)

**Endpoint:** `GET /business`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {ACCESS_TOKEN}"
}
```

**Response:**

```json
{
  "id": "user_123",
  "businessName": "Acme Corp",
  "email": "contact@acme.com",
  "phone": "555-0123",
  "address": "123 Main St, City, State 12345",
  "logo": "https://...",
  "customLogo": "data:image/png;base64,...",
  "brandColor": "#1E3A8A",
  "accentColor": "#14B8A6",
  "invoiceTemplate": "modern",
  "contactEmail": "support@acme.com",
  "chargeTax": true,
  "defaultTaxRate": 8.5,
  ...
}
```

### 2. Update Business Data (save branding settings)

**Endpoint:** `PATCH /business`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {ACCESS_TOKEN}"
}
```

**Request Body:**

```json
{
  "brandColor": "#1E3A8A",
  "accentColor": "#14B8A6",
  "invoiceTemplate": "modern",
  "customLogo": "data:image/png;base64,iVBORw0KG..."
}
```

**Response:**

```json
{
  "success": true,
  "business": {
    // Updated business data with new branding settings
  }
}
```

### 3. Upload Logo (Alternative method)

**Endpoint:** `POST /business/logo`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {ACCESS_TOKEN}"
}
```

**Request Body:**

```json
{
  "logoData": "data:image/png;base64,iVBORw0KG...",
  "fileName": "logo.png"
}
```

**Response:**

```json
{
  "success": true,
  "logoUrl": "https://storage.supabase.co/..."
}
```

---

## Data Structure

### Business Data Schema (relevant branding fields)

```typescript
interface BusinessData {
  // Basic Info
  id: string;
  businessName: string;
  email: string;
  phone: string;
  address?: string;

  // Branding Settings
  logo?: string; // URL to general business logo
  customLogo?: string; // Base64 or URL for invoice-specific logo
  brandColor?: string; // Hex color, default: '#1E3A8A' (deep blue)
  accentColor?: string; // Hex color, default: '#14B8A6' (teal)
  invoiceTemplate?: "modern" | "classic" | "minimal"; // Default: 'modern'

  // Contact
  contactEmail?: string; // Support/contact email for invoice footer

  // Tax Settings
  chargeTax?: boolean;
  defaultTaxRate?: number;

  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}
```

### Default Values

```javascript
const DEFAULT_BRANDING = {
  brandColor: '#1E3A8A',      // Deep blue
  accentColor: '#14B8A6',     // Teal
  invoiceTemplate: 'modern',
  customLogo: null
};
```

---

## Template Selection UI

The app provides two ways to select templates:

1. **Quick Selector** (in Custom Branding section) - Shows current template with "Browse Templates" button
2. **Template Browser** (full-screen) - Gallery view with live previews of all 15 templates

### Quick Template Selector Component

Located in the Custom Branding section, this shows the currently selected template and provides access to the full browser.

**UI Structure:**

```html
<div style="
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
">
  <!-- Left side: Current template info -->
  <div style="display: flex; align-items: center; gap: 12px;">
    <!-- Icon -->
    <div style="
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: rgba(30, 58, 138, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    </div>

    <!-- Text -->
    <div>
      <div style="font-size: 14px; color: #6b7280;">Current Template</div>
      <div style="font-weight: 500; color: #111827;">Modern</div>
    </div>
  </div>

  <!-- Right side: Browse button -->
  <button style="
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background: white;
    cursor: pointer;
  " onclick="openTemplateBrowser()">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
    Browse Templates
  </button>
</div>

<p style="font-size: 12px; color: #6b7280; margin-top: 8px;">
  Choose from 15 professional invoice templates. Preview full invoices before selecting.
</p>
```

### Template Browser (Full-Screen Gallery)

A dedicated screen that displays all available templates with live previews and category filtering.

**Available Templates List:**

```typescript
const INVOICE_TEMPLATES = [
  // Professional (5 templates)
  {
    id: "modern",
    name: "Modern",
    description: "Clean lines with a side accent bar",
    category: "Professional",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional business invoice layout",
    category: "Professional",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant design",
    category: "Professional",
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Professional with structured sections",
    category: "Professional",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Space-efficient design",
    category: "Professional",
  },
  {
    id: "traditional",
    name: "Traditional",
    description: "Formal business document style",
    category: "Professional",
  },

  // Creative (5 templates)
  {
    id: "bold",
    name: "Bold",
    description: "Strong header with gradient accents",
    category: "Creative",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Colorful and modern with unique layout",
    category: "Creative",
  },
  {
    id: "sleek",
    name: "Sleek",
    description: "Ultra-modern with subtle gradients",
    category: "Creative",
  },
  {
    id: "contemporary",
    name: "Contemporary",
    description: "Modern with asymmetric elements",
    category: "Creative",
  },
  {
    id: "vibrant",
    name: "Vibrant",
    description: "Colorful and eye-catching",
    category: "Creative",
  },

  // Tech (2 templates)
  {
    id: "technical",
    name: "Technical",
    description: "Grid-based tech-focused design",
    category: "Tech",
  },
  {
    id: "startup",
    name: "Startup",
    description: "Fresh and energetic style",
    category: "Tech",
  },

  // Premium (2 templates)
  {
    id: "elegant",
    name: "Elegant",
    description: "Sophisticated serif typography",
    category: "Premium",
  },
  {
    id: "luxury",
    name: "Luxury",
    description: "Premium gold accents",
    category: "Premium",
  },
];
```

**Browser UI Structure:**

```html
<div style="min-height: 100vh; background: #f9fafb;">
  <!-- Sticky Header -->
  <header style="
    position: sticky;
    top: 0;
    z-index: 10;
    background: white;
    border-bottom: 1px solid #e5e7eb;
  ">
    <!-- Top Bar -->
    <div style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
    ">
      <!-- Back Button -->
      <button style="display: flex; align-items: center; gap: 8px;" onclick="goBack()">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back
      </button>

      <!-- Template Counter -->
      <span style="color: #6b7280; font-size: 14px;">1 of 15</span>

      <!-- Select Button -->
      <button style="
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: #1E3A8A;
        color: white;
        border-radius: 6px;
      " onclick="selectCurrentTemplate()">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Select Template
      </button>
    </div>

    <!-- Category Filter -->
    <div style="display: flex; gap: 8px; padding: 0 16px 12px; overflow-x: auto;">
      <button class="category-filter active">All</button>
      <button class="category-filter">Professional</button>
      <button class="category-filter">Creative</button>
      <button class="category-filter">Tech</button>
      <button class="category-filter">Premium</button>
    </div>
  </header>

  <!-- Main Content -->
  <main style="max-width: 1200px; margin: 0 auto; padding: 24px;">
    <!-- Template Info -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
        <h1 style="font-size: 28px;">Modern</h1>
        <span style="
          padding: 4px 12px;
          background: #e0e7ff;
          color: #3730a3;
          border-radius: 999px;
          font-size: 12px;
        ">Professional</span>
      </div>
      <p style="color: #6b7280; margin-top: 8px;">Clean lines with a side accent bar</p>
    </div>

    <!-- Invoice Preview -->
    <div style="background: #d1d5db; padding: 16px; border-radius: 12px; margin-bottom: 24px;">
      <!-- Full invoice preview rendered here -->
      <!-- Uses businessData.brandColor and businessData.accentColor -->
    </div>

    <!-- Navigation -->
    <!-- Desktop: Horizontal layout -->
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px;">
      <button onclick="previousTemplate()">← Previous</button>

      <!-- Quick Select Pills -->
      <div style="display: flex; gap: 8px; overflow-x: auto;">
        <button class="template-pill">Modern</button>
        <button class="template-pill active">Classic</button>
        <button class="template-pill">Minimal</button>
        <!-- ... more pills -->
      </div>

      <button onclick="nextTemplate()">Next →</button>
    </div>
  </main>
</div>
```

**CSS for Filter Buttons:**

```css
.category-filter {
  padding: 6px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.category-filter.active {
  background: #1e3a8a;
  color: white;
  border-color: #1e3a8a;
}

.template-pill {
  padding: 8px 16px;
  border-radius: 6px;
  background: #f3f4f6;
  color: #374151;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.template-pill.active {
  background: #1e3a8a;
  color: white;
}
```

**JavaScript Logic:**

```javascript
// State management
let currentTemplateIndex = 0;
let selectedCategory = "All";
let filteredTemplates = INVOICE_TEMPLATES;

// Filter templates by category
function filterByCategory(category) {
  selectedCategory = category;
  filteredTemplates = category === "All"
    ? INVOICE_TEMPLATES
    : INVOICE_TEMPLATES.filter(t => t.category === category);
  currentTemplateIndex = 0;
  renderCurrentTemplate();
}

// Navigate templates
function previousTemplate() {
  currentTemplateIndex = currentTemplateIndex > 0
    ? currentTemplateIndex - 1
    : filteredTemplates.length - 1;
  renderCurrentTemplate();
}

function nextTemplate() {
  currentTemplateIndex = currentTemplateIndex < filteredTemplates.length - 1
    ? currentTemplateIndex + 1
    : 0;
  renderCurrentTemplate();
}

// Select template
async function selectCurrentTemplate() {
  const template = filteredTemplates[currentTemplateIndex];

  // Save to backend
  await fetch('/api/business', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      invoiceTemplate: template.id
    })
  });

  // Show success message
  showToast(`${template.name} template selected!`);

  // Go back to settings
  goBack();
}

// Render current template preview
function renderCurrentTemplate() {
  const template = filteredTemplates[currentTemplateIndex];
  document.querySelector('.template-info h1').textContent = template.name;
  document.querySelector('.template-info .badge').textContent = template.category;
  document.querySelector('.template-info p').textContent = template.description;

  // Update counter
  document.querySelector('.template-counter').textContent =
    `${currentTemplateIndex + 1} of ${filteredTemplates.length}`;

  // Render invoice preview with template
  renderInvoicePreview(template.id);
}
```

---

## Invoice Templates

The app provides 15 professionally designed invoice templates across 4 categories. All templates respect the user's custom `brandColor` and `accentColor` settings.

### Template Categories

- **Professional** (6 templates): Traditional, business-appropriate designs
- **Creative** (5 templates): Modern, colorful, eye-catching layouts
- **Tech** (2 templates): Startup-friendly, technical designs
- **Premium** (2 templates): Luxury, high-end aesthetics

---

### 1. Modern Template (Professional)

**ID:** `modern`  
**Description:** Clean lines with a side accent bar

**Visual Characteristics:**

- Vertical accent bar on the left side (4px, uses `accentColor`)
- Clean header with logo and business name only
- No address displayed
- Logo has circular border (uses `brandColor`)
- "INVOICE" text in `brandColor`
- Item grid layout
- Totals section with `brandColor` for labels
- Footer with contact card (border uses `brandColor`)

**Key Styling:**

```html
<!-- Header -->
<div style="border-left: 4px solid {accentColor}; padding-left: 16px;">
  <div style="border: 2px solid {brandColor}; border-radius: 50%;">
    <img src="{customLogo}" />
  </div>
  <div style="color: {brandColor}; font-weight: 600;">INVOICE</div>
</div>

<!-- Footer Contact Card -->
<div style="background: #f9fafb; border: 2px solid {brandColor}; border-radius: 12px;">
  <h3 style="color: {brandColor};">Questions or Need Support?</h3>
  <p style="color: {brandColor};">{contactEmail}</p>
</div>
```

---

## Color Extraction Algorithm

The app includes an intelligent color extraction algorithm that analyzes uploaded logos and suggests complementary color palettes.

### Algorithm Overview

1. **Image Loading**: Converts uploaded file to base64 data URL
2. **Pixel Sampling**: Samples every 10th pixel for performance
3. **Color Filtering**:
   - Skips transparent pixels (alpha < 125)
   - Filters out too-light (brightness > 240) or too-dark (brightness < 40) colors
   - In light mode: prefers brightness between 50-200
   - In dark mode: prefers brightness < 150
4. **Color Grouping**: Rounds RGB values to nearest 10 to group similar colors
5. **HSL Conversion**: Converts RGB to HSL for better color analysis
6. **Spectrum Categorization**: Groups colors into spectrums (Red, Orange, Yellow, Green, Cyan, Blue, Purple, Grey, White, Black)
7. **Contrast Calculation**: Finds pairs with high contrast:
   - Neutral + Saturated = 0.9 contrast score
   - Complementary colors (180° apart) = maximum contrast
   - Adjacent colors (< 60° apart) = low contrast
8. **Option Generation**: Returns top 5 color combinations with highest contrast

### Usage Example

```javascript
// Extract colors from logo
const extractColorsFromImage = async (imageDataUrl, isDarkMode = false) => {
  // Returns: { options: [{ primary: '#1E3A8A', accent: '#14B8A6', name: 'Ocean Blue' }] }
};

// In component
const handleLogoUpload = async (file) => {
  const reader = new FileReader();
  reader.onloadend = async () => {
    const dataUrl = reader.result;
    setCustomLogo(dataUrl);

    // Extract colors
    const { options } = await extractColorsFromImage(dataUrl);
    // Display options to user for selection
    setColorOptions(options);
  };
  reader.readAsDataURL(file);
};
```

### Sample Color Palettes (Fallbacks)

**Light Mode:**

```javascript
[
  { primary: '#1E3A8A', accent: '#14B8A6', name: 'Deep Blue' },
  { primary: '#14B8A6', accent: '#1E3A8A', name: 'Teal Wave' }
]
```

**Dark Mode:**

```javascript
[
  { primary: '#60A5FA', accent: '#34D399', name: 'Ocean Blue' },
  { primary: '#34D399', accent: '#60A5FA', name: 'Emerald Green' }
]
```

---

## Frontend Implementation

### 1. Initialize Component State

```javascript
const [brandColor, setBrandColor] = useState(businessData.brandColor || '#1E3A8A');
const [accentColor, setAccentColor] = useState(businessData.accentColor || '#14B8A6');
const [invoiceTemplate, setInvoiceTemplate] = useState(businessData.invoiceTemplate || 'modern');
const [customLogo, setCustomLogo] = useState(businessData.customLogo || businessData.logo || '');
const [saving, setSaving] = useState(false);
```

### 2. Load Existing Branding Settings

```javascript
useEffect(() => {
  // Fetch business data
  const loadBusinessData = async () => {
    const data = await businessApi.get();

    // Set branding values
    setBrandColor(data.brandColor || '#1E3A8A');
    setAccentColor(data.accentColor || '#14B8A6');
    setInvoiceTemplate(data.invoiceTemplate || 'modern');
    setCustomLogo(data.customLogo || data.logo || '');
  };

  loadBusinessData();
}, []);
```

### 3. Handle Logo Upload

```javascript
const handleLogoUpload = async (event) => {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result;
      setCustomLogo(dataUrl);

      // Extract colors from logo
      const { options } = await extractColorsFromImage(dataUrl);
      if (options.length > 0) {
        // Show color options to user
        setColorOptions(options);
        setShowColorOptions(true);
      }
    };
    reader.readAsDataURL(file);
  }
};
```

### 4. Save Branding Settings

```javascript
const handleSave = async () => {
  setSaving(true);
  try {
    const updatedData = {
      ...businessData,
      brandColor,
      accentColor,
      invoiceTemplate,
      customLogo,
    };

    // Save to backend
    await businessApi.update(updatedData);

    // Update local state
    onUpdateBusinessData(updatedData);

    // Show success message
    toast.success('Branding settings saved successfully!');
  } catch (error) {
    console.error('Error saving branding settings:', error);
    toast.error('Failed to save branding settings');
  } finally {
    setSaving(false);
  }
};
```

### 5. Color Picker UI

```html
<!-- Primary Brand Color -->
<div>
  <label>Primary Brand Color</label>
  <div style="display: flex; gap: 8px;">
    <input
      type="color"
      value={brandColor}
      onChange={(e) => setBrandColor(e.target.value)}
      style="width: 64px; height: 40px; cursor: pointer;"
    />
    <input
      type="text"
      value={brandColor}
      onChange={(e) => setBrandColor(e.target.value)}
      placeholder="#1E3A8A"
      style="flex: 1;"
    />
  </div>
</div>

<!-- Accent Color -->
<div>
  <label>Accent Color</label>
  <div style="display: flex; gap: 8px;">
    <input
      type="color"
      value={accentColor}
      onChange={(e) => setAccentColor(e.target.value)}
      style="width: 64px; height: 40px; cursor: pointer;"
    />
    <input
      type="text"
      value={accentColor}
      onChange={(e) => setAccentColor(e.target.value)}
      placeholder="#14B8A6"
      style="flex: 1;"
    />
  </div>
</div>
```

### 6. Template Selector

```html
<div>
  <label>Invoice Template</label>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
    <!-- Modern -->
    <div
      onClick={() => setInvoiceTemplate('modern')}
      style={{
        border: invoiceTemplate === 'modern' ? '2px solid blue' : '1px solid gray',
        cursor: 'pointer',
        padding: '16px',
        borderRadius: '8px'
      }}
    >
      <div style="font-weight: 600;">Modern</div>
      <div style="font-size: 12px; color: gray;">Clean with accent bar</div>
    </div>

    <!-- Classic -->
    <div
      onClick={() => setInvoiceTemplate('classic')}
      style={{
        border: invoiceTemplate === 'classic' ? '2px solid blue' : '1px solid gray',
        cursor: 'pointer',
        padding: '16px',
        borderRadius: '8px'
      }}
    >
      <div style="font-weight: 600;">Classic</div>
      <div style="font-size: 12px; color: gray;">Traditional with header</div>
    </div>

    <!-- Minimal -->
    <div
      onClick={() => setInvoiceTemplate('minimal')}
      style={{
        border: invoiceTemplate === 'minimal' ? '2px solid blue' : '1px solid gray',
        cursor: 'pointer',
        padding: '16px',
        borderRadius: '8px'
      }}
    >
      <div style="font-weight: 600;">Minimal</div>
      <div style="font-size: 12px; color: gray;">Ultra-clean design</div>
    </div>
  </div>
</div>
```

---

## Premium Feature Gating

### Check Premium Access

```javascript
import { usePremiumFeatures } from '../utils/usePremiumFeatures';

const { hasCustomBranding, subscription } = usePremiumFeatures();

if (!hasCustomBranding) {
  // Show upgrade prompt
  return (
    <div>
      <h3>Custom Branding</h3>
      <p>Upgrade to Premium to customize your invoice appearance</p>
      <button onClick={onUpgrade}>Upgrade to Premium</button>
    </div>
  );
}
```

### Subscription Types with Access

- **Trial** (`subscription.planType === 'trial'`): ✅ Full access
- **Premium** (`subscription.planType === 'premium'`): ✅ Full access
- **Basic** (`subscription.planType === 'basic'`): ❌ No access
- **Free/None** (`subscription.planType === null`): ❌ No access

### Feature List for Upgrade Prompt

```
✅ Custom brand colors
✅ Upload your logo
✅ Professional invoice templates
✅ Consistent brand experience
```

---

## Integration Checklist

### Backend Requirements

- [ ] Ensure `brandColor`, `accentColor`, `invoiceTemplate`, and `customLogo` fields exist in business data schema
- [ ] `GET /business` returns branding fields
- [ ] `PATCH /business` accepts and saves branding fields
- [ ] Optional: `POST /business/logo` endpoint for dedicated logo upload

### Frontend Requirements

- [ ] Color picker inputs for brand and accent colors
- [ ] File upload for custom logo with preview
- [ ] Template selector with 3 options (modern, classic, minimal)
- [ ] Save button that calls `PATCH /business`
- [ ] Load existing settings on component mount
- [ ] Premium feature gate (show upgrade prompt for Basic/Free users)
- [ ] Optional: Color extraction algorithm for logo analysis

### Invoice Generation

- [ ] PDF generator uses `brandColor`, `accentColor`, `invoiceTemplate` from business data
- [ ] Email templates use same branding settings
- [ ] Preview component shows accurate representation
- [ ] All 3 templates properly render with custom colors and logos

### Testing

- [ ] Upload logo and verify it appears in invoice preview
- [ ] Change colors and verify they apply to invoice
- [ ] Switch between templates and verify correct layout
- [ ] Save settings and reload page to verify persistence
- [ ] Test with Basic plan user (should see upgrade prompt)
- [ ] Test with Premium/Trial user (should have full access)

---

## Example API Calls

### JavaScript/TypeScript

```javascript
// Fetch branding settings
const fetchBranding = async () => {
  const response = await fetch(
    'https://xrgywtdjdlqthpthyxwj.supabase.co/functions/v1/make-server-dce439b6/business',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  const data = await response.json();
  return {
    brandColor: data.brandColor || '#1E3A8A',
    accentColor: data.accentColor || '#14B8A6',
    invoiceTemplate: data.invoiceTemplate || 'modern',
    customLogo: data.customLogo || data.logo
  };
};

// Save branding settings
const saveBranding = async (brandColor, accentColor, invoiceTemplate, customLogo) => {
  const response = await fetch(
    'https://xrgywtdjdlqthpthyxwj.supabase.co/functions/v1/make-server-dce439b6/business',
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        brandColor,
        accentColor,
        invoiceTemplate,
        customLogo
      })
    }
  );
  return await response.json();
};
```

---

## Support & Questions

For implementation questions or issues, refer to:

- `/components/CustomBrandingSection.tsx` - Full implementation reference
- `/components/InvoicePDFPreview.tsx` - Template rendering examples
- `/utils/api.tsx` - API client implementation
- `/supabase/functions/server/routes/business.ts` - Backend endpoints

---

**Document Version:** 1.0  
**Last Updated:** November 21, 2025  
**App Version:** BilltUp Mobile v1.0