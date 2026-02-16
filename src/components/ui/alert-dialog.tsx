import * as React from "react";
import { XIcon } from "lucide-react"; // Updated to latest
import { cn } from "./utils";
import { buttonVariants } from "./button";

interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  return (
    <AlertDialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

const AlertDialogContext = React.createContext<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}>({});

function AlertDialogTrigger({ children, asChild, ...props }: any) {
  const { onOpenChange } = React.useContext(AlertDialogContext);
  const handleClick = () => onOpenChange?.(true);
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: handleClick });
  }
  
  return <button onClick={handleClick} {...props}>{children}</button>;
}

function AlertDialogContent({ className, children, ...props }: any) {
  const { open, onOpenChange } = React.useContext(AlertDialogContext);
  
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);
  
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" />
      <div
        className={cn(
          "relative bg-white rounded-lg border shadow-lg p-6 w-full max-w-lg mx-4 z-50",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

function AlertDialogHeader({ className, ...props }: any) {
  return (
    <div
      className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({ className, ...props }: any) {
  return (
    <div
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4", className)}
      {...props}
    />
  );
}

function AlertDialogTitle({ className, ...props }: any) {
  return (
    <h2
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({ className, ...props }: any) {
  return (
    <p
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  );
}

function AlertDialogAction({ className, ...props }: any) {
  const { onOpenChange } = React.useContext(AlertDialogContext);
  
  return (
    <button
      className={cn(buttonVariants({ variant: "default" }), className)}
      onClick={(e) => {
        props.onClick?.(e);
        onOpenChange?.(false);
      }}
      {...props}
    />
  );
}

function AlertDialogCancel({ className, ...props }: any) {
  const { onOpenChange } = React.useContext(AlertDialogContext);
  
  return (
    <button
      className={cn(buttonVariants({ variant: "outline" }), className)}
      onClick={(e) => {
        props.onClick?.(e);
        onOpenChange?.(false);
      }}
      {...props}
    />
  );
}

const AlertDialogOverlay = () => null;
const AlertDialogPortal = ({ children }: any) => <>{children}</>;

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogOverlay,
  AlertDialogPortal,
};