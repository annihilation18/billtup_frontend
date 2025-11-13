// Session Management and Auto-Lock Utility
// Handles session timeout, activity tracking, and biometric authentication preparation

const SESSION_TIMEOUT = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
const ACTIVITY_CHECK_INTERVAL = 60 * 1000; // Check every minute
const LAST_ACTIVITY_KEY = 'billtup_last_activity';
const SESSION_LOCKED_KEY = 'billtup_session_locked';
const BIOMETRIC_ENABLED_KEY = 'billtup_biometric_enabled';

export interface SessionManager {
  updateActivity: () => void;
  checkTimeout: () => boolean;
  lockSession: () => void;
  unlockSession: () => void;
  isSessionLocked: () => boolean;
  getTimeSinceLastActivity: () => number;
  isBiometricEnabled: () => boolean;
  setBiometricEnabled: (enabled: boolean) => void;
  onSessionTimeout: (callback: () => void) => void;
}

class SessionManagerImpl implements SessionManager {
  private activityTimer: NodeJS.Timeout | null = null;
  private onSessionLockCallbacks: Array<() => void> = [];
  private onTimeoutCallbacks: Array<() => void> = [];
  private isListening = false;

  constructor() {
    this.initializeSession();
  }

  private initializeSession() {
    // Set initial activity timestamp if not exists
    if (!localStorage.getItem(LAST_ACTIVITY_KEY)) {
      this.updateActivity();
    }

    // Check if session was locked
    const locked = localStorage.getItem(SESSION_LOCKED_KEY);
    if (locked === 'true') {
      // Session was previously locked, keep it locked
      return;
    }

    // Check for timeout on init
    if (this.checkTimeout()) {
      this.lockSession();
    }
  }

  updateActivity() {
    const now = Date.now();
    localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
    
    // If session was locked due to inactivity, keep it locked
    // User must explicitly unlock
    const isLocked = this.isSessionLocked();
    if (!isLocked) {
      localStorage.removeItem(SESSION_LOCKED_KEY);
    }
  }

  checkTimeout(): boolean {
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (!lastActivity) return false;

    const timeSinceActivity = Date.now() - parseInt(lastActivity);
    return timeSinceActivity >= SESSION_TIMEOUT;
  }

  getTimeSinceLastActivity(): number {
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (!lastActivity) return 0;
    
    return Date.now() - parseInt(lastActivity);
  }

  lockSession() {
    localStorage.setItem(SESSION_LOCKED_KEY, 'true');
    this.notifySessionLock();
  }

  unlockSession() {
    localStorage.removeItem(SESSION_LOCKED_KEY);
    this.updateActivity();
  }

  isSessionLocked(): boolean {
    return localStorage.getItem(SESSION_LOCKED_KEY) === 'true';
  }

  isBiometricEnabled(): boolean {
    return localStorage.getItem(BIOMETRIC_ENABLED_KEY) === 'true';
  }

  setBiometricEnabled(enabled: boolean) {
    localStorage.setItem(BIOMETRIC_ENABLED_KEY, enabled ? 'true' : 'false');
  }

  // Subscribe to session lock events
  onSessionLock(callback: () => void) {
    this.onSessionLockCallbacks.push(callback);
  }

  private notifySessionLock() {
    this.onSessionLockCallbacks.forEach(cb => cb());
  }

  // Subscribe to session timeout events
  onSessionTimeout(callback: () => void) {
    this.onTimeoutCallbacks.push(callback);
  }

  private notifySessionTimeout() {
    this.onTimeoutCallbacks.forEach(cb => cb());
  }

