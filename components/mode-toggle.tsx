'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      <motion.div
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.4, ease: 'anticipate' }}
        className="relative w-[1.2rem] h-[1.2rem]"
      >
        <Sun className="absolute inset-0 h-full w-full transition-opacity" style={{ opacity: isDark ? 0 : 1 }} />
        <Moon className="absolute inset-0 h-full w-full transition-opacity" style={{ opacity: isDark ? 1 : 0 }} />
      </motion.div>
    </Button>
  );
}
