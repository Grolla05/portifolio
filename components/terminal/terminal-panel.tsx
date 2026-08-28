"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { TerminalSquare, X, Trash2 } from "lucide-react";
import type { Paper } from "@/lib/papers";
import type { RepoProject } from "@/lib/projects";
import {
  runCommand,
  completeCommand,
  WELCOME_LINES,
  type TerminalLine,
} from "@/lib/terminal";

/*
    Terminal integrado, no espírito do painel inferior do VS Code.

    Abre com Ctrl+` (o mesmo atalho do editor), pela status bar ou pela paleta de comandos.
    A lógica dos comandos vive em lib/terminal.ts como funções puras; aqui ficam só
    entrada, histórico, rolagem e a aplicação dos efeitos que os comandos devolvem.

    Os projetos são buscados sob demanda, na primeira abertura: quem nunca abre o
    terminal não paga uma requisição a /api/projects.
*/

const LINE_COLOR: Record<TerminalLine['kind'], string> = {
  output: 'var(--text-secondary)',
  error: 'var(--ide-accent-red)',
  muted: 'var(--syntax-comment)',
  accent: 'var(--ide-accent)',
  command: 'var(--text-primary)',
};

interface TerminalPanelProps {
  papers: Paper[];
}

export function TerminalPanel({ papers }: TerminalPanelProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const prefersReduced = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>(WELCOME_LINES);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  /** Posição no histórico: -1 = digitando algo novo. */
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [projects, setProjects] = useState<RepoProject[] | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fetchedRef = useRef(false);

  // Ctrl+` alterna o painel; Esc fecha quando ele tem o foco.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '`' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Permite abrir de qualquer lugar (status bar, paleta) sem prop drilling.
  useEffect(() => {
    const onToggle = () => setOpen((prev) => !prev);
    window.addEventListener('portfolio:toggle-terminal', onToggle);
    return () => window.removeEventListener('portfolio:toggle-terminal', onToggle);
  }, []);

  /*
      Busca preguiçosa dos projetos: só na primeira abertura, e uma vez por sessão.
      `fetchedRef` em vez de estado para não disparar re-render nem re-executar o efeito.
  */
  useEffect(() => {
    if (!open || fetchedRef.current) return;
    fetchedRef.current = true;

    fetch('/api/projects')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('falha'))))
      .then((data: { projects: RepoProject[] }) => setProjects(data.projects ?? []))
      .catch(() => setProjects([]));
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Mantém a última linha visível conforme a saída cresce.
  useEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [lines, open]);

  const applyEffect = useCallback(
    (effect: NonNullable<ReturnType<typeof runCommand>['effect']>) => {
      switch (effect.type) {
        case 'navigate':
          router.push(effect.to);
          break;
        case 'open':
          window.open(effect.url, '_blank', 'noopener,noreferrer');
          break;
        case 'theme':
          setTheme(
            effect.value === 'toggle' ? (theme === 'dark' ? 'light' : 'dark') : effect.value,
          );
          break;
        case 'clear':
          setLines([]);
          break;
        case 'close':
          setOpen(false);
          break;
      }
    },
    [router, setTheme, theme],
  );

  const submit = useCallback(() => {
    const entered = input;
    const result = runCommand(entered, { papers, projects, theme });

    setLines((prev) => [
      ...prev,
      { kind: 'command', text: `$ ${entered}` },
      ...result.lines,
    ]);

    if (entered.trim()) {
      setHistory((prev) => [...prev, entered]);
    }
    setHistoryIndex(-1);
    setInput('');

    if (result.effect) applyEffect(result.effect);
  }, [input, papers, projects, theme, applyEffect]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      const { completion, candidates } = completeCommand(input);
      setInput(completion);
      // Mais de um candidato: lista as opções, como faz o bash no segundo Tab.
      if (candidates.length > 1) {
        setLines((prev) => [...prev, { kind: 'muted', text: candidates.join('  ') }]);
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (history.length === 0) return;
      const next = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next]);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex === -1) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(next);
        setInput(history[next]);
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          /*
              `fixed` acima da status bar (1.5rem). Sobrepor em vez de empurrar o conteúdo
              evita recalcular a altura de todas as páginas quando o terminal abre.
          */
          className="fixed left-0 right-0 z-40 flex flex-col border-t shadow-2xl"
          style={{
            bottom: 'var(--status-bar-height)',
            height: 'min(42vh, 420px)',
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-default)',
          }}
          initial={prefersReduced ? false : { y: '100%' }}
          animate={prefersReduced ? undefined : { y: 0 }}
          exit={prefersReduced ? undefined : { y: '100%' }}
          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          aria-label="Terminal integrado"
          onClick={() => inputRef.current?.focus()}
        >
          <div
            className="h-9 flex items-center px-3 border-b flex-shrink-0"
            style={{ borderColor: 'var(--border-default)' }}
          >
            <TerminalSquare
              className="w-3.5 h-3.5 mr-2"
              style={{ color: 'var(--ide-accent)' }}
              aria-hidden="true"
            />
            <span
              className="text-[11px] font-semibold tracking-tight uppercase"
              style={{ color: 'var(--text-secondary)' }}
            >
              terminal
            </span>

            <button
              onClick={(event) => {
                event.stopPropagation();
                setLines([]);
              }}
              className="ml-auto p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Limpar terminal"
              style={{ color: 'var(--text-muted)' }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                setOpen(false);
              }}
              className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Fechar terminal"
              style={{ color: 'var(--text-muted)' }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed"
            style={{ backgroundColor: 'var(--bg-primary)' }}
            role="log"
            aria-live="polite"
          >
            {lines.map((line, index) => (
              <div
                key={index}
                style={{ color: LINE_COLOR[line.kind] }}
                className="whitespace-pre-wrap break-words"
              >
                {line.text || ' '}
              </div>
            ))}

            <div className="flex items-center mt-1">
              <span className="mr-2 flex-shrink-0" style={{ color: 'var(--ide-accent-green)' }}>
                $
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onKeyDown}
                className="flex-1 bg-transparent outline-none font-mono text-xs"
                style={{ color: 'var(--text-primary)' }}
                aria-label="Entrada do terminal"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

export default TerminalPanel;
