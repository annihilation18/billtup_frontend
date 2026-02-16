/**
 * Accessibility Utilities
 * 
 * Helpers for generating consistent, accessible IDs and ARIA attributes
 * across the BilltUp application.
 */

let idCounter = 0;

/**
 * Generate a unique ID for form elements, headings, and interactive components
 * @param prefix - Semantic prefix describing the element type
 * @returns A unique ID string
 */
export function generateId(prefix: string): string {
  idCounter++;
  return `${prefix}-${idCounter}-${Date.now()}`;
}

/**
 * Generate an ID that persists across renders using a key
 * @param prefix - Semantic prefix describing the element type
 * @param key - Unique key for this element
 * @returns A consistent ID string
 */
export function generateStableId(prefix: string, key: string | number): string {
  return `${prefix}-${key}`;
}

/**
 * Create ARIA attributes for a form field
 */
export function getFormFieldAria(id: string, error?: string, description?: string) {
  return {
    id,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${id}-error` : description ? `${id}-description` : undefined,
  };
}

/**
 * Create ARIA attributes for a button
 */
export function getButtonAria(label: string, pressed?: boolean, expanded?: boolean) {
  return {
    'aria-label': label,
    'aria-pressed': pressed,
    'aria-expanded': expanded,
  };
}

/**
 * Create ARIA attributes for a modal/dialog
 */
export function getModalAria(titleId: string, descriptionId?: string) {
  return {
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': titleId,
    'aria-describedby': descriptionId,
  };
}

/**
 * Create ARIA attributes for navigation
 */
export function getNavAria(label: string, current?: boolean) {
  return {
    'aria-label': label,
    'aria-current': current ? 'page' : undefined,
  };
}

/**
 * Create ARIA attributes for tabs
 */
export function getTabAria(id: string, selected: boolean, controls: string) {
  return {
    id,
    role: 'tab',
    'aria-selected': selected,
    'aria-controls': controls,
    tabIndex: selected ? 0 : -1,
  };
}

/**
 * Create ARIA attributes for tab panel
 */
export function getTabPanelAria(id: string, labelledBy: string, hidden: boolean) {
  return {
    id,
    role: 'tabpanel',
    'aria-labelledby': labelledBy,
    hidden,
    tabIndex: 0,
  };
}

/**
 * Create skip link for keyboard navigation
 */
export function createSkipLink(targetId: string, text: string = 'Skip to main content') {
  return {
    href: `#${targetId}`,
    className: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md focus:shadow-lg',
    children: text,
  };
}
