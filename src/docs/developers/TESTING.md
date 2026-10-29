# Testing

## What exists today

- There are no automated tests in this repo: no test runner, no test files, and no `test` script.
- There is no lint or type-check step. There is no `tsconfig.json`, and Vite does not report type errors.
- `npm run build` is the only check. The deploy workflow runs it on every push, so a build error stops the deploy.

So test by hand on a local dev server or on dev.billtup.com before promoting to `stg`, and again on stg.billtup.com before promoting to `main`.

## Before every push

```bash
npm run build
```

Fix any error. Chunk-size warnings are expected.

## Smoke test

Run the parts that your change touches. Before a release to `main`, run all of it on stg.billtup.com.

### Public pages

- [ ] Home, Features, Pricing, FAQ, Docs, Help, About, Contact, Integrations, Roadmap, Changelog load from the header and footer links.
- [ ] Privacy, Terms, Security, and `/delete-account` load.
- [ ] An unknown path (for example `/nope`) goes to the home page.
- [ ] Reloading a deep link (for example `/pricing` or `/dashboard/settings`) loads the right page.
- [ ] The pages work at phone width (about 375 px).

### Sign-up and sign-in

- [ ] Sign up with a new email. The page says the 14-day trial has started and no card is needed.
- [ ] Sign in. You land on `/dashboard`. The trial banner shows the days left.
- [ ] Open `/dashboard/settings` while signed out. You go to `/signin`, and after signing in you come back to `/dashboard/settings`.
- [ ] Settings → Account → reset password sends an email, and the link in it opens `/reset-password`, which sets a new password. (The "Forgot password?" button on the sign-in page has no action yet.)
- [ ] Sign out from the user menu.

### Dashboard

- [ ] Overview shows the billing cycle usage.
- [ ] Analytics loads for a trial or Premium account, and the period filter changes the numbers. It is locked for Basic.
- [ ] Each Settings card opens and saves: Account, Business Profile, Customer Analytics, Payment Settings, Email Notifications, Saved Items & Discounts, Custom Branding, Help & Support.
- [ ] Custom Branding: change the logo, logo shape, colors, and template, then reload and check they stuck.

### Subscriptions (test mode only)

- [ ] During the trial, "Choose a plan" opens the Subscribe dialog. Subscribe with a Stripe test card (see [Stripe and Square](./STRIPE_SETUP.md#testing)).
- [ ] Settings → Account shows the plan. Change plan, cancel, and reactivate work.
- [ ] A promo code can be applied.
- [ ] A trial-ended account without a plan shows the "Your free trial has ended" banner and stays read-only. Saving a change shows the "Choose a plan" toast.

### Customer pages

Create an invoice, estimate, or signature request in the mobile app against the dev API to get a link.

- [ ] `/pay/<token>` shows the invoice and opens Stripe or Square checkout. After paying, the success page shows.
- [ ] An already-paid or expired link shows the right message.
- [ ] `/estimate/<token>` can approve and reject.
- [ ] `/sign/<token>` accepts a signature with mouse and touch.

### Payment Settings

- [ ] Connect and disconnect Stripe (test account) and Square (sandbox). The OAuth callback returns to the dashboard.
- [ ] Switching the active provider saves.

## Accessibility checks

See [Accessibility](../ACCESSIBILITY.md#how-to-test).
