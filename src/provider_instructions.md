# Payment Provider API Integration Guide (Website)

**For**: Website Development Team  
**Purpose**: Implement payment provider selection in web dashboard  
**Date**: January 20, 2026  
**Status**: 🗑️ Temporary Guide - Delete After Implementation

---

## 📖 Overview

This guide explains how to integrate the payment provider selection feature into the BilltUp website dashboard. The mobile app already has this feature in the Settings screen.

## 🎯 What to Build

A settings section that allows users to:
1. View their current payment provider (Stripe or Square)
2. Switch between Stripe and Square
3. Connect/disconnect their payment accounts
4. See connection status

---

## 🔌 API Endpoints

### Base URL
```
https://xrgywtdjdlqthpthyxwj.supabase.co/functions/v1/make-server-dce439b6
```

### 1. GET /payment-provider/active

**Purpose**: Get the user's currently selected payment provider

**Authentication**: Required (Bearer token)

**Request**:
```javascript
const response = await fetch(
  'https://xrgywtdjdlqthpthyxwj.supabase.co/functions/v1/make-server-dce439b6/payment-provider/active',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  }
);

const data = await response.json();
```

**Response** (200):
```json
{
  "provider": "stripe"
}
```

**Possible Values**:
- `"stripe"` - Stripe Connect is active
- `"square"` - Square is active

**Default**: If user hasn't set a provider, returns `"stripe"`

**Errors**:
- `401` - Unauthorized (invalid/missing token)
- `500` - Server error

---

### 2. POST /payment-provider/set

**Purpose**: Set/change the user's active payment provider

**Authentication**: Required (Bearer token)

**Request**:
```javascript
const response = await fetch(
  'https://xrgywtdjdlqthpthyxwj.supabase.co/functions/v1/make-server-dce439b6/payment-provider/set',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      provider: 'stripe' // or 'square'
    })
  }
);

const data = await response.json();
```

**Request Body**:
```json
{
  "provider": "stripe"
}
```

**Valid Values**: `"stripe"` or `"square"` only

**Response** (200):
```json
{
  "success": true,
  "provider": "stripe"
}
```

**Errors**:
- `400` - Invalid provider (not 'stripe' or 'square')
- `401` - Unauthorized (invalid/missing token)
- `500` - Server error

---

## 💻 Complete Implementation Example

### React Component (TypeScript)

```typescript
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type PaymentProvider = 'stripe' | 'square';

interface PaymentProviderSettingsProps {
  accessToken: string;
}

export function PaymentProviderSettings({ accessToken }: PaymentProviderSettingsProps) {
  const [activeProvider, setActiveProvider] = useState<PaymentProvider>('stripe');
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current provider on mount
  useEffect(() => {
    fetchActiveProvider();
  }, []);

  const fetchActiveProvider = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        'https://xrgywtdjdlqthpthyxwj.supabase.co/functions/v1/make-server-dce439b6/payment-provider/active',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch payment provider');
      }

      const data = await response.json();
      setActiveProvider(data.provider);
    } catch (err) {
      console.error('Error fetching payment provider:', err);
      setError('Failed to load payment provider settings');
      // Default to stripe if error
      setActiveProvider('stripe');
    } finally {
      setLoading(false);
    }
  };

  const switchProvider = async (newProvider: PaymentProvider) => {
    if (newProvider === activeProvider) return;

    try {
      setSwitching(true);
      setError(null);

      const response = await fetch(
        'https://xrgywtdjdlqthpthyxwj.supabase.co/functions/v1/make-server-dce439b6/payment-provider/set',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ provider: newProvider })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to switch provider');
      }

      const data = await response.json();
      
      if (data.success) {
        setActiveProvider(data.provider);
        // Show success message
        console.log('Payment provider switched to:', data.provider);
      }
    } catch (err) {
      console.error('Error switching payment provider:', err);
      setError(err instanceof Error ? err.message : 'Failed to switch provider');
    } finally {
      setSwitching(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Payment Provider</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-md mb-4">
          {error}
        </div>
      )}

      <p className="text-sm text-muted-foreground mb-4">
        Choose how you want to process invoice payments
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stripe Option */}
        <div
          onClick={() => !switching && switchProvider('stripe')}
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            activeProvider === 'stripe'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          } ${switching ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.brandfetch.io/stripe.com/w/400/h/400" 
                alt="Stripe" 
                className="w-10 h-10"
              />
              <div>
                <h4 className="font-semibold">Stripe</h4>
                <p className="text-xs text-muted-foreground">2.9% + $0.30</p>
              </div>
            </div>
            {activeProvider === 'stripe' && (
              <Badge className="bg-primary">Active</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Industry-leading payment processor with instant payouts
          </p>
        </div>

        {/* Square Option */}
        <div
          onClick={() => !switching && switchProvider('square')}
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            activeProvider === 'square'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          } ${switching ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.brandfetch.io/square.com/w/400/h/400" 
                alt="Square" 
                className="w-10 h-10"
              />
              <div>
                <h4 className="font-semibold">Square</h4>
                <p className="text-xs text-muted-foreground">2.6% + $0.10</p>
              </div>
            </div>
            {activeProvider === 'square' && (
              <Badge className="bg-primary">Active</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Integrated POS and payment solution with competitive rates
          </p>
        </div>
      </div>

      {switching && (
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">Switching provider...</p>
        </div>
      )}
    </Card>
  );
}
```

