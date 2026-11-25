'use client';

import React, { useEffect, useState } from 'react';
import { vtState } from '@/components/motion/view-transition-router';

/*
    Entrada de rota — "troca de arquivo" no editor.

    Antes a troca de página era um corte seco. O template (ao contrário do layout) é
    remontado a cada navegação, então a classe `.route-enter` (app/globals.css) toca de
    novo em toda troca: 8px de subida + fade, curto e discreto.

    Por que não no primeiro carregamento: a home tem a própria cena (components/home/hero.tsx)
    e animar o wrapper inteiro por cima dela embaralharia a coreografia. A flag de módulo
    `navigated` vira true depois da primeira montagem; o servidor e a primeira renderização
    do cliente veem false (sem divergência de hidratação), e daí em diante cada nova página
    entra animada.

    CSS e não Framer: o Framer renderizaria `opacity:0` no HTML do servidor.
*/
let navigated = false;

export default function Template({ children }: { children: React.ReactNode }) {
  // Durante o morph card → estudo de caso, a View Transition já anima a troca.
  const [animate] = useState(() => navigated && !vtState.active);

  useEffect(() => {
    navigated = true;
  }, []);

  return <div className={animate ? 'route-enter' : undefined}>{children}</div>;
}
