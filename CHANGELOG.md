# Changelog

Website releases to production (billtup.com), by the date they reached `main`. Older history from before the move to AWS is in `src/docs/archive/changelog/`.

## Unreleased

- Home page: the Google Play and App Store buttons have side padding again, so "Google Play" and "Download on the" no longer touch the edge. The buttons used `px-5`, which the pre-built stylesheet (`src/index.css`) doesn't include; they now use `px-6`.

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
