import * as React from "react";
import { XIcon } from "lucide-react"; // Updated to latest
import { cn } from "./utils";

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function Sheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
}

const SheetContext = React.createContext<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}>({});

function SheetTrigger({ children, asChild, ...props }: any) {
  const { onOpenChange } = React.useContext(SheetContext);
  const handleClick = () => onOpenChange?.(true);
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: handleClick });
  }
  
  return <button onClick={handleClick} {...props}>{children}</button>;
}

interface SheetContentProps {
  className?: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

function SheetContent({ className, children, side = "right", ...props }: SheetContentProps) {
  const { open, onOpenChange } = React.useContext(SheetContext);
  
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange?.(false);
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onOpenChange]);
  
  if (!open) return null;
  
  const sideStyles = {
    top: "inset-x-0 top-0 border-b",
    bottom: "inset-x-0 bottom-0 border-t",
    left: "inset-y-0 left-0 h-full w-3/4 sm:max-w-sm border-r",
    right: "inset-y-0 right-0 h-full w-3/4 sm:max-w-sm border-l",
  };
  
  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange?.(false)}
      />
      <div
        className={cn(
          "fixed bg-white shadow-lg p-6 z-50",
          sideStyles[side],
          className
        )}
        {...props}
      >
        {children}
        <button
          onClick={() => onOpenChange?.(false)}
          className="absolute top-4 right-4 rounded-sm opacity-70 hover:opacity-100"
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
}

function SheetHeader({ className, ...props }: any) {
  return (
    <div
      className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: any) {
  return (
    <div
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: any) {
  return (
    <h2
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }: any) {
  return (
    <p
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  );
}

function SheetClose({ children, asChild, ...props }: any) {
  const { onOpenChange } = React.useContext(SheetContext);
  const handleClick = () => onOpenChange?.(false);
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: handleClick });
  }
  
  return <button onClick={handleClick} {...props}>{children}</button>;
}

const SheetOverlay = () => null;
const SheetPortal = ({ children }: any) => <>{children}</>;

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetOverlay,
  SheetPortal,
};