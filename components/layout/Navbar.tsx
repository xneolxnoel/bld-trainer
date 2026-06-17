"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Box, BookOpen, Dices, Library, Route, Dumbbell, Timer, BookMarked, Menu, X } from "lucide-react";

const navItems = [
  { href: "/", label: "Roadmap", icon: Box },
  { href: "/letters", label: "Letters", icon: BookOpen },
  { href: "/tracing", label: "Tracing", icon: Route },
  { href: "/edges", label: "Edges", icon: Box },
  { href: "/corners", label: "Corners", icon: Box },
  { href: "/parity", label: "Parity", icon: Box },
  { href: "/memo", label: "Memo", icon: Dices },
  { href: "/trainer", label: "Trainer", icon: Dumbbell },
  { href: "/solve", label: "Solve", icon: Timer },
  { href: "/algs", label: "Algs", icon: Library },
  { href: "/glossary", label: "Glossary", icon: BookMarked },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  // Close the mobile menu on navigation by detecting pathname changes during
  // render — React 19 derived-state pattern, avoids the effect+setState dance.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (mobileOpen) setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b-2 border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
            >
              <Box className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-black tracking-tight">
              BLD<span className="text-primary">Trainer</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 rounded-xl border-2 border-primary/30"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="md:hidden p-2 rounded-xl text-foreground hover:bg-muted transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="md:hidden overflow-hidden border-t border-border bg-background/95"
          >
            <ul className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
