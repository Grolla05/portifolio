'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/*
    "Movimento desligado?" — junta as duas fontes de preferência do site:

      1. prefers-reduced-motion do sistema (useReducedMotion do framer);
      2. o toggle "Reduce Motion" do menu de acessibilidade, que só põe a classe
         `a11y-reduce-motion` no <html> (components/accessibility-menu.tsx).

    Antes só (1) era respeitado pelas animações em JS: quem ligava o toggle do próprio
    site continuava vendo tudo se mexer, porque a classe só zerava animações em CSS.
    Use este hook onde a animação é LÓGICA (typewriter, contagem, traço reagindo ao mouse);
    para variantes simples o MotionConfig de components/motion/motion-provider.tsx já cobre.
*/
export const REDUCE_MOTION_CLASS = 'a11y-reduce-motion';

function readClass(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains(REDUCE_MOTION_CLASS);
}

/** true quando o site deve exibir o estado final sem animar. */
export function useMotionOff(): boolean {
  const system = useReducedMotion();
  const [manual, setManual] = useState(false);

  useEffect(() => {
    setManual(readClass());
    const observer = new MutationObserver(() => setManual(readClass()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return Boolean(system) || manual;
}
