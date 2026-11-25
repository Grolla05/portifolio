"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  ChevronDown,
  Download,
  ExternalLink,
  FileDown,
  FileText,
  FolderGit2,
  Gamepad2,
  Github,
  Linkedin,
  Mail,
  Music,
  Trophy,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { appleSpring, fadeUp, slideInLeft, staggerContainer } from "@/lib/animations/variants";
import Bio from "@/components/about/bio";
import { CtaGroup } from "@/components/cta-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { COURSES, EDUCATION, HOBBIES, QUICK_FACTS, type Hobby } from "@/lib/about";
import { type Paper, paperCitation, paperUrl, sortPapers } from "@/lib/papers";
import { SOCIAL } from "@/lib/site";

/*
    Redesign de /about (canvas "Avaliação e Redesign do Portfólio", artboards 5 e 5b).

    Antes: explorer de arquivos + abas, e cada arquivo (bio, hobbies, formação, artigo)
    abria numa aba própria. Para um recrutador isso escondia quase tudo: a página abria
    só na bio e a formação ficava duas pastas fechadas abaixo.

    Agora: uma página única, em rolagem, e a estética de IDE vira NAVEGAÇÃO em vez de
    esconderijo — o explorer à esquerda e a barra de abas no topo são o sumário. Clicar
    num arquivo rola até a seção; a aba ativa acompanha a rolagem (scrollspy).
    No celular o explorer vira uma fileira de chips fixa abaixo do header.

    Preservado: bio sincronizada do README do GitHub (com Código/Prévia), artigos varridos
    de public/papers com o visualizador de PDF próprio, CTAs de projetos/CV/contato.
*/

/*
    O pdf.js toca DOMMatrix/canvas no escopo do módulo — import dinâmico sem SSR, e o
    bundle (~300kb gz) só desce quando alguém abre um artigo.
*/
const PdfViewer = dynamic(() => import("./pdf-viewer").then((m) => m.PdfViewer), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center">
      <span className="font-mono text-xs" style={{ color: "var(--syntax-comment)" }}>
        {"// carregando visualizador..."}
      </span>
    </div>
  ),
});

interface Section {
  id: string;
  folder: string;
  file: string;
  /** Token de cor da pasta — o mesmo do explorer antigo, para manter a identidade. */
  color: string;
}

const HOBBY_ICONS: Record<Hobby["id"], React.ElementType> = {
  games: Gamepad2,
  music: Music,
  sports: Trophy,
};

interface AboutViewProps {
  /*
      Artigos varridos de public/papers/ pelo Server Component em app/about/page.tsx.
      Chegam por prop porque a varredura usa `fs`, indisponível no cliente.
  */
  papers: Paper[];
}

/** Título de seção no padrão do design: comentário de caminho + h2. */
function SectionTitle({ path, title, id }: { path: string; title: string; id: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[13px]" style={{ color: "var(--syntax-comment)" }}>
        {`// ${path}`}
      </span>
      <h2 id={id} className="text-[26px] md:text-[32px] font-medium tracking-tight">
        {title}
      </h2>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <li
      className="rounded-full px-2.5 py-0.5 font-mono text-xs"
      style={{ backgroundColor: "var(--chip-bg)", color: "var(--text-secondary)" }}
    >
      {children}
    </li>
  );
}

