"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/utils/cn";

interface NavLink {
  label: string;
  href: string;
}

interface MobileNavProps {
  navLinks: NavLink[];
  activeId?: string | null;
  onNavigate?: (
    id: string,
  ) => (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
}

const FOCUSABLE_SELECTOR = "a[href], button:not([disabled])";

export function MobileNav({ navLinks, activeId, onNavigate }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const prefersReducedMotion = usePrefersReducedMotion();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = () => setIsOpen(false);

  // Move focus into the panel on open, and back to the trigger on close.
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  // Lock body scroll while open, compensating for scrollbar width to avoid layout shift.
  useEffect(() => {
    if (!isOpen) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [isOpen]);

  // Escape closes the menu; Tab is trapped within the panel while open.
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const panelTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };
  const backdropTransition = prefersReducedMotion ? { duration: 0.01 } : { duration: 0.2 };
  const panelOffscreen = prefersReducedMotion ? { opacity: 0 } : { x: "100%" };
  const panelOnscreen = prefersReducedMotion ? { opacity: 1 } : { x: 0 };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="text-foreground focus-visible:ring-accent focus-visible:ring-offset-background inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:hidden"
      >
        <Menu aria-hidden="true" className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              aria-hidden="true"
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={backdropTransition}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
            />
            <motion.div
              key="panel"
              id={panelId}
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={panelOffscreen}
              animate={panelOnscreen}
              exit={panelOffscreen}
              transition={panelTransition}
              className="bg-background fixed inset-y-0 right-0 z-50 flex w-[min(20rem,85vw)] flex-col overflow-y-auto border-l border-white/10 p-6 md:hidden"
            >
              <div className="flex items-center justify-end">
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={close}
                  aria-label="Close menu"
                  className="text-foreground focus-visible:ring-accent focus-visible:ring-offset-background inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>
              <nav aria-label="Mobile" className="mt-8 flex flex-col gap-1">
                {navLinks.map((link) => {
                  const targetId = link.href.slice(1);
                  const isActive = activeId === targetId;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={(event) => {
                        onNavigate?.(targetId)(event);
                        close();
                      }}
                      className={cn(
                        "focus-visible:ring-accent focus-visible:ring-offset-background rounded-md px-3 py-3 text-lg font-medium transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                        isActive ? "text-accent" : "text-foreground",
                      )}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </nav>
              <Button
                href="#dashboard"
                onClick={(event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
                  onNavigate?.("dashboard")(event);
                  close();
                }}
                className="mt-6 w-full justify-center"
              >
                Get Started
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
