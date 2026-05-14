'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import AccessibilityMenu from './accessibility-menu';

const navLinks = [
  { href: '/',        label: '_hello'      },
  { href: '/about',   label: '_about-me'   },
  { href: '/projects',label: '_projects'   },
];

export default function Header() {
  const pathname  = usePathname();
  const prefersReduced = useReducedMotion();

  return (
    <motion.header
      className="h-14 border-b bg-[var(--bg-primary)] transition-colors duration-300"
      style={{ borderColor: 'var(--border-default)' }}
      initial={prefersReduced ? {} : { opacity: 0, y: -10 }}
      animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav className="w-full h-full flex items-center justify-between">
        {/* Logo + main nav */}
        <div className="flex items-center h-full">
          <div
            className="w-[268px] lg:w-[308px] h-full flex items-center pl-6 border-r transition-colors duration-300"
            style={{ borderColor: 'var(--border-default)' }}
          >
            <Link
              href="/"
              className="text-sm font-mono transition-colors duration-200"
              style={{ color: 'var(--text-secondary)' }}
            >
              Felipe Grolla
            </Link>
          </div>

          <div className="flex h-full">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative h-full flex items-center px-6 text-sm font-mono transition-colors duration-200"
                  style={{ color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                >
                  {label}
                  {active && (
                    <motion.span
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: 'var(--ide-accent)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right — contact + theme toggle */}
        <div className="flex items-center h-full">
          <Link
            href="/contact"
            className="relative h-full flex items-center px-6 text-sm font-mono transition-colors duration-200"
            style={{ color: pathname === '/contact' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          >
            _contact-me
            {pathname === '/contact' && (
              <motion.span
                layoutId="navUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: 'var(--ide-accent)' }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </Link>

          <div
            className="w-[200px] h-full flex items-center border-l pl-6"
            style={{ borderColor: 'var(--border-default)' }}
          >
            <AccessibilityMenu />
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
