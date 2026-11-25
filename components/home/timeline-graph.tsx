'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useMotionOff } from '@/lib/animations/use-motion-off';

/*
    Trajetória como `git log --graph`.

    A linha vertical do grafo se desenha conforme a seção rola pela tela (scaleY ligado
    ao progresso do scroll, origem no topo — só transform), e cada "commit" acende na cor
    de assinatura quando a linha o alcança. Ao rolar de volta, apaga: o grafo acompanha o
    leitor em vez de tocar uma vez e morrer.

    Com movimento reduzido: grafo completo e todos os commits acesos, estático.
*/

interface Entry {
  when: string;
  what: string;
}

function Commit({
  entry,
  index,
  total,
  progress,
  off,
}: {
  entry: Entry;
  index: number;
  total: number;
  progress: MotionValue<number>;
  off: boolean;
}) {
  // Ponto do progresso em que a linha chega a este commit.
  const at = total <= 1 ? 0 : index / (total - 1);
  const lit = useTransform(progress, [Math.max(0, at - 0.08), at], [0, 1]);
  const scale = useTransform(lit, [0, 1], [0.6, 1]);

  return (
    <li className="relative flex gap-4 pl-7">
      {/* Nó do commit: contorno sempre visível + miolo laranja que acende. */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-[0.3rem] w-[11px] h-[11px] rounded-full border"
        style={{ borderColor: 'var(--brand-signal)', backgroundColor: 'var(--bg-secondary)' }}
      >
        <motion.span
          className="absolute inset-[2px] rounded-full"
          style={{
            backgroundColor: 'var(--brand-signal)',
            opacity: off ? 1 : lit,
            scale: off ? 1 : scale,
          }}
        />
      </span>
      <span className="w-16 flex-shrink-0 font-mono" style={{ color: 'var(--text-muted)' }}>
        {entry.when}
      </span>
      <span style={{ color: 'var(--text-secondary)' }}>{entry.what}</span>
    </li>
  );
}

export function TimelineGraph({ entries }: { entries: Entry[] }) {
  const off = useMotionOff();
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] });

  return (
    <ol ref={ref} className="relative space-y-3 text-sm">
      {/* Trilho do grafo (apagado) e a linha que se desenha por cima. */}
      <span
        aria-hidden="true"
        className="absolute left-[5px] top-2 bottom-2 w-px"
        style={{ backgroundColor: 'var(--border-default)' }}
      />
      <motion.span
        aria-hidden="true"
        className="absolute left-[5px] top-2 bottom-2 w-px origin-top"
        style={{ backgroundColor: 'var(--brand-signal)', scaleY: off ? 1 : scrollYProgress }}
      />
      {entries.map((entry, i) => (
        <Commit
          key={entry.what}
          entry={entry}
          index={i}
          total={entries.length}
          progress={scrollYProgress}
          off={off}
        />
      ))}
    </ol>
  );
}
