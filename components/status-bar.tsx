"use client";

import React, { useEffect, useState } from "react";
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

  /*
      Linha de boot (primeira visita da sessão): "compiling portfolio…" e depois
      "✓ ready in Xs" com o tempo REAL de carregamento (performance.now() na montagem),
      e então volta ao caminho da rota. Coerente com a regra acima: nada de número
      inventado — se o site levou 1,8s, a barra diz 1,8s.
      Renderizado só no cliente, depois da montagem: o HTML do servidor mostra a rota
      normal, sem divergência de hidratação.
  */
  const [boot, setBoot] = useState<string | null>(null);
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem('boot-seen') === '1';
      sessionStorage.setItem('boot-seen', '1');
    } catch {}
    if (seen) return;
    const loadedIn = (performance.now() / 1000).toFixed(2);
    setBoot('compiling portfolio…');
    const t1 = window.setTimeout(() => setBoot(`✓ ready in ${loadedIn}s`), 700);
    const t2 = window.setTimeout(() => setBoot(null), 2200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  const openTerminal = () => {
    window.dispatchEvent(new CustomEvent('portfolio:toggle-terminal'));
  };

  const openPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  const itemClass =
    'flex items-center gap-1.5 px-2 h-full transition-colors hover:bg-black/5 ' +
    'dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 ' +
    'focus-visible:ring-inset focus-visible:ring-[var(--ide-accent)]';

  return (
    <footer
      /*
          Barra cinza, discreta (a azul do primeiro redesign chamava atenção demais para
          um rodapé). Cores em --statusbar-*: todos os itens herdam o mesmo tom, que passa
          AA sobre o fundo nas duas paletas.
      */
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center border-t text-[11px] font-mono select-none"
      style={{
        height: 'var(--status-bar-height)',
        backgroundColor: 'var(--statusbar-bg)',
        borderColor: 'var(--border-default)',
        color: 'var(--statusbar-fg)',
      }}
    >
      <span className="flex items-center gap-1.5 px-2 h-full">
        <GitBranch className="w-3 h-3" aria-hidden="true" />
        main
      </span>

      <span className="px-2 h-full flex items-center">
        {boot ? (
          <span
            key={boot}
            className="reveal-fade"
            style={{ color: boot.startsWith('✓') ? 'var(--statusbar-dot)' : undefined, ['--reveal-delay' as string]: '0ms' }}
            aria-hidden="true"
          >
            {boot}
          </span>
        ) : (
          `~/${route}`
        )}
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
