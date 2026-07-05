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
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Experience", icon: Briefcase, href: "/experience" },
  { name: "Projects", icon: Folder, href: "/projects" },
  { name: "Skills", icon: Code, href: "/skills" },
  { name: "Contact", icon: Mail, href: "/contact" },
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
                  className="btn-glass inline-flex h-10 w-10 items-center justify-center rounded-xl md:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="flex w-full max-w-sm flex-col border-border/40 bg-background/95 backdrop-blur-xl"
                >
                  <SheetHeader className="border-b border-border/30 pb-4 text-left">
                    <SheetTitle className="font-mono text-sm uppercase tracking-widest text-primary">
                      Menu
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-1 flex-col gap-1 py-6">
                    {navItems.map((item) => {
                      const active = location.pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition",
                            active
                              ? "bg-primary/15 text-foreground"
                              : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-5 w-5",
                              active ? "text-primary" : "",
                            )}
                          />
                          {item.name}
                        </Link>
                      );
                    })}
                  </nav>
                  <Link
                    to="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="btn-gradient mb-6 mt-auto block rounded-xl py-3.5 text-center font-mono text-sm font-semibold uppercase tracking-wide text-primary-foreground"
                  >
                    Hire me
                  </Link>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