  // Start monitoring activity
  startMonitoring() {
    if (this.isListening) return;
    
    this.isListening = true;

    // Set up periodic timeout checks
    this.activityTimer = setInterval(() => {
      if (this.checkTimeout() && !this.isSessionLocked()) {
        console.log('Session timeout detected - locking session');
        this.lockSession();
        this.notifySessionTimeout();
      }
    }, ACTIVITY_CHECK_INTERVAL);

    // Track user activity events
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    const handleActivity = () => {
      if (!this.isSessionLocked()) {
        this.updateActivity();
      }
    };

    // Throttle activity updates (max once per 10 seconds)
    let lastUpdate = 0;
    const throttledHandleActivity = () => {
      const now = Date.now();
      if (now - lastUpdate > 10000) {
        handleActivity();
        lastUpdate = now;
      }
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, throttledHandleActivity, { passive: true });
    });

    // Check for timeout when page becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        if (this.checkTimeout() && !this.isSessionLocked()) {
          this.lockSession();
          this.notifySessionTimeout();
        }
      }
    });
  }

  stopMonitoring() {
    if (this.activityTimer) {
      clearInterval(this.activityTimer);
      this.activityTimer = null;
    }
    this.isListening = false;
  }

  // Get remaining time before timeout (in milliseconds)
  getRemainingTime(): number {
    const timeSinceActivity = this.getTimeSinceLastActivity();
    const remaining = SESSION_TIMEOUT - timeSinceActivity;
    return Math.max(0, remaining);
  }

  // Format remaining time as human readable
  getFormattedRemainingTime(): string {
    const remaining = this.getRemainingTime();
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}

// Singleton instance
export const sessionManager = new SessionManagerImpl();

// Hook for React components
import { useState, useEffect } from 'react';

export function useSessionLock() {
  const [isLocked, setIsLocked] = useState(sessionManager.isSessionLocked());
  const [remainingTime, setRemainingTime] = useState(sessionManager.getFormattedRemainingTime());

  useEffect(() => {
    // Start monitoring on mount
    sessionManager.startMonitoring();

    // Subscribe to lock events
    const handleLock = () => {
      setIsLocked(true);
    };

    sessionManager.onSessionLock(handleLock);

    // Update remaining time every minute
    const timer = setInterval(() => {
      setIsLocked(sessionManager.isSessionLocked());
      setRemainingTime(sessionManager.getFormattedRemainingTime());
    }, 60000);

    // Check immediately
    setIsLocked(sessionManager.isSessionLocked());

    return () => {
      clearInterval(timer);
      sessionManager.stopMonitoring();
    };
  }, []);

  const unlock = (onSuccess?: () => void) => {
    sessionManager.unlockSession();
    setIsLocked(false);
    if (onSuccess) onSuccess();
  };

  const lock = () => {
    sessionManager.lockSession();
    setIsLocked(true);
  };

  return {
    isLocked,
    unlock,
    lock,
    remainingTime,
    isBiometricEnabled: sessionManager.isBiometricEnabled(),
    setBiometricEnabled: sessionManager.setBiometricEnabled.bind(sessionManager),
  };
}

// Biometric authentication preparation (for mobile apps)
export interface BiometricAuth {
  isSupported: () => Promise<boolean>;
  authenticate: () => Promise<boolean>;
  enrollBiometric: () => Promise<boolean>;
}

export const biometricAuth: BiometricAuth = {
  // Check if biometric is supported (will be implemented in mobile app)
  async isSupported(): Promise<boolean> {
    // In web app, return false
    // In mobile app (React Native), this will check device capabilities
    if (typeof window !== 'undefined' && (window as any).BiometricAuth) {
      return (window as any).BiometricAuth.isSupported();
    }
    return false;
  },

  // Authenticate with biometric
  async authenticate(): Promise<boolean> {
    // In web app, fall back to password
    // In mobile app, this will trigger biometric prompt
    if (typeof window !== 'undefined' && (window as any).BiometricAuth) {
      try {
        return await (window as any).BiometricAuth.authenticate();
      } catch (error) {
        console.error('Biometric authentication failed:', error);
        return false;
      }
    }
    return false;
  },

  // Enroll biometric (first-time setup)
  async enrollBiometric(): Promise<boolean> {
    // In mobile app, this will prompt user to enable biometric
    if (typeof window !== 'undefined' && (window as any).BiometricAuth) {
      try {
        return await (window as any).BiometricAuth.enroll();
      } catch (error) {
        console.error('Biometric enrollment failed:', error);
        return false;
      }
    }
    return false;
  }
};