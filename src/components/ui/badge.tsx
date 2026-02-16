import * as React from "react";
import { cn } from "./utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
  asChild?: boolean;
}

function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantStyles = {
    default: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
    destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
    outline: "text-gray-900 border-gray-300",
  };
  
  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Badge };
export type { BadgeProps };

export const badgeVariants = (props?: any) => {
  const variant = props?.variant || "default";
  const className = props?.className || "";
  
  const baseStyles = "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantStyles: Record<string, string> = {
    default: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
    destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
    outline: "text-gray-900 border-gray-300",
  };
  
  return cn(baseStyles, variantStyles[variant], className);
};
