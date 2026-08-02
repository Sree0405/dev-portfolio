/**
 * Site navigation — solid elevated bar, sheet menu mobile
 */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Home,
  Briefcase,
  Folder,
  Code,
  Mail,
  Menu,
  ArrowUpRight,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/portfolio/BrandMark";
import { ThemeToggle } from "@/components/portfolio/ThemeToggle";

const navItems = [
  {
    name: "Home",
    icon: Home,
    href: "/",
    description: "Portfolio overview",
  },
  {
    name: "Experience",
    icon: Briefcase,
    href: "/experience",
    description: "Career & freelance story",
  },
  {
    name: "Projects",
    icon: Folder,
    href: "/projects",
    description: "Selected engineering work",
  },
  {
    name: "Skills",
    icon: Code,
    href: "/skills",
    description: "React, TS & full-stack depth",
  },
  {
    name: "Contact",
    icon: Mail,
    href: "/contact",
    description: "Hire or collaborate",
  },
] as const;

function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

export default function Navigation() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrolled();
  const reduceMotion = useReducedMotion();

  return (
    <motion.nav
      initial={reduceMotion ? false : { y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
      aria-label="Primary"
    >
      <div className="mx-auto max-w-7xl">
        <div
          className={cn(
            "glass-nav relative overflow-hidden rounded-2xl transition-[background,border-color,box-shadow] duration-[var(--motion-normal,250ms)] ease-out sm:rounded-full",
            scrolled
              ? "border-border bg-[hsl(var(--surface))] shadow-[var(--shadow-soft)]"
              : "border-border/60 bg-[hsl(var(--surface)/0.85)]",
          )}
        >
          {/* 3-column bar: brand | centered page menu | actions */}
          <div className="relative z-10 grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-2 md:px-5 md:py-2.5">
            <Link
              to="/"
              className="justify-self-start flex shrink-0 items-center rounded-lg px-0.5 py-0.5 transition-opacity duration-[var(--motion-fast,150ms)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={() => setMobileOpen(false)}
              aria-label="Sree — Home"
            >
              <BrandMark size="nav" />
            </Link>

            {/* Desktop page menu — optically centered in the bar */}
            <div className="hidden items-center justify-center gap-0.5 md:flex lg:gap-1">
              {navItems.map((item) => {
                const active = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    aria-current={active ? "page" : undefined}
                    className="relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span
                      className={cn(
                        "relative flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors duration-[var(--motion-fast,150ms)] lg:px-3.5",
                        active
                          ? "text-foreground"
                          : "portfolio-text-muted hover:text-foreground",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full border border-primary/35 bg-primary/15"
                          transition={{
                            duration: 0.28,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        />
                      )}
                      <item.icon
                        className={cn(
                          "relative z-10 h-4 w-4 lg:h-[1.125rem] lg:w-[1.125rem]",
                          active ? "text-primary" : "",
                        )}
                      />
                      <span className="relative z-10 hidden lg:inline">
                        {item.name}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Spacer cell on mobile so brand + actions stay at ends */}
            <div className="md:hidden" aria-hidden />

            <div className="justify-self-end flex items-center gap-2">
              <ThemeToggle className="hidden sm:inline-flex" />

              <ThemeToggle className="sm:hidden" />

              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger
                  type="button"
                  className="btn-glass inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5 text-primary" />
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="portfolio-theme-scope flex w-full max-w-[min(100vw,20rem)] flex-col justify-between border-l border-border bg-[hsl(var(--surface))] p-0 text-foreground [&>button.absolute]:hidden"
                >
                  <div className="relative flex h-full flex-col justify-between px-4 pb-5 pt-6">
                    <SheetHeader className="sr-only">
                      <SheetTitle>Navigation menu</SheetTitle>
                    </SheetHeader>

                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between gap-3">
                        <Link
                          to="/"
                          onClick={() => setMobileOpen(false)}
                          className="inline-flex min-w-0 flex-1 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label="Sree — Home"
                        >
                          <BrandMark size="nav" />
                        </Link>

                        <div className="flex shrink-0 items-center gap-2">
                          <ThemeToggle />
                          <SheetClose asChild>
                            <button
                              type="button"
                              aria-label="Close menu"
                              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-[hsl(var(--surface-2))] text-foreground transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
                            >
                              <X className="h-6 w-6" strokeWidth={2.25} />
                            </button>
                          </SheetClose>
                        </div>
                      </div>

                      <nav
                        aria-label="Mobile navigation"
                        className="flex flex-col gap-1.5"
                      >
                        {navItems.map((item) => {
                          const active = location.pathname === item.href;
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.name}
                              to={item.href}
                              aria-current={active ? "page" : undefined}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                "group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors duration-[var(--motion-fast,150ms)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                active
                                  ? "border-primary/35 bg-primary/10"
                                  : "border-border bg-[hsl(var(--surface-2))] hover:border-primary/25 hover:bg-primary/5",
                              )}
                            >
                              <span
                                className={cn(
                                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition",
                                  active
                                    ? "border-primary/35 bg-primary/15 text-primary"
                                    : "border-border bg-[hsl(var(--surface))] portfolio-text-muted group-hover:text-primary",
                                )}
                              >
                                <Icon className="h-4 w-4" strokeWidth={1.75} />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold leading-tight text-foreground">
                                  {item.name}
                                </span>
                                <span className="mt-0.5 block truncate text-[11px] portfolio-text-muted">
                                  {item.description}
                                </span>
                              </span>
                              <ArrowUpRight
                                className={cn(
                                  "h-3.5 w-3.5 shrink-0",
                                  active
                                    ? "text-primary"
                                    : "portfolio-text-muted opacity-40",
                                )}
                              />
                            </Link>
                          );
                        })}
                      </nav>
                    </div>

                    <Link
                      to="/contact"
                      onClick={() => setMobileOpen(false)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 py-3 text-center font-mono text-xs font-semibold uppercase tracking-wide text-primary transition-colors duration-[var(--motion-fast,150ms)] hover:border-primary/50 hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Contact
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
