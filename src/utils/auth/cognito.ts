/**
 * Cognito authentication client for the BilltUp frontend.
 *
 * Uses the Cognito public API directly (InitiateAuth, no SDK required).
 * Tokens are stored in localStorage and refreshed automatically.
 */

import { COGNITO_REGION, COGNITO_CLIENT_ID } from './config';

const COGNITO_ENDPOINT = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com`;

// localStorage keys for Cognito tokens
const TOKEN_KEYS = {
  idToken: 'billtup_id_token',
  accessToken: 'billtup_access_token',
  refreshToken: 'billtup_refresh_token',
  expiresAt: 'billtup_token_expires_at',
  userEmail: 'billtup_user_email',
  userId: 'billtup_user_id',
} as const;

export interface CognitoSession {
  idToken: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: { id: string; email: string };
}

export interface CognitoSignInResult {
  session: CognitoSession;
  user: { id: string; email: string };
}

/** Call the Cognito public API */
async function cognitoRequest(action: string, payload: Record<string, unknown>): Promise<any> {
  const response = await fetch(COGNITO_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': `AWSCognitoIdentityProviderService.${action}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || data.Message || 'Authentication failed');
    (error as any).code = data.__type?.split('#').pop() || 'UnknownError';
    throw error;
  }

  return data;
}

/** Decode a JWT payload (without verifying — verification happens server-side) */
function decodeJwtPayload(token: string): Record<string, any> {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
}

/** Store tokens in localStorage */
function storeTokens(authResult: any): CognitoSession {
  const idToken = authResult.IdToken;
  const accessToken = authResult.AccessToken;
  const refreshToken = authResult.RefreshToken;
  const expiresIn = authResult.ExpiresIn || 3600;

  const claims = decodeJwtPayload(idToken);
  const userId = claims.sub;
  const userEmail = claims.email || '';
  const expiresAt = Date.now() + expiresIn * 1000;

  localStorage.setItem(TOKEN_KEYS.idToken, idToken);
  localStorage.setItem(TOKEN_KEYS.accessToken, accessToken);
  if (refreshToken) {
    localStorage.setItem(TOKEN_KEYS.refreshToken, refreshToken);
  }
  localStorage.setItem(TOKEN_KEYS.expiresAt, expiresAt.toString());
  localStorage.setItem(TOKEN_KEYS.userEmail, userEmail);
  localStorage.setItem(TOKEN_KEYS.userId, userId);

  return {
    idToken,
    accessToken,
    refreshToken: refreshToken || localStorage.getItem(TOKEN_KEYS.refreshToken) || '',
    expiresAt,
    user: { id: userId, email: userEmail },
  };
}

/** Clear all stored tokens */
function clearTokens(): void {
  Object.values(TOKEN_KEYS).forEach(key => localStorage.removeItem(key));
}

/**
 * Sign in with email and password.
 * Returns session tokens and user info.
 */
export async function signIn(email: string, password: string): Promise<CognitoSignInResult> {
  const data = await cognitoRequest('InitiateAuth', {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });

  const session = storeTokens(data.AuthenticationResult);
  return { session, user: session.user };
}

/**
 * Sign out — clears local tokens.
 * Optionally revokes the refresh token on the server.
 */
export async function signOut(): Promise<void> {
  try {
    const accessToken = localStorage.getItem(TOKEN_KEYS.accessToken);
    if (accessToken) {
      await cognitoRequest('GlobalSignOut', { AccessToken: accessToken }).catch(() => {});
    }
  } finally {
    clearTokens();
  }
}

/**
 * Get the current session (from stored tokens).
 * Automatically refreshes if the ID token is expired but a refresh token exists.
 * Returns null if no session exists.
 */
export async function getSession(): Promise<CognitoSession | null> {
  const idToken = localStorage.getItem(TOKEN_KEYS.idToken);
  const refreshToken = localStorage.getItem(TOKEN_KEYS.refreshToken);
  const expiresAt = parseInt(localStorage.getItem(TOKEN_KEYS.expiresAt) || '0');

  if (!idToken) return null;

  // If token is still valid (with 60s buffer), return cached session
  if (Date.now() < expiresAt - 60_000) {
    return {
      idToken,
      accessToken: localStorage.getItem(TOKEN_KEYS.accessToken) || '',
      refreshToken: refreshToken || '',
      expiresAt,
      user: {
        id: localStorage.getItem(TOKEN_KEYS.userId) || '',
        email: localStorage.getItem(TOKEN_KEYS.userEmail) || '',
      },
    };
  }

  // Try to refresh
  if (refreshToken) {
    try {
      const data = await cognitoRequest('InitiateAuth', {
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: COGNITO_CLIENT_ID,
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
        },
      });
      return storeTokens(data.AuthenticationResult);
    } catch (error) {
      console.warn('[Auth] Token refresh failed, clearing session:', error);
      clearTokens();
      return null;
    }
  }

  // Token expired and no refresh token
  clearTokens();
  return null;
}

/**
 * Get the current ID token for API authorization.
 * Refreshes automatically if expired.
 * Returns null if no valid session exists.
 */
export async function getIdToken(): Promise<string | null> {
  const session = await getSession();
  return session?.idToken || null;
}

/** Get stored user email (synchronous, from localStorage) */
export function getUserEmail(): string {
  return localStorage.getItem(TOKEN_KEYS.userEmail) || '';
}

/** Get stored user ID (synchronous, from localStorage) */
export function getUserId(): string {
  return localStorage.getItem(TOKEN_KEYS.userId) || '';
}
