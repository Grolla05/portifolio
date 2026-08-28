'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Github, Linkedin, Copy, ExternalLink, Code2, FolderGit2, FileDown, Mail } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, fadeIn, scaleIn, staggerContainer, appleSpring } from '@/lib/animations/variants';
import { toast } from 'sonner';
import { CtaGroup } from '@/components/cta-group';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';

function TrafficLights() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex items-center gap-1.5 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm border border-black/10 flex items-center justify-center text-[8px] font-bold text-black/60 leading-none select-none">
        <span className={hovered ? 'opacity-100' : 'opacity-0'}>×</span>
      </div>
      <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm border border-black/10 flex items-center justify-center text-[8px] font-bold text-black/60 leading-none select-none">
        <span className={hovered ? 'opacity-100' : 'opacity-0'}>−</span>
      </div>
      <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm border border-black/10 flex items-center justify-center text-[7px] font-bold text-black/60 leading-none select-none">
        <span className={hovered ? 'opacity-100' : 'opacity-0'}>+</span>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const prefersReduced = useReducedMotion();

  const copySnippet = (codeText: string, name: string) => {
    navigator.clipboard.writeText(codeText);
    toast.success(`Código de ${name} copiado para a área de transferência!`);
  };

  return (
    <TooltipProvider>
      {/*
          Descontar a altura do header (h-16 = 4rem).
          Antes era `min-h-screen` (100vh) DEPOIS do header sticky de 64px, que também ocupa
          espaço no fluxo — o body ficava 100vh + 64px e a página nascia com barra de rolagem
          mesmo cabendo tudo na tela. A section ainda descontava `3.5rem`, valor que não bate
          com o header real.
          Fica `min-h-` (e não `h-`) para que a página continue rolando em janelas baixas
          demais para o conteúdo, em vez de cortá-lo.
      */}
      <div
        className="min-h-[calc(100vh-4rem)] w-full transition-colors duration-300"
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
        <main className="w-full">
          <section
            id="hello"
            className="min-h-[calc(100vh-4rem)] flex items-center px-6 md:px-12 lg:px-24 py-20 relative overflow-hidden"
          >
            <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
              {/* Left Content */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <motion.p
                    className="text-lg font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                    variants={prefersReduced ? {} : fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                  >
                    Hello World. Eu sou
                  </motion.p>

                  <motion.h1
                    className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                    variants={prefersReduced ? {} : fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                  >
                    Felipe Grolla
                  </motion.h1>

                <motion.h2
                  className="text-2xl md:text-3xl font-normal flex items-center gap-2"
                  variants={prefersReduced ? {} : fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                >
                  <span style={{ color: 'var(--ide-accent)' }}>&gt;</span>
                  <span style={{ color: 'var(--syntax-type)' }}>Desenvolvedor de Software</span>
                </motion.h2>
              </div>

              {/*
                  CTA principal.
                  A home não tinha nenhuma chamada para ação: quem chegava lia o nome e o
                  cargo e ficava sem próximo passo — os únicos links eram os ícones sociais
                  no rodapé da tela. Estes três cobrem as três intenções reais de quem
                  visita um portfólio: ver o trabalho, levar o currículo, falar comigo.
              */}
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

              {/* Code-style comments */}
              <motion.div
                className="space-y-3 pt-8 font-mono text-sm"
                variants={prefersReduced ? {} : fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
              >
                <p style={{ color: 'var(--syntax-comment)' }}>
                  // Encontre meu perfil no GitHub:
                </p>
                <p style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--syntax-keyword)' }}>const</span>{' '}
                  <span style={{ color: 'var(--syntax-type)' }}>githubLink</span>{' '}
                  <span style={{ color: 'var(--text-primary)' }}>=</span>{' '}
                  <Link
                    href="https://github.com/Grolla05"
                    target="_blank"
                    className="hover:underline"
                    style={{ color: 'var(--syntax-string)' }}
                  >
                    &quot;https://github.com/Grolla05&quot;
                  </Link>
                </p>
              </motion.div>
            </div>

            {/* Right Content - Code Snippets with Liquid Glass & Context Menus */}
            <motion.div
              className="hidden lg:flex flex-col gap-4 relative"
              variants={prefersReduced ? {} : staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {/* Code Snippet 1 - SQL */}
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <motion.div
                    className="glass-panel rounded-2xl overflow-hidden elevation-1 border border-white/30 dark:border-white/10 transition-shadow duration-300 cursor-context-menu"
                    variants={prefersReduced ? {} : scaleIn}
                    whileHover={prefersReduced ? {} : { y: -4, scale: 1.01 }}
                    whileTap={prefersReduced ? {} : { scale: 0.98 }}
                    transition={appleSpring}
                  >
                    <div
                      className="border-b px-4 py-2.5 flex items-center justify-between border-white/15 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md"
                    >
                      <div className="flex items-center gap-2">
                        <TrafficLights />
                        <span className="text-xs font-semibold tracking-tight ml-1 text-foreground/90">
                          SQL Query
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground">query.sql</span>
                    </div>
                    <div className="p-5">
                      <pre className="font-mono text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        <code>
                          <span style={{ color: 'var(--syntax-keyword)' }}>SELECT</span>{' '}
                          <span style={{ color: 'var(--text-primary)' }}>u.id, u.username,</span>
                          {'\n  '}
                          <span style={{ color: 'var(--syntax-type)' }}>COUNT</span>
                          <span style={{ color: 'var(--text-muted)' }}>(</span>
                          <span style={{ color: 'var(--text-primary)' }}>p.id</span>
                          <span style={{ color: 'var(--text-muted)' }}>)</span>{' '}
                          <span style={{ color: 'var(--syntax-keyword)' }}>AS</span>{' '}
                          <span style={{ color: 'var(--text-primary)' }}>total</span>
                          {'\n'}
                          <span style={{ color: 'var(--syntax-keyword)' }}>FROM</span>{' '}
                          <span style={{ color: 'var(--text-primary)' }}>users u</span>
                          {'\n'}
                          <span style={{ color: 'var(--syntax-keyword)' }}>LEFT JOIN</span>{' '}
                          <span style={{ color: 'var(--text-primary)' }}>projects p</span>
                          {'\n  '}
                          <span style={{ color: 'var(--syntax-keyword)' }}>ON</span>{' '}
                          <span style={{ color: 'var(--text-primary)' }}>u.id</span>{' '}
                          <span style={{ color: 'var(--text-muted)' }}>=</span>{' '}
                          <span style={{ color: 'var(--text-primary)' }}>p.user_id</span>
                          {'\n'}
                          <span style={{ color: 'var(--syntax-keyword)' }}>GROUP BY</span>{' '}
                          <span style={{ color: 'var(--text-primary)' }}>u.id</span>
                          <span style={{ color: 'var(--text-muted)' }}>;</span>
                        </code>
                      </pre>
                    </div>
                  </motion.div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => copySnippet("SELECT u.id, u.username, COUNT(p.id) AS total FROM users u LEFT JOIN projects p ON u.id = p.user_id GROUP BY u.id;", "SQL")}>
                    <Copy className="w-3.5 h-3.5 mr-2 text-[var(--text-muted)]" />
                    Copiar Consulta SQL
                    <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => window.open("https://github.com/Grolla05", "_blank")}>
                    <ExternalLink className="w-3.5 h-3.5 mr-2 text-[var(--ide-accent)]" />
                    Ver no GitHub
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>

              {/* Code Snippet 2 - Python */}
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <motion.div
                    className="glass-panel rounded-2xl overflow-hidden elevation-1 border border-white/30 dark:border-white/10 transition-shadow duration-300 cursor-context-menu"
                    variants={prefersReduced ? {} : scaleIn}
                    whileHover={prefersReduced ? {} : { y: -4, scale: 1.01 }}
                    whileTap={prefersReduced ? {} : { scale: 0.98 }}
                    transition={appleSpring}
                  >
                    <div
                      className="border-b px-4 py-2.5 flex items-center justify-between border-white/15 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md"
                    >
                      <div className="flex items-center gap-2">
                        <TrafficLights />
                        <span className="text-xs font-semibold tracking-tight ml-1 text-foreground/90">
                          Python Script
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground">analyzer.py</span>
                    </div>
                    <div className="p-5">
                      <pre className="font-mono text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        <code>
                          <span style={{ color: 'var(--syntax-keyword)' }}>def</span>{' '}
                          <span style={{ color: 'var(--ide-accent)' }}>get_active_projects</span>
                          <span style={{ color: 'var(--text-muted)' }}>(</span>
                          <span style={{ color: 'var(--text-primary)' }}>user_id: </span>
                          <span style={{ color: 'var(--syntax-type)' }}>int</span>
                          <span style={{ color: 'var(--text-muted)' }}>) -&gt; </span>
                          <span style={{ color: 'var(--syntax-type)' }}>list[dict]</span>
                          <span style={{ color: 'var(--text-muted)' }}>:</span>
                          {'\n    '}
                          <span style={{ color: 'var(--syntax-string)' }}>&quot;&quot;&quot;Fetch projects with recent commits.&quot;&quot;&quot;</span>
                          {'\n    '}
                          <span style={{ color: 'var(--text-primary)' }}>db </span>
                          <span style={{ color: 'var(--text-muted)' }}>= </span>
                          <span style={{ color: 'var(--ide-accent)' }}>Database</span>
                          <span style={{ color: 'var(--text-muted)' }}>()</span>
                          {'\n    '}
                          <span style={{ color: 'var(--syntax-keyword)' }}>return </span>
                          <span style={{ color: 'var(--text-primary)' }}>db.query</span>
                          <span style={{ color: 'var(--text-muted)' }}>(</span>
                          <span style={{ color: 'var(--syntax-string)' }}>&quot;SELECT * FROM projects WHERE active = 1&quot;</span>
                          <span style={{ color: 'var(--text-muted)' }}>)</span>
                        </code>
                      </pre>
                    </div>
                  </motion.div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => copySnippet("def get_active_projects(user_id: int) -> list[dict]:\n    \"\"\"Fetch projects with recent commits.\"\"\"\n    db = Database()\n    return db.query(\"SELECT * FROM projects WHERE active = 1\")", "Python")}>
                    <Copy className="w-3.5 h-3.5 mr-2 text-[var(--text-muted)]" />
                    Copiar Código Python
                    <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => window.open("https://github.com/Grolla05", "_blank")}>
                    <ExternalLink className="w-3.5 h-3.5 mr-2 text-[var(--ide-accent)]" />
                    Ver no GitHub
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>

              {/* Code Snippet 3 - JavaScript */}
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <motion.div
                    className="glass-panel rounded-2xl overflow-hidden elevation-1 border border-white/30 dark:border-white/10 transition-shadow duration-300 cursor-context-menu"
                    variants={prefersReduced ? {} : scaleIn}
                    whileHover={prefersReduced ? {} : { y: -4, scale: 1.01 }}
                    whileTap={prefersReduced ? {} : { scale: 0.98 }}
                    transition={appleSpring}
                  >
                    <div
                      className="border-b px-4 py-2.5 flex items-center justify-between border-white/15 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md"
                    >
                      <div className="flex items-center gap-2">
                        <TrafficLights />
                        <span className="text-xs font-semibold tracking-tight ml-1 text-foreground/90">
                          JavaScript / Node.js
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground">server.js</span>
                    </div>
                    <div className="p-5">
                      <pre className="font-mono text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        <code>
                          <span style={{ color: 'var(--syntax-keyword)' }}>async function</span>{' '}
                          <span style={{ color: 'var(--ide-accent)' }}>loadUserData</span>
                          <span style={{ color: 'var(--text-muted)' }}>(</span>
                          <span style={{ color: 'var(--text-primary)' }}>userId</span>
                          <span style={{ color: 'var(--text-muted)' }}>) {'{'}</span>
                          {'\n  '}
                          <span style={{ color: 'var(--syntax-keyword)' }}>try {'{'}</span>
                          {'\n    '}
                          <span style={{ color: 'var(--syntax-keyword)' }}>const</span>{' '}
                          <span style={{ color: 'var(--text-primary)' }}>response</span>{' '}
                          <span style={{ color: 'var(--text-muted)' }}>=</span>{' '}
                          <span style={{ color: 'var(--syntax-keyword)' }}>await</span>{' '}
                          <span style={{ color: 'var(--syntax-type)' }}>fetch</span>
                          <span style={{ color: 'var(--text-muted)' }}>(</span>
                          <span style={{ color: 'var(--syntax-string)' }}>`/api/users/$&#123;userId&#125;/projects`</span>
                          <span style={{ color: 'var(--text-muted)' }}>);</span>
                          {'\n    '}
                          <span style={{ color: 'var(--syntax-keyword)' }}>return await</span>{' '}
                          <span style={{ color: 'var(--text-primary)' }}>response</span>
                          <span style={{ color: 'var(--text-muted)' }}>.</span>
                          <span style={{ color: 'var(--syntax-type)' }}>json</span>
                          <span style={{ color: 'var(--text-muted)' }}>{'();'}</span>
                          {'\n  '}
                          <span style={{ color: 'var(--text-muted)' }}>{'}'}</span>{' '}
                          <span style={{ color: 'var(--syntax-keyword)' }}>catch</span>{' '}
                          <span style={{ color: 'var(--text-muted)' }}>(</span>
                          <span style={{ color: 'var(--ide-accent-purple)' }}>error</span>
                          <span style={{ color: 'var(--text-muted)' }}>) {'{'}</span>
                          {'\n    '}
                          <span style={{ color: 'var(--text-primary)' }}>console</span>
                          <span style={{ color: 'var(--text-muted)' }}>.</span>
                          <span style={{ color: 'var(--syntax-type)' }}>error</span>
                          <span style={{ color: 'var(--text-muted)' }}>(</span>
                          <span style={{ color: 'var(--syntax-string)' }}>&apos;Failed:&apos;</span>
                          <span style={{ color: 'var(--text-muted)' }}>,</span>{' '}
                          <span style={{ color: 'var(--ide-accent-purple)' }}>error</span>
                          <span style={{ color: 'var(--text-muted)' }}>{'};'}</span>
                          {'\n'}
                          <span style={{ color: 'var(--text-muted)' }}>{'}'}</span>
                        </code>
                      </pre>
                    </div>
                  </motion.div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => copySnippet("async function loadUserData(userId) {\n  try {\n    const response = await fetch(`/api/users/${userId}/projects`);\n    return await response.json();\n  } catch (error) {\n    console.error('Failed:', error);\n  };\n}", "JavaScript")}>
                    <Copy className="w-3.5 h-3.5 mr-2 text-[var(--text-muted)]" />
                    Copiar Código JavaScript
                    <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => window.open("https://github.com/Grolla05", "_blank")}>
                    <ExternalLink className="w-3.5 h-3.5 mr-2 text-[var(--ide-accent)]" />
                    Ver no GitHub
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </motion.div>
          </div>

          {/* Bottom Social Links */}
          <motion.div
            className="absolute bottom-8 left-6 md:left-12 lg:left-24 flex flex-col gap-4"
            variants={prefersReduced ? {} : fadeIn}
            initial="hidden"
            animate="visible"
          >
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>find me in:</p>
            <div className="flex gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={prefersReduced ? {} : { scale: 1.15, y: -2 }} whileTap={prefersReduced ? {} : { scale: 0.95 }}>
                    <Link
                      href="https://github.com/Grolla05"
                      target="_blank"
                      aria-label="Perfil no GitHub"
                      className="transition-colors duration-200"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <Github className="h-5 w-5 hover:text-[var(--text-primary)]" />
                    </Link>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  GitHub @Grolla05
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={prefersReduced ? {} : { scale: 1.15, y: -2 }} whileTap={prefersReduced ? {} : { scale: 0.95 }}>
                    <Link
                      href="https://www.linkedin.com/in/felipegrolla/"
                      target="_blank"
                      aria-label="Perfil no LinkedIn"
                      className="transition-colors duration-200"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <Linkedin className="h-5 w-5 hover:text-[#0A66C2]" />
                    </Link>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  LinkedIn /in/felipegrolla
                </TooltipContent>
              </Tooltip>
            </div>
          </motion.div>

          {/* Bottom Right username */}
          <motion.div
            className="absolute bottom-8 right-6 md:right-12 lg:right-24 flex items-center gap-2"
            variants={prefersReduced ? {} : fadeIn}
            initial="hidden"
            animate="visible"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="https://github.com/Grolla05"
                  target="_blank"
                  className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <span>@Grolla05</span>
                  <Github className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                Acessar github.com/Grolla05
              </TooltipContent>
            </Tooltip>
          </motion.div>
        </section>
      </main>
    </div>
  </TooltipProvider>
  );
}
