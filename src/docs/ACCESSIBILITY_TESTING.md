# BilltUp Accessibility Testing Guide

## Overview

This document provides comprehensive testing procedures to ensure BilltUp meets accessibility standards and provides an excellent experience for all users, including those using assistive technologies.

## Table of Contents

- [Automated Testing](#automated-testing)
- [Manual Testing Procedures](#manual-testing-procedures)
- [Screen Reader Testing](#screen-reader-testing)
- [Keyboard Navigation Testing](#keyboard-navigation-testing)
- [Visual Testing](#visual-testing)
- [Testing Checklist](#testing-checklist)
- [Common Issues & Solutions](#common-issues--solutions)
- [Reporting Accessibility Issues](#reporting-accessibility-issues)

## Automated Testing

### 1. Browser DevTools - Lighthouse

**Steps:**
1. Open Chrome DevTools (F12)
2. Navigate to "Lighthouse" tab
3. Select "Accessibility" category
4. Click "Analyze page load"
5. Review results and address any issues scoring below 90

**Key Areas to Check:**
- Color contrast ratios
- ARIA attributes
- Form labels
- Image alt text
- Heading hierarchy

### 2. axe DevTools Extension

**Installation:**
```
Chrome: https://chrome.google.com/webstore (search "axe DevTools")
Firefox: https://addons.mozilla.org/ (search "axe DevTools")
```

**Steps:**
1. Install axe DevTools extension
2. Navigate to the page you want to test
3. Open browser DevTools
4. Click on "axe DevTools" tab
5. Click "Scan ALL of my page"
6. Review violations categorized by severity

**Priority Order:**
- Critical issues (fix immediately)
- Serious issues (fix within sprint)
- Moderate issues (fix within release)
- Minor issues (backlog for next release)

### 3. WAVE Web Accessibility Evaluation Tool

**Installation:**
```
https://wave.webaim.org/extension/
```

**Steps:**
1. Install WAVE extension
2. Navigate to the page
3. Click WAVE extension icon
4. Review errors, alerts, and features
5. Use the "Styles" tab to view page without CSS

**Common Checks:**
- Missing alt text
- Empty links or buttons
- Missing form labels
- Low contrast text

## Manual Testing Procedures

### 1. Keyboard Navigation Test

**Objective:** Ensure all functionality is accessible via keyboard alone

**Steps:**
1. Disconnect your mouse or don't use it
2. Navigate the entire site using only:
   - `Tab` - Move forward
   - `Shift + Tab` - Move backward
   - `Enter` - Activate links/buttons
   - `Space` - Activate buttons/checkboxes
   - `Arrow keys` - Navigate dropdowns/menus
   - `Escape` - Close modals/menus

**Checklist:**
- [ ] Can reach all interactive elements via Tab
- [ ] Tab order is logical and follows visual layout
- [ ] Focus indicator is visible on all elements
- [ ] No keyboard traps (can Tab away from all elements)
- [ ] Skip links work correctly
- [ ] Modals trap focus appropriately
- [ ] Dropdowns/menus work with arrow keys
- [ ] Can submit forms with Enter key
- [ ] Can close modals with Escape key

### 2. Focus Indicator Test

**Steps:**
1. Tab through the page
2. Verify each focusable element has a visible indicator
3. Check contrast ratio of focus indicator (3:1 minimum)

**Elements to Check:**
- Links
- Buttons
- Form inputs
- Dropdowns
- Checkboxes/Radio buttons
- Custom components

### 3. Heading Structure Test

**Steps:**
1. Use a heading extension or screen reader
2. Navigate by headings
3. Verify hierarchy is logical (h1 → h2 → h3, no skips)

**Tool:**
```
HeadingsMap Extension
https://chromewebstore.google.com/detail/headingsmap
```

**Checklist:**
- [ ] One h1 per page
- [ ] No heading levels skipped
- [ ] Headings describe content accurately
- [ ] Headings are in logical order

### 4. Color Contrast Test

**Steps:**
1. Use browser DevTools or contrast checker
2. Check all text against background
3. Ensure minimum ratios are met:
   - Normal text: 4.5:1
   - Large text (18pt+): 3:1
   - Interactive elements: 3:1

**Tool:**
```
WebAIM Contrast Checker
https://webaim.org/resources/contrastchecker/
```

### 5. Zoom and Reflow Test

**Steps:**
1. Zoom browser to 200%
2. Verify all content is readable
3. Check that layout reflows properly
4. No horizontal scrolling (except data tables)

**Breakpoints to Test:**
- 100% (default)
- 150%
- 200%
- 400% (if supported)

### 6. Form Accessibility Test

**Steps:**
For each form on the site:
1. Check all inputs have associated labels
2. Required fields are marked (visually and aria-required)
3. Error messages are associated with inputs
4. Can submit with Enter key
5. Errors announced to screen readers

**Checklist:**
- [ ] Labels use `htmlFor` attribute
- [ ] Required fields marked with `*` and aria-required
- [ ] Error messages use aria-describedby
- [ ] Success messages announced
- [ ] Form can be submitted with keyboard
- [ ] Focus moves to first error on submission

## Screen Reader Testing

### Windows - NVDA (Free)

**Installation:**
```
https://www.nvaccess.org/download/
```

**Basic Commands:**
- `Insert + Down Arrow` - Read from cursor
- `Insert + Ctrl + Down Arrow` - Read entire page
- `H` - Next heading
- `Shift + H` - Previous heading
- `D` - Next landmark
- `F` - Next form field
- `B` - Next button
- `L` - Next link
- `T` - Next table
- `Insert + F7` - Elements list

**Testing Checklist:**
- [ ] Page title is announced
- [ ] Headings are announced with level
- [ ] Landmarks are properly identified
- [ ] Links describe destination
- [ ] Buttons describe action
- [ ] Images have meaningful alt text
- [ ] Form fields announce label and type
- [ ] Error messages are announced
- [ ] Loading states announced
- [ ] Success messages announced

### macOS/iOS - VoiceOver (Built-in)

**Enable:**
- macOS: `Cmd + F5`
- iOS: Settings > Accessibility > VoiceOver

**Basic Commands (macOS):**
- `Ctrl + Option + A` - Start reading
- `Ctrl + Option + Right Arrow` - Next item
- `Ctrl + Option + Left Arrow` - Previous item
- `Ctrl + Option + U` - Rotor (navigation menu)
- `Ctrl + Option + Space` - Activate item

**Basic Gestures (iOS):**
- Swipe right - Next item
- Swipe left - Previous item
- Double tap - Activate
- Two-finger swipe down - Read from top
- Rotor - Rotate two fingers

### Testing Scenarios

**1. Homepage Navigation:**
```
1. Start VoiceOver/NVDA
2. Load homepage
3. Listen to page title announcement
4. Navigate by headings (H key)
5. Navigate by landmarks (D key)
6. Test skip link (Tab, then Enter)
7. Navigate main menu
8. Test all call-to-action buttons
```

**2. Form Completion:**
```
1. Navigate to Sign Up page
2. Tab through form fields
3. Listen to label announcements
4. Fill out form incorrectly
5. Submit and verify error announcements
6. Correct errors
7. Submit successfully
8. Verify success announcement
```

**3. Dashboard Navigation:**
```
1. Sign in to dashboard
2. Navigate by landmarks
3. Test tab navigation
4. Open and close modals
5. Create new customer/invoice
6. Edit existing records
7. Delete records (verify confirmation)
```

## Visual Testing

### 1. Windows High Contrast Mode

**Steps:**
1. Press `Left Alt + Left Shift + Print Screen`
2. Click "Yes" to enable
3. Navigate site and verify all content is visible
4. Check focus indicators are visible
5. Verify images/icons have text alternatives

### 2. Reduced Motion

**Steps (Chrome):**
1. Open DevTools
2. Press `Cmd/Ctrl + Shift + P`
3. Type "Emulate CSS prefers-reduced-motion"
4. Select "prefers-reduced-motion: reduce"
5. Verify animations are disabled/minimized

**Steps (macOS):**
1. System Preferences > Accessibility
2. Display > Reduce motion
3. Test site with reduced motion enabled

### 3. Color Blindness Simulation

**Tools:**
- Chrome DevTools (Rendering tab)
- ColorBlindly extension
- Sim Daltonism (macOS app)

**Types to Test:**
- Protanopia (red-blind)
- Deuteranopia (green-blind)
- Tritanopia (blue-blind)
- Achromatopsia (completely color blind)

**Checklist:**
- [ ] Information not conveyed by color alone
- [ ] Error states use icons + color
- [ ] Success states use icons + color
- [ ] Charts/graphs have patterns + color

## Testing Checklist

### Per-Page Checklist

Use this checklist for each major page/section:

#### Structure
- [ ] One h1 element present
- [ ] Heading hierarchy is logical
- [ ] Landmarks used (header, nav, main, footer)
- [ ] Skip link available and functional

#### Keyboard Navigation
- [ ] All interactive elements accessible via Tab
- [ ] Focus order is logical
- [ ] Focus indicators visible
- [ ] No keyboard traps
- [ ] Modals trap and restore focus

#### Screen Reader
- [ ] Page title is descriptive
- [ ] Headings announce level
- [ ] Links describe destination
- [ ] Buttons describe action
- [ ] Images have alt text
- [ ] Form labels properly associated
- [ ] Error messages announced

#### Visual
- [ ] Color contrast meets WCAG AA
- [ ] Text resizable to 200%
- [ ] No horizontal scrolling (except tables)
- [ ] High contrast mode supported
- [ ] Reduced motion respected

#### Forms
- [ ] All inputs have labels
- [ ] Required fields marked
- [ ] Error messages clear and associated
- [ ] Can submit with Enter
- [ ] Success confirmed

#### Interactive Elements
- [ ] Buttons have accessible names
- [ ] Links have descriptive text
- [ ] Icons have text alternatives
- [ ] Loading states announced
- [ ] Disabled states clear

### Component-Specific Checklists

#### Modal/Dialog
- [ ] Has role="dialog"
- [ ] Has aria-modal="true"
- [ ] Has aria-labelledby
- [ ] Has aria-describedby (if applicable)
- [ ] Focus moves to modal on open
- [ ] Focus trapped in modal
- [ ] Closes on Escape
- [ ] Focus returns to trigger on close

#### Dropdown Menu
- [ ] Trigger has aria-haspopup
- [ ] Trigger has aria-expanded
- [ ] Menu has proper role
- [ ] Arrow keys navigate items
- [ ] Escape closes menu
- [ ] Selection announced

#### Tabs
- [ ] Has role="tablist"
- [ ] Tabs have role="tab"
- [ ] Panels have role="tabpanel"
- [ ] Selected tab has aria-selected="true"
- [ ] Arrow keys navigate tabs
- [ ] Tab/panel association clear

#### Data Table
- [ ] Has `<caption>` or aria-label
- [ ] Headers use `<th>`
- [ ] Headers have scope attribute
- [ ] Complex tables use headers attribute
- [ ] Sortable columns announced

## Common Issues & Solutions

### Issue: Missing Focus Indicators

**Symptom:** Can't see which element has focus

**Solution:**
```css
*:focus-visible {
  outline: 2px solid #14B8A6;
  outline-offset: 2px;
}
```

### Issue: Poor Color Contrast

**Symptom:** Text difficult to read

**Solution:**
- Use darker text colors
- Use lighter background colors
- Increase font weight
- Add text shadow (carefully)

### Issue: Missing Form Labels

**Symptom:** Screen reader doesn't announce input purpose

**Solution:**
```tsx
<Label htmlFor="email-input">Email Address</Label>
<Input id="email-input" type="email" />
```

### Issue: Keyboard Trap in Modal

**Symptom:** Can't Tab out of modal

**Solution:**
- Use Dialog component with focus trap
- Ensure Tab cycles through modal elements
- Ensure Escape closes modal

### Issue: Decorative Images Not Hidden

**Symptom:** Screen reader reads "image" for decorative elements

**Solution:**
```tsx
<img src="decoration.svg" alt="" aria-hidden="true" />
```

### Issue: Click-only Interactions

**Symptom:** Can't activate with keyboard

**Solution:**
- Use `<button>` instead of `<div onClick>`
- Add `onKeyDown` handler if necessary
- Ensure Enter/Space activate element

## Reporting Accessibility Issues

### Issue Template

```markdown
## Issue Description
[Brief description of the accessibility issue]

## Steps to Reproduce
1. [First step]
2. [Second step]
3. [...]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Impact
- [ ] Blocker - Prevents access to critical functionality
- [ ] High - Significant difficulty using feature
- [ ] Medium - Moderate difficulty
- [ ] Low - Minor inconvenience

## WCAG Criteria
[Which WCAG success criteria are violated]
Example: 2.1.1 Keyboard (Level A)

## Assistive Technology
- Device: [Windows/Mac/iPhone/Android]
- Browser: [Chrome/Firefox/Safari/Edge + version]
- Screen Reader: [NVDA/JAWS/VoiceOver + version]

## Screenshots/Videos
[Attach evidence if applicable]

## Suggested Solution
[How to fix the issue]
```

### Severity Levels

**Blocker:**
- Prevents completing critical tasks
- Affects large number of users
- WCAG Level A violation
- Example: Can't submit sign-up form with keyboard

**High:**
- Significant difficulty completing tasks
- Affects moderate number of users
- WCAG Level AA violation
- Example: Poor contrast makes text hard to read

**Medium:**
- Moderate difficulty
- Affects specific user groups
- WCAG Level AAA violation
- Example: Missing skip link

**Low:**
- Minor inconvenience
- Best practice violation
- Example: Non-descriptive link text

## Resources

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [NVDA Screen Reader](https://www.nvaccess.org/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Guidelines
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

### Testing Schedule

**Daily (During Development):**
- Keyboard navigation for new features
- Color contrast for new designs
- ARIA attributes for new components

**Weekly:**
- axe DevTools scan of changed pages
- Manual keyboard testing of new features
- Screen reader spot checks

**Pre-Release:**
- Full Lighthouse accessibility audit
- Complete manual keyboard testing
- WAVE scan of all pages
- Screen reader testing of critical paths
- User testing with assistive technology users

**Quarterly:**
- Comprehensive accessibility audit
- User testing with diverse assistive tech users
- Update accessibility documentation
- Review and address backlog issues

## Contact

For accessibility questions or to report issues:
- Email: accessibility@billtup.com
- Internal: #accessibility Slack channel
- GitHub: Use "accessibility" label on issues
