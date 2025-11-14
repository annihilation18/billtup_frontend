import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17.4.0";
import * as kv from "./kv_store.ts";
import { generateModernTemplate, generateClassicTemplate, generateMinimalTemplate } from "./email-templates.ts";

const app = new Hono();

// Initialize Supabase clients
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Stripe
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: '2024-10-28.acacia',
});

// Platform fee configuration
const PLATFORM_FEE_PERCENTAGE = 0.6; // 0.6%
const PLATFORM_FEE_FIXED = 0.20; // $0.20
const STRIPE_FEE_PERCENTAGE = 2.9; // 2.9%
const STRIPE_FEE_FIXED = 0.30; // $0.30
const TOTAL_FEE_PERCENTAGE = 3.5; // 3.5% total
const TOTAL_FEE_FIXED = 0.50; // $0.50 total

// Initialize Nodemailer configuration
const emailConfig = {
    host: Deno.env.get('EMAIL_HOST') || 'smtp.gmail.com',
    port: parseInt(Deno.env.get('EMAIL_PORT') || '587'),
    secure: Deno.env.get('EMAIL_SECURE') === 'true', // true for 465, false for other ports
    auth: {
        user: Deno.env.get('EMAIL_USER'),
        pass: Deno.env.get('EMAIL_PASSWORD'),
    },
    from: Deno.env.get('EMAIL_FROM') || 'BilltUp <noreply@billtup.com>',
};

// Log email config status on startup (without exposing passwords)
console.log('📧 Email Configuration Status:', {
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    hasUser: !!emailConfig.auth.user,
    hasPassword: !!emailConfig.auth.pass,
    from: emailConfig.from
});

// Storage bucket name
const LOGO_BUCKET = 'make-dce439b6-logos';
const PDF_BUCKET = 'make-dce439b6-invoices';

// Create storage buckets on startup
async function initializeStorage() {
    const { data: buckets } = await supabase.storage.listBuckets();

    // Create logo bucket
    const logoExists = buckets?.some(bucket => bucket.name === LOGO_BUCKET);
    if (!logoExists) {
        await supabase.storage.createBucket(LOGO_BUCKET, { public: false });
        console.log('Created logo storage bucket');
    }

    // Create PDF bucket
    const pdfExists = buckets?.some(bucket => bucket.name === PDF_BUCKET);
    if (!pdfExists) {
        await supabase.storage.createBucket(PDF_BUCKET, { public: false });
        console.log('Created PDF storage bucket');
    }
}

initializeStorage().catch(console.error);

// Enable logger
app.use('*', logger(console.log));

// Security headers middleware
app.use('*', async (c, next) => {
    await next();

    // Add security headers for PCI compliance and bank-level security
    c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    c.header('X-Content-Type-Options', 'nosniff');
    c.header('X-Frame-Options', 'DENY');
    c.header('X-XSS-Protection', '1; mode=block');
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    c.header('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; frame-src https://js.stripe.com https://hooks.stripe.com; connect-src 'self' https://api.stripe.com;");

    // Ensure HTTPS in production (encrypted in transit)
    const protocol = c.req.header('x-forwarded-proto') || 'https';
    if (protocol !== 'https' && Deno.env.get('DENO_DEPLOYMENT_ID')) {
        return c.redirect(`https://${c.req.header('host')}${c.req.url}`, 301);
    }
});

// ==================== DDOS PROTECTION & RATE LIMITING ====================

// In-memory rate limiting store (resets on cold start, but provides protection)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const ipBlockList = new Map<string, number>(); // IP -> block expiry timestamp

// Rate limit configuration
const RATE_LIMITS = {
    // Per-user authenticated endpoints
    authenticated: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 100, // 100 requests per minute per user
    },
    // Per-IP for login/signup (prevent credential stuffing)
    auth: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 10, // 10 login attempts per 15 minutes per IP
    },
    // Per-IP for all other endpoints
    general: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 60, // 60 requests per minute per IP
    },
    // Aggressive blocking threshold
    ddosThreshold: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 200, // 200 requests = temporary ban
        blockDurationMs: 15 * 60 * 1000, // 15 minute block
    }
};

// Query limits to prevent large data dumps
const MAX_QUERY_LIMIT = 100; // Maximum rows per query
const MAX_RESPONSE_SIZE = 5 * 1024 * 1024; // 5MB max response size

// Clean up expired rate limit entries every 5 minutes
setInterval(() => {
    const now = Date.now();

    // Clean rate limit store
    for (const [key, value] of rateLimitStore.entries()) {
        if (value.resetTime < now) {
            rateLimitStore.delete(key);
        }
    }

    // Clean IP block list
    for (const [ip, expiryTime] of ipBlockList.entries()) {
        if (expiryTime < now) {
            ipBlockList.delete(ip);
        }
    }

    console.log(`🧹 Cleaned rate limit store. Active entries: ${rateLimitStore.size}, Blocked IPs: ${ipBlockList.size}`);
}, 5 * 60 * 1000);

// Rate limiting middleware
app.use('*', async (c, next) => {
    const now = Date.now();
    const ip = c.req.header('x-forwarded-for')?.split(',')[0] || c.req.header('x-real-ip') || 'unknown';
    const path = c.req.path;

    // Check if IP is blocked
    const blockExpiry = ipBlockList.get(ip);
    if (blockExpiry && blockExpiry > now) {
        const remainingMs = blockExpiry - now;
        const remainingMinutes = Math.ceil(remainingMs / 60000);
        console.log(`🚫 Blocked IP attempted access: ${ip} (${remainingMinutes} minutes remaining)`);
        return c.json({
            error: 'Too many requests. Your IP has been temporarily blocked.',
            retryAfter: remainingMinutes,
            message: 'Please try again later.'
        }, 429);
    }

    // Determine rate limit config based on endpoint
    let config = RATE_LIMITS.general;
    let identifier = ip;

    if (path.includes('/auth/')) {
        config = RATE_LIMITS.auth;
    } else if (c.req.header('Authorization')) {
        // For authenticated requests, use user token as identifier
        const token = c.req.header('Authorization')?.split(' ')[1];
        if (token && token !== supabaseAnonKey) {
            identifier = `user:${token.substring(0, 20)}`; // Use first 20 chars of token
            config = RATE_LIMITS.authenticated;
        }
    }

    // Get or create rate limit entry
    const key = `${identifier}:${path}`;
    let entry = rateLimitStore.get(key);

    if (!entry || entry.resetTime < now) {
        // Create new entry or reset expired one
        entry = {
            count: 0,
            resetTime: now + config.windowMs
        };
        rateLimitStore.set(key, entry);
    }

    // Increment request count
    entry.count++;

    // Check for DDoS-level abuse
    const ddosKey = `ddos:${ip}`;
    let ddosEntry = rateLimitStore.get(ddosKey);

    if (!ddosEntry || ddosEntry.resetTime < now) {
        ddosEntry = {
            count: 0,
            resetTime: now + RATE_LIMITS.ddosThreshold.windowMs
        };
        rateLimitStore.set(ddosKey, ddosEntry);
    }

    ddosEntry.count++;

    // If DDoS threshold exceeded, block the IP
    if (ddosEntry.count > RATE_LIMITS.ddosThreshold.maxRequests) {
        const blockUntil = now + RATE_LIMITS.ddosThreshold.blockDurationMs;
        ipBlockList.set(ip, blockUntil);
        console.log(`⚠️ DDoS DETECTED! Blocking IP: ${ip} for 15 minutes. Request count: ${ddosEntry.count}`);
        return c.json({
            error: 'Too many requests. Your IP has been temporarily blocked for suspicious activity.',
            retryAfter: 15,
            message: 'If you believe this is an error, please contact support.'
        }, 429);
    }

    // Check if rate limit exceeded
    if (entry.count > config.maxRequests) {
        const remainingMs = entry.resetTime - now;
        const remainingSeconds = Math.ceil(remainingMs / 1000);
        console.log(`⏱️ Rate limit exceeded for ${identifier} on ${path}. Count: ${entry.count}/${config.maxRequests}`);

        c.header('X-RateLimit-Limit', config.maxRequests.toString());
        c.header('X-RateLimit-Remaining', '0');
        c.header('X-RateLimit-Reset', entry.resetTime.toString());
        c.header('Retry-After', remainingSeconds.toString());

        return c.json({
            error: 'Rate limit exceeded. Please slow down.',
            retryAfter: remainingSeconds,
            limit: config.maxRequests,
            window: config.windowMs / 1000
        }, 429);
    }

    // Add rate limit headers to response
    const remaining = config.maxRequests - entry.count;
    c.header('X-RateLimit-Limit', config.maxRequests.toString());
    c.header('X-RateLimit-Remaining', remaining.toString());
    c.header('X-RateLimit-Reset', entry.resetTime.toString());

    await next();
});

// Response size limiting middleware
app.use('*', async (c, next) => {
    await next();

    // Check response size
    const response = c.res;
    const contentLength = response.headers.get('content-length');

    if (contentLength && parseInt(contentLength) > MAX_RESPONSE_SIZE) {
        console.log(`⚠️ Response size exceeded limit: ${contentLength} bytes`);
        return c.json({
            error: 'Response too large. Please use pagination or filters to reduce data size.',
            maxSize: MAX_RESPONSE_SIZE
        }, 413);
    }
});

// Enable CORS for all routes and methods
app.use(
    "/*",
    cors({
        origin: "*",
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        exposeHeaders: ["Content-Length"],
        maxAge: 600,
    }),
);

// Request validation middleware
app.use('*', async (c, next) => {
    const method = c.req.method;
    const path = c.req.path;

    // Log ALL incoming requests
    console.log(`🌐 INCOMING REQUEST: ${method} ${path}`);
    console.log(`📍 Full URL: ${c.req.url}`);
    console.log(`🔑 Headers:`, {
        'content-type': c.req.header('Content-Type'),
        'authorization': c.req.header('Authorization') ? 'Bearer ***' : 'MISSING'
    });

    // Validate content type for POST/PATCH/PUT requests
    if (['POST', 'PATCH', 'PUT'].includes(method)) {
        const contentType = c.req.header('Content-Type');
        if (!contentType?.includes('application/json')) {
            console.log('❌ Invalid Content-Type');
            return c.json({ error: 'Content-Type must be application/json' }, 400);
        }
    }

    await next();
});

// Middleware to verify authentication
async function requireAuth(c: any, next: any) {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken || accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
        return c.json({ error: 'Unauthorized - Authentication required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
        console.error('Authentication error while verifying user:', error);
        return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }

    c.set('userId', user.id);
    c.set('userEmail', user.email);
    await next();
}

// Helper function to check auth inline in routes
async function checkAuth(c: any) {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken || accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
        return { error: 'Unauthorized - Authentication required', status: 401 };
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
        console.error('Authentication error while verifying user:', error);
        return { error: 'Unauthorized - Invalid token', status: 401 };
    }

    return { user, userId: user.id, userEmail: user.email };
}

// Health check endpoint
app.get("/health", (c) => {
    return c.json({ status: "ok" });
});

