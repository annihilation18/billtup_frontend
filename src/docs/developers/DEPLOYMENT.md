# Deployment

The website is a static single-page app. It is built with Vite and served from Amazon S3 through CloudFront. There is one bucket and one CloudFront distribution per environment.

The API, the mobile app, and their deploys live in the app repo, not here.

## Environments

| Environment | Branch | URL | S3 bucket |
|-------------|--------|-----|-----------|
| dev | `dev` | https://dev.billtup.com | `billtup-frontend-dev` |
| stg | `stg` | https://stg.billtup.com | `billtup-frontend-stg` |
| prod | `main` | https://billtup.com, https://www.billtup.com | `billtup-frontend-prod` |

## Branch flow

1. Commit to `dev`. Each push deploys to dev.billtup.com.
2. Open a PR from `dev` to `stg` and merge it. This deploys to stg.billtup.com.
3. Open a PR from `stg` to `main` and merge it. This deploys to billtup.com.

Never push straight to `stg` or `main`, and never skip a stage. The `Enforce Promotion Flow` workflow (`.github/workflows/enforce-promotion.yml`) runs on every PR to `stg` or `main`. It fails if a PR to `stg` does not come from `dev`, or a PR to `main` does not come from `stg`.

## What the deploy workflow does

`.github/workflows/deploy.yml` runs on every push to `dev`, `stg`, or `main`. It picks the environment from the branch (`main` → `prod`, `stg` → `stg`, anything else → `dev`) and uses the GitHub environment of the same name for secrets.

Steps:

1. Check out the code and set up Node.js 20 (with the npm cache).
2. `npm ci`
3. `npm run build`, with `VITE_API_URL`, `VITE_COGNITO_REGION`, `VITE_COGNITO_USER_POOL_ID`, and `VITE_COGNITO_CLIENT_ID` taken from the environment's secrets.
4. Sign in to AWS (`us-east-1`) by assuming the role in `AWS_ROLE_ARN` through GitHub OIDC. No long-lived AWS keys are stored.
5. Sync `build/` to `s3://billtup-frontend-<env>` with `--delete`:
   - every file except `index.html` gets `Cache-Control: max-age=31536000, immutable` (Vite puts a content hash in asset names);
   - `index.html` is uploaded last with `Cache-Control: no-cache, no-store, must-revalidate`, so users always get the latest asset list.
6. Create a CloudFront invalidation for `/*` on the distribution in `CLOUDFRONT_DISTRIBUTION_ID`.
7. If any step fails and `SLACK_WEBHOOK_URL` is set, post a failure message to Slack.

### GitHub environment secrets

Each GitHub environment (`dev`, `stg`, `prod`) needs:

| Secret | Used for |
|--------|----------|
| `VITE_API_URL` | API base URL baked into the build |
| `VITE_COGNITO_REGION` | Cognito region baked into the build |
| `VITE_COGNITO_USER_POOL_ID` | Cognito user pool baked into the build |
| `VITE_COGNITO_CLIENT_ID` | Cognito app client baked into the build |
| `AWS_ROLE_ARN` | IAM role the workflow assumes |
| `CLOUDFRONT_DISTRIBUTION_ID` | Distribution to invalidate |
| `SLACK_WEBHOOK_URL` | Optional. Failure alerts. |

The four `VITE_` values are public once built. They are stored as secrets only so each environment can have its own.

## Build locally

```bash
npm ci
npm run build          # reads .env; output in build/
```

To build against another environment, set the four `VITE_` variables in your shell or `.env` first.

## Client-side routes

The app uses React Router with real paths (for example `/dashboard/settings` or `/pay/<token>`). The S3/CloudFront setup must return `index.html` for unknown paths so deep links load the app. That setting lives in AWS, not in this repo (to verify in the CloudFront console if deep links break).

`public/.htaccess` is a leftover from the old Apache hosting. CloudFront ignores it.

## Rollback

There is no rollback button. To roll back, revert the bad commit on `dev` and promote the revert through `stg` to `main` as usual.

## Not in this repo

- DNS, TLS certificates, S3 buckets, CloudFront distributions, and the IAM deploy role are managed in AWS.
- The domain is registered at Namecheap. Namecheap does not host the site.
