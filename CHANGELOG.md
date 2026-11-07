# Changelog

Website releases to production (billtup.com), by the date they reached `main`. Older history from before the move to AWS is in `src/docs/archive/changelog/`.

## Unreleased

- Home page and site header redesigned in the approved C2 style, "BilltUp Blue with gradients" (app repo BACKLOG P4.1). Navy gradient hero with a slanted edge, "Send the invoice. Get paid on the spot.", the App Store and Google Play badges, and an app home screen mockup with "payment received" and "estimate approved" cards. Below it: a "Take payments with" strip, three "job done to paid" steps, six features with links to the trade pages, Basic/Premium pricing, and a closing call to action. The "Native mobile apps" section is no longer on the home page (the store badges are in the hero). The header is transparent over the hero on the home page (solid navy once you scroll) and white on other pages, with the new "BilltUp" wordmark, a Trades menu listing the trade pages, and "Start free trial". The footer is now light. These sections use Inter; styles are plain CSS in `src/styles/c2-site.css` because `src/index.css` is a pre-built Tailwind file. `PRICING_CONFIG.basic.invoiceLimit` corrected from 25 to 10 (with `estimateLimit` and `customerLimit` of 10), matching what the API enforces; the home pricing reads these values.

- Customer tips (app repo BACKLOG P2.0). Pay page: when the invoice was sent with "Allow tip", a quiet "Add a tip" button under Pay opens 10% / 15% / 20% / Custom (nothing pre-selected) and "No tip"; a chosen tip shows as its own line, the processing fee is worked out again on amount + tip (same formula as the API) and the Pay amount updates; the tip is sent with checkout. Deposits and invoices without "Allow tip" look as before. Checkout errors now show on the page. Analytics shows "Tips $X (not in revenue)" under Total Revenue. Unit tests: vitest + Testing Library added (`npm test`). Tipping on the website is the pay page and Analytics only: the dashboard does not send invoices or take payments (the app does), and the unused `InvoiceViewModal` / `TakePaymentModal` dialogs have no tip code.
- Amounts show thousands separators ($12,015.76) on the dashboard, payment, estimate and sign pages: one formatter, `src/utils/money.ts` (app repo BACKLOG N.66).
- Customer estimate and signature pages add up: the estimate page now shows subtotal, discount and tax before the total (it showed only the items and the total), and the sign page shows the discount line; dates show as "Oct 30, 2026" on the right day (the estimate page showed them a day early, the sign page as "2026-10-31"). App repo BACKLOG N.73, found by the email tests (TESTING.md EST-05, EML-02).
- Invoice due dates show the right day: dates stored as "2026-11-29" were read as midnight UTC, which displayed the day before in US time zones (InvoicesTab). Found by the app repo's live test suite.
- Dashboard lists always show the latest data: requests to the API skip the browser cache. The API sends GET responses with a 60-second private cache time, so a list reloaded within a minute of a change (for example after marking an invoice paid) could show the old version. Found by the app repo's live test suite (TESTING.md).
- Trade pages (app repo BACKLOG M.6): /invoice-app-for-plumbers, -landscapers, -mobile-detailers, -electricians and -small-business, each written for its trade (pain points, features, a typical job, line items, FAQ), with their own titles and descriptions, in the sitemap, and linked from the footer.

## 2026-10-29 (3)

- Search engines (app repo BACKLOG M.6): `robots.txt` and `sitemap.xml` (both used to return the homepage); a real title and description on every public page, a canonical address on billtup.com, and social-preview tags; account, payment, signature and estimate-approval pages kept out of search; dev and stg get "Disallow: /" so they never appear in Google.

## 2026-10-29 (2)

