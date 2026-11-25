'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Github, Linkedin, Copy, FolderGit2, FileDown, Mail } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, fadeIn, staggerContainer } from '@/lib/animations/variants';
import { toast } from 'sonner';
import { CtaGroup } from '@/components/cta-group';
import { FeaturedCard } from '@/components/projects/featured-card';
import { useProjects } from '@/hooks/use-projects';
import { collectLanguages, pickFeatured } from '@/lib/projects';
import { AVAILABILITY, SOCIAL } from '@/lib/site';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
} from '@/components/ui/context-menu';

/*
    Home redesenhada.

    Antes: nome + cargo genérico e três snippets decorativos (SQL de `users u`, Python de
    `get_active_projects`, fetch genérico) que não diziam nada sobre quem escreveu o site.
    Agora a primeira tela responde "o que ele faz?" (software + hardware), o painel de
    código mostra um `profile.ts` com dados reais, e abaixo vêm a prova (números ao vivo
    da conta do GitHub) e três projetos em destaque.

    Preservado: CTAs, tokens, animações Framer Motion, menu de contexto no card de código.
*/

function TrafficLights() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex items-center gap-1.5 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-hidden="true"
    >
      <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm border border-black/10 flex items-center justify-center text-[8px] text-black/60 leading-none select-none">
        <span className={hovered ? 'opacity-100' : 'opacity-0'}>×</span>
      </div>
      <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm border border-black/10 flex items-center justify-center text-[8px] text-black/60 leading-none select-none">
        <span className={hovered ? 'opacity-100' : 'opacity-0'}>−</span>
      </div>
      <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm border border-black/10 flex items-center justify-center text-[7px] text-black/60 leading-none select-none">
        <span className={hovered ? 'opacity-100' : 'opacity-0'}>+</span>
      </div>
    </div>
  );
}

const PROFILE_TS = `const felipe = {
  role: "Desenvolvedor de Software",
  stack: ["C", "C++", "Python", "TypeScript"],
  focus: "sistemas embarcados + web",
  courses: ["CS50x", "MIT 6.002.1x"],
  contact: "${SOCIAL.email}",
};`;

const kw = { color: 'var(--syntax-keyword)' } as const;
const str = { color: 'var(--syntax-string)' } as const;
const ty = { color: 'var(--syntax-type)' } as const;
const mu = { color: 'var(--text-muted)' } as const;

const STACK = [
  { dir: 'embarcados/', items: 'C, C++, Arduino, ESP32, KiCad' },
  { dir: 'backend/', items: 'Python, Flask, Node.js, SQL' },
  { dir: 'frontend/', items: 'TypeScript, React, Next.js, Tailwind' },
];

