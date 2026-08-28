"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { appleSpring } from "@/lib/animations/variants";
import { cn } from "@/lib/utils";

/*
    Grupo de chamadas para ação (CTA).

    Extraído do padrão que já existia em app/not-found.tsx (botão primário sólido +
    botão glass-pill secundário, ambos com mola Apple HIG). Virou componente porque o
    mesmo par passa a aparecer na home, no fim de /projects e no fim de /about — e três
    cópias divergem na primeira vez que alguém ajustar um padding.

    Deliberadamente NÃO usa components/ui/button.tsx: nenhuma página do site usa aquele
    componente hoje (todas montam <Link> estilizado à mão), então adotá-lo agora criaria
    dois vocabulários visuais de botão convivendo.
*/

export type CtaVariant = "primary" | "glass";

export interface CtaAction {
  href: string;
  label: string;
  icon?: React.ElementType;
  variant?: CtaVariant;
  /** Abre em nova aba com rel de segurança. */
  external?: boolean;
  /** Texto para leitores de tela quando o rótulo visível não basta. */
  ariaLabel?: string;
}

interface CtaGroupProps {
  actions: CtaAction[];
  className?: string;
  /** Animação de entrada: use false quando o pai já orquestra via variants. */
  animateOnMount?: boolean;
}

const baseClasses =
  "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold tracking-tight " +
  "transition-colors focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-[var(--ide-accent)] focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-[var(--bg-primary)]";

const variantClasses: Record<CtaVariant, string> = {
  primary: "bg-primary text-primary-foreground shadow-sm hover:opacity-95 px-6",
  glass: "glass-pill hover:bg-black/5 dark:hover:bg-white/10",
};

export function CtaGroup({ actions, className, animateOnMount = true }: CtaGroupProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className={cn("flex flex-wrap items-center gap-3", className)}
      initial={animateOnMount && !prefersReduced ? { opacity: 0, y: 12 } : false}
      animate={animateOnMount && !prefersReduced ? { opacity: 1, y: 0 } : undefined}
      transition={{ delay: 0.35, ...appleSpring }}
    >
      {actions.map(({ href, label, icon: Icon, variant = "glass", external, ariaLabel }) => {
        const content = (
          <>
            {Icon && (
              <Icon
                className={cn(
                  "w-4 h-4",
                  variant === "primary" ? "" : "text-primary",
                )}
                aria-hidden="true"
              />
            )}
            <span>{label}</span>
          </>
        );

        const classes = cn(baseClasses, variantClasses[variant]);

        return (
          <motion.div
            key={href + label}
            whileHover={prefersReduced ? {} : { scale: 1.02 }}
            whileTap={prefersReduced ? {} : { scale: 0.97 }}
            transition={appleSpring}
          >
            {external ? (
              /*
                  Links externos usam <a> e não next/link: não há rota interna para
                  prefetch, e rel="noopener" corta o acesso a window.opener na aba aberta.
              */
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                /* Só quando difere do texto visível: aria-label idêntico ao rótulo
                   substitui o conteúdo por ele mesmo, sem ganho e com risco de
                   dessincronizar da tradução visível. */
                aria-label={ariaLabel}
                className={classes}
                style={variant === "glass" ? { color: "var(--text-primary)" } : undefined}
              >
                {content}
              </a>
            ) : (
              <Link
                href={href}
                /* Só quando difere do texto visível: aria-label idêntico ao rótulo
                   substitui o conteúdo por ele mesmo, sem ganho e com risco de
                   dessincronizar da tradução visível. */
                aria-label={ariaLabel}
                className={classes}
                style={variant === "glass" ? { color: "var(--text-primary)" } : undefined}
              >
                {content}
              </Link>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default CtaGroup;