---

## 🎨 UI/UX Recommendations

### Visual Design
1. **Two-column grid** on desktop, single column on mobile
2. **Card-based selection** with click-to-select
3. **Active indicator** - Badge or checkmark on selected provider
4. **Hover states** - Show it's clickable
5. **Disabled state** - When switching is in progress

### User Feedback
1. **Loading state** - Skeleton while fetching
2. **Success message** - Toast notification when switched
3. **Error handling** - Clear error messages
4. **Optimistic update** - Instant UI feedback, rollback if fails

### Provider Cards
Each card should show:
- ✅ Provider logo
- ✅ Provider name
- ✅ Fee structure (e.g., "2.9% + $0.30")
- ✅ Brief description
- ✅ Active badge (if selected)

---

## 🔄 Integration Flow

### 1. Initial Load
```typescript
// On component mount
useEffect(() => {
  fetchActiveProvider();
}, []);
```

### 2. Display Current Provider
```typescript
// Show which provider is active
{activeProvider === 'stripe' && <Badge>Active</Badge>}
```

### 3. Switch Provider
```typescript
// User clicks on different provider card
onClick={() => switchProvider('square')}
```

### 4. Update UI
```typescript
// On success, update local state
setActiveProvider(data.provider);

// Show success toast
toast.success('Payment provider switched to Square');
```

---

## ⚠️ Error Handling

### Common Errors

**1. Authentication Error (401)**
```typescript
if (response.status === 401) {
  // Redirect to login or refresh token
  window.location.href = '/login';
}
```

**2. Invalid Provider (400)**
```typescript
if (response.status === 400) {
  setError('Invalid payment provider selected');
}
```

**3. Server Error (500)**
```typescript
if (response.status === 500) {
  setError('Server error. Please try again later.');
}
```

**4. Network Error**
```typescript
catch (err) {
  if (err instanceof TypeError && err.message === 'Failed to fetch') {
    setError('Network error. Check your internet connection.');
  }
}
```

---

## 🧪 Testing

### Test Cases

**1. Load Active Provider**
```typescript
// Should show Stripe as active by default
expect(await getActiveProvider()).toBe('stripe');
```

**2. Switch to Square**
```typescript
await switchProvider('square');
expect(await getActiveProvider()).toBe('square');
```

**3. Switch Back to Stripe**
```typescript
await switchProvider('stripe');
expect(await getActiveProvider()).toBe('stripe');
```

**4. Handle Invalid Provider**
```typescript
const response = await setProvider('paypal'); // Invalid
expect(response.status).toBe(400);
```