// Email configuration diagnostic endpoint
app.get("/email/check-config", async (c) => {
    try {
        console.log('📧 Email Configuration Diagnostic Check');

        const config = {
            host: emailConfig.host,
            port: emailConfig.port,
            secure: emailConfig.secure,
            from: emailConfig.from,
            hasUser: !!emailConfig.auth.user,
            hasPassword: !!emailConfig.auth.pass,
            userValue: emailConfig.auth.user ? `${emailConfig.auth.user.substring(0, 3)}***` : 'NOT SET',
        };

        console.log('Current email configuration:', config);

        // Try to verify SMTP connection
        const nodemailer = await import('npm:nodemailer@6.9.7');
        const transporter = nodemailer.default.createTransport({
            host: emailConfig.host,
            port: emailConfig.port,
            secure: emailConfig.secure,
            auth: {
                user: emailConfig.auth.user,
                pass: emailConfig.auth.pass,
            },
            logger: true,
            debug: true,
        });

        let smtpStatus = 'UNKNOWN';
        let smtpError = null;

        try {
            await transporter.verify();
            smtpStatus = 'CONNECTED ✅';
            console.log('✅ SMTP connection successful');
        } catch (err: any) {
            smtpStatus = 'FAILED ❌';
            smtpError = {
                message: err.message,
                code: err.code,
                command: err.command,
                response: err.response,
            };
            console.error('❌ SMTP connection failed:', smtpError);
        }

        return c.json({
            emailConfig: config,
            smtpStatus,
            smtpError,
            envVariables: {
                EMAIL_HOST: Deno.env.get('EMAIL_HOST') || 'NOT SET',
                EMAIL_PORT: Deno.env.get('EMAIL_PORT') || 'NOT SET',
                EMAIL_SECURE: Deno.env.get('EMAIL_SECURE') || 'NOT SET (defaults to false)',
                EMAIL_USER: Deno.env.get('EMAIL_USER') ? 'SET ✅' : 'NOT SET ❌',
                EMAIL_PASSWORD: Deno.env.get('EMAIL_PASSWORD') ? 'SET ✅' : 'NOT SET ❌',
                EMAIL_FROM: Deno.env.get('EMAIL_FROM') || 'NOT SET (using default)',
            },
            recommendations: smtpStatus === 'FAILED ❌' ? [
                'Verify EMAIL_USER is your full email address',
                'For Gmail, use App Password (not regular password)',
                'Check EMAIL_HOST is correct (smtp.gmail.com for Gmail)',
                'Verify EMAIL_PORT is 587 for TLS or 465 for SSL',
                'If using port 465, set EMAIL_SECURE=true'
            ] : []
        });
    } catch (error: any) {
        console.error('Error during email config check:', error);
        return c.json({ error: 'Failed to check email configuration', details: error.message }, 500);
    }
});

// ==================== AUTH ROUTES ====================

// Helper function to calculate next billing date (same day next month)
function getNextBillingDate(dateString: string): string {
    const date = new Date(dateString);
    const nextMonth = new Date(date);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString();
}

// Helper function to check if current date is past billing period
function shouldResetMonthlyCounter(monthStart: string, monthEnd: string): boolean {
    const now = new Date();
    const endDate = new Date(monthEnd);
    return now >= endDate;
}

// Sign up endpoint
app.post("/auth/signup", async (c) => {
    try {
        const body = await c.req.json();
        const { email, password, businessName } = body;

        if (!email || !password || !businessName) {
            return c.json({ error: 'Email, password, and business name are required' }, 400);
        }

        // Create user with Supabase Auth
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm since email server not configured
            user_metadata: { businessName }
        });

        if (error) {
            console.error('Error creating user during signup:', error);
            return c.json({ error: error.message }, 400);
        }

        // Store user account creation date and initialize monthly invoice counter
        const userId = data.user.id;
        const accountCreatedAt = new Date().toISOString();

        // Calculate trial end date (14 days from now)
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 14);
        const trialEndsAt = trialEndDate.toISOString();

        // Initialize subscription with 14-day trial
        const initialSubscription = {
            planType: 'trial',
            isActive: true,
            isTrial: true,
            trialEndsAt: trialEndsAt,
            createdAt: accountCreatedAt,
            invoicesThisPeriod: 0,
            customerCount: 0,
        };

        await kv.set(`user:${userId}:account_created`, accountCreatedAt);
        await kv.set(`user:${userId}:monthly_invoice_count`, {
            count: 0,
            monthStart: accountCreatedAt,
            monthEnd: getNextBillingDate(accountCreatedAt)
        });
        await kv.set(`subscription:${userId}`, initialSubscription);

        console.log('User created successfully:', userId, 'Account created:', accountCreatedAt);
        console.log('Trial subscription initialized:', { trialEndsAt });
        return c.json({
            user: data.user,
            subscription: initialSubscription,
            message: 'Account created successfully'
        });
    } catch (error) {
        console.error('Error during signup:', error);
        return c.json({ error: 'Failed to create account' }, 500);
    }
});

// Test endpoint for auth routes
app.get("/auth/test", (c) => {
    console.log('✅ Auth test endpoint hit!');
    return c.json({
        message: "Auth routes are working!",
        timestamp: new Date().toISOString(),
        availableEndpoints: [
            "POST /auth/request-password-reset",
            "POST /auth/reset-password"
        ]
    });
});

