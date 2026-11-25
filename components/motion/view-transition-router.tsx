'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMotionOff } from '@/lib/animations/use-motion-off';

/*
    Shared element: card de projeto → página do estudo de caso.

    Ao clicar num link para /projects/<slug> dentro de um card marcado com `data-vt-card`,
    o título (`data-vt="title"`) e a capa (`data-vt="cover"`) do card recebem
    view-transition-name; a página de destino tem os mesmos nomes no h1 e na capa. O
    navegador (View Transitions API) interpola posição e tamanho entre os dois — o card
    "vira" a página.

    Os nomes são atribuídos SÓ no elemento clicado: o mesmo projeto pode aparecer duas
    vezes na tela (destaque + grade) e nomes duplicados abortam a transição inteira.

    A navegação do App Router é assíncrona, então o callback do startViewTransition
    devolve uma Promise que só resolve quando o pathname muda (efeito abaixo) — com
    teto de 1,5s para nunca travar a página se algo falhar.

    Fallback: sem suporte à API, com movimento reduzido ou com modificador (Ctrl/⌘/
    botão do meio), o clique segue o caminho normal do <Link>.
*/

type DocWithVT = Document & {
  startViewTransition?: (cb: () => Promise<void> | void) => { finished: Promise<void> };
};

const CASE_STUDY = /^\/projects\/[^/]+\/?$/;

/**
 * true enquanto uma View Transition de card → estudo de caso está em andamento.
 * O app/template.tsx lê para NÃO tocar a entrada de rota por cima do morph.
 */
export const vtState = { active: false };

export function ViewTransitionRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const off = useMotionOff();
  const pending = useRef<(() => void) | null>(null);

  // Rota nova montada: libera a transição para capturar o estado final.
  useEffect(() => {
    pending.current?.();
    pending.current = null;
  }, [pathname]);

  useEffect(() => {
    const doc = document as DocWithVT;
    if (off || typeof doc.startViewTransition !== 'function') return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!anchor || anchor.target === '_blank') return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || !CASE_STUDY.test(url.pathname)) return;
      if (url.pathname === window.location.pathname) return;

      const card = anchor.closest('[data-vt-card]');
      const title = card?.querySelector<HTMLElement>('[data-vt="title"]');
      const cover = card?.querySelector<HTMLElement>('[data-vt="cover"]');

      // Antes do React/Next tratarem o clique: assumimos a navegação.
      e.preventDefault();
      e.stopPropagation();

      if (title) title.style.viewTransitionName = 'vt-title';
      if (cover) cover.style.viewTransitionName = 'vt-cover';

      vtState.active = true;
      const transition = doc.startViewTransition!(
        () =>
          new Promise<void>((resolve) => {
            pending.current = resolve;
            router.push(url.pathname + url.search + url.hash);
            window.setTimeout(resolve, 1500);
          }),
      );
      transition.finished.finally(() => {
        vtState.active = false;
      });
    };

    // Fase de captura no document: roda antes do handler do <Link> (que fica na raiz do React).
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [off, router]);

  return null;
}