- Basic plan now includes 10 estimates a month (app repo BACKLOG N.26): pricing, FAQ, help, account settings, the subscribe dialog and Terms section 4 (last updated October 29, 2026) say so.
- Basic plan limits (app repo BACKLOG N.26): creating an invoice, a customer, or an estimate (past the estimate limit, or with a new customer past the customer limit) shows "You've reached your monthly limit of 10 invoices…" with where to upgrade, instead of "Failed to create". The Invoices tab shows "You've created X of 10 invoices this billing period" from the real count (it counted all invoices ever, and its usage call went to a route that doesn't exist).

## 2026-10-29

- Home page: the Google Play and App Store buttons have side padding again, so "Google Play" and "Download on the" no longer touch the edge. The buttons used `px-5`, which the pre-built stylesheet (`src/index.css`) doesn't include; they now use `px-6`. They also get the dark see-through background they were designed with (`bg-black/30`, darker on hover), added by hand to the stylesheet.

## 2026-10-28 (2)

- App Store subscribers see "Billed through the App Store" in account settings, with the renewal date, how to turn off renewal at account.apple.com, and that they can subscribe by card once it ends; the card plan and cancel buttons are hidden for them (app repo BACKLOG N.29, P2.7).
- Terms of Service and Privacy Policy rewritten (last updated October 28, 2026): $4.99/$9.99 card and App Store billing and cancellation, processing fee paid by the customer, account deletion, Apple's app terms, Arizona law; the Privacy Policy lists every service that receives personal data. Wording approved by the owner (app repo BACKLOG N.20).

## 2026-10-28

- Subscribing on billtup.com uses the live Stripe key (production had a test key, so the card form could not load). App repo BACKLOG N.17.
- App Store buttons and the hero badge open BilltUp on the App Store.
- Docs rewritten to match the code; stale reports archived.

## 2026-10-08

- Home page hero links to the App Store and Google Play.
- Fixed the Google Play link (package `com.billtup.app`).
- The Help Center link opens the help page.

## 2026-09-30

- New sign-ups get a 14-day free trial with no credit card.
- Subscribe on the website with a card (Stripe), from the trial banner or Settings → Account.
- When the trial ends without a plan, the account is read-only until the user subscribes.

## 2026-03-25

- New `/delete-account` page explaining how to delete an account (Google Play requirement).
- The payment page shows discounts. Saved items and estimate improvements.

## 2026-03-22

- New Saved Items & Discounts settings card. Restyled docs page.

## 2026-03-11

- Promo codes: redeem in Settings → Account.

## 2026-03-10

- Business operations moved to the mobile app. The web dashboard no longer creates or edits invoices, estimates, or customers. It now focuses on account, subscription, settings, and analytics.

## 2026-03-08 to 2026-03-09

- Custom Branding dialog wired up, with a square or circle logo shape.
- Deposit and balance payments on the payment page.
- Signature page fixes for touch screens.
- Removed the unused two-factor authentication button.

## 2026-03-07

- The payment page and success page show processing fees.

## 2026-03-01 to 2026-03-05

- Revenue line chart and custom date ranges in analytics. Analytics date filtering fixes.
- Trial details and billing date in account settings.
- Monthly pricing only (annual option removed).
- Sign-in no longer depends on email capitalization.
- Legal pages updated. Removed dead social links from the footer.
- Mobile layout fixes.

## 2026-02-28

- Payment fixes: fees, refunds, payout disclosures.

## 2026-02-26

- Client-side routing with real URLs (React Router). Sign-in returns you to the page you asked for.
- Customer payment page (`/pay/:token`) and Stripe/Square connect flows in Payment Settings.
- Estimates, estimate approval page, line item notes and autocomplete, photo uploads.
- Subscription cancel and reactivate. Trial users get Premium features.
- 1-hour inactivity sign-out. Confirmation before leaving the dashboard while signed in.
- Contact form sends email through the API.

## 2026-02-16

- Moved from Supabase and Namecheap hosting to AWS: Cognito sign-in, the BilltUp API on Lambda, and S3 + CloudFront hosting with separate dev, stg, and prod sites.
- Branch promotion check (`dev` → `stg` → `main`).
- Server errors are reported to the team. Quieter console in production.