// Password reset request endpoint
app.post("/auth/request-password-reset", async (c) => {
    console.log('');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║         PASSWORD RESET REQUEST RECEIVED                       ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('⏰ Timestamp:', new Date().toISOString());

    try {
        const body = await c.req.json();
        const { email } = body;

        if (!email) {
            console.log('❌ Error: Email is required');
            return c.json({ error: 'Email is required' }, 400);
        }

        console.log('📧 Password reset request for:', email);

        // Check if user exists
        console.log('🔍 Checking if user exists in database...');
        const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
        const user = userData?.users.find(u => u.email === email);

        if (userError) {
            console.error('❌ Error fetching users:', userError);
        }

        // Always return success to prevent email enumeration
        if (!user) {
            console.log('⚠️  User not found in database, but returning success to prevent enumeration');
            console.log('📧 Email address checked:', email);
            console.log('✅ Returning success response (no email will be sent)');
            return c.json({ message: 'If an account exists with this email, you will receive a password reset link.' });
        }

        console.log('✅ User found in database!');
        console.log('👤 User ID:', user.id);
        console.log('📧 User Email:', user.email);

        // Generate reset token (valid for 1 hour)
        const resetToken = crypto.randomUUID();
        const expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour from now

        // Store reset token in database
        await kv.set(`password_reset:${resetToken}`, {
            userId: user.id,
            email: user.email,
            expiresAt,
            used: false
        });

        // Send email via Nodemailer
        if (!emailConfig.auth.user || !emailConfig.auth.pass) {
            console.error('❌ Email credentials not configured');
            console.error('EMAIL_USER:', emailConfig.auth.user ? 'SET' : 'MISSING');
            console.error('EMAIL_PASSWORD:', emailConfig.auth.pass ? 'SET' : 'MISSING');
            return c.json({ error: 'Email service not configured. Please set EMAIL_USER and EMAIL_PASSWORD.' }, 500);
        }

        console.log('📧 Preparing to send email via Nodemailer...');
        console.log('Email settings:', {
            host: emailConfig.host,
            port: emailConfig.port,
            secure: emailConfig.secure,
            from: emailConfig.from,
            to: email
        });

        const nodemailer = await import('npm:nodemailer@6.9.7');

        // Create transporter with detailed logging
        const transporter = nodemailer.default.createTransport({
            host: emailConfig.host,
            port: emailConfig.port,
            secure: emailConfig.secure,
            auth: {
                user: emailConfig.auth.user,
                pass: emailConfig.auth.pass,
            },
            logger: true, // Enable Nodemailer logging
            debug: true,  // Enable debug output
        });

        // Verify transporter configuration
        try {
            console.log('🔍 Verifying SMTP connection...');
            await transporter.verify();
            console.log('✅ SMTP connection verified successfully');
        } catch (verifyError: any) {
            console.error('❌ SMTP verification failed:', verifyError);
            console.error('Error details:', {
                message: verifyError.message,
                code: verifyError.code,
                command: verifyError.command,
                response: verifyError.response,
                responseCode: verifyError.responseCode
            });
            return c.json({
                error: 'Email service configuration error. Please check EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASSWORD.',
                details: verifyError.message
            }, 500);
        }

        // Generate reset URL - use APP_URL if set, otherwise use request origin
        const origin = c.req.header('origin') || c.req.header('referer')?.split('?')[0] || '';
        const baseUrl = Deno.env.get('APP_URL') || origin || 'http://127.0.0.1:5173';

        if (!baseUrl) {
            console.error('❌ Cannot determine app URL. No origin or referer found.');
            return c.json({
                error: 'Unable to determine app URL. Please try again.'
            }, 500);
        }

        const resetUrl = `${baseUrl}?reset-token=${resetToken}`;

        console.log('======================== SENDING EMAIL ========================');
        console.log('📨 Sending password reset email...');
        console.log('📧 Email Details:', {
            from: emailConfig.from,
            to: email,
            subject: 'Reset Your BilltUp Password',
            resetToken: resetToken,
            tokenExpiresAt: new Date(expiresAt).toISOString(),
            resetUrl: resetUrl
        });
        console.log('🔧 SMTP Configuration:', {
            host: emailConfig.host,
            port: emailConfig.port,
            secure: emailConfig.secure,
            user: emailConfig.auth.user?.substring(0, 3) + '***' + emailConfig.auth.user?.substring(emailConfig.auth.user.length - 10),
            hasPassword: !!emailConfig.auth.pass,
            passwordLength: emailConfig.auth.pass?.length
        });
        console.log('===============================================================');

        // Send email with comprehensive error handling
        let info;
        try {
            info = await transporter.sendMail({
                from: emailConfig.from,
                to: email,
                subject: 'Reset Your BilltUp Password',
                html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1E3A8A 0%, #14B8A6 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
              .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; }
              .button { display: inline-block; background: #1E3A8A; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
              .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">Reset Your Password</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>We received a request to reset the password for your BilltUp account associated with <strong>${email}</strong>.</p>
                <p>Click the button below to create a new password:</p>
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
                <p style="color: #6b7280; font-size: 14px; word-break: break-all;">${resetUrl}</p>
                <div class="warning">
                  <p style="margin: 0; color: #92400e;">
                    <strong>⏰ This link will expire in 1 hour</strong> for security reasons.
                  </p>
                </div>
                <p style="color: #6b7280; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} BilltUp. All rights reserved.</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </body>
        </html>
      `,
            });

            console.log('======================== EMAIL SENT ========================');
            console.log('✅ Password reset email sent successfully!');
            console.log('📬 Email Delivery Info:', {
                messageId: info.messageId,
                response: info.response,
                accepted: info.accepted,
                rejected: info.rejected,
                pending: info.pending,
                envelope: info.envelope
            });
            console.log('===============================================================');

        } catch (sendError: any) {
            console.error('❌ Failed to send email:', sendError);
            console.error('Error details:', {
                message: sendError.message,
                code: sendError.code,
                command: sendError.command,
                response: sendError.response,
                responseCode: sendError.responseCode,
                stack: sendError.stack
            });
            return c.json({
                error: 'Failed to send password reset email. Please try again or contact support.',
                details: sendError.message
            }, 500);
        }

        return c.json({ message: 'Password reset email sent successfully' });
    } catch (error: any) {
        console.error('❌ Unexpected error during password reset request:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return c.json({ error: 'Failed to process password reset request', details: error.message }, 500);
    }
});

// Password reset verification and update endpoint
app.post("/auth/reset-password", async (c) => {
    try {
        const body = await c.req.json();
        const { token, newPassword } = body;

        if (!token || !newPassword) {
            return c.json({ error: 'Token and new password are required' }, 400);
        }

        console.log('Password reset attempt with token');

        // Retrieve reset token from database
        const resetData = await kv.get(`password_reset:${token}`);

        if (!resetData) {
            console.log('Invalid or expired reset token');
            return c.json({ error: 'Invalid or expired reset link. Please request a new password reset.' }, 400);
        }

        // Check if token is expired
        if (Date.now() > resetData.expiresAt) {
            await kv.del(`password_reset:${token}`);
            console.log('Reset token expired');
            return c.json({ error: 'Reset link has expired. Please request a new password reset.' }, 400);
        }

        // Check if token was already used
        if (resetData.used) {
            console.log('Reset token already used');
            return c.json({ error: 'This reset link has already been used. Please request a new password reset.' }, 400);
        }

        // Update password using Supabase Admin API
        const { error } = await supabase.auth.admin.updateUserById(resetData.userId, {
            password: newPassword,
        });

        if (error) {
            console.error('Failed to update password:', error);

            if (error.message.includes('breached')) {
                return c.json({ error: 'This password has been found in a data breach. Please choose a different password.' }, 400);
            }

            return c.json({ error: error.message || 'Failed to update password' }, 400);
        }

        // Mark token as used
        await kv.set(`password_reset:${token}`, {
            ...resetData,
            used: true,
            usedAt: Date.now()
        });

        console.log('Password updated successfully');
        return c.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error during password reset:', error);
        return c.json({ error: 'Failed to reset password' }, 500);
    }
});

// Sign in endpoint - handled by Supabase client on frontend
// Get session endpoint - handled by Supabase client on frontend

// ==================== BUSINESS ROUTES ====================

// Save business data
app.post("/business", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        const businessData = await c.req.json();

        // Save business data to KV store
        await kv.set(`business:${userId}`, businessData);

        console.log('Business data saved for user:', userId);
        return c.json({ success: true, message: 'Business data saved' });
    } catch (error) {
        console.error('Error saving business data:', error);
        return c.json({ error: 'Failed to save business data' }, 500);
    }
});

// Get business data
app.get("/business", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        const businessData = await kv.get(`business:${userId}`);

        if (!businessData) {
            return c.json({ error: 'Business data not found' }, 404);
        }

        return c.json(businessData);
    } catch (error) {
        console.error('Error fetching business data:', error);
        return c.json({ error: 'Failed to fetch business data' }, 500);
    }
});

// Update business data
app.patch("/business", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        const updates = await c.req.json();

        // Get existing business data
        const existingData = await kv.get(`business:${userId}`) || {};

        // Merge updates with existing data
        const updatedBusinessData = {
            ...existingData,
            ...updates,
            updatedAt: new Date().toISOString()
        };

        // Save updated business data to KV store
        await kv.set(`business:${userId}`, updatedBusinessData);

        console.log('Business data updated for user:', userId);
        return c.json({ success: true, message: 'Business data updated', data: updatedBusinessData });
    } catch (error) {
        console.error('Error updating business data:', error);
        return c.json({ error: 'Failed to update business data' }, 500);
    }
});

// Upload business logo
app.post("/business/logo", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        const body = await c.req.json();
        const { logoData, fileName } = body; // logoData is base64 string

        if (!logoData) {
            return c.json({ error: 'Logo data is required' }, 400);
        }

        // Convert base64 to blob
        const base64Data = logoData.split(',')[1];
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        // Upload to Supabase Storage
        const filePath = `${userId}/${fileName || 'logo.png'}`;
        const { data, error } = await supabase.storage
            .from(LOGO_BUCKET)
            .upload(filePath, binaryData, {
                contentType: 'image/png',
                upsert: true
            });

        if (error) {
            console.error('Error uploading logo to storage:', error);
            return c.json({ error: 'Failed to upload logo' }, 500);
        }

        // Create signed URL (valid for 1 year)
        const { data: signedUrlData } = await supabase.storage
            .from(LOGO_BUCKET)
            .createSignedUrl(filePath, 31536000);

        console.log('Logo uploaded successfully for user:', userId);
        return c.json({
            success: true,
            logoUrl: signedUrlData?.signedUrl,
            path: filePath
        });
    } catch (error) {
        console.error('Error processing logo upload:', error);
        return c.json({ error: 'Failed to process logo upload' }, 500);
    }
});

// ==================== SUBSCRIPTION ROUTES ====================

// Get subscription status with trial tracking
app.get("/subscription/status", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        // Get subscription data
        let subscription = await kv.get(`subscription:${userId}`);

        // If no subscription exists (old user), create trial
        if (!subscription) {
            const accountCreatedData = await kv.get(`user:${userId}:account_created`);
            const accountCreatedAt = accountCreatedData || new Date().toISOString();

            const trialEndDate = new Date(accountCreatedAt);
            trialEndDate.setDate(trialEndDate.getDate() + 14);

            subscription = {
                planType: 'trial',
                isActive: true,
                isTrial: true,
                trialEndsAt: trialEndDate.toISOString(),
                createdAt: accountCreatedAt,
                invoicesThisPeriod: 0,
                customerCount: 0,
            };

            await kv.set(`subscription:${userId}`, subscription);
            console.log('Created trial subscription for existing user:', userId);
        }

        // Check if trial is expired
        const isTrialExpired = subscription.isTrial &&
            subscription.trialEndsAt &&
            new Date(subscription.trialEndsAt) < new Date();

        // Get current counts
        const invoices = await kv.get(`invoices:${userId}`) || [];
        const customers = await kv.get(`customers:${userId}`) || [];
        const monthlyData = await kv.get(`user:${userId}:monthly_invoice_count`) || { count: 0 };

        // Return subscription with current counts
        const response = {
            ...subscription,
            isTrialExpired,
            invoicesThisPeriod: monthlyData.count || 0,
            customerCount: Array.isArray(customers) ? customers.length : 0,
            totalInvoices: Array.isArray(invoices) ? invoices.length : 0,
            totalCustomers: Array.isArray(customers) ? customers.length : 0,
        };

        console.log('Subscription status retrieved for user:', userId, {
            planType: response.planType,
            isTrial: response.isTrial,
            isTrialExpired,
            trialEndsAt: subscription.trialEndsAt
        });

        return c.json(response);
    } catch (error) {
        console.error('Error fetching subscription status:', error);
        return c.json({ error: 'Failed to fetch subscription status' }, 500);
    }
});

// Cancel subscription
app.post("/subscription/cancel", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        let subscription = await kv.get(`subscription:${userId}`);

        if (!subscription) {
            return c.json({ error: 'No subscription found' }, 404);
        }

        console.log('Cancellation request for user:', userId, {
            planType: subscription.planType,
            isTrial: subscription.isTrial,
            hasStripeSubscription: !!subscription.stripeSubscriptionId
        });

        // TRIAL CANCELLATION - No charge, immediate cancellation
        if (subscription.isTrial) {
            subscription = {
                ...subscription,
                isActive: false,
                canceledAt: new Date().toISOString(),
                cancelAtPeriodEnd: false, // Immediate for trials
            };

            await kv.set(`subscription:${userId}`, subscription);

            console.log('✅ Trial subscription cancelled immediately (no charge)');
            return c.json({
                success: true,
                message: 'Trial cancelled. No charges were made.',
                subscription,
                immediate: true
            });
        }

        // PAID SUBSCRIPTION - Cancel at period end (let them use until billing cycle ends)
        if (subscription.stripeSubscriptionId) {
            try {
                // Update Stripe subscription to cancel at period end
                const stripeSubscription = await stripe.subscriptions.update(
                    subscription.stripeSubscriptionId,
                    { cancel_at_period_end: true }
                );

                subscription = {
                    ...subscription,
                    cancelAtPeriodEnd: true,
                    canceledAt: new Date().toISOString(),
                    currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
                };

                await kv.set(`subscription:${userId}`, subscription);

                const endDate = new Date(stripeSubscription.current_period_end * 1000);
                console.log('✅ Paid subscription set to cancel at period end:', endDate.toISOString());

                return c.json({
                    success: true,
                    message: `Subscription will be cancelled at the end of your billing period (${endDate.toLocaleDateString()}). You'll have access until then.`,
                    subscription,
                    accessUntil: endDate.toISOString(),
                    immediate: false
                });
            } catch (stripeError: any) {
                console.error('Error cancelling Stripe subscription:', stripeError);
                return c.json({
                    error: 'Failed to cancel subscription with Stripe',
                    details: stripeError.message
                }, 500);
            }
        }

        // Fallback for subscriptions without Stripe ID (shouldn't happen, but handle it)
        subscription = {
            ...subscription,
            isActive: false,
            canceledAt: new Date().toISOString(),
            cancelAtPeriodEnd: false,
        };

        await kv.set(`subscription:${userId}`, subscription);

        console.log('✅ Subscription cancelled (no Stripe subscription found)');
        return c.json({
            success: true,
            message: 'Subscription cancelled',
            subscription,
            immediate: true
        });

    } catch (error) {
        console.error('Error cancelling subscription:', error);
        return c.json({ error: 'Failed to cancel subscription' }, 500);
    }
});

// ==================== ACCOUNT DELETION ROUTE ====================

