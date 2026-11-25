"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { GitBranch, TerminalSquare, Search, Circle } from "lucide-react";

/*
    Barra de status no rodapé, no padrão da do VS Code.

    Regra de conteúdo: só entra informação VERDADEIRA ou acionável. É tentador encher de
    "Ln 12, Col 4" e "0 erros, 0 avisos" para reforçar a estética de IDE, mas número que
    nunca muda lê como fantasia — pior que não ter. Então: rota real, tema real, atalhos
    que de fato funcionam e o sinal de disponibilidade.

    A altura (1.5rem) é a mesma declarada em --status-bar-height, de onde as páginas
    descontam o viewport. Mudar aqui exige mudar lá.
*/

const ROUTE_LABELS: Record<string, string> = {
  '/': 'home',
  '/about': 'about',
  '/projects': 'projects',
  '/contact': 'contact',
};

export function StatusBar() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  const route = ROUTE_LABELS[pathname] ?? pathname.replace(/^\//, '');

  const openTerminal = () => {
    window.dispatchEvent(new CustomEvent('portfolio:toggle-terminal'));
  };

  const openPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  const itemClass =
    'flex items-center gap-1.5 px-2 h-full transition-colors hover:bg-white/15 ' +
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset ' +
    'focus-visible:ring-white';

  return (
    <footer
      /*
          Redesign: barra azul sólida do design (padrão VS Code), no lugar da cinza.
          Texto em --statusbar-fg sobre --statusbar-bg dá 6.4:1 — por isso todos os itens
          herdam a mesma cor, sem tons de cinza que perderiam contraste sobre o azul.
      */
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center text-[11px] font-mono select-none"
      style={{
        height: 'var(--status-bar-height)',
        backgroundColor: 'var(--statusbar-bg)',
        color: 'var(--statusbar-fg)',
      }}
    >
      <span className="flex items-center gap-1.5 px-2 h-full">
        <GitBranch className="w-3 h-3" aria-hidden="true" />
        main
      </span>

      <span className="px-2 h-full flex items-center">
        {`~/${route}`}
      </span>

      <button onClick={openTerminal} className={itemClass} aria-label="Abrir terminal integrado">
        <TerminalSquare className="w-3 h-3" aria-hidden="true" />
        <span className="hidden sm:inline">terminal</span>
        <kbd className="hidden md:inline opacity-70">Ctrl+`</kbd>
      </button>

      <button onClick={openPalette} className={itemClass} aria-label="Abrir paleta de comandos">
        <Search className="w-3 h-3" aria-hidden="true" />
        <span className="hidden sm:inline">buscar</span>
        <kbd className="hidden md:inline opacity-70">⌘K</kbd>
      </button>

      <span className="ml-auto px-2 h-full hidden md:flex items-center">
        {resolvedTheme === 'light' ? 'claro' : 'escuro'}
      </span>

      <span className="flex items-center gap-1.5 px-3 h-full">
        <Circle
          className="w-2 h-2"
          style={{ color: 'var(--statusbar-dot)' }}
          fill="currentColor"
          aria-hidden="true"
        />
        {/* A 375px o rótulo longo quebrava em duas linhas e vazava dos 24px da barra. */}
        <span className="hidden sm:inline whitespace-nowrap">Disponível para oportunidades</span>
        <span className="sm:hidden whitespace-nowrap">disponível</span>
      </span>
    </footer>
  );
}

export default StatusBar;
