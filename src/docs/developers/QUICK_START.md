# Quick Start

## Prerequisites

- Node.js 20 (the deploy workflow uses 20) and npm
- Git
- The dev values for `.env` (ask a maintainer)

## Set up

```bash
git clone <repo-url>
cd billtup_frontend
git checkout dev
npm install
cp .env.example .env
```

Fill in `.env`:

```
VITE_API_URL=<dev API base URL, no trailing path>
VITE_COGNITO_REGION=<region>
VITE_COGNITO_USER_POOL_ID=<dev user pool ID>
VITE_COGNITO_CLIENT_ID=<dev app client ID>
```

Vite reads only `VITE_`-prefixed variables, and they all end up in the browser bundle. Never put a secret in `.env`. `.env` is git-ignored.

## Run

```bash
npm run dev -- --host
```

The `--host` flag is required. Vite serves on port 3000 and opens a browser. Use the Network URL it prints to test on a phone on the same Wi-Fi.

`src/start-dev.sh` and `src/start-dev.bat` do the same but bind to `127.0.0.1` only.

## Build

```bash
npm run build
```

Output goes to `build/`. These are the only two npm scripts (`dev` and `build`).

## Day-to-day workflow

1. Work on `dev`. Commit small changes.
2. Run `npm run build` before you push. It is the only automatic check.
3. Push `dev`. dev.billtup.com updates in a few minutes.
4. Promote `dev` → `stg` → `main` with pull requests. See [Deployment](./DEPLOYMENT.md).

## Things to know

- **Styles:** `src/index.css` is a pre-built Tailwind CSS file. Tailwind does not run at build time, so a class that is not already in `index.css` has no effect. Check with a search before you rely on a new class, or use inline styles.
- **Imports with versions:** some imports look like `lucide-react@0.468.0` or `@stripe/stripe-js@4.0.0`. `vite.config.ts` maps these aliases to the normal packages. Both forms work.
- **`@` alias:** `@/` points to `src/`.
- **Types:** there is no `tsconfig.json` and no type-check step. Vite does not report type errors.
- **API:** the API and mobile app live in a separate repo. If the site needs a new endpoint, it is added there.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Sign-in fails right away | Check the three `VITE_COGNITO_*` values in `.env` and restart the dev server. |
| Every API call fails | Check `VITE_API_URL`. It must not end in `/billtup-api`; the code adds that. |
| Phone can't reach the dev server | Start with `--host` and use the Network URL. Check your firewall allows port 3000. |
| `localhost` doesn't resolve | Use `src/start-dev.sh` or `src/start-dev.bat`, which bind to `127.0.0.1`. |
| A style doesn't apply | The class is probably missing from `src/index.css` (see above). |
