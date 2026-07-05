/**
 * Site navigation — glass bar desktop, sheet menu mobile
 */

import { useState } from "react";
import { motion } from "framer-motion";
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

export default function Navigation() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isImmersive = location.pathname === "/immersive";

  if (isImmersive) {
    return (
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed left-0 right-0 top-0 z-50 px-4 py-3 sm:px-6 sm:py-4"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/immersive" className="flex max-w-[14rem] shrink-0 items-center sm:max-w-[16rem]">
            <motion.img
              src="/branding/sreeBrandLogo.png"
              alt="Sreekanth"
              className="h-auto w-[45%] max-w-full object-contain"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          </Link>
          <Link to="/">
            <motion.span
              className="btn-glass flex items-center gap-2 rounded-full px-4 py-2 text-sm font-mono text-muted-foreground"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Exit immersive</span>
            </motion.span>
          </Link>
        </div>
      </motion.nav>
    );
  }

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
    >
      <div className="mx-auto max-w-7xl">
        <div className="glass-nav relative overflow-hidden rounded-2xl sm:rounded-full">
          <div className="relative z-10 flex w-full items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-2 md:px-5 md:py-2.5">
            <Link
              to="/"
              className="flex max-w-[14rem] shrink-0 items-center sm:max-w-[16rem]"
              onClick={() => setMobileOpen(false)}
            >
              <img
                src="/branding/sreeBrandLogo.png"
                alt="Sreekanth"
                className="h-auto w-[45%] max-w-full object-contain"
              />
            </Link>

            {/* Desktop links */}
            <div className="hidden items-center gap-0.5 md:flex lg:gap-1">
              {navItems.map((item) => {
                const active = location.pathname === item.href;
                return (
                  <Link key={item.name} to={item.href} className="relative">
                    <span
                      className={cn(
                        "relative flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors lg:px-3.5",
                        active
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full border border-primary/35 bg-primary/10 shadow-[inset_0_1px_0_hsl(var(--primary)/0.12)]"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
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

            <div className="flex items-center gap-2">
              <Link
                to="/contact"
                className="btn-gradient hidden rounded-full px-4 py-2 text-center font-mono text-[11px] font-semibold uppercase tracking-wider text-primary-foreground md:inline-block md:text-xs"
              >
                Hire me
              </Link>

              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger
                  type="button"
                  className="btn-glass inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 md:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5 text-primary" />
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="flex w-full max-w-[min(100vw,20rem)] flex-col justify-between border-l border-primary/20 bg-gradient-to-b from-background via-background/98 to-background/95 p-0 backdrop-blur-2xl [&>button.absolute]:hidden"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_100%_0%,hsl(var(--primary)/0.12),transparent_55%)]" />

                  <div className="relative flex h-full flex-col justify-between px-4 pb-5 pt-6">
                    <SheetHeader className="sr-only">
                      <SheetTitle>Navigation menu</SheetTitle>
                    </SheetHeader>

                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between gap-3">
                        <Link
                          to="/"
                          onClick={() => setMobileOpen(false)}
                          className="inline-flex min-w-0 max-w-[9.5rem] flex-1 items-center"
                        >
                          <img
                            src="/branding/sreeBrandLogo.png"
                            alt="Sreekanth"
                            className="h-auto w-full max-w-full object-contain object-left"
                          />
                        </Link>

                        <SheetClose asChild>
                          <button
                            type="button"
                            aria-label="Close menu"
                            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-[0_0_20px_hsl(var(--primary)/0.15)] transition hover:border-primary/50 hover:bg-primary/15 active:scale-95"
                          >
                            <X className="h-6 w-6" strokeWidth={2.25} />
                          </button>
                        </SheetClose>
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
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition",
                              active
                                ? "border-primary/40 bg-primary/10"
                                : "border-border/50 bg-background/40 hover:border-primary/25 hover:bg-background/70",
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition",
                                active
                                  ? "border-primary/35 bg-primary/15 text-primary"
                                  : "border-border/50 bg-background/60 text-muted-foreground group-hover:text-primary",
                              )}
                            >
                              <Icon className="h-4 w-4" strokeWidth={1.75} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span
                                className={cn(
                                  "block text-sm font-semibold leading-tight",
                                  active ? "text-foreground" : "text-foreground/90",
                                )}
                              >
                                {item.name}
                              </span>
                              <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                                {item.description}
                              </span>
                            </span>
                            <ArrowUpRight
                              className={cn(
                                "h-3.5 w-3.5 shrink-0",
                                active
                                  ? "text-primary"
                                  : "text-muted-foreground opacity-40",
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
                      className="btn-gradient mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-center font-mono text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-[0_8px_24px_hsl(var(--primary)/0.3)]"
                    >
                      Hire me
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