**5. Handle Unauthorized**
```typescript
const response = await fetch(url, { 
  headers: { Authorization: 'Bearer invalid_token' } 
});
expect(response.status).toBe(401);
```

---

## 📱 Mobile App Reference

The mobile app already implements this feature. Reference implementation:

**File**: `/components/SettingsScreen.tsx`

**Code Location**: Lines ~350-450 (Payment Provider section)

**Key Features**:
- Radio button UI for provider selection
- Shows Stripe and Square logos
- Displays fee structures
- Instant switching with optimistic updates
- Connected account badges

**You can copy the UI pattern** from the mobile app and adapt it for the web dashboard.

---

## 🎨 Recommended UI for Website

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Payment Provider Settings                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Choose how you want to process invoice payments            │
│                                                              │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │  [Stripe Logo]       │  │  [Square Logo]       │        │
│  │                      │  │                      │        │
│  │  Stripe         [✓]  │  │  Square              │        │
│  │  2.9% + $0.30        │  │  2.6% + $0.10        │        │
│  │                      │  │                      │        │
│  │  Industry-leading    │  │  Integrated POS      │        │
│  │  payment processor   │  │  and payment         │        │
│  │                      │  │                      │        │
│  │  [Configure Stripe]  │  │  [Connect Square]    │        │
│  └──────────────────────┘  └──────────────────────┘        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌───────────────────────────┐
│ Payment Provider          │
├───────────────────────────┤
│                           │
│ ┌─────────────────────┐  │
│ │ [Stripe Logo]       │  │
│ │ Stripe         [✓]  │  │
│ │ 2.9% + $0.30        │  │
│ │ [Configure]         │  │
│ └─────────────────────┘  │
│                           │
│ ┌─────────────────────┐  │
│ │ [Square Logo]       │  │
│ │ Square              │  │
│ │ 2.6% + $0.10        │  │
│ │ [Connect]           │  │
│ └─────────────────────┘  │
│                           │
└───────────────────────────┘
```

---

## 🔐 Authentication

### Getting the Access Token

The website should already have the user's access token from login. If using Supabase Auth:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xrgywtdjdlqthpthyxwj.supabase.co',
  'your_anon_key'
);

// Get current session
const { data: { session } } = await supabase.auth.getSession();
const accessToken = session?.access_token;

// Use in API calls
headers: {
  'Authorization': `Bearer ${accessToken}`
}
```

---

## 📦 Complete API Client Example

Create a utility file for payment provider API calls:

```typescript
// utils/paymentProviderApi.ts

const API_BASE = 'https://xrgywtdjdlqthpthyxwj.supabase.co/functions/v1/make-server-dce439b6';

export type PaymentProvider = 'stripe' | 'square';

export interface PaymentProviderResponse {
  provider: PaymentProvider;
}

export interface SetProviderResponse {
  success: boolean;
  provider: PaymentProvider;
}

export class PaymentProviderApi {
  constructor(private accessToken: string) {}

  async getActiveProvider(): Promise<PaymentProvider> {
    try {
      const response = await fetch(`${API_BASE}/payment-provider/active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error('Failed to fetch payment provider');
      }

      const data: PaymentProviderResponse = await response.json();
      return data.provider;
    } catch (error) {
      console.error('Error fetching payment provider:', error);
      // Default to stripe if error
      return 'stripe';
    }
  }

  async setProvider(provider: PaymentProvider): Promise<SetProviderResponse> {
    const response = await fetch(`${API_BASE}/payment-provider/set`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      },
      body: JSON.stringify({ provider })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to set payment provider');
    }

    return await response.json();
  }
}

