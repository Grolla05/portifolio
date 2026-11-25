'use client';

import { useCallback, useEffect, useState } from 'react';
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion';
import { useMotionOff } from '@/lib/animations/use-motion-off';

/*
    Inclinação 3D que segue o cursor (cards de projeto) e atração magnética (CTA).

    Ambos usam molas sobre motion values: o React não re-renderiza a cada pointermove,
    o framer escreve o transform direto no elemento. Só transform — nada de reflow.
    Desligados em toque (sem "hover" real) e com movimento reduzido.
*/

const SPRING = { stiffness: 220, damping: 20, mass: 0.6 };

function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    setFine(Boolean(window.matchMedia?.('(pointer: fine)').matches));
  }, []);
  return fine;
}

interface TiltBindings {
  style: { rotateX: MotionValue<number>; rotateY: MotionValue<number>; transformPerspective: number };
  onPointerMove?: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave?: () => void;
}

/** Inclinação de até `max` graus nos dois eixos. */
export function useTilt(max = 4): TiltBindings {
  const off = useMotionOff();
  const fine = useFinePointer();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, SPRING);
  const rotateY = useSpring(ry, SPRING);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ry.set(px * max * 2);
      rx.set(-py * max * 2);
    },
    [rx, ry, max],
  );

  const onPointerLeave = useCallback(() => {
    rx.set(0);
    ry.set(0);
  }, [rx, ry]);

  const style = { rotateX, rotateY, transformPerspective: 1000 };
  if (off || !fine) return { style };
  return { style, onPointerMove, onPointerLeave };
}

interface MagnetBindings {
  style: { x: MotionValue<number>; y: MotionValue<number> };
  onPointerMove?: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave?: () => void;
}

/** Elemento atraído até `strength` px na direção do cursor. */
export function useMagnet(strength = 6): MagnetBindings {
  const off = useMotionOff();
  const fine = useFinePointer();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, SPRING);
  const y = useSpring(my, SPRING);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      mx.set(((e.clientX - r.left) / r.width - 0.5) * strength * 2);
      my.set(((e.clientY - r.top) / r.height - 0.5) * strength * 2);
    },
    [mx, my, strength],
  );

  const onPointerLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const style = { x, y };
  if (off || !fine) return { style };
  return { style, onPointerMove, onPointerLeave };
}
