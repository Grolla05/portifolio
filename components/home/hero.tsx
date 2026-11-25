'use client';

import React, { useLayoutEffect } from 'react';
import Link from 'next/link';
import { FolderGit2, FileDown, Mail } from 'lucide-react';
import { CtaGroup } from '@/components/cta-group';
import { Typewriter, typingDuration } from '@/components/motion/typewriter';
import { MaskWord } from '@/components/motion/split-words';
import { ContributionGraph } from '@/components/home/contribution-graph';
import { ProfileCard } from '@/components/home/profile-card';
import { AVAILABILITY } from '@/lib/site';

/*
    Hero como CENA.

    Antes: cada elemento tinha o próprio initial/animate do Framer e todos entravam no
    mesmo frame — e, como o Framer renderiza `initial` como `opacity:0` no servidor, a
    primeira tela ficava vazia até hidratar.

    Agora: uma sequência com começo, meio e fim, coreografada por animation-delay em CSS
    (funciona sem JS, o conteúdo está no HTML desde o primeiro byte):

       0ms   pílula de disponibilidade
     100ms   comentário digitado caractere a caractere
     250ms   título sobe palavra por palavra, de dentro de máscaras
     ~800ms  "hardware" ganha a cor de assinatura num wipe
     700ms   parágrafo · 850ms CTAs · 1000ms link de destaque
     400ms   painel profile.ts entra e se "digita" token a token
    1000ms   gráfico de contribuições do GitHub entra em onda, dia a dia

    A cena toca uma vez por sessão (ver SCENE_KEY); depois a home entra pronta.
*/

export const SCENE_KEY = 'scene-seen';
const SCENE_CLASS = 'scene-seen';
/** Duração total da cena — depois disso marcamos como vista. */
const SCENE_MS = 1800;

const COMMENT = '// Felipe Grolla · desenvolvedor de software';
const TITLE = ['Software', 'que', 'conversa', 'com', 'o'];
const WORD_START = 250;
const WORD_STAGGER = 70;

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as React.CSSProperties;

export function Hero() {
  /*
      useLayoutEffect (não useEffect): roda antes do primeiro paint no cliente. Em
      navegação interna de volta para a home, a classe entra antes de o navegador pintar
      o estado inicial das animações — sem "piscar" escondido por um frame.
      No carregamento completo, o script inline de app/layout.tsx já fez o mesmo.
  */
  useLayoutEffect(() => {
    const html = document.documentElement;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SCENE_KEY) === '1';
    } catch {}
    if (seen) {
      html.classList.add(SCENE_CLASS);
      return;
    }
    const t = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SCENE_KEY, '1');
      } catch {}
    }, SCENE_MS);
    return () => window.clearTimeout(t);
  }, []);

  const titleEnd = WORD_START + TITLE.length * WORD_STAGGER;
  const afterComment = 100 + typingDuration(COMMENT);

  return (
    <section id="hello" data-scene className="relative grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
      <div className="space-y-6">
        {AVAILABILITY && (
          <p
            className="reveal-up inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)', ...delay(0) }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--ide-accent-green)' }}
              aria-hidden="true"
            />
            {AVAILABILITY}
          </p>
        )}

        <Typewriter
          text={COMMENT}
          delay={100}
          className="font-mono text-sm"
          style={{ color: 'var(--syntax-comment)' }}
        />

        <h1
          className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.05]"
          style={{ color: 'var(--text-primary)' }}
        >
          {TITLE.map((word, i) => (
            <React.Fragment key={word}>
              <MaskWord delay={WORD_START + i * WORD_STAGGER}>{word}</MaskWord>{' '}
            </React.Fragment>
          ))}
          {/*
              "hardware": entra branco como as outras palavras e, logo depois, uma cópia na
              cor de assinatura é revelada da esquerda para a direita por cima (clip-path).
              A cópia é aria-hidden — o leitor de tela lê a palavra uma vez só.
          */}
          <MaskWord delay={titleEnd}>
            <span className="relative inline-block">
              hardware
              <span
                aria-hidden="true"
                className="wipe-in absolute inset-0"
                style={{ color: 'var(--brand-signal)', ...delay(titleEnd + 450) }}
              >
                hardware
              </span>
            </span>
            .
          </MaskWord>
        </h1>

        <p
          className="reveal-up text-lg md:text-xl leading-relaxed max-w-xl"
          style={{ color: 'var(--text-secondary)', ...delay(Math.max(700, afterComment - 200)) }}
        >
          Estudante de Engenharia de Controle e Automação na PUC-Campinas. Escrevo em C, C++,
          Python e TypeScript, do firmware em ESP32 e Arduino à interface web.
        </p>

        <div className="reveal-up" style={delay(850)}>
          <CtaGroup
            className="pt-2"
            animateOnMount={false}
            actions={[
              { href: '/projects', label: 'Ver meus projetos', icon: FolderGit2, variant: 'primary' },
              {
                href: '/api/cv',
                label: 'Baixar CV',
                icon: FileDown,
                external: true,
                ariaLabel: 'Baixar currículo em PDF (abre em nova aba)',
              },
              { href: '/contact', label: 'Falar comigo', icon: Mail },
            ]}
          />
        </div>

        {/* Atalho para o estudo de caso: leva direto à prova de trabalho. */}
        <p className="reveal-up text-sm" style={{ color: 'var(--text-secondary)', ...delay(1000) }}>
          Em destaque:{' '}
          <Link
            href="/projects/solar-points"
            className="hover:underline underline-offset-4"
            style={{ color: 'var(--ide-accent-text)' }}
          >
            Solar Points, iluminação autônoma com ESP32 e energia solar →
          </Link>
        </p>
      </div>

      <ProfileCard delay={400} />

      {/* Gráfico de contribuições do GitHub (dado real) no lugar do pulso simulado. */}
      {/* min-w-0: sem ele a grade do gráfico (largura mínima ~800px) alargaria a coluna no celular. */}
      <div className="lg:col-span-2 min-w-0">
        <ContributionGraph delay={1000} />
      </div>
    </section>
  );
}
