'use client';

import React from 'react';
import { MotionConfig } from 'framer-motion';
import { useMotionOff } from '@/lib/animations/use-motion-off';

/*
    Configuração global do Framer Motion.

    reducedMotion: com "always", o framer desliga transform/layout em TODAS as animações
    de uma vez (opacidade continua, o que é aceito pelo WCAG 2.3.3). Antes cada elemento
    repetia `variants={prefersReduced ? {} : fadeUp}` — dezenas de cópias, e bastava
    esquecer uma para quebrar a preferência. "user" só olharia o sistema; aqui o valor
    também liga quando o toggle do menu de acessibilidade está ativo (useMotionOff).

    LazyMotion ficou de fora de propósito: o site usa `layoutId` (abas, sublinhado do
    header), que exige o pacote `domMax` — a economia de bundle seria quase nula e
    obrigaria trocar todo `motion.*` por `m.*`.
*/
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const off = useMotionOff();
  return <MotionConfig reducedMotion={off ? 'always' : 'never'}>{children}</MotionConfig>;
}