// Delete account and archive data for BilltUp records
app.post("/account/delete", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        console.log('🗑️ Account deletion requested for user:', userId);

        // 1. Fetch all user data before deletion
        const businessData = await kv.get(`business:${userId}`) || {};
        const customersData = await kv.get(`customers:${userId}`) || [];
        const invoicesData = await kv.get(`invoices:${userId}`) || [];
        const subscriptionData = await kv.get(`subscription:${userId}`) || {};

        // 2. Archive data for BilltUp records (anonymized copy)
        const archiveId = `archived_${userId}_${Date.now()}`;
        const archivedData = {
            archiveId,
            deletedAt: new Date().toISOString(),
            anonymizedUserId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            // Remove all PII - keep only aggregated stats
            stats: {
                totalInvoices: Array.isArray(invoicesData) ? invoicesData.length : 0,
                totalCustomers: Array.isArray(customersData) ? customersData.length : 0,
                industry: businessData.industry || 'unknown',
                subscriptionPlan: subscriptionData.planType || 'none',
                accountCreatedDate: businessData.createdAt || null,
            },
            // Note: No email, name, address, or any identifiable information
        };

        // Store in archived_accounts table (only accessible to BilltUp admins)
        const { error: archiveError } = await supabase
            .from('archived_accounts')
            .insert(archivedData);

        if (archiveError) {
            console.error('Error archiving account data:', archiveError);
            // Continue with deletion even if archiving fails
        } else {
            console.log('✅ Account data archived successfully:', archiveId);
        }

        // 3. Cancel Stripe subscription if exists
        if (subscriptionData.stripeSubscriptionId) {
            try {
                await stripe.subscriptions.cancel(subscriptionData.stripeSubscriptionId);
                console.log('✅ Stripe subscription cancelled');
            } catch (stripeError) {
                console.error('Error cancelling Stripe subscription:', stripeError);
                // Continue with deletion
            }
        }

        // 4. Disconnect Stripe Connect account if exists
        if (businessData.stripeConnectedAccountId) {
            try {
                await stripe.accounts.del(businessData.stripeConnectedAccountId);
                console.log('✅ Stripe Connect account disconnected');
            } catch (stripeError) {
                console.error('Error disconnecting Stripe Connect:', stripeError);
                // Continue with deletion
            }
        }

        // 5. Delete all user data from KV store
        const keysToDelete = [
            `business:${userId}`,
            `customers:${userId}`,
            `invoices:${userId}`,
            `subscription:${userId}`,
            `branding:${userId}`,
            `email_config:${userId}`,
        ];

        for (const key of keysToDelete) {
            try {
                await kv.del(key);
                console.log(`✅ Deleted: ${key}`);
            } catch (error) {
                console.error(`Error deleting ${key}:`, error);
            }
        }

        // 6. Delete user from Supabase auth
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);

        if (authError) {
            console.error('Error deleting user from auth:', authError);
            return c.json({ error: 'Failed to delete account' }, 500);
        }

        console.log('✅ Account deleted successfully for user:', userId);

        return c.json({
            success: true,
            message: 'Account deleted successfully. You can create a new account with the same email.',
            archivedId: archiveId // For internal tracking only
        });
    } catch (error) {
        console.error('Error deleting account:', error);
        return c.json({ error: 'Failed to delete account' }, 500);
    }
});

// ==================== STRIPE CONNECT ROUTES ====================

