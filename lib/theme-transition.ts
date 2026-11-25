'use client';

import { useCallback } from 'react';
import { useTheme } from 'next-themes';
import { REDUCE_MOTION_CLASS } from '@/lib/animations/use-motion-off';

/*
    Troca de tema com revelação circular.

    O tema novo se espalha em círculo a partir do ponto do clique (ou do canto do
    header, quando a troca vem do teclado/terminal). View Transitions API: o navegador
    tira um "print" do tema antigo, aplica o novo e animamos só o `clip-path` da
    camada nova — sem reflow, sem pintar a página duas vezes.

    O next-themes aplica a classe num efeito (assíncrono), mas o callback do
    startViewTransition precisa que o DOM já esteja no estado final ao retornar. Por isso
    a classe `dark` e o color-scheme são aplicados aqui, à mão, e só então o setTheme
    persiste a escolha (que reaplica a mesma classe — no-op).

    Fallback: sem a API ou com movimento reduzido, troca direto.
*/

type Theme = 'light' | 'dark' | 'system';
type Origin = { x: number; y: number };

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

function resolve(theme: Theme): 'light' | 'dark' {
  if (theme !== 'system') return theme;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function motionOff(): boolean {
  return (
    document.documentElement.classList.contains(REDUCE_MOTION_CLASS) ||
    Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  );
}

/** Origem padrão: canto superior direito, onde ficam os controles do header. */
function defaultOrigin(): Origin {
  return { x: window.innerWidth - 40, y: 32 };
}

export function useThemeSwitch() {
  const { setTheme } = useTheme();

  return useCallback(
    (next: Theme, origin?: Origin) => {
      const doc = document as DocWithVT;
      const html = document.documentElement;
      const target = resolve(next);
      const already = html.classList.contains('dark') === (target === 'dark');

      if (already || typeof doc.startViewTransition !== 'function' || motionOff()) {
        setTheme(next);
        return;
      }

      const { x, y } = origin ?? defaultOrigin();
      // Raio até o canto mais distante: o círculo sempre cobre a tela inteira.
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

      html.classList.add('theme-vt');
      const transition = doc.startViewTransition(() => {
        html.classList.toggle('dark', target === 'dark');
        html.classList.toggle('light', target === 'light');
        html.style.colorScheme = target;
        setTheme(next);
      });

      transition.ready
        .then(() =>
          html.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            {
              duration: 550,
              easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
              pseudoElement: '::view-transition-new(root)',
            },
          ).finished,
        )
        .catch(() => {})
        .finally(() => html.classList.remove('theme-vt'));
    },
    [setTheme],
  );
}

/** Origem a partir de um evento de clique (centro do botão se veio do teclado). */
export function originFromEvent(e: { clientX: number; clientY: number; currentTarget: EventTarget | null }): Origin {
  if (e.clientX || e.clientY) return { x: e.clientX, y: e.clientY };
  const el = e.currentTarget as HTMLElement | null;
  const r = el?.getBoundingClientRect();
  return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : defaultOrigin();
}