// Usage example:
// const api = new PaymentProviderApi(accessToken);
// const provider = await api.getActiveProvider();
// await api.setProvider('square');
```

---

## 🎯 Integration Checklist

### Frontend Implementation
- [ ] Create PaymentProviderSettings component
- [ ] Add to Settings/Account page
- [ ] Implement provider selection UI
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add success notifications (toast)
- [ ] Test switching between providers
- [ ] Test error scenarios

### API Integration
- [ ] Create API client utility
- [ ] Implement GET /payment-provider/active
- [ ] Implement POST /payment-provider/set
- [ ] Add authentication headers
- [ ] Handle 401 errors (redirect to login)
- [ ] Handle 400 errors (invalid provider)
- [ ] Handle network errors

### Testing
- [ ] Test loading active provider
- [ ] Test switching to Stripe
- [ ] Test switching to Square
- [ ] Test with invalid token (401)
- [ ] Test with invalid provider (400)
- [ ] Test offline/network error
- [ ] Test switching multiple times
- [ ] Test UI states (loading, error, success)

---

## 🔗 Related Endpoints

After switching providers, you may need to:

### Stripe Connect
- **GET** `/stripe/account-status` - Check Stripe connection status
- **POST** `/stripe/account-link` - Connect Stripe account

### Square Connect
- **GET** `/square/account-status` - Check Square connection status
- **POST** `/square/connect` - Connect Square account

---

## 💡 Important Notes

### 1. Provider vs Connection
- **Provider** = Which payment processor is ACTIVE
- **Connection** = Whether account is CONNECTED to that processor

**User Flow**:
1. Select provider (Stripe or Square)
2. Connect account (OAuth flow)
3. Start accepting payments

### 2. Default Behavior
- New users default to **Stripe**
- No connection required until user wants to accept payments
- Provider selection can happen before or after connecting

### 3. Switching Providers
- Users can switch freely between Stripe and Square
- Both accounts can be connected simultaneously
- Only one provider is "active" for new invoices
- Existing invoices keep their original payment provider

### 4. No Platform Fees
- BilltUp revenue comes from subscriptions ($4.99/$9.99)
- NO markup on payment processing fees
- Users pay standard Stripe/Square rates only

---

## 📋 API Response Examples

### Success Responses

**Get Active Provider**:
```json
{
  "provider": "stripe"
}
```

**Set Provider**:
```json
{
  "success": true,
  "provider": "square"
}
```

### Error Responses

**Unauthorized (401)**:
```json
{
  "error": "Unauthorized - Authentication required"
}
```

**Invalid Provider (400)**:
```json
{
  "error": "Invalid payment provider"
}
```

**Server Error (500)**:
```json
{
  "error": "Failed to set payment provider"
}
```

---

## 🎨 Design Assets

### Provider Logos

**Stripe**:
- URL: `https://cdn.brandfetch.io/stripe.com/w/400/h/400`
- Brand Color: `#635BFF`

**Square**:
- URL: `https://cdn.brandfetch.io/square.com/w/400/h/400`
- Brand Color: `#000000`

### BilltUp Brand Colors
- Primary: `#1E3A8A` (Deep Blue)
- Secondary: `#14B8A6` (Teal)
- Accent: `#F59E0B` (Amber)

---

## 📞 Questions?

If you have questions about this integration:

1. **Check mobile app implementation**: `/components/SettingsScreen.tsx`
2. **Review API code**: `/supabase/functions/make-server-dce439b6/index.tsx` (line 2770)
3. **Test endpoints**: Use the examples above
4. **Contact**: dev@billtup.com

---

## ✅ Definition of Done

Implementation is complete when:

- ✅ User can view their active payment provider
- ✅ User can switch between Stripe and Square
- ✅ UI shows loading states appropriately
- ✅ Error messages are clear and actionable
- ✅ Success feedback is provided
- ✅ Works on desktop and mobile
- ✅ All test cases pass
- ✅ Code is reviewed and merged

---

**Guide Created**: January 20, 2026  
**For**: Website Development Team  
**Mobile Reference**: `/components/SettingsScreen.tsx` (lines 350-450)  
**Backend**: `/supabase/functions/make-server-dce439b6/` (lines 2770-2820 in combined file)

🗑️ **DELETE THIS FILE** after implementation is complete!