// Get Stripe OAuth connect URL
app.get("/stripe/oauth-url", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        // Check if account already exists
        const business = await kv.get(`business:${userId}`) || {};
        if (business.stripeConnectedAccountId) {
            return c.json({
                error: 'Stripe account already connected',
                accountId: business.stripeConnectedAccountId
            }, 400);
        }

        const origin = c.req.header('origin') || c.req.header('referer') || supabaseUrl;
        const redirectUri = `${origin}/stripe/callback`;

        // Store state to verify callback
        const state = `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await kv.set(`stripe_oauth_state:${state}`, { userId, timestamp: Date.now() }, { expirationTtl: 600 }); // 10 min expiry

        // Construct Stripe OAuth URL with Standard Connect account
        const stripeClientId = Deno.env.get('STRIPE_CLIENT_ID') || '';
        const oauthUrl = `https://connect.stripe.com/oauth/authorize?` +
            `response_type=code` +
            `&client_id=${stripeClientId}` +
            `&scope=read_write` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&state=${state}` +
            `&stripe_user[business_type]=company` + // Specify business type
            `&suggested_capabilities[]=card_payments` + // Request card payment capability
            `&suggested_capabilities[]=transfers`; // Request transfer capability for application fees

        console.log('OAuth URL generated for user:', userId);

        return c.json({
            success: true,
            oauthUrl,
            state
        });
    } catch (error) {
        console.error('Error generating OAuth URL:', error);
        return c.json({ error: 'Failed to generate OAuth URL: ' + String(error) }, 500);
    }
});

// Handle Stripe OAuth callback
app.post("/stripe/oauth-callback", async (c) => {
    try {
        const { code, state } = await c.req.json();

        if (!code || !state) {
            return c.json({ error: 'Missing authorization code or state' }, 400);
        }

        // Verify state
        const stateData = await kv.get(`stripe_oauth_state:${state}`);
        if (!stateData) {
            return c.json({ error: 'Invalid or expired state parameter' }, 400);
        }

        const { userId } = stateData;

        // Exchange code for connected account ID
        const response = await fetch('https://connect.stripe.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_secret: Deno.env.get('STRIPE_SECRET_KEY') || '',
                code,
                grant_type: 'authorization_code',
            }).toString(),
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            console.error('Stripe OAuth error:', data);
            return c.json({ error: data.error_description || 'Failed to connect Stripe account' }, 400);
        }

        const connectedAccountId = data.stripe_user_id;

        // Get account details
        const account = await stripe.accounts.retrieve(connectedAccountId);

        // Save to database
        const business = await kv.get(`business:${userId}`) || {};
        business.stripeConnectedAccountId = connectedAccountId;
        business.stripeAccountStatus = account.charges_enabled ? 'active' : 'pending';
        business.stripeChargesEnabled = account.charges_enabled;
        business.stripePayoutsEnabled = account.payouts_enabled;
        business.stripeDetailsSubmitted = account.details_submitted;
        business.platformFeePercentage = PLATFORM_FEE_PERCENTAGE;
        business.platformFeeFixed = PLATFORM_FEE_FIXED;
        business.updatedAt = new Date().toISOString();

        await kv.set(`business:${userId}`, business);

        // Clean up state
        await kv.delete(`stripe_oauth_state:${state}`);

        console.log('Stripe account connected via OAuth:', connectedAccountId, 'for user:', userId);

        return c.json({
            success: true,
            accountId: connectedAccountId,
            chargesEnabled: account.charges_enabled,
            payoutsEnabled: account.payouts_enabled,
            detailsSubmitted: account.details_submitted
        });
    } catch (error) {
        console.error('Stripe OAuth callback error:', error);
        return c.json({ error: 'Failed to process OAuth callback: ' + String(error) }, 500);
    }
});

// Get Stripe Connect account status
app.get("/stripe/account-status", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        const business = await kv.get(`business:${userId}`);

        if (!business?.stripeConnectedAccountId) {
            return c.json({
                success: true,
                connected: false,
                message: 'No Stripe Connect account found'
            });
        }

        // Retrieve account from Stripe
        const account = await stripe.accounts.retrieve(business.stripeConnectedAccountId);

        // Update status in database
        business.stripePayoutsEnabled = account.payouts_enabled;
        business.stripeChargesEnabled = account.charges_enabled;
        business.stripeAccountStatus = account.charges_enabled ? 'active' : 'pending';
        business.stripeOnboardingComplete = account.details_submitted;
        business.updatedAt = new Date().toISOString();

        await kv.set(`business:${userId}`, business);

        console.log('Stripe Connect account status updated:', account.id, {
            chargesEnabled: account.charges_enabled,
            payoutsEnabled: account.payouts_enabled,
            detailsSubmitted: account.details_submitted
        });

        return c.json({
            success: true,
            connected: true,
            accountId: account.id,
            chargesEnabled: account.charges_enabled,
            payoutsEnabled: account.payouts_enabled,
            detailsSubmitted: account.details_submitted,
            platformFeePercentage: business.platformFeePercentage || PLATFORM_FEE_PERCENTAGE,
            platformFeeFixed: business.platformFeeFixed || PLATFORM_FEE_FIXED,
            totalFeePercentage: TOTAL_FEE_PERCENTAGE,
            totalFeeFixed: TOTAL_FEE_FIXED,
        });
    } catch (error) {
        console.error('Stripe account status error:', error);
        return c.json({ error: 'Failed to fetch account status: ' + String(error) }, 500);
    }
});

// Refresh Stripe Connect onboarding link (if expired)
app.post("/stripe/refresh-onboarding", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        const business = await kv.get(`business:${userId}`);

        if (!business?.stripeConnectedAccountId) {
            return c.json({ error: 'No Stripe Connect account found' }, 404);
        }

        // Create new onboarding link
        const origin = c.req.header('origin') || c.req.header('referer') || supabaseUrl;
        const accountLink = await stripe.accountLinks.create({
            account: business.stripeConnectedAccountId,
            refresh_url: `${origin}?reauth=true`,
            return_url: `${origin}?success=true`,
            type: 'account_onboarding',
        });

        console.log('Onboarding link refreshed for account:', business.stripeConnectedAccountId);

        return c.json({
            success: true,
            onboardingUrl: accountLink.url
        });
    } catch (error) {
        console.error('Error refreshing onboarding link:', error);
        return c.json({ error: 'Failed to refresh onboarding link: ' + String(error) }, 500);
    }
});

// Disconnect Stripe Connect account
app.post("/stripe/disconnect", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        const business = await kv.get(`business:${userId}`);

        if (!business?.stripeConnectedAccountId) {
            return c.json({ error: 'No Stripe Connect account found' }, 404);
        }

        // Note: We don't delete the Stripe account itself - just disconnect it from our app
        // The business owner can manage their Stripe account directly on Stripe dashboard

        // Remove Stripe connection data from business profile
        delete business.stripeConnectedAccountId;
        delete business.stripeAccountStatus;
        delete business.stripeChargesEnabled;
        delete business.stripePayoutsEnabled;
        delete business.stripeDetailsSubmitted;
        business.updatedAt = new Date().toISOString();

        await kv.set(`business:${userId}`, business);

        console.log('Stripe account disconnected for user:', userId);

        return c.json({
            success: true,
            message: 'Stripe account disconnected successfully'
        });
    } catch (error) {
        console.error('Error disconnecting Stripe account:', error);
        return c.json({ error: 'Failed to disconnect Stripe account: ' + String(error) }, 500);
    }
});

// Calculate fees for a transaction (utility endpoint)
app.post("/stripe/calculate-fees", async (c) => {
    try {
        const { amount } = await c.req.json();

        if (!amount || amount <= 0) {
            return c.json({ error: 'Invalid amount' }, 400);
        }

        // Calculate fees
        const stripeFee = (amount * STRIPE_FEE_PERCENTAGE / 100) + STRIPE_FEE_FIXED;
        const platformFee = (amount * PLATFORM_FEE_PERCENTAGE / 100) + PLATFORM_FEE_FIXED;
        const totalFee = (amount * TOTAL_FEE_PERCENTAGE / 100) + TOTAL_FEE_FIXED;
        const netAmount = amount - totalFee;
        const businessReceives = amount - totalFee;

        return c.json({
            success: true,
            amount: parseFloat(amount.toFixed(2)),
            fees: {
                stripeFee: parseFloat(stripeFee.toFixed(2)),
                stripeFeePercentage: STRIPE_FEE_PERCENTAGE,
                stripeFeeFixed: STRIPE_FEE_FIXED,
                platformFee: parseFloat(platformFee.toFixed(2)),
                platformFeePercentage: PLATFORM_FEE_PERCENTAGE,
                platformFeeFixed: PLATFORM_FEE_FIXED,
                totalFee: parseFloat(totalFee.toFixed(2)),
                totalFeePercentage: TOTAL_FEE_PERCENTAGE,
                totalFeeFixed: TOTAL_FEE_FIXED,
            },
            netAmount: parseFloat(netAmount.toFixed(2)),
            businessReceives: parseFloat(businessReceives.toFixed(2)),
            breakdown: {
                invoiceAmount: parseFloat(amount.toFixed(2)),
                minus: {
                    stripeProcessing: parseFloat(stripeFee.toFixed(2)),
                    platformFee: parseFloat(platformFee.toFixed(2)),
                },
                equals: parseFloat(businessReceives.toFixed(2)),
            }
        });
    } catch (error) {
        console.error('Error calculating fees:', error);
        return c.json({ error: 'Failed to calculate fees' }, 500);
    }
});

// ==================== INVOICE ROUTES ====================

// Create invoice
app.post("/invoices", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        const invoiceData = await c.req.json();
        const invoiceId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Get existing invoices
        const existingInvoices = await kv.get(`invoices:${userId}`) || [];

        // Add new invoice
        const newInvoice = {
            id: invoiceId,
            ...invoiceData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        existingInvoices.unshift(newInvoice);

        // Save back to KV store
        await kv.set(`invoices:${userId}`, existingInvoices);

        // Update monthly invoice counter
        let monthlyCount = await kv.get(`user:${userId}:monthly_invoice_count`);

        if (!monthlyCount) {
            // Initialize if not exists (for existing users)
            const accountCreated = await kv.get(`user:${userId}:account_created`) || new Date().toISOString();
            monthlyCount = {
                count: 0,
                monthStart: accountCreated,
                monthEnd: getNextBillingDate(accountCreated)
            };
        }

        // Check if we need to reset the counter (new billing month)
        if (shouldResetMonthlyCounter(monthlyCount.monthStart, monthlyCount.monthEnd)) {
            const newMonthStart = monthlyCount.monthEnd;
            monthlyCount = {
                count: 0,
                monthStart: newMonthStart,
                monthEnd: getNextBillingDate(newMonthStart)
            };
        }

        // Increment counter
        monthlyCount.count += 1;
        await kv.set(`user:${userId}:monthly_invoice_count`, monthlyCount);

        console.log('Invoice created:', invoiceId, 'for user:', userId, '- Monthly count:', monthlyCount.count);
        return c.json({ success: true, invoice: newInvoice, monthlyInvoiceCount: monthlyCount.count });
    } catch (error) {
        console.error('Error creating invoice:', error);
        return c.json({ error: 'Failed to create invoice' }, 500);
    }
});

// Get all invoices (with pagination to prevent data dumps)
app.get("/invoices", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        // Get pagination params
        const limit = Math.min(parseInt(c.req.query('limit') || '100'), MAX_QUERY_LIMIT);
        const offset = parseInt(c.req.query('offset') || '0');

        const allInvoices = await kv.get(`invoices:${userId}`) || [];

        // Apply pagination
        const paginatedInvoices = allInvoices.slice(offset, offset + limit);

        // Return with metadata
        return c.json({
            data: paginatedInvoices,
            pagination: {
                total: allInvoices.length,
                limit,
                offset,
                hasMore: offset + limit < allInvoices.length
            }
        });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return c.json({ error: 'Failed to fetch invoices' }, 500);
    }
});

// Get single invoice
app.get("/invoices/:id", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;
    const invoiceId = c.req.param('id');

    try {
        const invoices = await kv.get(`invoices:${userId}`) || [];
        const invoice = invoices.find((inv: any) => inv.id === invoiceId);

        if (!invoice) {
            return c.json({ error: 'Invoice not found' }, 404);
        }

        return c.json(invoice);
    } catch (error) {
        console.error('Error fetching invoice:', error);
        return c.json({ error: 'Failed to fetch invoice' }, 500);
    }
});

// Update invoice status
app.patch("/invoices/:id", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;
    const invoiceId = c.req.param('id');

    try {
        const updates = await c.req.json();
        const invoices = await kv.get(`invoices:${userId}`) || [];

        const invoiceIndex = invoices.findIndex((inv: any) => inv.id === invoiceId);
        if (invoiceIndex === -1) {
            return c.json({ error: 'Invoice not found' }, 404);
        }

        const oldInvoice = invoices[invoiceIndex];
        const wasUnpaid = oldInvoice.status !== 'paid';

        invoices[invoiceIndex] = {
            ...oldInvoice,
            ...updates,
            updatedAt: new Date().toISOString()
        };

        await kv.set(`invoices:${userId}`, invoices);

        // Automatically email invoice when payment is taken (status changed to paid)
        if (updates.status === 'paid' && wasUnpaid && oldInvoice.customerEmail) {
            console.log('Payment taken - auto-sending invoice email to:', oldInvoice.customerEmail);

            try {
                const business = await kv.get(`business:${userId}`);

                if (business && emailConfig.auth.user) {
                    // Import nodemailer dynamically
                    const nodemailer = await import('npm:nodemailer@6');
                    const transporter = nodemailer.default.createTransporter(emailConfig);

                    const invoiceData = invoices[invoiceIndex];

                    await transporter.sendMail({
                        from: emailConfig.from,
                        to: oldInvoice.customerEmail,
                        subject: `Invoice #${invoiceData.number} - Payment Received`,
                        html: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: #1E3A8A; color: white; padding: 20px; text-align: center; }
                  .content { padding: 30px; background: #f9fafb; }
                  .invoice-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                  .amount { font-size: 32px; color: #14B8A6; font-weight: bold; }
                  .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                  .status-badge { display: inline-block; background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>${business.businessName || 'Invoice'}</h1>
                  </div>
                  <div class="content">
                    <h2>Payment Received! ✓</h2>
                    <p>Hello ${invoiceData.customer},</p>
                    <p>Thank you for your payment. Your invoice has been marked as <span class="status-badge">PAID</span>.</p>
                    
                    <div class="invoice-details">
                      <h3>Invoice Details</h3>
                      <p><strong>Invoice Number:</strong> #${invoiceData.number}</p>
                      <p><strong>Date:</strong> ${invoiceData.date}</p>
                      <p><strong>Amount Paid:</strong> <span class="amount">$${invoiceData.total.toFixed(2)}</span></p>
                    </div>
                    
                    <p>This email serves as your receipt. Keep it for your records.</p>
                    
                    <p>If you have any questions, please contact us at ${business.email || emailConfig.auth.user}.</p>
                    
                    <p>Best regards,<br>${business.businessName || 'Your Business'}</p>
                  </div>
                  <div class="footer">
                    <p>This is an automated email from ${business.businessName || 'BilltUp'}.</p>
                    <p>🔒 All transactions are secured with bank-level encryption and PCI compliance.</p>
                  </div>
                </div>
              </body>
              </html>
            `
                    });

                    console.log('Auto-sent invoice email successfully to:', oldInvoice.customerEmail);
                }
            } catch (emailError) {
                console.error('Failed to auto-send invoice email:', emailError);
                // Don't fail the invoice update if email fails
            }
        }

        console.log('Invoice updated:', invoiceId, 'for user:', userId);
        return c.json({ success: true, invoice: invoices[invoiceIndex] });
    } catch (error) {
        console.error('Error updating invoice:', error);
        return c.json({ error: 'Failed to update invoice' }, 500);
    }
});

// Update invoice signature
app.patch("/invoices/:id/signature", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;
    const invoiceId = c.req.param('id');

    try {
        const { signature } = await c.req.json();
        const invoices = await kv.get(`invoices:${userId}`) || [];

        const invoiceIndex = invoices.findIndex((inv: any) => inv.id === invoiceId);
        if (invoiceIndex === -1) {
            return c.json({ error: 'Invoice not found' }, 404);
        }

        // Update signature
        invoices[invoiceIndex] = {
            ...invoices[invoiceIndex],
            signature: signature,
            updatedAt: new Date().toISOString()
        };

        await kv.set(`invoices:${userId}`, invoices);

        console.log('Invoice signature updated:', invoiceId, 'for user:', userId);
        return c.json({
            success: true,
            message: signature ? 'Signature added successfully' : 'Signature removed successfully',
            invoice: invoices[invoiceIndex]
        });
    } catch (error) {
        console.error('Error updating invoice signature:', error);
        return c.json({ error: 'Failed to update signature' }, 500);
    }
});

// Delete invoice
app.delete("/invoices/:id", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;
    const invoiceId = c.req.param('id');

    try {
        const invoices = await kv.get(`invoices:${userId}`) || [];
        const invoice = invoices.find((inv: any) => inv.id === invoiceId);

        if (!invoice) {
            return c.json({ error: 'Invoice not found' }, 404);
        }

        // Only allow deletion of pending invoices
        if (invoice.status !== 'pending') {
            return c.json({ error: 'Only pending invoices can be deleted' }, 400);
        }

        const filteredInvoices = invoices.filter((inv: any) => inv.id !== invoiceId);
        await kv.set(`invoices:${userId}`, filteredInvoices);

        console.log('Invoice deleted:', invoiceId, 'for user:', userId);
        return c.json({ success: true, message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        return c.json({ error: 'Failed to delete invoice' }, 500);
    }
});

// ==================== CUSTOMER ROUTES ====================

// Create customer
app.post("/customers", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        const customerData = await c.req.json();
        const customerId = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const existingCustomers = await kv.get(`customers:${userId}`) || [];

        const newCustomer = {
            id: customerId,
            ...customerData,
            createdAt: new Date().toISOString()
        };

        existingCustomers.push(newCustomer);
        await kv.set(`customers:${userId}`, existingCustomers);

        console.log('Customer created:', customerId, 'for user:', userId);
        return c.json({ success: true, customer: newCustomer });
    } catch (error) {
        console.error('Error creating customer:', error);
        return c.json({ error: 'Failed to create customer' }, 500);
    }
});

// Get all customers (with pagination to prevent data dumps)
app.get("/customers", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        // Get pagination params
        const limit = Math.min(parseInt(c.req.query('limit') || '100'), MAX_QUERY_LIMIT);
        const offset = parseInt(c.req.query('offset') || '0');

        const allCustomers = await kv.get(`customers:${userId}`) || [];

        // Apply pagination
        const paginatedCustomers = allCustomers.slice(offset, offset + limit);

        // Return with metadata
        return c.json({
            data: paginatedCustomers,
            pagination: {
                total: allCustomers.length,
                limit,
                offset,
                hasMore: offset + limit < allCustomers.length
            }
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        return c.json({ error: 'Failed to fetch customers' }, 500);
    }
});

// Get customer by ID
app.get("/customers/:id", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;
    const customerId = c.req.param('id');

    try {
        const customers = await kv.get(`customers:${userId}`) || [];
        const customer = customers.find((cust: any) => cust.id === customerId);

        if (!customer) {
            return c.json({ error: 'Customer not found' }, 404);
        }

        return c.json(customer);
    } catch (error) {
        console.error('Error fetching customer:', error);
        return c.json({ error: 'Failed to fetch customer' }, 500);
    }
});

// Update customer
app.patch("/customers/:id", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;
    const customerId = c.req.param('id');

    try {
        const updates = await c.req.json();
        const customers = await kv.get(`customers:${userId}`) || [];

        const customerIndex = customers.findIndex((cust: any) => cust.id === customerId);
        if (customerIndex === -1) {
            return c.json({ error: 'Customer not found' }, 404);
        }

        customers[customerIndex] = {
            ...customers[customerIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        await kv.set(`customers:${userId}`, customers);

        console.log('Customer updated:', customerId, 'for user:', userId);
        return c.json({ success: true, customer: customers[customerIndex] });
    } catch (error) {
        console.error('Error updating customer:', error);
        return c.json({ error: 'Failed to update customer' }, 500);
    }
});

// Delete customer
app.delete("/customers/:id", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;
    const customerId = c.req.param('id');

    try {
        const customers = await kv.get(`customers:${userId}`) || [];
        const filteredCustomers = customers.filter((cust: any) => cust.id !== customerId);

        if (customers.length === filteredCustomers.length) {
            return c.json({ error: 'Customer not found' }, 404);
        }

        await kv.set(`customers:${userId}`, filteredCustomers);

        console.log('Customer deleted:', customerId, 'for user:', userId);
        return c.json({ success: true, message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        return c.json({ error: 'Failed to delete customer' }, 500);
    }
});

// ==================== PAYMENT ROUTES ====================

// Create payment intent with Stripe Connect
app.post("/payments/create-intent", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        const { amount, currency = 'usd', invoiceId, customerEmail } = await c.req.json();

        if (!amount || amount <= 0) {
            return c.json({ error: 'Invalid amount' }, 400);
        }

        // Get business data to check for connected account
        const business = await kv.get(`business:${userId}`);

        if (!business?.stripeConnectedAccountId) {
            return c.json({
                error: 'Stripe Connect account not set up. Please complete your payment setup in Settings.',
                requiresOnboarding: true
            }, 400);
        }

        if (!business.stripeChargesEnabled) {
            return c.json({
                error: 'Your Stripe account is not yet enabled to accept charges. Please complete the onboarding process.',
                requiresOnboarding: true,
                accountId: business.stripeConnectedAccountId
            }, 400);
        }

        // Calculate platform fee
        const amountInCents = Math.round(amount * 100);
        const platformFee = Math.round((amount * PLATFORM_FEE_PERCENTAGE / 100 + PLATFORM_FEE_FIXED) * 100);

        // Create payment intent with destination charge (money goes to connected account)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency,
            application_fee_amount: platformFee, // Platform takes this fee
            transfer_data: {
                destination: business.stripeConnectedAccountId, // Money goes to connected account
            },
            metadata: {
                userId,
                invoiceId,
                customerEmail,
                connectedAccountId: business.stripeConnectedAccountId
            }
        });

        console.log('Payment intent created:', paymentIntent.id, 'for user:', userId, 'connected account:', business.stripeConnectedAccountId);
        return c.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            platformFee: platformFee / 100,
            businessReceives: (amountInCents - platformFee) / 100
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        return c.json({ error: 'Failed to create payment intent: ' + String(error) }, 500);
    }
});

// Confirm payment (card entry)
app.post("/payments/confirm", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        const { paymentMethodId, paymentIntentId } = await c.req.json();

        if (!paymentIntentId) {
            return c.json({ error: 'Payment intent ID is required' }, 400);
        }

        // Confirm the payment
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
            payment_method: paymentMethodId,
            return_url: `${supabaseUrl}/functions/v1/server/payments/return`
        });

        console.log('Payment confirmed:', paymentIntent.id, 'for user:', userId);
        return c.json({
            success: true,
            status: paymentIntent.status,
            paymentIntent
        });
    } catch (error) {
        console.error('Error confirming payment:', error);
        return c.json({ error: 'Failed to confirm payment' }, 500);
    }
});

// Process NFC payment (simulated)
app.post("/payments/nfc", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        const { amount, invoiceId } = await c.req.json();

        // In a real implementation, this would interface with NFC hardware
        // For now, we'll simulate a successful payment

        const paymentId = `pay_nfc_${Date.now()}`;

        console.log('NFC payment processed:', paymentId, 'for user:', userId);
        return c.json({
            success: true,
            paymentId,
            status: 'succeeded',
            message: 'NFC payment processed successfully'
        });
    } catch (error) {
        console.error('Error processing NFC payment:', error);
        return c.json({ error: 'Failed to process NFC payment' }, 500);
    }
});

// Refund payment
app.post("/payments/refund", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        const { invoiceId, amount } = await c.req.json();

        if (!invoiceId || !amount) {
            return c.json({ error: 'Invoice ID and amount are required' }, 400);
        }

        if (amount <= 0) {
            return c.json({ error: 'Refund amount must be greater than 0' }, 400);
        }

        // Get the invoice
        const invoices = await kv.get(`invoices:${userId}`) || [];
        const invoiceIndex = invoices.findIndex((inv: any) => inv.id === invoiceId);

        if (invoiceIndex === -1) {
            return c.json({ error: 'Invoice not found' }, 404);
        }

        const invoice = invoices[invoiceIndex];

        if (invoice.status !== 'paid' && invoice.status !== 'partially_refunded') {
            return c.json({ error: 'Only paid invoices can be refunded' }, 400);
        }

        const currentRefundedAmount = invoice.refundedAmount || 0;
        const maxRefundable = invoice.total - currentRefundedAmount;

        if (amount > maxRefundable) {
            return c.json({
                error: `Refund amount cannot exceed $${maxRefundable.toFixed(2)}`
            }, 400);
        }

        // Process refund with Stripe (if payment intent exists)
        let refundResult;
        if (invoice.paymentIntentId) {
            try {
                refundResult = await stripe.refunds.create({
                    payment_intent: invoice.paymentIntentId,
                    amount: Math.round(amount * 100), // Convert to cents
                    metadata: {
                        userId,
                        invoiceId,
                        invoiceNumber: invoice.number
                    }
                });
                console.log('Stripe refund created:', refundResult.id);
            } catch (stripeError) {
                console.error('Stripe refund error:', stripeError);
                return c.json({
                    error: 'Failed to process refund with payment processor: ' + String(stripeError)
                }, 500);
            }
        }

        // Update invoice with refund information
        const newRefundedAmount = currentRefundedAmount + amount;
        const isFullRefund = newRefundedAmount >= invoice.total;

        invoices[invoiceIndex] = {
            ...invoice,
            refundedAmount: newRefundedAmount,
            status: isFullRefund ? 'refunded' : 'partially_refunded',
            refundDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            stripeRefundId: refundResult?.id,
            updatedAt: new Date().toISOString()
        };

        await kv.set(`invoices:${userId}`, invoices);

        console.log('Refund processed:', {
            invoiceId,
            amount,
            newStatus: invoices[invoiceIndex].status,
            totalRefunded: newRefundedAmount
        });

        return c.json({
            success: true,
            invoice: invoices[invoiceIndex],
            refund: {
                amount,
                totalRefunded: newRefundedAmount,
                stripeRefundId: refundResult?.id
            },
            message: `Refund of $${amount.toFixed(2)} processed successfully`
        });
    } catch (error) {
        console.error('Error processing refund:', error);
        return c.json({ error: 'Failed to process refund: ' + String(error) }, 500);
    }
});

// ==================== PDF & EMAIL ROUTES ====================

// Helper function to generate PDF buffer from invoice data
async function generateInvoicePDFBuffer(invoiceData: any, businessData: any): Promise<Uint8Array> {
    const PDFDocument = (await import('npm:pdfkit@0.15.0')).default;

    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50,
                bufferPages: true
            });

            const chunks: Uint8Array[] = [];

            doc.on('data', (chunk: Uint8Array) => chunks.push(chunk));
            doc.on('end', () => {
                const pdfBuffer = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
                let offset = 0;
                for (const chunk of chunks) {
                    pdfBuffer.set(chunk, offset);
                    offset += chunk.length;
                }
                resolve(pdfBuffer);
            });
            doc.on('error', reject);

            // Use custom branding or defaults
            const primaryColor = businessData.brandColor || '#1E3A8A';
            const secondaryColor = businessData.accentColor || '#14B8A6';

            // Convert hex to RGB
            const hexToRgb = (hex: string) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? [
                    parseInt(result[1], 16) / 255,
                    parseInt(result[2], 16) / 255,
                    parseInt(result[3], 16) / 255
                ] : [0.118, 0.227, 0.541]; // Default blue
            };

            const [r, g, b] = hexToRgb(primaryColor);
            const [r2, g2, b2] = hexToRgb(secondaryColor);

            // Header Section
            doc.fontSize(28).fillColor(r, g, b).text('INVOICE', 50, 50);

            // Business Info (Left side)
            doc.fontSize(16).fillColor(r, g, b).text(businessData.businessName || 'Business Name', 50, 100);
            doc.fontSize(10).fillColor('#4b5563')
                .text(businessData.email || '', 50, 125)
                .text(businessData.phone || '', 50, 140)
                .text(businessData.address || '', 50, 155);

            // Invoice Details (Right side)
            doc.fontSize(10).fillColor('#4b5563')
                .text(`Invoice Number: ${invoiceData.number || 'N/A'}`, 350, 100, { align: 'right', width: 200 })
                .text(`Date: ${invoiceData.date || new Date().toLocaleDateString()}`, 350, 115, { align: 'right', width: 200 });

            // Bill To Section
            doc.fontSize(12).fillColor(r, g, b).text('Bill To:', 50, 200);
            doc.fontSize(10).fillColor('#1f2937')
                .text(invoiceData.customer || 'Customer', 50, 220)
                .text(invoiceData.customerEmail || '', 50, 235);

            if (invoiceData.customerPhone) {
                doc.text(invoiceData.customerPhone, 50, 250);
            }

            // Line Items Table
            const tableTop = 300;
            const itemX = 50;
            const qtyX = 300;
            const priceX = 380;
            const amountX = 480;

            // Table Header
            doc.fontSize(10).fillColor('white')
                .rect(50, tableTop, 495, 25).fill(r, g, b);

            doc.fillColor('white')
                .text('Item', itemX + 10, tableTop + 8)
                .text('Qty', qtyX + 10, tableTop + 8)
                .text('Price', priceX + 10, tableTop + 8)
                .text('Amount', amountX + 10, tableTop + 8);

            // Table Rows
            let y = tableTop + 35;
            doc.fillColor('#1f2937').fontSize(9);

            if (invoiceData.lineItems && invoiceData.lineItems.length > 0) {
                invoiceData.lineItems.forEach((item: any, i: number) => {
                    const amount = (item.quantity * item.price).toFixed(2);

                    // Alternate row background
                    if (i % 2 === 0) {
                        doc.rect(50, y - 5, 495, 20).fill('#f9fafb');
                    }

                    doc.fillColor('#1f2937')
                        .text(item.name, itemX + 10, y, { width: 230 })
                        .text(item.quantity.toString(), qtyX + 10, y)
                        .text(`$${item.price.toFixed(2)}`, priceX + 10, y)
                        .text(`$${amount}`, amountX + 10, y);

                    y += 25;
                });
            }

            // Totals Section
            const totalsY = y + 30;
            const labelX = 380;
            const valueX = 480;

            doc.fontSize(10).fillColor('#4b5563');

            // Subtotal
            doc.text('Subtotal:', labelX, totalsY)
                .text(`$${(invoiceData.subtotal || 0).toFixed(2)}`, valueX, totalsY);

            // Tax (if applicable)
            if (invoiceData.tax && invoiceData.tax > 0) {
                doc.text('Tax:', labelX, totalsY + 20)
                    .text(`$${invoiceData.tax.toFixed(2)}`, valueX, totalsY + 20);
            }

            // Total (bold and colored)
            const totalY = invoiceData.tax > 0 ? totalsY + 50 : totalsY + 30;
            doc.fontSize(14).fillColor(r, g, b)
                .text('TOTAL:', labelX, totalY)
                .text(`$${(invoiceData.total || 0).toFixed(2)}`, valueX, totalY);

            // Payment Status Badge
            if (invoiceData.status) {
                const statusY = totalY + 30;
                const statusText = invoiceData.status.toUpperCase();
                const statusColor = invoiceData.status === 'paid' ? [0.059, 0.522, 0.451] : [0.964, 0.620, 0.043]; // Teal or Amber

                doc.fontSize(10).fillColor(statusColor[0], statusColor[1], statusColor[2])
                    .text(`Status: ${statusText}`, valueX - 50, statusY);
            }

            // Footer - Contact Information
            const footerY = doc.page.height - 150;

            doc.fontSize(12).fillColor(r, g, b)
                .text('Contact Us', 50, footerY);

            doc.fontSize(9).fillColor('#4b5563')
                .text(`For questions about this invoice, contact us at:`, 50, footerY + 20)
                .text(`Email: ${businessData.contactEmail || businessData.email || ''}`, 50, footerY + 35)
                .text(`Phone: ${businessData.phone || ''}`, 50, footerY + 50);

            // Thank you message
            doc.fontSize(10).fillColor(r2, g2, b2)
                .text('Thank you for your business!', 50, footerY + 80, { align: 'center', width: 495 });

            // Footer line
            doc.strokeColor(r, g, b).lineWidth(2)
                .moveTo(50, doc.page.height - 50)
                .lineTo(545, doc.page.height - 50)
                .stroke();

            doc.fontSize(8).fillColor('#9ca3af')
                .text(`© ${new Date().getFullYear()} ${businessData.businessName || 'BilltUp'}. All rights reserved.`,
                    50, doc.page.height - 35, { align: 'center', width: 495 });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

// Generate and send invoice PDF via email
app.post("/invoices/send-email", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        const { invoiceData, customerEmail, businessData } = await c.req.json();

        console.log('Attempting to send invoice email:', {
            invoiceNumber: invoiceData?.number,
            customerEmail,
            hasBusinessData: !!businessData,
            hasLogo: !!(businessData?.logo),
            hasCustomLogo: !!(businessData?.customLogo),
            logoPreview: businessData?.logo?.substring(0, 50) || 'none',
            customLogoPreview: businessData?.customLogo?.substring(0, 50) || 'none',
            brandColor: businessData?.brandColor || 'not set',
            accentColor: businessData?.accentColor || 'not set',
            invoiceTemplate: businessData?.invoiceTemplate || 'not set'
        });

        if (!customerEmail) {
            return c.json({ error: 'Customer email is required' }, 400);
        }

        if (!invoiceData) {
            return c.json({ error: 'Invoice data is required' }, 400);
        }

        // Check for custom email configuration in KV store first
        let emailSettings = emailConfig; // Default from env variables
        const customEmailConfig = await kv.get('email_config');

        if (customEmailConfig && customEmailConfig.host && customEmailConfig.user && customEmailConfig.password) {
            console.log('Using custom email configuration from KV store');
            emailSettings = {
                host: customEmailConfig.host,
                port: parseInt(customEmailConfig.port),
                secure: parseInt(customEmailConfig.port) === 465,
                auth: {
                    user: customEmailConfig.user,
                    pass: customEmailConfig.password,
                },
                from: `${businessData.businessName} <${customEmailConfig.user}>`,
            };
        } else {
            // Validate default email configuration
            if (!emailSettings.auth.user || !emailSettings.auth.pass) {
                console.error('Email credentials not configured');
                return c.json({
                    success: false,
                    error: 'Email service not configured. Please configure email settings in the app Settings.'
                }, 500);
            }
        }

        // Generate PDF content (HTML)
        const pdfContent = generateInvoicePDF(invoiceData, businessData);

        const emailSubject = `Invoice ${invoiceData.number || '#' + (invoiceData.id || 'N/A')} from ${businessData.businessName}`;

        console.log('Sending email with subject:', emailSubject);
        console.log('Using email host:', emailSettings.host, 'port:', emailSettings.port);

        // Send email using Nodemailer
        try {
            const nodemailer = await import('npm:nodemailer@6.9.15');

            // Create transporter
            const transporter = nodemailer.default.createTransport({
                host: emailSettings.host,
                port: emailSettings.port,
                secure: emailSettings.secure,
                auth: {
                    user: emailSettings.auth.user,
                    pass: emailSettings.auth.pass,
                },
            });

            // Create a simple text version of the invoice for plain text email clients
            const textContent = `
Invoice ${invoiceData.number || 'N/A'}
From: ${businessData.businessName}

Bill To: ${invoiceData.customer}
Email: ${customerEmail}

Items:
${invoiceData.lineItems.map((item: any) =>
                `${item.name} - Qty: ${item.quantity} x $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`
            ).join('\n')}

Subtotal: $${invoiceData.subtotal?.toFixed(2) || '0.00'}
${invoiceData.tax && invoiceData.tax > 0 ? `Tax: $${invoiceData.tax.toFixed(2)}` : ''}
TOTAL: $${invoiceData.total?.toFixed(2) || '0.00'}

A PDF copy of this invoice is attached to this email for your records.

Thank you for your business!

${businessData.businessName}
${businessData.email || ''}
${businessData.phone || ''}
${businessData.address || ''}
      `;

            console.log('Preparing to send invoice email');
            const displayLogo = businessData.customLogo || businessData.logo;
            console.log('Logo data:', {
                hasCustomLogo: !!businessData.customLogo,
                hasLogo: !!businessData.logo,
                hasDisplayLogo: !!displayLogo,
                logoType: displayLogo?.substring(0, 30)
            });

            // Prepare attachments array
            const attachments: any[] = [];

            // Prepare HTML content with embedded images
            let emailHtml = pdfContent;

            // Handle logo embedding as CID
            if (displayLogo && displayLogo.startsWith('data:')) {
                const logoMatch = displayLogo.match(/^data:([^;]+);base64,(.+)$/);
                if (logoMatch) {
                    const [, mimeType, base64Data] = logoMatch;
                    const extension = mimeType.split('/')[1] || 'png';

                    // Add logo as embedded attachment
                    attachments.push({
                        filename: `logo.${extension}`,
                        content: base64Data,
                        encoding: 'base64',
                        cid: 'logo@billtup'
                    });

                    // Replace data URL with CID in HTML
                    emailHtml = emailHtml.replace(displayLogo, 'cid:logo@billtup');
                    console.log('Logo embedded as CID attachment');
                }
            }

            // Handle signature embedding as CID if it exists
            if (invoiceData.signature && invoiceData.signature.startsWith('data:')) {
                const sigMatch = invoiceData.signature.match(/^data:([^;]+);base64,(.+)$/);
                if (sigMatch) {
                    const [, mimeType, base64Data] = sigMatch;
                    const extension = mimeType.split('/')[1] || 'png';

                    // Add signature as embedded attachment
                    attachments.push({
                        filename: `signature.${extension}`,
                        content: base64Data,
                        encoding: 'base64',
                        cid: 'signature@billtup'
                    });

                    // Replace data URL with CID in HTML
                    emailHtml = emailHtml.replace(invoiceData.signature, 'cid:signature@billtup');
                    console.log('Signature embedded as CID attachment');
                }
            }

            // Generate and add PDF file as downloadable attachment
            console.log('📄 Generating PDF attachment...');
            try {
                const pdfBuffer = await generateInvoicePDFBuffer(invoiceData, businessData);
                attachments.push({
                    filename: `Invoice-${invoiceData.number || invoiceData.id || 'N-A'}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                });
                console.log('✅ PDF attachment generated successfully');
            } catch (pdfError) {
                console.error('⚠️ Error generating PDF, skipping PDF attachment:', pdfError);
                // Continue without PDF attachment if generation fails
            }

            // Send email with embedded images and PDF attachment
            const info = await transporter.sendMail({
                from: emailSettings.from,
                to: customerEmail,
                subject: emailSubject,
                text: textContent,
                html: emailHtml, // Use modified HTML with CID references
                attachments: attachments
            });

            console.log('Invoice email sent successfully:', info.messageId, 'to:', customerEmail);

            return c.json({
                success: true,
                emailId: info.messageId,
                message: `Invoice sent to ${customerEmail}`
            });
        } catch (emailError) {
            console.error('Error sending email via Nodemailer:', emailError);
            return c.json({
                success: false,
                error: 'Failed to send email: ' + String(emailError)
            }, 500);
        }
    } catch (error) {
        console.error('Error sending invoice email - detailed error:', error);
        return c.json({ error: 'Failed to send invoice email: ' + String(error) }, 500);
    }
});

