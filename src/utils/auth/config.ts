// AWS API + Cognito configuration
// These values are set via Vite environment variables (VITE_ prefix)

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://hmn3e5a70d.execute-api.us-east-1.amazonaws.com';
export const COGNITO_REGION = import.meta.env.VITE_COGNITO_REGION || 'us-east-1';
export const COGNITO_USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID || 'us-east-1_b9Uasrv2W';
export const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID || '3lg1uicgi058c4an1g2jv10fli';
