/**
 * Error reporting for the BilltUp frontend website.
 *
 * Captures errors and forwards them to the backend `/error-report`
 * endpoint, which relays them to Slack. Fire-and-forget.
 */

import { API_BASE_URL } from './auth/config';
import { getIdToken } from './auth/cognito';

let _userId: string | undefined;
let _userEmail: string | undefined;

/** Store user context so error reports include who was affected. */
export function setErrorUser(userId: string, email?: string): void {
  _userId = userId;
  _userEmail = email;
}

/** Clear user context on logout. */
export function clearErrorUser(): void {
  _userId = undefined;
  _userEmail = undefined;
}

/**
 * Capture an error and forward it to the backend for Slack alerting.
 * Fire-and-forget — never blocks the caller.
 */
export function captureError(
  error: unknown,
  context?: Record<string, unknown>
): void {
  console.error('[captureError]', error, context);

  reportToBackend(error, context).catch(() => {
    // Silently swallow — already logged above
  });
}

// ── internal ────────────────────────────────────────────────────────

async function reportToBackend(
  error: unknown,
  context?: Record<string, unknown>
): Promise<void> {
  try {
    const token = await getIdToken();

    const payload = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Error',
      context,
      user: _userId ? { id: _userId, email: _userEmail } : undefined,
      device: {
        userAgent: navigator.userAgent,
        screen: `${screen.width}x${screen.height}`,
        online: navigator.onLine,
        url: window.location.href,
      },
      timestamp: new Date().toISOString(),
      environment: import.meta.env.MODE,
      source: 'website',
    };

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    await fetch(`${API_BASE_URL}/billtup-api/error-report`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
  } catch {
    // Best-effort — don't let error reporting break the app
  }
}
