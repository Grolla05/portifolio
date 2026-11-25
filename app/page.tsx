'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, sectionReveal, revealOnScroll } from '@/lib/animations/variants';
import { Hero } from '@/components/home/hero';
import { CountUp } from '@/components/motion/count-up';
import { SignalTrace } from '@/components/motion/signal-trace';
import { CtaGroup } from '@/components/cta-group';
import { FeaturedCard } from '@/components/projects/featured-card';
import { useProjects } from '@/hooks/use-projects';
import { collectLanguages, pickFeatured } from '@/lib/projects';
import { SOCIAL } from '@/lib/site';

/*
    Home redesenhada.

    Antes: nome + cargo genérico e três snippets decorativos (SQL de `users u`, Python de
    `get_active_projects`, fetch genérico) que não diziam nada sobre quem escreveu o site.
    Agora a primeira tela responde "o que ele faz?" (software + hardware), o painel de
    código mostra um `profile.ts` com dados reais, e abaixo vêm a prova (números ao vivo
    da conta do GitHub) e três projetos em destaque.

    Preservado: CTAs, tokens, menu de contexto no card de código (agora em
    components/home/profile-card.tsx). Hero vira cena coreografada em components/home/hero.tsx;
    as seções abaixo da dobra entram ao rolar, e os números contam até o valor.
*/

/*
    Trajetória do design ("git log --oneline"). Só marcos com ano verificável no próprio
    site (components/about/education.tsx e lib/papers.ts) — nada de "[ANO]" inventado.
*/
const TIMELINE = [
  { when: '2025–', what: 'Engenharia de Controle e Automação, PUC-Campinas' },
  { when: '2025', what: 'Artigo publicado no COBENGE 2025' },
  { when: '2024', what: 'Engenharia de Computação, PUC-Campinas' },
  { when: '2021–23', what: 'Ensino Médio, Colégio Objetivo' },
];

const STACK = [
  { dir: 'embarcados/', items: 'C, C++, Arduino, ESP32, KiCad' },
  { dir: 'backend/', items: 'Python, Flask, Node.js, SQL' },
  { dir: 'frontend/', items: 'TypeScript, React, Next.js, Tailwind' },
];

export default function ProfilePage() {
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

  return (
    <div
      className="min-h-[calc(100vh-var(--chrome-height))] w-full transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <main className="w-full px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto w-full">
          {/* HERO: cena coreografada (components/home/hero.tsx). */}
          <Hero />

          {/* FAIXA DE PROVA: números ao vivo da conta do GitHub */}
          <motion.section
            aria-label="Números do portfólio"
            className="grid grid-cols-2 lg:grid-cols-4 rounded-xl border overflow-hidden"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
            variants={staggerContainer}
            {...revealOnScroll}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className={`p-6 md:p-7 flex flex-col gap-1.5 border-b lg:border-b-0 ${
                  i % 2 === 0 ? 'border-r' : ''
                } ${i < 3 ? 'lg:border-r' : 'lg:border-r-0'}`}
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <span className="text-3xl md:text-4xl font-medium tracking-tight tabular-nums">
                  {/* Contagem de 0 até o valor quando a faixa entra na tela. */}
                  <CountUp
                    value={stat.value}
                    ready={status === 'ready' || stat.label.startsWith('artigo')}
                  />
                </span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.section>

          {/* PROJETOS EM DESTAQUE */}
          {/* Mais respiro entre seções (pt-24/32): cada uma "entra em cena" sozinha. */}
          <section className="pt-24 lg:pt-32" aria-labelledby="featured-title">
            <motion.div
              className="flex flex-wrap items-end justify-between gap-4 mb-8"
              variants={sectionReveal}
              {...revealOnScroll}
            >
              <div className="space-y-2">
                <p className="font-mono text-sm" style={{ color: 'var(--syntax-comment)' }}>
                  {'// projects/featured'}
                </p>
                <h2
                  id="featured-title"
                  className="text-4xl md:text-5xl lg:text-[56px] lg:leading-[1.05] font-medium tracking-tight"
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
            </motion.div>

            {status === 'loading' && (
              <div className="grid md:grid-cols-3 gap-5" aria-hidden="true">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-72 rounded-xl border animate-pulse"
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
                variants={staggerContainer}
                {...revealOnScroll}
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

          {/* STACK + TRAJETÓRIA — lado a lado no desktop, empilhados no celular */}
          {/* Divisor: o traço de osciloscópio reaparece entre as seções, desenhando ao rolar. */}
          <SignalTrace variant="divider" className="block w-full h-10 mt-24 lg:mt-32 opacity-70" />

          <motion.section
            className="pt-10 lg:pt-12 grid lg:grid-cols-2 gap-6"
            aria-label="Stack e trajetória"
            variants={staggerContainer}
            {...revealOnScroll}
          >
            <motion.div
              variants={sectionReveal}
              className="rounded-xl border p-6 md:p-8 space-y-5"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
            >
              <h2 className="font-mono text-sm" style={{ color: 'var(--syntax-comment)' }}>
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
            </motion.div>
            <motion.div
              variants={sectionReveal}
              className="rounded-xl border p-6 md:p-8 space-y-5"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
            >
              <h2 className="font-mono text-sm" style={{ color: 'var(--syntax-comment)' }}>
                {'// git log --oneline --trajetória'}
              </h2>
              <ol className="space-y-3 text-sm">
                {TIMELINE.map(({ when, what }) => (
                  <li key={what} className="flex gap-4">
                    <span
                      className="w-16 flex-shrink-0 font-mono"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {when}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{what}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          </motion.section>

          {/* CTA FINAL */}
          <section className="py-24 lg:py-32">
            <motion.div
              variants={sectionReveal}
              {...revealOnScroll}
              className="rounded-xl border p-8 md:p-12 flex flex-wrap items-center justify-between gap-8"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
            >
              <div className="space-y-2 max-w-md">
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight">Vamos conversar?</h2>
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
            </motion.div>
          </section>
        </div>
      </main>
    </div>
  );
}