export default function ProfilePage() {
  const prefersReduced = useReducedMotion();
  const { projects, status } = useProjects();

  const featured = useMemo(() => pickFeatured(projects), [projects]);
  const stats = useMemo(
    () => [
      { value: projects.length, label: 'repositórios públicos, ao vivo do GitHub' },
      { value: collectLanguages(projects).length, label: 'linguagens nos projetos' },
      { value: projects.filter((p) => p.homepage).length, label: 'projetos com demo online' },
      { value: 1, label: 'artigo acadêmico (Qualificação Formal de PSR)' },
    ],
    [projects],
  );

  const copyProfile = () => {
    navigator.clipboard.writeText(PROFILE_TS);
    toast.success('profile.ts copiado para a área de transferência!');
  };

  return (
    <div
      className="min-h-[calc(100vh-var(--chrome-height))] w-full transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <main className="w-full px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto w-full">
          {/* HERO */}
          <section
            id="hello"
            className="grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24"
          >
            <div className="space-y-6">
              {AVAILABILITY && (
                <motion.p
                  className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs"
                  style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                  variants={prefersReduced ? {} : fadeUp}
                  initial="hidden"
                  animate="visible"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'var(--ide-accent-green)' }}
                    aria-hidden="true"
                  />
                  {AVAILABILITY}
                </motion.p>
              )}

              <motion.p
                className="font-mono text-sm"
                style={{ color: 'var(--syntax-comment)' }}
                variants={prefersReduced ? {} : fadeUp}
                initial="hidden"
                animate="visible"
              >
                {'// Felipe Grolla · desenvolvedor de software'}
              </motion.p>

              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.05]"
                style={{ color: 'var(--text-primary)' }}
                variants={prefersReduced ? {} : fadeUp}
                initial="hidden"
                animate="visible"
              >
                Software que conversa com o{' '}
                <span style={{ color: 'var(--syntax-type)' }}>hardware</span>.
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl leading-relaxed max-w-xl"
                style={{ color: 'var(--text-secondary)' }}
                variants={prefersReduced ? {} : fadeUp}
                initial="hidden"
                animate="visible"
              >
                Escrevo em C, C++, Python e TypeScript, do firmware em ESP32 e Arduino à
                interface web.
              </motion.p>

              <CtaGroup
                className="pt-2"
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

            {/* profile.ts: código SEU, no lugar dos snippets genéricos */}
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <motion.div
                  className="glass-panel rounded-2xl overflow-hidden elevation-1 border border-white/30 dark:border-white/10 cursor-context-menu w-full max-w-xl lg:ml-auto"
                  variants={prefersReduced ? {} : fadeIn}
                  initial="hidden"
                  animate="visible"
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
                        <span style={kw}>const</span> <span style={ty}>felipe</span>{' '}
                        <span style={mu}>= {'{'}</span>
                        {'\n  '}role<span style={mu}>:</span>{' '}
                        <span style={str}>&quot;Desenvolvedor de Software&quot;</span>
                        <span style={mu}>,</span>
                        {'\n  '}stack<span style={mu}>: [</span>
                        <span style={str}>&quot;C&quot;</span>
                        <span style={mu}>, </span>
                        <span style={str}>&quot;C++&quot;</span>
                        <span style={mu}>, </span>
                        <span style={str}>&quot;Python&quot;</span>
                        <span style={mu}>, </span>
                        <span style={str}>&quot;TypeScript&quot;</span>
                        <span style={mu}>],</span>
                        {'\n  '}focus<span style={mu}>:</span>{' '}
                        <span style={str}>&quot;sistemas embarcados + web&quot;</span>
                        <span style={mu}>,</span>
                        {'\n  '}courses<span style={mu}>: [</span>
                        <span style={str}>&quot;CS50x&quot;</span>
                        <span style={mu}>, </span>
                        <span style={str}>&quot;MIT 6.002.1x&quot;</span>
                        <span style={mu}>],</span>
                        {'\n  '}contact<span style={mu}>:</span>{' '}
                        <span style={str}>&quot;{SOCIAL.email}&quot;</span>
                        <span style={mu}>,</span>
                        {'\n'}
                        <span style={mu}>{'};'}</span>
                        {'\n'}
                        <motion.span
                          aria-hidden="true"
                          className="inline-block w-[9px] h-[1.1em] align-text-bottom"
                          style={{ backgroundColor: 'var(--ide-accent)' }}
                          animate={prefersReduced ? undefined : { opacity: [1, 0, 1] }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      </code>
                    </pre>
                  </div>
                </motion.div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={copyProfile}>
                  <Copy className="w-3.5 h-3.5 mr-2 text-[var(--text-muted)]" />
                  Copiar profile.ts
                  <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </section>

          {/* FAIXA DE PROVA: números ao vivo da conta do GitHub */}
          <motion.section
            aria-label="Números do portfólio"
            className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl border overflow-hidden"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
            variants={prefersReduced ? {} : staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={prefersReduced ? {} : fadeUp}
                className={`p-6 md:p-7 flex flex-col gap-1.5 border-b lg:border-b-0 ${
                  i % 2 === 0 ? 'border-r' : ''
                } ${i < 3 ? 'lg:border-r' : 'lg:border-r-0'}`}
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <span className="text-3xl md:text-4xl font-medium tracking-tight tabular-nums">
                  {status === 'ready' || stat.label.startsWith('artigo') ? stat.value : '–'}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.section>

          {/* PROJETOS EM DESTAQUE */}
          <section className="pt-20 lg:pt-28" aria-labelledby="featured-title">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div className="space-y-2">
                <p className="font-mono text-sm" style={{ color: 'var(--syntax-comment)' }}>
                  {'// projects/featured'}
                </p>
                <h2
                  id="featured-title"
                  className="text-3xl md:text-4xl font-medium tracking-tight"
                >
                  Projetos em destaque
                </h2>
              </div>
              <Link
                href="/projects"
                className="text-sm font-medium hover:underline underline-offset-4"
                style={{ color: 'var(--ide-accent-text)' }}
              >
                Ver todos os projetos →
              </Link>
            </div>

            {status === 'loading' && (
              <div className="grid md:grid-cols-3 gap-5" aria-hidden="true">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-72 rounded-2xl border animate-pulse"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-default)',
                    }}
                  />
                ))}
              </div>
            )}

            {status === 'ready' && featured.length > 0 && (
              <motion.div
                className="grid md:grid-cols-3 gap-5"
                variants={prefersReduced ? {} : staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {featured.map((project) => (
                  <FeaturedCard key={project.id} project={project} />
                ))}
              </motion.div>
            )}

            {status === 'error' && (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Não consegui carregar os projetos agora.{' '}
                <Link
                  href="/projects"
                  className="underline underline-offset-4"
                  style={{ color: 'var(--ide-accent-text)' }}
                >
                  Tente a página de projetos
                </Link>{' '}
                ou veja direto no{' '}
                <a
                  href={SOCIAL.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                  style={{ color: 'var(--ide-accent-text)' }}
                >
                  GitHub
                </a>
                .
              </p>
            )}
          </section>

          {/* STACK */}
          <section className="pt-20 lg:pt-28" aria-labelledby="stack-title">
            <div
              className="rounded-2xl border p-6 md:p-8 space-y-5"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
            >
              <h2 id="stack-title" className="font-mono text-sm" style={{ color: 'var(--syntax-comment)' }}>
                {'// stack/'}
              </h2>
              <dl className="space-y-3 font-mono text-sm">
                {STACK.map(({ dir, items }) => (
                  <div key={dir} className="flex flex-col sm:flex-row sm:gap-6">
                    <dt className="sm:w-36 flex-shrink-0" style={{ color: 'var(--syntax-type)' }}>
                      {dir}
                    </dt>
                    <dd style={{ color: 'var(--text-secondary)' }}>{items}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* CTA FINAL */}
          <section className="py-20 lg:py-28">
            <div
              className="rounded-2xl border p-8 md:p-12 flex flex-wrap items-center justify-between gap-8"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
            >
              <div className="space-y-2 max-w-md">
                <h2 className="text-3xl font-medium tracking-tight">Vamos conversar?</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Fale comigo por mensagem, e-mail ou LinkedIn.
                </p>
              </div>
              <div className="flex flex-col items-start gap-5">
                <CtaGroup
                  animateOnMount={false}
                  actions={[
                    { href: '/contact', label: 'Enviar mensagem', icon: Mail, variant: 'primary' },
                  ]}
                />
                <div className="flex items-center gap-5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <a
                    href={SOCIAL.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors"
                  >
                    <Github className="h-4 w-4" aria-hidden="true" />
                    GitHub
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                  <a
                    href={SOCIAL.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors"
                  >
                    <Linkedin className="h-4 w-4" aria-hidden="true" />
                    LinkedIn
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                  <a
                    href={`mailto:${SOCIAL.email}`}
                    className="hover:text-[var(--text-primary)] transition-colors"
                  >
                    {SOCIAL.email}
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
