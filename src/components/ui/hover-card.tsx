import * as React from "react";
import { cn } from "./utils";

interface HoverCardProps {
  openDelay?: number;
  closeDelay?: number;
  children: React.ReactNode;
}

function HoverCard({ openDelay = 200, closeDelay = 300, children }: HoverCardProps) {
  const [open, setOpen] = React.useState(false);
  
  return (
    <HoverCardContext.Provider value={{ open, setOpen, openDelay, closeDelay }}>
      {children}
    </HoverCardContext.Provider>
  );
}

const HoverCardContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  openDelay: number;
  closeDelay: number;
}>({
  open: false,
  setOpen: () => {},
  openDelay: 200,
  closeDelay: 300,
});

function HoverCardTrigger({ children, asChild, ...props }: any) {
  const { setOpen, openDelay, closeDelay } = React.useContext(HoverCardContext);
  const openTimeoutRef = React.useRef<NodeJS.Timeout>();
  const closeTimeoutRef = React.useRef<NodeJS.Timeout>();
  
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    openTimeoutRef.current = setTimeout(() => setOpen(true), openDelay);
  };
  
  const handleMouseLeave = () => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => setOpen(false), closeDelay);
  };
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    });
  }
  
  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props}>
      {children}
    </div>
  );
}

function HoverCardContent({ className, align = "center", sideOffset = 4, children, ...props }: any) {
  const { open } = React.useContext(HoverCardContext);
  
  if (!open) return null;
  
  return (
    <div
      className={cn(
        "absolute z-50 w-64 rounded-md border bg-white p-4 shadow-md",
        className
      )}
      style={{ marginTop: sideOffset }}
      {...props}
    >
      {children}
    </div>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