export default function AboutView({ papers }: AboutViewProps) {
  const prefersReduced = useReducedMotion();
  const sortedPapers = useMemo(() => sortPapers(papers), [papers]);
  const [openPaper, setOpenPaper] = useState<Paper | null>(null);

  const sections: Section[] = useMemo(
    () => [
      { id: "bio", folder: "bio", file: "my-bio.md", color: "var(--folder-bio)" },
      { id: "formacao", folder: "education", file: "Education.tsx", color: "var(--folder-education)" },
      // Sem PDF em public/papers, a seção e o arquivo somem — nada de pasta vazia.
      ...(sortedPapers.length > 0
        ? [{ id: "pesquisa", folder: "research", file: sortedPapers[0].file, color: "var(--folder-research)" }]
        : []),
      { id: "hobbies", folder: "hobbies", file: "hobbies.ts", color: "var(--folder-hobbies)" },
    ],
    [sortedPapers],
  );

  const [active, setActive] = useState(sections[0].id);

  /*
      Scrollspy: a seção ativa é a ÚLTIMA cujo topo já passou da linha de leitura (40%
      da janela). Com IntersectionObserver a primeira versão ficava presa na seção
      anterior enquanto duas cruzavam a faixa ao mesmo tempo; medir no scroll (agrupado
      por requestAnimationFrame) é determinístico. No fim da página, a última seção
      ganha mesmo que seu topo não chegue à linha — senão "hobbies" nunca acenderia.
  */
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current = sections[0].id;
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      if (atBottom) current = sections[sections.length - 1].id;
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sections]);

  const goTo = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    setActive(id);
    // `?.`: o jsdom dos testes não implementa scrollIntoView.
    el.scrollIntoView?.({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  const activeSection = sections.find((s) => s.id === active) ?? sections[0];
  const motionProps = (variants: typeof fadeUp) =>
    prefersReduced
      ? {}
      : { variants, initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.15 } };

  return (
    <div
      className="w-full flex flex-col md:flex-row transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      {/* EXPLORER — desktop. Fixo na lateral enquanto o conteúdo rola. */}
      <motion.aside
        className="hidden md:flex flex-col gap-5 w-64 flex-shrink-0 sticky top-16 self-start h-[calc(100vh-var(--chrome-height))] overflow-y-auto border-r px-3 pt-5 pb-8"
        style={{ backgroundColor: "var(--surface-sunken)", borderColor: "var(--border-subtle)" }}
        variants={slideInLeft}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-between px-2">
          <span className="text-[11px] font-medium tracking-[0.08em]" style={{ color: "var(--text-muted)" }}>
            EXPLORER
          </span>
          <span className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
            about/
          </span>
        </div>

        <nav aria-label="Seções da página">
          <motion.ul
            className="flex flex-col gap-0.5 font-mono text-[13px]"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {sections.map((section) => {
              const isActive = section.id === active;
              return (
                <motion.li key={section.id} variants={fadeUp}>
                  <div
                    className="flex items-center gap-2 min-h-8 px-2"
                    style={{ color: "var(--text-secondary)" }}
                    aria-hidden="true"
                  >
                    <ChevronDown className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: section.color }} />
                    {section.folder}
                  </div>
                  <a
                    href={`#${section.id}`}
                    onClick={goTo(section.id)}
                    aria-current={isActive ? "location" : undefined}
                    className="relative flex items-center min-h-8 pl-9 pr-2 rounded-md truncate transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ide-accent)]"
                    style={{ color: isActive ? "var(--text-primary)" : "var(--text-secondary)" }}
                    title={section.file}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="aboutExplorerActive"
                        className="absolute inset-0 rounded-md"
                        style={{ backgroundColor: "var(--accent-soft)" }}
                        transition={prefersReduced ? { duration: 0 } : appleSpring}
                      >
                        {/* Barra de assinatura (--brand-signal): marca o "arquivo aberto" como a
                            gutter de um editor, e desliza junto com o fundo via layoutId. */}
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full"
                          style={{ backgroundColor: "var(--brand-signal)" }}
                        />
                      </motion.span>
                    )}
                    <span className="relative truncate">{section.file}</span>
                  </a>
                </motion.li>
              );
            })}
          </motion.ul>
        </nav>

        <div className="h-px mx-2" style={{ backgroundColor: "var(--border-subtle)" }} />

        <div className="flex flex-col gap-0.5 text-[13px]">
          <span className="px-2 pb-1.5 text-[11px] font-medium tracking-[0.08em]" style={{ color: "var(--text-muted)" }}>
            CONTATOS
          </span>
          {[
            { href: `mailto:${SOCIAL.email}`, label: SOCIAL.email, icon: Mail, external: false },
            { href: SOCIAL.github, label: "github.com/Grolla05", icon: Github, external: true },
            { href: SOCIAL.linkedin, label: "LinkedIn", icon: Linkedin, external: true },
          ].map(({ href, label, icon: Icon, external }) => (
            <a
              key={href}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex items-center gap-2.5 min-h-9 px-2 rounded-md truncate transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ color: "var(--text-secondary)" }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{label}</span>
              {external && <span className="sr-only"> (abre em nova aba)</span>}
            </a>
          ))}
        </div>
      </motion.aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/*
            Barra de abas (desktop) / chips (celular). Fica presa logo abaixo do header.
            É a mesma navegação do explorer: no celular é a ÚNICA, por isso a versão
            em chips tem alvos de 36px e rola na horizontal.
        */}
        <div
          className="sticky top-16 z-30 border-b"
          style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-subtle)" }}
        >
          <nav aria-label="Arquivos abertos" className="hidden md:flex font-mono text-[13px] overflow-x-auto">
            {sections.map((section) => {
              const isActive = section.id === active;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={goTo(section.id)}
                  aria-current={isActive ? "location" : undefined}
                  className="relative flex items-center px-4 h-11 border-r whitespace-nowrap max-w-[260px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ide-accent)]"
                  style={{
                    borderColor: "var(--border-subtle)",
                    color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                    backgroundColor: isActive ? "var(--bg-primary)" : "transparent",
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeTab"
                      className="absolute left-0 right-0 top-0 h-[2px]"
                      style={{ backgroundColor: "var(--ide-accent)" }}
                      transition={prefersReduced ? { duration: 0 } : appleSpring}
                      aria-hidden="true"
                    />
                  )}
                  <span className="truncate">{section.file}</span>
                </a>
              );
            })}
          </nav>

          <nav
            aria-label="Seções da página"
            className="md:hidden flex gap-2 px-4 py-3 overflow-x-auto font-mono text-xs no-scrollbar"
            style={{ backgroundColor: "var(--surface-sunken)" }}
          >
            {sections.map((section) => {
              const isActive = section.id === active;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={goTo(section.id)}
                  aria-current={isActive ? "location" : undefined}
                  className="flex-shrink-0 flex items-center gap-1.5 min-h-9 px-3 rounded-full border"
                  style={{
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                    backgroundColor: isActive ? "var(--accent-soft)" : "transparent",
                    borderColor: isActive ? "transparent" : "var(--border-default)",
                  }}
                >
                  <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: section.color }} aria-hidden="true" />
                  {section.folder}
                </a>
              );
            })}
          </nav>

          <div
            className="hidden md:block px-8 py-2 border-t font-mono text-xs"
            style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
          >
            about › {activeSection.folder} › {activeSection.file}
          </div>
        </div>

        <main className="w-full max-w-[1040px] px-4 sm:px-8 lg:px-12 pt-8 md:pt-14 pb-28 flex flex-col gap-12 md:gap-[72px]">
          {/* INTRO */}
          <motion.section
            id="bio"
            aria-labelledby="about-title"
            className="scroll-mt-40 flex flex-col sm:flex-row gap-6 sm:gap-10 items-start"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/*
                Monograma no lugar da foto: o repositório não tem retrato do Felipe, e uma
                foto de banco de imagens seria pior que nenhuma. Trocar por <img> quando
                houver um arquivo em /public.
            */}
            <motion.div
              variants={fadeUp}
              className="w-24 h-24 sm:w-[152px] sm:h-[152px] flex-shrink-0 rounded-xl border flex items-center justify-center font-mono text-3xl sm:text-5xl"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                borderColor: "var(--border-default)",
                color: "var(--syntax-type)",
              }}
              aria-hidden="true"
            >
              FG
            </motion.div>
            <div className="flex flex-col gap-4 sm:gap-5 min-w-0">
              <motion.p variants={fadeUp} className="font-mono text-[13px]" style={{ color: "var(--syntax-comment)" }}>
                # about/bio
              </motion.p>
              <motion.h1
                id="about-title"
                variants={fadeUp}
                className="text-4xl md:text-[52px] leading-[1.06] font-medium tracking-tight"
              >
                Oi, eu sou o Felipe.
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-base md:text-[19px] leading-relaxed max-w-[620px]"
                style={{ color: "var(--text-secondary)" }}
              >
                Estudante de Engenharia de Controle e Automação na PUC-Campinas. Gosto do
                ponto em que o código encontra o circuito: firmware em C/C++, ferramentas em
                Python e interfaces em TypeScript.
              </motion.p>
            </div>
          </motion.section>

          {/* BIO (README) + FATOS RÁPIDOS */}
          <motion.section className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-5" aria-label="Biografia" {...motionProps(fadeUp)}>
            <Bio />
            <aside
              className="rounded-xl border p-5 sm:p-7 flex flex-col gap-5 font-mono text-sm self-start"
              style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-default)" }}
              aria-label="Resumo rápido"
            >
              <span className="text-[13px]" style={{ color: "var(--syntax-comment)" }}>
                {"// felipe.json"}
              </span>
              <dl className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                {[...QUICK_FACTS, { key: "publicações", value: `${papers.length} artigo${papers.length === 1 ? "" : "s"}` }].map(
                  ({ key, value }) => (
                    <div key={key} className="flex flex-col gap-1">
                      <dt className="text-xs" style={{ color: "var(--syntax-type)" }}>
                        {key}
                      </dt>
                      <dd style={{ color: "var(--text-secondary)" }}>{value}</dd>
                    </div>
                  ),
                )}
              </dl>
              <CtaGroup
                animateOnMount={false}
                className="[&>div]:w-full [&_a]:w-full"
                actions={[
                  {
                    href: "/api/cv",
                    label: "Baixar CV (PDF)",
                    icon: FileDown,
                    variant: "primary",
                    external: true,
                    ariaLabel: "Baixar currículo em PDF (abre em nova aba)",
                  },
                ]}
              />
            </aside>
          </motion.section>

          {/* FORMAÇÃO */}
          <motion.section id="formacao" aria-labelledby="formacao-title" className="scroll-mt-40 flex flex-col gap-7" {...motionProps(fadeUp)}>
            <SectionTitle path="about/education" title="Formação" id="formacao-title" />
            <ol className="ml-1.5 border-l flex flex-col" style={{ borderColor: "var(--border-default)" }}>
              {EDUCATION.map((item, i) => (
                <li
                  key={item.title}
                  className={`relative pl-6 sm:pl-8 flex flex-col gap-2 ${i < EDUCATION.length - 1 ? "pb-8" : ""}`}
                >
                  <span
                    className="absolute -left-[7px] top-1.5 w-[13px] h-[13px] rounded-full border-2"
                    style={{ backgroundColor: "var(--bg-primary)", borderColor: item.accent }}
                    aria-hidden="true"
                  />
                  <span
                    className="font-mono text-xs"
                    style={{ color: item.current ? item.accent : "var(--text-muted)" }}
                  >
                    {item.period}
                  </span>
                  <h3 className="text-lg md:text-xl font-medium">{item.title}</h3>
                  <span className="text-sm md:text-[15px]" style={{ color: "var(--text-secondary)" }}>
                    {[item.level !== item.title ? item.level : null, item.institution, item.note]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                  {item.tags.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5 pt-1" aria-label="Áreas">
                      {item.tags.map((tag) => (
                        <Pill key={tag}>{tag}</Pill>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
            <ul className="grid sm:grid-cols-2 gap-3" aria-label="Cursos livres">
              {COURSES.map((course) => (
                <li
                  key={course.name}
                  className="flex items-center gap-4 px-5 py-4 rounded-xl border"
                  style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-default)" }}
                >
                  <span className="font-mono text-xs w-12 flex-shrink-0" style={{ color: "var(--syntax-type)" }}>
                    curso
                  </span>
                  <span className="text-sm md:text-[15px]" style={{ color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--text-primary)" }}>{course.name}</span> · {course.detail}
                  </span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* PESQUISA */}
          {sortedPapers.length > 0 && (
            <motion.section id="pesquisa" aria-labelledby="pesquisa-title" className="scroll-mt-40 flex flex-col gap-7" {...motionProps(fadeUp)}>
              <SectionTitle path="about/research" title="Pesquisa e extensão" id="pesquisa-title" />
              {sortedPapers.map((paper) => {
                const citation = paperCitation(paper);
                return (
                  <article
                    key={paper.id}
                    className="flex flex-col md:flex-row rounded-xl border overflow-hidden"
                    style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-default)" }}
                  >
                    <div
                      className="hidden md:flex w-[200px] flex-shrink-0 flex-col items-center justify-center gap-3 border-r"
                      style={{ backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border-subtle)" }}
                      aria-hidden="true"
                    >
                      <FileText className="w-9 h-9" style={{ color: "var(--ide-accent-purple)" }} strokeWidth={1.4} />
                      <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>PDF</span>
                    </div>
                    <div className="flex-1 p-5 sm:p-8 flex flex-col gap-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs"
                          style={{ backgroundColor: "var(--chip-bg)", color: "var(--accent-purple-text)" }}
                        >
                          Artigo{paper.year ? ` · ${paper.year}` : ""}
                        </span>
                        {paper.venue && (
                          <span className="text-xs sm:text-[13px]" style={{ color: "var(--text-secondary)" }}>
                            {paper.venue}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg md:text-[22px] leading-snug font-medium tracking-tight">{paper.title}</h3>
                      {paper.abstract && (
                        <p className="text-sm md:text-[15px] leading-relaxed line-clamp-4" style={{ color: "var(--text-secondary)" }}>
                          {paper.abstract}
                        </p>
                      )}
                      {paper.authors && (
                        <p className="text-xs sm:text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                          {paper.authors.map((author, i) => (
                            <React.Fragment key={author}>
                              {i > 0 && ", "}
                              {/* Destaca o próprio nome na lista de coautores. */}
                              <span style={author.includes("Grolla") ? { color: "var(--text-primary)" } : undefined}>
                                {author}
                              </span>
                            </React.Fragment>
                          ))}
                        </p>
                      )}
                      <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => setOpenPaper(paper)}
                          className="inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-[10px] text-sm font-medium bg-[var(--cta-bg)] text-[var(--cta-fg)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ide-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]"
                        >
                          <FileText className="w-4 h-4" aria-hidden="true" />
                          Ler o artigo
                        </button>
                        {paper.doi && (
                          <a
                            href={paper.doi}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-[10px] border text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                            style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}
                          >
                            <ExternalLink className="w-4 h-4" aria-hidden="true" style={{ color: "var(--text-secondary)" }} />
                            DOI
                            <span className="sr-only"> (abre em nova aba)</span>
                          </a>
                        )}
                        <a
                          href={paperUrl(paper)}
                          download
                          className="inline-flex items-center justify-center gap-2 min-h-12 px-4 rounded-[10px] text-sm transition-opacity hover:opacity-75"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <Download className="w-4 h-4" aria-hidden="true" />
                          Baixar PDF
                        </a>
                      </div>
                      {citation && <span className="sr-only">Publicado em {citation}.</span>}
                    </div>
                  </article>
                );
              })}
            </motion.section>
          )}

          {/* HOBBIES */}
          <motion.section id="hobbies" aria-labelledby="hobbies-title" className="scroll-mt-40 flex flex-col gap-7" {...motionProps(fadeUp)}>
            <SectionTitle path="about/hobbies" title="Fora do editor" id="hobbies-title" />
            <motion.ul
              className="grid sm:grid-cols-3 gap-3 sm:gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {HOBBIES.map((hobby) => {
                const Icon = HOBBY_ICONS[hobby.id];
                return (
                  <motion.li
                    key={hobby.id}
                    variants={fadeUp}
                    whileHover={{ y: -2 }}
                    className="flex sm:flex-col gap-4 sm:gap-3 p-4 sm:p-6 rounded-xl border"
                    style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-default)" }}
                  >
                    <Icon className="w-[22px] h-[22px] flex-shrink-0" style={{ color: "var(--ide-accent-green)" }} aria-hidden="true" />
                    <div className="flex flex-col gap-2 sm:gap-3 flex-1">
                      <h3 className="text-base sm:text-[17px] font-medium">{hobby.name}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {hobby.description}
                      </p>
                      <ul className="flex flex-wrap gap-1.5 sm:mt-auto" aria-label={`Exemplos de ${hobby.name}`}>
                        {hobby.tags.map((tag) => (
                          <Pill key={tag}>{tag}</Pill>
                        ))}
                      </ul>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.section>

          {/* CTA */}
          <motion.section
            className="p-6 sm:p-10 rounded-xl border flex flex-col md:flex-row md:items-center md:justify-between gap-6"
            style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-default)" }}
            aria-label="Próximos passos"
            {...motionProps(fadeUp)}
          >
            <div className="flex flex-col gap-1.5">
              <h2 className="text-2xl md:text-[26px] font-medium tracking-tight">Quer ver o que eu construo?</h2>
              <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>
                Estudos de caso com problema, decisão e resultado.
              </p>
            </div>
            <CtaGroup
              animateOnMount={false}
              className="[&>div]:w-full sm:[&>div]:w-auto [&_a]:w-full"
              actions={[
                { href: "/projects", label: "Ver projetos", icon: FolderGit2, variant: "primary" },
                { href: "/contact", label: "Falar comigo", icon: Mail },
              ]}
            />
          </motion.section>

        </main>
      </div>

      {/* Visualizador de PDF em diálogo (Radix: focus trap, Esc, aria-modal). */}
      <Dialog open={openPaper !== null} onOpenChange={(open) => !open && setOpenPaper(null)}>
        <DialogContent
          className="max-w-5xl w-[calc(100vw-2rem)] h-[85vh] p-0 gap-0 flex flex-col overflow-hidden rounded-xl"
          style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-default)" }}
        >
          <div className="px-5 py-3 pr-12 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <DialogTitle className="text-sm font-medium truncate">{openPaper?.title}</DialogTitle>
            <DialogDescription className="font-mono text-xs truncate" style={{ color: "var(--text-muted)" }}>
              {openPaper ? `about/research/${openPaper.file}` : ""}
            </DialogDescription>
          </div>
          {openPaper && <PdfViewer url={paperUrl(openPaper)} title={openPaper.title} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
