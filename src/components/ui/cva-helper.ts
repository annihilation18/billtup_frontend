// Simple replacement for class-variance-authority to avoid esm.sh issues
import { cn } from "./utils";

export type VariantProps<T> = T extends (...args: any[]) => any
  ? Parameters<T>[0]
  : never;

export function cva(base: string, config?: any) {
  return (props?: any) => {
    if (!config || !props) return base;
    
    const { variants, defaultVariants } = config;
    const classes: string[] = [base];
    
    const mergedProps = { ...defaultVariants, ...props };
    
    if (variants) {
      Object.keys(variants).forEach((variantKey) => {
        const variantValue = mergedProps[variantKey];
        if (variantValue && variants[variantKey][variantValue]) {
          classes.push(variants[variantKey][variantValue]);
        }
      });
    }
    
    if (props?.className) {
      classes.push(props.className);
    }
    
    return cn(...classes);
  };
}