// ==================== EMAIL CONFIGURATION ROUTES ====================

// Update email configuration (stored in KV store)
app.post("/email-config", async (c) => {
    try {
        const { emailHost, emailPort, emailUser, emailPassword } = await c.req.json();

        if (!emailHost || !emailPort || !emailUser || !emailPassword) {
            return c.json({ error: 'All email configuration fields are required' }, 400);
        }

        // First, validate email configuration by trying to connect
        console.log('Validating email configuration...');
        try {
            const nodemailer = await import('npm:nodemailer@6.9.15');

            const transporter = nodemailer.default.createTransport({
                host: emailHost,
                port: parseInt(emailPort),
                secure: parseInt(emailPort) === 465,
                auth: {
                    user: emailUser,
                    pass: emailPassword,
                },
            });

            // Verify the connection
            await transporter.verify();
            console.log('✅ Email configuration validated successfully');
        } catch (verifyError) {
            console.error('❌ Email configuration validation failed:', verifyError);
            return c.json({
                error: 'Invalid email configuration: ' + String(verifyError)
            }, 400);
        }

        // Save to KV store (encrypted in practice)
        console.log('Saving email configuration to KV store...');
        try {
            await kv.set('email_config', {
                host: emailHost,
                port: emailPort,
                user: emailUser,
                password: emailPassword,
                updatedAt: new Date().toISOString(),
            });

            console.log('✅ Email configuration saved successfully');

            return c.json({
                success: true,
                message: 'Email configuration saved successfully. Changes are now active!'
            });
        } catch (saveError) {
            console.error('Failed to save email configuration:', saveError);
            return c.json({
                error: 'Email validated but failed to save: ' + String(saveError)
            }, 500);
        }
    } catch (error) {
        console.error('Error processing email configuration:', error);
        return c.json({ error: 'Failed to update email configuration: ' + String(error) }, 500);
    }
});

