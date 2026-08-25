"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { appleSpring } from "@/lib/animations/variants";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  elevation?: "1" | "2" | "none";
  interactive?: boolean;
}

export function GlassCard({
  children,
  className,
  elevation = "1",
  interactive = false,
  ...props
}: GlassCardProps) {
  const elevationClass =
    elevation === "1"
      ? "elevation-1"
      : elevation === "2"
      ? "elevation-2"
      : "";

  return (
    <motion.div
      whileHover={interactive ? { y: -4, scale: 1.005 } : undefined}
      whileTap={interactive ? { scale: 0.99 } : undefined}
      transition={appleSpring}
      className={cn(
        "glass-panel rounded-3xl p-6 sm:p-8 transition-shadow duration-300",
        elevationClass,
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
