/**
 * Encryption utilities for securing sensitive data
 * Uses Web Crypto API (AES-GCM encryption standard)
 */

// Generate a secure encryption key from a password
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt sensitive data
 * @param data - String data to encrypt
 * @param password - Encryption password (from environment)
 * @returns Encrypted data as base64 string with salt and IV
 */
export async function encrypt(data: string, password: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    
    // Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Derive encryption key
    const key = await deriveKey(password, salt);
    
    // Encrypt the data
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encoder.encode(data)
    );
    
    // Combine salt + IV + encrypted data
    const combined = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encryptedData), salt.length + iv.length);
    
    // Convert to base64
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt encrypted data
 * @param encryptedData - Base64 encrypted string
 * @param password - Decryption password
 * @returns Decrypted string
 */
export async function decrypt(encryptedData: string, password: string): Promise<string> {
  try {
    // Decode from base64
    const combined = new Uint8Array(
      atob(encryptedData).split('').map(c => c.charCodeAt(0))
    );
    
    // Extract salt, IV, and encrypted data
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const data = combined.slice(28);
    
    // Derive decryption key
    const key = await deriveKey(password, salt);
    
    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      data
    );
    
    // Convert to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Hash sensitive data (one-way) for secure storage
 * Useful for data that doesn't need to be decrypted (e.g., verification)
 */
export async function hash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Securely redact sensitive information for logging
 */
export function redact(value: string, showChars: number = 4): string {
  if (!value || value.length <= showChars) return '***';
  return value.slice(0, showChars) + '***';
}
