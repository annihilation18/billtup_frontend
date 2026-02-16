import * as React from "react";
import { cn } from "./utils";

interface PopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function Popover({ open, onOpenChange, children }: PopoverProps) {
  return (
    <PopoverContext.Provider value={{ open, onOpenChange }}>
      {children}
    </PopoverContext.Provider>
  );
}

const PopoverContext = React.createContext<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}>({});

function PopoverTrigger({ children, asChild, ...props }: any) {
  const { onOpenChange } = React.useContext(PopoverContext);
  const handleClick = () => onOpenChange?.((prev) => !prev);
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: handleClick });
  }
  
  return <button onClick={handleClick} {...props}>{children}</button>;
}

function PopoverContent({ className, align = "center", sideOffset = 4, children, ...props }: any) {
  const { open, onOpenChange } = React.useContext(PopoverContext);
  const contentRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
        onOpenChange?.(false);
      }
    };
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange?.(false);
    };
    
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onOpenChange]);
  
  if (!open) return null;
  
  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 w-72 rounded-md border bg-white p-4 shadow-md outline-none",
        className
      )}
      style={{ marginTop: sideOffset }}
      {...props}
    >
      {children}
    </div>
  );
}

function PopoverAnchor({ children }: any) {
  return <>{children}</>;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
