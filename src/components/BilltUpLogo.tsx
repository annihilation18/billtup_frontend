import { Receipt } from "lucide-react";

/**
 * BilltUpLogo Component
 *
 * This is a LOCAL component, NOT an npm package
 * Displays the BilltUp brand logo with gradient colors
 */

interface BilltUpLogoProps {
  className?: string;
  size?: number;
}

export function BilltUpLogo({
  className = "",
  size = 64,
}: BilltUpLogoProps) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1E3A8A] via-[#14B8A6] to-[#F59E0B] p-0.5 ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
        <svg
          width={size * 0.6}
          height={size * 0.6}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="billtup-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="50%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            stroke="url(#billtup-gradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="14 2 14 8 20 8"
            stroke="url(#billtup-gradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="16"
            y1="13"
            x2="8"
            y2="13"
            stroke="url(#billtup-gradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="16"
            y1="17"
            x2="8"
            y2="17"
            stroke="url(#billtup-gradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="10 9 9 9 8 9"
            stroke="url(#billtup-gradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}