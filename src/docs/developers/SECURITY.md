# Security

The website is a static app in the browser. It holds no secrets and no database. The API (in the app repo) does authorization, validation, rate limiting, and data storage. This page covers what the website itself does.

## Secrets and configuration

- Everything in a `VITE_` variable is compiled into the public JavaScript bundle. Only public values go there: the API URL, the Cognito region, user pool ID, and app client ID.
- The Stripe **publishable** key is in `src/utils/config.ts`. Publishable keys are meant to be public. Secret keys (`sk_...`), webhook secrets, and Square access tokens belong only in the API.
- `.env` is git-ignored. `.env.example` lists the variable names only.
- The deploy workflow signs in to AWS through GitHub OIDC (`AWS_ROLE_ARN`). No AWS access keys are stored in GitHub.

## Authentication

- Sign-in goes straight to Amazon Cognito over HTTPS (`src/utils/auth/cognito.ts`, `USER_PASSWORD_AUTH`). The password goes only to Cognito.
- Cognito tokens are stored in `localStorage`. Any script running on the page can read them, so do not add third-party scripts or render untrusted HTML. The code has no `dangerouslySetInnerHTML` outside the shared `ui/` components.
- The ID token is sent as `Authorization: Bearer <token>` on API calls. The API checks it.
- Expired tokens are refreshed with the refresh token. Sign-out calls Cognito `GlobalSignOut` (ignoring errors) and always clears the stored tokens.
- After 1 hour with no activity on `/dashboard` pages, the user is signed out (`src/utils/sessionTimeout.ts`).
- Dashboard routes are wrapped in an auth guard. This only controls what the browser shows; the API is what protects the data.

## Customer pages

`/pay/:token`, `/estimate/:token`, and `/sign/:token` need no sign-in. The token in the URL is issued by the API, and the API decides what it can see and do. Treat these links as private: anyone with the link can open the page.

## Payments

The website never handles raw card numbers.

- **Subscriptions:** the Subscribe dialog uses Stripe's Payment Element. Card fields are Stripe-hosted iframes. The site gets back only a SetupIntent and payment method ID, which it sends to the API to start the subscription.
- **Invoice payments:** `/pay/:token` asks the API for a checkout session and redirects the customer to the Stripe or Square hosted checkout page.
- **Connecting Stripe or Square:** Payment Settings sends the user through Stripe or Square OAuth. The callback page (`/dashboard/oauth/<provider>/callback`) passes the `code` and `state` to the API, which stores the connection.
- **Refunds and payouts** are handled by the API and the mobile app, not the website.

Because card data stays inside Stripe and Square, the site does not store, log, or send card numbers. Keep it that way: never add a plain card input.

## Logging and error reports

- Production builds silence `console.log`, `console.info`, and `console.debug` (`src/main.tsx`). `console.warn` and `console.error` still print.
- `src/utils/errorReporter.ts` sends errors, with the page URL, stack trace, and the signed-in user's ID and email, to the API, which posts them to Slack. Do not put passwords, tokens, or card data in error messages.

## Transport and hosting

- All environments are served over HTTPS by CloudFront.
- Security headers (for example Content-Security-Policy and HSTS) would be set in CloudFront, not in this repo. To verify in AWS.

## Rules for contributors

- No secrets in code, `.env.example`, docs, or `VITE_` variables.
- No new third-party scripts without review.
- No raw HTML from user or API data.
- Card data only through Stripe Elements or hosted checkout.
- Keep this repo public-safe: no AWS account IDs, internal resource IDs, or internal email addresses in docs.

## Reporting a problem

Email support@billtup.com.
