import * as React from "react";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react@0.468.0";
import { cn } from "./utils";

interface DropdownMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function DropdownMenu({ open, onOpenChange, children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const controlledOpen = open !== undefined ? open : isOpen;
  const handleOpenChange = onOpenChange || setIsOpen;
  
  return (
    <DropdownMenuContext.Provider value={{ open: controlledOpen, onOpenChange: handleOpenChange }}>
      {children}
    </DropdownMenuContext.Provider>
  );
}

const DropdownMenuContext = React.createContext<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}>({});

function DropdownMenuTrigger({ children, asChild, className, ...props }: any) {
  const { open, onOpenChange } = React.useContext(DropdownMenuContext);
  const handleClick = () => onOpenChange?.(!open);
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: handleClick, className });
  }
  
  return <button onClick={handleClick} className={className} {...props}>{children}</button>;
}

function DropdownMenuContent({ className, children, align = "center", sideOffset = 4, ...props }: any) {
  const { open, onOpenChange } = React.useContext(DropdownMenuContext);
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
        "absolute z-50 min-w-[8rem] rounded-md border bg-white p-1 shadow-md",
        className
      )}
      style={{ marginTop: sideOffset }}
      {...props}
    >
      {children}
    </div>
  );
}

function DropdownMenuItem({ className, inset, onClick, ...props }: any) {
  const { onOpenChange } = React.useContext(DropdownMenuContext);
  
  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e);
    onOpenChange?.(false);
  };
  
  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100",
        inset && "pl-8",
        className
      )}
      onClick={handleClick}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({ className, children, checked, ...props }: any) {
  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <CheckIcon className="h-4 w-4" />}
      </span>
      {children}
    </div>
  );
}

function DropdownMenuRadioItem({ className, children, ...props }: any) {
  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <CircleIcon className="h-2 w-2 fill-current" />
      </span>
      {children}
    </div>
  );
}

function DropdownMenuLabel({ className, inset, ...props }: any) {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-sm font-semibold",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({ className, ...props }: any) {
  return (
    <div
      className={cn("-mx-1 my-1 h-px bg-gray-200", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({ className, ...props }: any) {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  );
}

function DropdownMenuGroup({ ...props }: any) {
  return <div {...props} />;
}

function DropdownMenuPortal({ children }: any) {
  return <>{children}</>;
}

function DropdownMenuSub({ children }: any) {
  return <>{children}</>;
}

function DropdownMenuSubContent({ className, ...props }: any) {
  return (
    <div
      className={cn(
        "z-50 min-w-[8rem] rounded-md border bg-white p-1 shadow-lg",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSubTrigger({ className, inset, children, ...props }: any) {
  return (
    <div
      className={cn(
        "flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </div>
  );
}

function DropdownMenuRadioGroup({ ...props }: any) {
  return <div {...props} />;
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};