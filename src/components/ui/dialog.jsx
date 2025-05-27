import React, { useContext, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Context to manage dialog state
const DialogContext = React.createContext({
  open: false,
  setOpen: () => {},
});

// Dialog root component
function Dialog({ open: openProp, onOpenChange, children }) {
  const [open, setOpen] = useState(openProp ?? false);

  useEffect(() => {
    if (openProp !== undefined) setOpen(openProp);
  }, [openProp]);

  useEffect(() => {
    if (onOpenChange) onOpenChange(open);
  }, [open, onOpenChange]);

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

// Button that opens the dialog
function DialogTrigger({ children }) {
  const { setOpen } = useContext(DialogContext);
  return React.cloneElement(children, {
    onClick: () => setOpen(true),
  });
}

// Button that closes the dialog
function DialogClose({ children }) {
  const { setOpen } = useContext(DialogContext);
  return React.cloneElement(children, {
    onClick: () => setOpen(false),
  });
}

// Overlay background
const DialogOverlay = React.forwardRef(function DialogOverlay({ className, ...props }, ref) {
  const { open, setOpen } = useContext(DialogContext);
  if (!open) return null;

  return (
    <div
      ref={ref}
      onClick={() => setOpen(false)}
      className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fadeIn",
        className
      )}
      {...props}
    />
  );
});

// Main content box
const DialogContent = React.forwardRef(function DialogContent({ className, children, ...props }, ref) {
  const { open } = useContext(DialogContext);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        ref={ref}
        className={cn(
          "relative w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg animate-zoomIn",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
});

// Header container
function DialogHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
      {...props}
    />
  );
}

// Footer container
function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className
      )}
      {...props}
    />
  );
}

// Title component
const DialogTitle = React.forwardRef(function DialogTitle({ className, ...props }, ref) {
  return (
    <h2
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
});

// Description component
const DialogDescription = React.forwardRef(function DialogDescription({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

// Close (X) button
const DialogCloseButton = React.forwardRef(function DialogCloseButton({ className, ...props }, ref) {
  const { setOpen } = useContext(DialogContext);

  return (
    <button
      ref={ref}
      onClick={() => setOpen(false)}
      className={cn(
        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      {...props}
      aria-label="Close"
    >
      <X className="h-4 w-4" />
    </button>
  );
});

export {
  Dialog,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogCloseButton,
};
