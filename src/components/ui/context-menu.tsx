import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"; // Updated to latest
import { cn } from "./utils";

interface ContextMenuProps {
  children: React.ReactNode;
}

function ContextMenu({ children }: ContextMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  
  return (
    <ContextMenuContext.Provider value={{ open, setOpen, position, setPosition }}>
      {children}
    </ContextMenuContext.Provider>
  );
}

const ContextMenuContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;
}>({
  open: false,
  setOpen: () => {},
  position: { x: 0, y: 0 },
  setPosition: () => {},
});

function ContextMenuTrigger({ children, asChild, ...props }: any) {
  const { setOpen, setPosition } = React.useContext(ContextMenuContext);
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setOpen(true);
  };
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onContextMenu: handleContextMenu });
  }
  
  return <div onContextMenu={handleContextMenu} {...props}>{children}</div>;
}

function ContextMenuContent({ className, children, ...props }: any) {
  const { open, setOpen, position } = React.useContext(ContextMenuContext);
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
        "fixed z-50 min-w-[8rem] rounded-md border bg-white p-1 shadow-md",
        className
      )}
      style={{ left: position.x, top: position.y }}
      {...props}
    >
      {children}
    </div>
  );
}

function ContextMenuItem({ className, inset, ...props }: any) {
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

function ContextMenuCheckboxItem({ className, children, checked, ...props }: any) {
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

function ContextMenuRadioItem({ className, children, ...props }: any) {
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

function ContextMenuLabel({ className, inset, ...props }: any) {
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

function ContextMenuSeparator({ className, ...props }: any) {
  return (
    <div
      className={cn("-mx-1 my-1 h-px bg-gray-200", className)}
      {...props}
    />
  );
}

function ContextMenuShortcut({ className, ...props }: any) {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  );
}

function ContextMenuGroup({ ...props }: any) {
  return <div {...props} />;
}

function ContextMenuPortal({ children }: any) {
  return <>{children}</>;
}

function ContextMenuSub({ children }: any) {
  return <>{children}</>;
}

function ContextMenuSubContent({ className, ...props }: any) {
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

function ContextMenuSubTrigger({ className, inset, children, ...props }: any) {
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

function ContextMenuRadioGroup({ ...props }: any) {
  return <div {...props} />;
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};