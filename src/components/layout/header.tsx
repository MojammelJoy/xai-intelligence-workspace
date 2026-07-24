"use client";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { useActiveSection } from "@/hooks/use-active-section";
import { useSmoothScrollTo } from "@/hooks/use-smooth-scroll-to";
import { cn } from "@/utils/cn";
import { MobileNav } from "./mobile-nav";

const navLinks = [
  { label: "Product", href: "#hero" },
  { label: "Docs", href: "#insight-flow" },
  { label: "Pricing", href: "#dashboard" },
];

const SECTION_IDS = navLinks.map((link) => link.href.slice(1));

export function Header() {
  const activeId = useActiveSection(SECTION_IDS);
  const scrollTo = useSmoothScrollTo();

  return (
    <Reveal as="header" className="bg-background sticky top-0 z-50 border-b border-white/5">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <a
          href="#hero"
          onClick={scrollTo("hero")}
          className="text-foreground focus-visible:ring-accent focus-visible:ring-offset-background rounded-sm text-lg font-semibold tracking-tight transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Xai
        </a>
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const targetId = link.href.slice(1);
            const isActive = activeId === targetId;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={scrollTo(targetId)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "focus-visible:ring-accent focus-visible:ring-offset-background rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
        <div className="flex items-center">
          <Button
            href="#dashboard"
            onClick={scrollTo("dashboard")}
            size="sm"
            className="hidden md:inline-flex"
          >
            Get Started
          </Button>
          <MobileNav navLinks={navLinks} activeId={activeId} onNavigate={scrollTo} />
        </div>
      </div>
    </Reveal>
  );
}
