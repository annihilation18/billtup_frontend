# Deployment Guide

Complete guide for deploying BilltUp across all environments.

## Architecture Diagram

```
User's Browser
     |
     v
Route 53 DNS (billtup.com, *.billtup.com)
     |
     v
CloudFront CDN (per environment)
  - SSL termination (ACM cert: billtup.com + *.billtup.com)
  - Edge caching
  - index.html: no-cache
  - Assets: immutable, 1-year max-age
     |
     v
S3 Bucket (static site hosting)
  - billtup-frontend-dev
  - billtup-frontend-stg
  - billtup-frontend-prod
     |
     v (API calls)
API Gateway HTTP API v2 (per environment)
     |
     v
AWS Lambda Functions (SAM/CloudFormation)
  - Auth (Cognito)
  - Invoices, Clients, Payments, etc.
     |
     v
DynamoDB Tables + S3 (file storage) + Secrets Manager
     |
     v
External Services
  - Stripe (Payments)
  - Cognito (Authentication)
  - SES / Email provider
```

---

## Environments

| Environment | Branch | Domain | S3 Bucket | CloudFront ID |
|-------------|--------|--------|-----------|---------------|
| dev | `dev` | dev.billtup.com | billtup-frontend-dev | `E3IBYP7ZOWQE4R` |
| stg | `stg` | stg.billtup.com | billtup-frontend-stg | `EY7GQL9GE8S9I` |
| prod | `main` | billtup.com, www.billtup.com | billtup-frontend-prod | `E3UO9LEXKR9373` |

**Branch promotion flow:** `dev` -> `stg` -> `main` (via pull requests, never skip a stage).

---

## Frontend Deployment

### How It Works

The frontend is a Vite + React app. On every push to `dev`, `stg`, or `main`, a GitHub Actions workflow:

1. Checks out the code
2. Runs `npm ci` and `npm run build` (with environment-specific `VITE_*` variables)
3. Assumes an AWS IAM role via GitHub OIDC federation
4. Syncs the `build/` output to the correct S3 bucket (`aws s3 sync --delete`)
5. Invalidates the CloudFront distribution so users get the latest version

### Build Modes

| Branch | Build Command | Mode |
|--------|---------------|------|
| `dev` | `npm run build:dev` | development |
| `stg` | `npm run build:stg` | staging |
| `main` | `npm run build` | production |

### Environment Variables (set as GitHub environment secrets)

- `VITE_API_URL` -- Backend API base URL for the environment
- `VITE_COGNITO_REGION` -- AWS region for Cognito
- `VITE_COGNITO_USER_POOL_ID` -- Cognito user pool ID
- `VITE_COGNITO_CLIENT_ID` -- Cognito app client ID
- `AWS_ROLE_ARN` -- IAM role ARN for deploying (OIDC)
- `CLOUDFRONT_DISTRIBUTION_ID` -- CloudFront distribution to invalidate

### Caching Strategy

- **`index.html`**: `Cache-Control: no-cache, no-store, must-revalidate` (always fetches latest)
- **All other assets**: `Cache-Control: max-age=31536000, immutable` (Vite hashes filenames, so new deploys get new URLs)

### DNS

- **Route 53 Hosted Zone:** `Z04318478OZHA8Z5EIOY`
- A ALIAS records point each subdomain to its CloudFront distribution
- ACM certificate covers `billtup.com` and `*.billtup.com`
- Nameservers are configured at Namecheap to delegate to Route 53

---

## Backend Deployment

### How It Works

The backend is a set of AWS Lambda functions defined in `lambda/template.yaml` (SAM template). Each environment has its own CloudFormation stack, API Gateway, DynamoDB tables, and secrets.

### Deploy Commands (manual)

```bash
cd lambda
npm ci && npm run build

# Deploy to dev (default)
sam deploy

# Deploy to staging
sam deploy --config-env stg

# Deploy to production
sam deploy --config-env prod
```

### CI/CD

GitHub Actions deploys the backend automatically on push to `dev`, `stg`, or `main` branches. The workflow:

1. Checks out the code
2. Installs dependencies and builds
3. Assumes the environment-specific IAM role via OIDC (`billtup-deploy-dev`, `billtup-deploy-stg`, `billtup-deploy-prod`)
4. Syncs GitHub environment secrets to AWS Secrets Manager
5. Runs `sam deploy` with the appropriate `--config-env`

### Infrastructure as Code

- **`lambda/template.yaml`** -- SAM template defining Lambda functions, API Gateway HTTP API v2, DynamoDB tables, S3 buckets, IAM roles, CloudWatch alarms, and SNS topics
- **`lambda/samconfig.toml`** -- Multi-environment deployment configuration (stack names, S3 deploy buckets, parameter overrides per env)

### Key Backend Services

| Service | Purpose |
|---------|---------|
| AWS Lambda | Serverless functions (auth, invoices, clients, payments, etc.) |
| API Gateway HTTP API v2 | REST API routing (`$default` stage) |
| DynamoDB | NoSQL database (pay-per-request) |
| S3 | File/document storage |
| Cognito | User authentication (direct API, no SDK on frontend) |
| Secrets Manager | API keys, Stripe keys, third-party credentials |
| SNS | Alarm notifications |

---

## CI/CD

### GitHub Actions Workflows

**Frontend** (`.github/workflows/deploy.yml`):
- Triggers on push to `dev`, `stg`, `main`
- Uses `actions/setup-node@v4` with Node 20
- Assumes AWS role via `aws-actions/configure-aws-credentials@v4` (OIDC)
- Syncs build output to S3, invalidates CloudFront

