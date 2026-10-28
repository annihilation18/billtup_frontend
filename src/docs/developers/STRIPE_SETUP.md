# Stripe and Square on the Website

This page covers how the website uses Stripe and Square. Server-side setup (secret keys, webhooks, Connect platform settings, fees, payouts, refunds) belongs to the API in the app repo.

## Where the website uses them

| Feature | Provider | How |
|---------|----------|-----|
| Subscribe to Basic or Premium | Stripe | Subscribe dialog (`SubscribeModal.tsx`) with the Stripe Payment Element |
| Customer pays an invoice | Stripe or Square | `/pay/:token` redirects to a hosted checkout page created by the API |
| Business connects a payment account | Stripe and Square | OAuth from Payment Settings (`PaymentSettingsModal.tsx`) |
| Business picks which provider invoices use | — | Payment Settings saves the active provider through the API |

## Subscriptions

1. The user opens the Subscribe dialog (from the trial banner, the "Choose a plan" button, or an upgrade link).
2. The site calls `POST /subscription/create-setup-intent` with the plan. The API returns a SetupIntent client secret.
3. The Stripe Payment Element collects the card. `stripe.confirmSetup()` confirms it with Stripe.
4. The site calls `POST /subscription/activate` with the plan and the payment method ID. The API creates the subscription. If the user is still in the trial, billing starts when the trial ends.

Plan changes, cancel, reactivate, and promo codes are in **Settings → Account** and call `/subscription/*` endpoints.

### Publishable key

The Stripe publishable key is hard-coded in `src/utils/config.ts` (`STRIPE_CONFIG.publishableKey`). It is the same for every environment; there is no `VITE_` variable for it.

It must come from the same Stripe account and the same mode (test or live) as the API's secret key, or confirming the card fails. To switch accounts or modes, change it in `config.ts` and deploy.

## Invoice payments (`/pay/:token`)

1. The page loads the invoice with `GET /pay/:token`. It shows the business branding, line items, discounts, fees, and deposit or balance amounts.
2. When the customer clicks pay, the site calls `POST /pay/:token/checkout`.
3. The API returns a `checkoutUrl` for Stripe or Square (whichever the business uses). The browser goes there.
4. After payment, the provider sends the customer back to `/pay/:token/success`. The API sets that return URL when it creates the checkout (to verify in the API).

The page also handles links that are expired, already paid, or not found.

The website never sees card details for invoice payments.

## Connecting Stripe or Square (OAuth)

1. In **Settings → Payment Settings**, the user clicks Connect.
2. The site asks the API for an OAuth URL (`getStripeOAuthUrl` / `getSquareOAuthUrl`) and adds `redirect_uri=<site origin>/dashboard/oauth/<stripe|square>/callback`.
3. The provider sends the user back to that callback with `code` and `state`.
4. `OAuthCallbackPage.tsx` sends `code` and `state` to the API, which finishes the connection, then returns to the dashboard.

Each callback URL (for dev, stg, prod, and local dev if used) must be allowed in the Stripe Connect and Square app settings. To verify which URLs are registered today.

## Testing

Use dev.billtup.com or a local dev server pointed at the dev API, with test or sandbox accounts only.

Stripe test cards (any future expiry date, any CVC, any ZIP):

| Card | Result |
|------|--------|
| 4242 4242 4242 4242 | Succeeds |
| 4000 0025 0000 3155 | Asks for 3D Secure |
| 4000 0000 0000 9995 | Declined (insufficient funds) |

For Square sandbox payments, use Square's sandbox test cards from the Square developer docs.

Never use a real card on dev or stg.
