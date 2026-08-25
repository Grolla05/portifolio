"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Home, User, FolderGit2, Mail, Search } from "lucide-react";
import AccessibilityMenu from "./accessibility-menu";
import { appleSpring } from "@/lib/animations/variants";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About Me", icon: User },
  { href: "/projects", label: "Projects", icon: FolderGit2 },
  { href: "/contact", label: "Contact", icon: Mail },
];

export default function Header() {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();

  const openCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  return (
    <motion.header
      className="sticky top-0 z-50 h-16 w-full backdrop-blur-xl bg-[var(--bg-glass)] border-b border-[var(--border-default)] transition-colors duration-300 shadow-sm"
      initial={prefersReduced ? {} : { opacity: 0, y: -10 }}
      animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav className="w-full h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo / Name with SF Pro */}
        <motion.div whileTap={prefersReduced ? {} : { scale: 0.96 }} transition={appleSpring}>
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight transition-colors duration-200 hover:text-primary"
            style={{ color: "var(--text-primary)" }}
          >
            Felipe Grolla
          </Link>
        </motion.div>

        {/* Navigation Links with Liquid Glass Buttons & SF Pro */}
        <div className="flex items-center gap-1.5 p-1 rounded-full glass-panel">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <motion.div
                key={href}
                whileTap={prefersReduced ? {} : { scale: 0.96 }}
                transition={appleSpring}
                className="relative"
              >
                <Link
                  href={href}
                  className="relative flex items-center gap-2 px-4 py-1.5 text-xs font-medium tracking-tight rounded-full transition-colors duration-200 select-none"
                  style={{
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="headerNavPill"
                      className="absolute inset-0 rounded-full bg-white/70 dark:bg-white/10 shadow-sm border border-white/30 dark:border-white/15"
                      transition={appleSpring}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10 text-primary" />
                  <span className="relative z-10">{label}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Right — Command Palette trigger & Accessibility Menu */}
        <div className="flex items-center gap-3">
          <motion.button
            onClick={openCommandPalette}
            whileHover={prefersReduced ? {} : { scale: 1.02 }}
            whileTap={prefersReduced ? {} : { scale: 0.96 }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] glass-panel transition-colors border border-white/20 dark:border-white/10 select-none cursor-pointer"
            title="Abrir Command Palette (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-[var(--ide-accent)]" />
            <span className="text-[11px]">Buscar...</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-muted-foreground border border-black/5 dark:border-white/5">
              ⌘K
            </kbd>
          </motion.button>
          <AccessibilityMenu />
        </div>
      </nav>
    </motion.header>
  );
}
