import { useId } from "react";

/**
 * BilltUpLogo: the BilltUp logo mark (P4.14, chosen 2026-11-08).
 * Masters: app repo brand/logo-mark-2026-11.svg (full colour) and
 * brand/logo-mark-2026-11-light.svg (light, for dark backgrounds); copies of both
 * are served from public/brand/.
 *
 * Colours ("tone"):
 *   - "color": navy / blue / teal mark, for white and light backgrounds.
 *   - "light": white / light-blue / mint mark, for navy, dark or gradient backgrounds.
 *   - not set (auto): full colour, but the stop colours read the --btl-* CSS variables,
 *     so the logo switches to the light colours by itself inside .bt-footer or any
 *     element with class .bt-on-dark (rule in src/styles/billtup-site.css).
 *
 * Each instance gets its own gradient / mask ids (useId), so several logos on one
 * page never share or override each other's definitions.
 */

export type BilltUpLogoTone = "color" | "light";

interface BilltUpLogoProps {
  className?: string;
  /** Width and height in px (the mark is square). */
  size?: number;
  /** Force the full-colour or light version; omit to adapt to dark containers via CSS. */
  tone?: BilltUpLogoTone;
}

type Stop = [offset: string, varName: string, color: string];

// Full colour (brand/logo-mark-2026-11.svg)
const COLOR_FRAME: Stop[] = [["0", "f0", "#0A0F62"], ["1", "f1", "#0360B7"]];
const COLOR_ARROW: Stop[] = [
  ["0", "a0", "#0B1062"],
  ["0.40", "a1", "#053886"],
  ["0.49", "a2", "#026298"],
  ["0.75", "a3", "#029A9E"],
  ["1", "a4", "#04B4A5"],
];
// Light (brand/logo-mark-2026-11-light.svg)
const LIGHT_FRAME: Stop[] = [["0", "f0", "#FFFFFF"], ["1", "f1", "#BFDBFE"]];
const LIGHT_ARROW: Stop[] = [
  ["0", "a0", "#FFFFFF"],
  ["0.25", "a1", "#BAE6FD"],
  ["0.5", "a2", "#93DDFB"],
  ["0.75", "a3", "#7DD3FC"],
  ["1", "a4", "#5EEAD4"],
];

const ZIG =
  "M206 640 L206 610 Q206 554.6 256.5 500 L412.4 331.5 L514.2 431.4 L628 308 L555 236 L843 141 L795 437 L731 378 L731 295 L518.3 526 L415.4 424.4 L271 580.5 L271 640 Z";

export function BilltUpLogo({ className = "", size = 64, tone }: BilltUpLogoProps) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const light = tone === "light";
  const frame = light ? LIGHT_FRAME : COLOR_FRAME;
  const arrow = light ? LIGHT_ARROW : COLOR_ARROW;
  // Auto mode: colours come from --btl-* variables (falling back to full colour).
  const stops = (list: Stop[]) =>
    list.map(([offset, v, color]) => (
      <stop key={offset} offset={offset} style={{ stopColor: tone ? color : `var(--btl-${v}, ${color})` }} />
    ));
  const toneClass = tone ? ` bt-logo-mark--${tone}` : "";

  return (
    <svg
      className={`bt-logo-mark${toneClass} ${className}`.trim()}
      width={size}
      height={size}
      viewBox="144 121 761 761"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="BilltUp"
      style={{ flex: "none" }}
    >
      <defs>
        <linearGradient id={`${id}f`} gradientUnits="userSpaceOnUse" x1="206" y1="0" x2="731" y2="0">
          {stops(frame)}
        </linearGradient>
        <linearGradient id={`${id}a`} gradientUnits="userSpaceOnUse" x1="230" y1="620" x2="842" y2="140">
          {stops(arrow)}
        </linearGradient>
        <linearGradient id={`${id}r`} gradientUnits="userSpaceOnUse" x1="260" y1="560" x2="420" y2="400">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id={`${id}m`} maskUnits="userSpaceOnUse" x="144" y="121" width="761" height="761">
          <rect x="144" y="121" width="761" height="761" fill={`url(#${id}r)`} />
        </mask>
      </defs>
      {/* Page frame and text lines */}
      <g fill={`url(#${id}f)`}>
        <path d="M206 494 L206 262 A95 95 0 0 1 301 167 L628 167 L560 190 Q522 203 510 231 L301 231 A30 30 0 0 0 271 261 L271 424 Z" />
        <path d="M731 397 L731 772 A90 90 0 0 1 641 862 L206 862 L206 620 L271 620 L271 801 L639 801 A30 30 0 0 0 669 771 L669 461 Z" />
        <path d="M360 557 L610 557 L610 617 L330 617 L330 587 A30 30 0 0 1 360 557 Z" />
        <path d="M330 673 L610 673 L610 702 A30 30 0 0 1 580 732 L330 732 Z" />
        <path d={ZIG} />
      </g>
      {/* Rising line into the arrow, fading in from the frame colours */}
      <path fill={`url(#${id}a)`} mask={`url(#${id}m)`} d={ZIG} />
    </svg>
  );
}
