/**
 * Session inactivity timeout for the BilltUp website.
 *
 * Tracks user activity (mouse, keyboard, touch, scroll) and signs the user
 * out after 1 hour of inactivity.  Activity updates are throttled to avoid
 * excessive localStorage writes.
 *
 * Usage:
 *   import { sessionTimeout } from './sessionTimeout';
 *
 *   // Start monitoring when the user is authenticated
 *   sessionTimeout.start(() => {
 *     // Called when timeout fires -- clear state & redirect to login
 *     signOut();
 *     setCurrentSection('signin');
 *   });
 *
 *   // Stop monitoring on sign-out (cleanup)
 *   sessionTimeout.stop();
 */

const SESSION_TIMEOUT_MS = 1 * 60 * 60 * 1000; // 1 hour
const CHECK_INTERVAL_MS = 60 * 1000;            // check every 60 s
const THROTTLE_MS = 10_000;                      // write at most once per 10 s

const LAST_ACTIVITY_KEY = 'billtup_web_last_activity';

// Activity events to track
const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousedown',
  'mousemove',
  'keydown',
  'scroll',
  'touchstart',
  'click',
];

class SessionTimeoutManager {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private lastWriteTime = 0;
  private onTimeout: (() => void) | null = null;
  private boundHandler: (() => void) | null = null;
  private boundVisibilityHandler: (() => void) | null = null;
  private running = false;

  /** Record the current time as last activity (throttled). */
  recordActivity = (): void => {
    const now = Date.now();
    if (now - this.lastWriteTime < THROTTLE_MS) return;
    this.lastWriteTime = now;
    localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
  };

  /** Check whether the inactivity threshold has been exceeded. */
  private hasTimedOut(): boolean {
    const raw = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (!raw) return false;
    return Date.now() - parseInt(raw, 10) >= SESSION_TIMEOUT_MS;
  }

  /**
   * Start monitoring user activity.
   * @param onTimeout - callback invoked when the session times out
   */
  start(onTimeout: () => void): void {
    if (this.running) return;
    this.running = true;
    this.onTimeout = onTimeout;

    // Seed the last-activity timestamp
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    this.lastWriteTime = Date.now();

    // -- DOM event listeners (throttled) --
    this.boundHandler = this.recordActivity;
    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, this.boundHandler, { passive: true });
    }

    // -- Visibility change: check immediately when tab becomes visible --
    this.boundVisibilityHandler = () => {
      if (!document.hidden && this.hasTimedOut()) {
        this.fireTimeout();
      }
    };
    document.addEventListener('visibilitychange', this.boundVisibilityHandler);

    // -- Periodic check --
    this.intervalId = setInterval(() => {
      if (this.hasTimedOut()) {
        this.fireTimeout();
      }
    }, CHECK_INTERVAL_MS);
  }

  /** Stop monitoring and remove all listeners. */
  stop(): void {
    this.running = false;

    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.boundHandler) {
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, this.boundHandler);
      }
      this.boundHandler = null;
    }

    if (this.boundVisibilityHandler) {
      document.removeEventListener('visibilitychange', this.boundVisibilityHandler);
      this.boundVisibilityHandler = null;
    }

    this.onTimeout = null;
  }

  /** Clear the stored last-activity timestamp (call on sign-out). */
  clear(): void {
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  }

  /** Fire the timeout callback and clean up. */
  private fireTimeout(): void {
    console.log('[SessionTimeout] Inactivity timeout reached -- signing out');
    const cb = this.onTimeout;
    this.stop();
    this.clear();
    if (cb) cb();
  }
}

/** Singleton instance */
export const sessionTimeout = new SessionTimeoutManager();