// Get current email configuration (without exposing password)
app.get("/email-config", async (c) => {
    try {
        const config = await kv.get('email_config');

        if (!config) {
            return c.json({
                configured: false,
                host: '',
                port: '587',
                user: '',
            });
        }

        // Return config without password
        return c.json({
            configured: true,
            host: config.host || '',
            port: config.port || '587',
            user: config.user || '',
            updatedAt: config.updatedAt,
        });
    } catch (error) {
        console.error('Error fetching email configuration:', error);
        return c.json({ error: 'Failed to fetch email configuration' }, 500);
    }
});

// ==================== WEBHOOK ROUTES ====================

// Stripe webhook handler (for production use)
app.post("/webhooks/stripe", async (c) => {
    try {
        const body = await c.req.text();
        const signature = c.req.header('stripe-signature');

        // In production, verify the webhook signature here
        // const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

        console.log('Stripe webhook received');

        // Handle different event types
        // switch (event.type) {
        //   case 'payment_intent.succeeded':
        //     // Update invoice status, send receipt, etc.
        //     break;
        //   case 'payment_intent.payment_failed':
        //     // Handle failed payment
        //     break;
        // }

        return c.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return c.json({ error: 'Webhook handler failed' }, 400);
    }
});

// Helper function to generate invoice PDF HTML
function generateInvoicePDF(invoiceData: any, businessData: any): string {
    const { customer, customerEmail, lineItems, subtotal, tax, total, number, date, signature } = invoiceData;
    const { businessName, email, phone, address, logo, customLogo, brandColor, accentColor, invoiceTemplate, contactEmail } = businessData;

    // Use custom branding or defaults
    const primaryColor = brandColor || '#1E3A8A';
    const secondaryColor = accentColor || '#14B8A6';
    const template = invoiceTemplate || 'modern';
    const displayLogo = customLogo || logo;
    const supportEmail = contactEmail || email;

    console.log('📧 Generating invoice PDF HTML:', {
        hasLogo: !!logo,
        hasCustomLogo: !!customLogo,
        hasDisplayLogo: !!displayLogo,
        logoLength: displayLogo?.length || 0,
        logoType: displayLogo?.substring(0, 30) || 'none',
        brandColor: brandColor || 'using default #1E3A8A',
        accentColor: accentColor || 'using default #14B8A6',
        template: template
    });

    // Use template-specific generators
    if (template === 'modern') {
        return generateModernTemplate(invoiceData, businessData, primaryColor, secondaryColor, displayLogo, supportEmail);
    }

    if (template === 'classic') {
        return generateClassicTemplate(invoiceData, businessData, primaryColor, secondaryColor, displayLogo, supportEmail);
    }

    if (template === 'minimal') {
        return generateMinimalTemplate(invoiceData, businessData, primaryColor, secondaryColor, displayLogo, supportEmail);
    }

    // Fallback to modern template
    return generateModernTemplate(invoiceData, businessData, primaryColor, secondaryColor, displayLogo, supportEmail);
}