**Backend** (in the `billtup` Android/backend repo):
- Triggers on push to `dev`, `stg`, `main`
- Syncs secrets from GitHub to AWS Secrets Manager
- Runs `sam deploy` with the correct config environment

**Branch Protection** (`.github/workflows/enforce-promotion.yml`):
- Enforces the `dev -> stg -> main` promotion flow
- Prevents direct pushes that skip stages

### OIDC Federation

GitHub Actions authenticates to AWS without long-lived credentials. Three IAM roles exist:

| Role | Environment | Trusted By |
|------|-------------|------------|
| `billtup-deploy-dev` | dev | GitHub `dev` branch |
| `billtup-deploy-stg` | stg | GitHub `stg` branch |
| `billtup-deploy-prod` | prod | GitHub `main` branch |

---

## Monitoring

### CloudWatch Alarms

The SAM template provisions CloudWatch alarms per environment:

| Alarm | Threshold | Description |
|-------|-----------|-------------|
| API 5xx errors | > 0 in 5 min | Any server error triggers alert |
| API 4xx spike | > 50 in 5 min | Unusual client error volume |
| API p95 latency | > 3 seconds | Slow response times |
| Lambda errors | > 0 in 5 min | Any Lambda invocation failure |
| DynamoDB throttling | > 0 in 5 min | Read/write capacity exceeded |

All alarms notify an SNS topic per environment. Subscribe an email address or Slack webhook to the topic for notifications.

### Logs

- **Lambda logs**: CloudWatch Log Groups (`/aws/lambda/<function-name>`)
- **API Gateway logs**: CloudWatch access logs (if enabled in template)
- **CloudFront logs**: Optional, can be enabled to S3

---

## Pre-Launch Checklist

### Security
- [ ] All secrets stored in AWS Secrets Manager (not in code or env files)
- [ ] GitHub environment secrets configured for all three environments
- [ ] CORS configured for production domains only
- [ ] Rate limiting enabled on API Gateway
- [ ] Security headers configured (CSP, HSTS, X-Frame-Options, etc.)
- [ ] Stripe webhooks verified with signing secret
- [ ] Cognito user pool configured (password policy, MFA optional)

### Functionality
- [ ] Sign up / sign in works end-to-end
- [ ] Invoice creation, editing, and deletion works
- [ ] Payment processing works (Stripe test mode, then live)
- [ ] Email sending works
- [ ] PDF generation works
- [ ] File uploads work (S3)

### Infrastructure
- [ ] All three environments deployed and accessible
- [ ] CloudFront distributions serving correct S3 origins
- [ ] Route 53 DNS records resolving correctly
- [ ] ACM certificate valid and attached to all CloudFront distributions
- [ ] CloudWatch alarms configured and SNS subscriptions active
- [ ] GitHub Actions OIDC roles scoped to correct branches

### Legal
- [ ] Privacy Policy added
- [ ] Terms of Service added
- [ ] Cookie notice implemented

### Performance
- [ ] Page load under 3 seconds
- [ ] Lighthouse score above 90
- [ ] Mobile responsive
- [ ] Cross-browser tested

---

## Costs

### AWS Free Tier (small scale, 0-1000 users)

| Service | Free Tier Allowance | Typical Cost Beyond |
|---------|--------------------|--------------------|
| Lambda | 1M requests/month, 400k GB-seconds | $0.20 per 1M requests |
| API Gateway | 1M HTTP API calls/month | $1.00 per 1M calls |
| DynamoDB | 25 GB storage, 25 RCU/WCU | Pay-per-request mode |
| S3 | 5 GB storage | ~$0.023/GB/month |
| CloudFront | 1 TB transfer/month | $0.085/GB |
| Cognito | 50,000 MAU | $0.0055/MAU beyond |
| CloudWatch | 10 alarms free | $0.10/alarm/month |
| Secrets Manager | -- | $0.40/secret/month |
| Route 53 | -- | $0.50/hosted zone/month |

**Estimated total for small scale:** ~$5-15/month

### Stripe (all scales)

- 2.9% + $0.30 per successful card charge
- No monthly fees

### Scaling Notes

- Lambda, API Gateway, DynamoDB, and CloudFront scale automatically with no provisioning
- DynamoDB on-demand mode handles traffic spikes without capacity planning
- CloudFront caches static assets at edge locations globally
- No servers to manage, patch, or scale manually

---

## Useful Commands

```bash
# Check which environment a branch deploys to
git branch --show-current   # dev, stg, or main

# Build frontend locally for a specific environment
npm run build:dev           # dev mode
npm run build:stg           # staging mode
npm run build               # production mode

# Start local dev server
npm run dev -- --host

# Deploy backend manually
cd lambda
sam deploy                    # dev
sam deploy --config-env stg   # staging
sam deploy --config-env prod  # production

# View CloudFormation stack status
aws cloudformation describe-stacks --stack-name billtup-dev
aws cloudformation describe-stacks --stack-name billtup-stg
aws cloudformation describe-stacks --stack-name billtup-prod

# Invalidate CloudFront cache manually
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"

# Tail Lambda logs
aws logs tail /aws/lambda/<function-name> --follow
```

---

## Support Resources

- **AWS SAM Docs:** https://docs.aws.amazon.com/serverless-application-model/
- **CloudFront Docs:** https://docs.aws.amazon.com/cloudfront/
- **Cognito Docs:** https://docs.aws.amazon.com/cognito/
- **Stripe Docs:** https://stripe.com/docs
- **Project Docs:** See `src/docs/developers/`

---

*Last Updated: February 2026*
