import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"; // Updated to latest
import { cn } from "./utils";

interface MenubarProps {
  children: React.ReactNode;
  className?: string;
}

function Menubar({ children, className }: MenubarProps) {
  return (
    <div className={cn("flex h-10 items-center space-x-1 rounded-md border bg-white p-1", className)}>
      {children}
    </div>
  );
}

interface MenubarMenuProps {
  children: React.ReactNode;
}

function MenubarMenu({ children }: MenubarMenuProps) {
  const [open, setOpen] = React.useState(false);
  
  return (
    <MenubarMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </MenubarMenuContext.Provider>
  );
}

const MenubarMenuContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

function MenubarTrigger({ className, children, ...props }: any) {
  const { open, setOpen } = React.useContext(MenubarMenuContext);
  
  return (
    <button
      className={cn(
        "flex cursor-pointer select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none hover:bg-gray-100 focus:bg-gray-100",
        open && "bg-gray-100",
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
    </button>
  );
}

function MenubarContent({ className, children, align = "start", sideOffset = 4, ...props }: any) {
  const { open, setOpen } = React.useContext(MenubarMenuContext);
  const contentRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, setOpen]);
  
  if (!open) return null;
  
  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 min-w-[12rem] rounded-md border bg-white p-1 shadow-md",
        className
      )}
      style={{ marginTop: sideOffset }}
      {...props}
    >
      {children}
    </div>
  );
}

function MenubarItem({ className, inset, ...props }: any) {
  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
}

function MenubarCheckboxItem({ className, children, checked, ...props }: any) {
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

function MenubarRadioItem({ className, children, ...props }: any) {
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

function MenubarLabel({ className, inset, ...props }: any) {
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

function MenubarSeparator({ className, ...props }: any) {
  return (
    <div
      className={cn("-mx-1 my-1 h-px bg-gray-200", className)}
      {...props}
    />
  );
}

function MenubarShortcut({ className, ...props }: any) {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-gray-500", className)}
      {...props}
    />
  );
}

function MenubarGroup({ ...props }: any) {
  return <div {...props} />;
}

function MenubarPortal({ children }: any) {
  return <>{children}</>;
}

function MenubarSub({ children }: any) {
  return <>{children}</>;
}

function MenubarSubContent({ className, ...props }: any) {
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

function MenubarSubTrigger({ className, inset, children, ...props }: any) {
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

function MenubarRadioGroup({ ...props }: any) {
  return <div {...props} />;
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
  MenubarGroup,
  MenubarPortal,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarRadioGroup,
};