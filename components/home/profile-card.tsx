'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMotionOff } from '@/lib/animations/use-motion-off';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { TrafficLights } from '@/components/traffic-lights';
import { SOCIAL } from '@/lib/site';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
} from '@/components/ui/context-menu';

/*
    Painel `profile.ts` do hero.

    Antes: JSX montado à mão, span por span, aparecendo inteiro de uma vez.
    Agora: lista de tokens {texto, cor} — o mesmo dado gera o código colorido e a
    "digitação" token a token (stagger de alguns ms por token, como um editor
    recebendo um paste). CSS puro, então o código está no HTML desde o servidor.
*/

export const PROFILE_TS = `const felipe = {
  role: "Desenvolvedor de Software",
  stack: ["C", "C++", "Python", "TypeScript"],
  focus: "sistemas embarcados + web",
  courses: ["CS50x", "MIT 6.002.1x"],
  contact: "${SOCIAL.email}",
};`;

type Kind = 'kw' | 'ty' | 'str' | 'mu' | 'plain';
const COLOR: Record<Kind, string | undefined> = {
  kw: 'var(--syntax-keyword)',
  ty: 'var(--syntax-type)',
  str: 'var(--syntax-string)',
  mu: 'var(--text-muted)',
  plain: undefined,
};

type Token = [string, Kind];

const s = (v: string): Token => [`"${v}"`, 'str'];
const list = (items: string[]): Token[] =>
  items.flatMap((item, i) => (i === 0 ? [s(item)] : [[', ', 'mu'] as Token, s(item)]));

const TOKENS: Token[] = [
  ['const', 'kw'], [' ', 'plain'], ['felipe', 'ty'], [' = {', 'mu'],
  ['\n  role', 'plain'], [': ', 'mu'], s('Desenvolvedor de Software'), [',', 'mu'],
  ['\n  stack', 'plain'], [': [', 'mu'], ...list(['C', 'C++', 'Python', 'TypeScript']), ['],', 'mu'],
  ['\n  focus', 'plain'], [': ', 'mu'], s('sistemas embarcados + web'), [',', 'mu'],
  ['\n  courses', 'plain'], [': [', 'mu'], ...list(['CS50x', 'MIT 6.002.1x']), ['],', 'mu'],
  ['\n  contact', 'plain'], [': ', 'mu'], s(SOCIAL.email), [',', 'mu'],
  ['\n};', 'mu'], ['\n', 'plain'],
];

interface ProfileCardProps {
  /** Quando o painel começa a aparecer (ms). */
  delay?: number;
  /** Intervalo entre tokens (ms). */
  tokenStagger?: number;
}

export function ProfileCard({ delay = 400, tokenStagger = 14 }: ProfileCardProps) {
  const typingStart = delay + 200;
  const caretDelay = typingStart + TOKENS.length * tokenStagger;

  /*
      Parallax leve: ao rolar, o painel sobe um pouco mais devagar que a página (até 40px),
      dando profundidade à cena sem chamar atenção. Wrapper separado do .reveal-up para
      o transform da animação CSS e o do scroll não brigarem.
  */
  const off = useMotionOff();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, -40]);

  const copyProfile = () => {
    navigator.clipboard.writeText(PROFILE_TS);
    toast.success('profile.ts copiado para a área de transferência!');
  };

  // min-w-0: item de grid com min-width:auto cresceria até a largura do <pre>, vazando no mobile.
  return (
    <motion.div className="w-full min-w-0 max-w-xl lg:ml-auto" style={off ? undefined : { y: parallaxY }}>
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className="reveal-up glass-panel rounded-xl overflow-hidden elevation-1 border border-white/30 dark:border-white/10 cursor-context-menu w-full"
          style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
        >
          <div className="border-b px-4 py-2.5 flex items-center justify-between border-white/15 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <TrafficLights />
              <span className="text-xs font-medium tracking-tight ml-1 text-foreground/90">
                profile.ts
              </span>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">TypeScript</span>
          </div>
          <div className="p-6 overflow-x-auto">
            <pre
              className="font-mono text-[13px] sm:text-sm leading-7"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Arquivo profile.ts com stack, foco, cursos e contato"
            >
              <code>
                {TOKENS.map(([text, kind], i) => (
                  <span
                    key={i}
                    className="type-char"
                    style={{
                      color: COLOR[kind],
                      '--reveal-delay': `${typingStart + i * tokenStagger}ms`,
                    } as React.CSSProperties}
                  >
                    {text}
                  </span>
                ))}
                {/* Caret em CSS (steps): pisca como num editor; entra só quando a digitação acaba. */}
                <span
                  aria-hidden="true"
                  className="type-char inline-block align-text-bottom"
                  style={{ '--reveal-delay': `${caretDelay}ms` } as React.CSSProperties}
                >
                  <span
                    className="caret inline-block w-[9px] h-[1.1em] align-text-bottom"
                    style={{ backgroundColor: 'var(--ide-accent)' }}
                  />
                </span>
              </code>
            </pre>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={copyProfile}>
          <Copy className="w-3.5 h-3.5 mr-2 text-[var(--text-muted)]" />
          Copiar profile.ts
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
    </motion.div>
  );
}