// ==================== ANALYTICS ROUTES ====================

// Get sales summary (monthly and YTD)
app.get("/analytics/sales", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        const invoices = await kv.get(`invoices:${userId}`) || [];
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        // Calculate Month-to-Date (MTD) metrics
        const mtdInvoices = invoices.filter((inv: any) => {
            const invDate = new Date(inv.date);
            return invDate.getFullYear() === currentYear &&
                invDate.getMonth() === currentMonth;
        });

        const mtdPaid = mtdInvoices.filter((inv: any) => inv.status === 'paid');
        const mtdPending = mtdInvoices.filter((inv: any) => inv.status === 'pending');
        const mtdRevenue = mtdPaid.reduce((sum: number, inv: any) => {
            const refunded = inv.refundedAmount || 0;
            return sum + (inv.total - refunded);
        }, 0);

        // Calculate Year-to-Date (YTD) metrics
        const ytdInvoices = invoices.filter((inv: any) => {
            const invDate = new Date(inv.date);
            return invDate.getFullYear() === currentYear;
        });

        const ytdPaid = ytdInvoices.filter((inv: any) => inv.status === 'paid');
        const ytdPending = ytdInvoices.filter((inv: any) => inv.status === 'pending');
        const ytdRevenue = ytdPaid.reduce((sum: number, inv: any) => {
            const refunded = inv.refundedAmount || 0;
            return sum + (inv.total - refunded);
        }, 0);

        return c.json({
            success: true,
            analytics: {
                monthToDate: {
                    totalRevenue: mtdRevenue,
                    invoiceCount: mtdInvoices.length,
                    averageInvoice: mtdInvoices.length > 0 ? mtdRevenue / mtdPaid.length : 0,
                    paidInvoices: mtdPaid.length,
                    pendingInvoices: mtdPending.length
                },
                yearToDate: {
                    totalRevenue: ytdRevenue,
                    invoiceCount: ytdInvoices.length,
                    averageInvoice: ytdInvoices.length > 0 ? ytdRevenue / ytdPaid.length : 0,
                    paidInvoices: ytdPaid.length,
                    pendingInvoices: ytdPending.length
                }
            }
        });
    } catch (error) {
        console.error('Error fetching sales analytics:', error);
        return c.json({ error: 'Failed to fetch sales analytics' }, 500);
    }
});

// Get revenue chart data
app.get("/analytics/revenue-chart", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        const period = c.req.query('period') || 'month';
        const year = parseInt(c.req.query('year') || new Date().getFullYear().toString());
        const month = parseInt(c.req.query('month') || (new Date().getMonth() + 1).toString());

        const invoices = await kv.get(`invoices:${userId}`) || [];
        const paidInvoices = invoices.filter((inv: any) => inv.status === 'paid');

        // Group invoices by date based on period
        const chartData: any[] = [];

        if (period === 'week') {
            // Last 7 days
            const today = new Date();
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];

                const dayInvoices = paidInvoices.filter((inv: any) => {
                    return inv.date.startsWith(dateStr);
                });

                const revenue = dayInvoices.reduce((sum: number, inv: any) => {
                    const refunded = inv.refundedAmount || 0;
                    return sum + (inv.total - refunded);
                }, 0);

                chartData.push({
                    date: dateStr,
                    revenue,
                    invoiceCount: dayInvoices.length
                });
            }
        } else if (period === 'month') {
            // Days in current month
            const daysInMonth = new Date(year, month, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                const dayInvoices = paidInvoices.filter((inv: any) => {
                    return inv.date.startsWith(dateStr);
                });

                const revenue = dayInvoices.reduce((sum: number, inv: any) => {
                    const refunded = inv.refundedAmount || 0;
                    return sum + (inv.total - refunded);
                }, 0);

                chartData.push({
                    date: dateStr,
                    revenue,
                    invoiceCount: dayInvoices.length
                });
            }
        } else if (period === 'quarter') {
            // Last 3 months
            for (let i = 2; i >= 0; i--) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

                const monthInvoices = paidInvoices.filter((inv: any) => {
                    return inv.date.startsWith(monthYear);
                });

                const revenue = monthInvoices.reduce((sum: number, inv: any) => {
                    const refunded = inv.refundedAmount || 0;
                    return sum + (inv.total - refunded);
                }, 0);

                chartData.push({
                    date: monthYear,
                    revenue,
                    invoiceCount: monthInvoices.length
                });
            }
        } else if (period === 'year') {
            // 12 months
            for (let month = 1; month <= 12; month++) {
                const monthYear = `${year}-${String(month).padStart(2, '0')}`;

                const monthInvoices = paidInvoices.filter((inv: any) => {
                    return inv.date.startsWith(monthYear);
                });

                const revenue = monthInvoices.reduce((sum: number, inv: any) => {
                    const refunded = inv.refundedAmount || 0;
                    return sum + (inv.total - refunded);
                }, 0);

                chartData.push({
                    date: monthYear,
                    revenue,
                    invoiceCount: monthInvoices.length
                });
            }
        }

        return c.json({
            success: true,
            chartData
        });
    } catch (error) {
        console.error('Error fetching revenue chart data:', error);
        return c.json({ error: 'Failed to fetch revenue chart data' }, 500);
    }
});

// Get monthly invoice count (based on account anniversary billing cycle)
app.get("/analytics/monthly-invoice-count", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;

    try {
        let monthlyCount = await kv.get(`user:${userId}:monthly_invoice_count`);

        if (!monthlyCount) {
            // Initialize if not exists (for existing users)
            const accountCreated = await kv.get(`user:${userId}:account_created`) || new Date().toISOString();
            monthlyCount = {
                count: 0,
                monthStart: accountCreated,
                monthEnd: getNextBillingDate(accountCreated)
            };
            await kv.set(`user:${userId}:monthly_invoice_count`, monthlyCount);
        }

        // Check if we need to reset the counter (new billing month)
        if (shouldResetMonthlyCounter(monthlyCount.monthStart, monthlyCount.monthEnd)) {
            const newMonthStart = monthlyCount.monthEnd;
            monthlyCount = {
                count: 0,
                monthStart: newMonthStart,
                monthEnd: getNextBillingDate(newMonthStart)
            };
            await kv.set(`user:${userId}:monthly_invoice_count`, monthlyCount);
        }

        // Calculate days remaining in billing cycle
        const now = new Date();
        const endDate = new Date(monthlyCount.monthEnd);
        const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // Format dates for display
        const monthStartDate = new Date(monthlyCount.monthStart);
        const monthEndDate = new Date(monthlyCount.monthEnd);

        return c.json({
            success: true,
            invoiceCount: monthlyCount.count,
            billingPeriod: {
                start: monthStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                end: monthEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                daysRemaining,
                startISO: monthlyCount.monthStart,
                endISO: monthlyCount.monthEnd
            }
        });
    } catch (error) {
        console.error('Error fetching monthly invoice count:', error);
        return c.json({ error: 'Failed to fetch monthly invoice count' }, 500);
    }
});

// ==================== USER DATA ROUTES (GDPR Compliance) ====================

// Export all user data (GDPR Right to Access)
app.get("/user/export", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;
    const userEmail = auth.userEmail;

    try {
        const business = await kv.get(`business:${userId}`);
        const customers = await kv.get(`customers:${userId}`) || [];
        const invoices = await kv.get(`invoices:${userId}`) || [];

        const exportData = {
            exportDate: new Date().toISOString(),
            userEmail,
            userId,
            business,
            customers,
            invoices,
            totalCustomers: customers.length,
            totalInvoices: invoices.length
        };

        console.log('Data export requested for user:', userId);
        return c.json(exportData);
    } catch (error) {
        console.error('Error exporting user data:', error);
        return c.json({ error: 'Failed to export data' }, 500);
    }
});

// Delete user account and all data (GDPR Right to Erasure)
app.delete("/user/account", async (c) => {
    const auth = await checkAuth(c);
    if ('error' in auth) {
        return c.json({ error: auth.error }, auth.status);
    }
    const userId = auth.userId;
    const userEmail = auth.userEmail;

    try {
        // Delete all user data from KV store
        await kv.del(`business:${userId}`);
        await kv.del(`customers:${userId}`);
        await kv.del(`invoices:${userId}`);

        // Delete files from storage buckets
        try {
            const { data: logoFiles } = await supabase.storage
                .from(LOGO_BUCKET)
                .list(userId);

            if (logoFiles && logoFiles.length > 0) {
                const logoFilePaths = logoFiles.map(file => `${userId}/${file.name}`);
                await supabase.storage
                    .from(LOGO_BUCKET)
                    .remove(logoFilePaths);
            }
        } catch (storageError) {
            console.error('Error deleting storage files:', storageError);
            // Continue with account deletion even if file deletion fails
        }

        // Delete user from Supabase Auth
        const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
        if (deleteError) {
            console.error('Error deleting user from auth:', deleteError);
            throw deleteError;
        }

        console.log('User account and all data deleted:', userId, userEmail);
        return c.json({
            success: true,
            message: 'Account and all associated data have been permanently deleted'
        });
    } catch (error) {
        console.error('Error deleting user account:', error);
        return c.json({ error: 'Failed to delete account: ' + String(error) }, 500);
    }
});

Deno.serve(app.fetch);