'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { drawPath } from '@/lib/animations/variants';
import { useMotionOff } from '@/lib/animations/use-motion-off';

/*
    Traço de osciloscópio — elemento assinatura do site.

    Uma linha de 1px que começa reta, vira pulsos digitais (o lado "hardware") e termina
    em senoide suave (o lado "software"), ligando visualmente as duas metades do
    posicionamento "software que conversa com o hardware". Desenha-se com `pathLength`
    e, no hero, a amplitude responde à proximidade do cursor (mola, sem jitter).

    Dentro das regras do CLAUDE.md: traço sólido na cor de token, sem glow nem gradiente.
    Decorativo: aria-hidden e pointer-events: none.
*/

const W = 1000;

/** Monta o `d` do traço para uma amplitude (px no viewBox). */
export function buildTracePath(amp: number, h: number): string {
  const mid = h / 2;
  const pts: string[] = [`M0 ${mid}`, `L140 ${mid}`];

  // Pulsos digitais (onda quadrada) — o firmware.
  const period = 56;
  for (let x = 140; x < 460; x += period) {
    pts.push(`L${x} ${mid - amp}`, `L${x + period / 2} ${mid - amp}`, `L${x + period / 2} ${mid}`, `L${x + period} ${mid}`);
  }
  pts.push(`L520 ${mid}`);

  // Senoide — a interface. Amplitude cresce do zero para não ter degrau na emenda.
  for (let x = 520; x <= W; x += 6) {
    const t = (x - 520) / (W - 520);
    const envelope = Math.min(1, t * 4) * (1 - t * 0.3);
    const y = mid - Math.sin(((x - 520) / 92) * Math.PI * 2) * amp * 0.85 * envelope;
    pts.push(`L${x} ${y.toFixed(2)}`);
  }
  return pts.join(' ');
}

interface SignalTraceProps {
  variant?: 'hero' | 'divider';
  /** Atraso para começar a desenhar (s) — encadeia com a cena do hero. */
  delay?: number;
  className?: string;
}

export function SignalTrace({ variant = 'hero', delay = 0, className }: SignalTraceProps) {
  const off = useMotionOff();
  const ref = useRef<SVGSVGElement>(null);
  const h = variant === 'hero' ? 80 : 40;
  const baseAmp = variant === 'hero' ? 12 : 8;

  const amp = useMotionValue(baseAmp);
  const smooth = useSpring(amp, { stiffness: 120, damping: 18, mass: 0.6 });
  const d = useTransform(smooth, (a) => buildTracePath(a, h));

  useEffect(() => {
    if (off || variant !== 'hero') return;
    // Só ponteiro fino: no toque não há "aproximar o cursor".
    if (!window.matchMedia?.('(pointer: fine)').matches) return;

    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dist = Math.abs(e.clientY - (rect.top + rect.height / 2));
      const near = Math.max(0, 1 - dist / 320);
      amp.set(baseAmp + near * 14);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [off, variant, amp, baseAmp]);

  const common = {
    fill: 'none',
    stroke: 'var(--brand-signal)',
    strokeWidth: 1.25,
    vectorEffect: 'non-scaling-stroke' as const,
    strokeLinejoin: 'round' as const,
    strokeLinecap: 'round' as const,
  };

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${h}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      focusable="false"
      style={{ pointerEvents: 'none', overflow: 'visible' }}
    >
      {off ? (
        <path d={buildTracePath(baseAmp, h)} {...common} />
      ) : variant === 'hero' ? (
        <motion.path
          d={d}
          {...common}
          variants={drawPath}
          initial="hidden"
          animate="visible"
          custom={delay}
        />
      ) : (
        <motion.path
          d={buildTracePath(baseAmp, h)}
          {...common}
          variants={drawPath}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        />
      )}
    </svg>
  );
}
