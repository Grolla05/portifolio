'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useMotionOff } from '@/lib/animations/use-motion-off';

/*
    Número que conta de 0 até o valor quando entra na tela.

    Mola (não duração fixa): números grandes e pequenos assentam com a mesma sensação.
    `tabular-nums` no pai evita que a largura pule a cada dígito.
    O valor visível é aria-hidden; o leitor de tela recebe só o número final (sr-only),
    em vez de ouvir a contagem intermediária.
*/
interface CountUpProps {
  value: number;
  /** false enquanto o dado não chegou (ex.: GitHub carregando). */
  ready?: boolean;
  placeholder?: string;
}

export function CountUp({ value, ready = true, placeholder = '–' }: CountUpProps) {
  const off = useMotionOff();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const spring = useSpring(0, { stiffness: 70, damping: 22 });
  const display = useTransform(spring, (v) => Math.round(v).toString());

  useEffect(() => {
    if (ready && inView) spring.set(value);
  }, [ready, inView, value, spring]);

  if (!ready) return <span ref={ref}>{placeholder}</span>;

  return (
    <span ref={ref}>
      <span className="sr-only">{value}</span>
      {off ? <span aria-hidden="true">{value}</span> : <motion.span aria-hidden="true">{display}</motion.span>}
    </span>
  );
}
