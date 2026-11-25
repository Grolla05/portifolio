"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Copy,
  Eye,
  Star,
  FileText,
  AlertCircle,
  RefreshCw,
  Globe,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer, appleSpring } from "@/lib/animations/variants";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { ProjectModal } from "@/components/projects/project-modal";
import { RepoModal } from "@/components/projects/repo-modal";
import { ProjectCover } from "@/components/projects/project-cover";
import { CtaGroup } from "@/components/cta-group";
import { type CaseStudy, getCaseStudy, getCuratedSummary } from "@/lib/case-studies";
import { FeaturedCard } from "@/components/projects/featured-card";
import { useProjects } from "@/hooks/use-projects";
import {
  type RepoProject,
  collectLanguages,
  describeProject,
  displayTopics,
  pickFeatured,
  formatRelativeDate,
  getLanguageColor,
  getLanguageIcon,
  prefersReadmeView,
} from "@/lib/projects";
import { SOCIAL } from "@/lib/site";

/*
    Redesign de /projects (canvas "Avaliação e Redesign do Portfólio", artboards 3 e 3b).

    Antes: split view com barra lateral de checkboxes de linguagem e ordenação, e uma
    grade de cards de mesmo peso. O filtro escondido na lateral era o primeiro controle
    que a pessoa via, e a lateral roubava ~20% da largura de uma página que é de leitura.

    Agora: cabeçalho → um estudo de caso em destaque, grande, com problema/solução/decisão
    → demais destaques → "Todos os repositórios" com filtro em chips e grade compacta.
    No celular os chips rolam na horizontal e a grade vira coluna única.

    Preservado: dados ao vivo de /api/projects, Quick Look (clique, Espaço, Enter),
    menu de contexto, modais README/árvore, estudos de caso, estados de carga e erro.
*/

/** Quantos repositórios a grade mostra antes de "Carregar mais". */
const PAGE_SIZE = 9;

/** Linguagens exibidas como chip; as demais continuam pesquisáveis pelo ⌘K. */
const MAX_LANGUAGE_CHIPS = 6;

type SortOrder = "newest" | "oldest";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="flex-shrink-0 inline-flex items-center gap-2 min-h-9 px-3.5 rounded-full border text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ide-accent)]"
      style={{
        backgroundColor: active ? "var(--cta-bg)" : "transparent",
        borderColor: active ? "var(--cta-bg)" : "var(--border-default)",
        color: active ? "var(--cta-fg)" : "var(--text-secondary)",
        fontWeight: active ? 500 : 400,
      }}
    >
      {children}
    </button>
  );
}

/** Estudo de caso em destaque: o "card grande" do topo do design. */
function CaseStudyHero({
  project,
  caseStudy,
}: {
  project: RepoProject;
  caseStudy: CaseStudy;
}) {
  const prefersReduced = useReducedMotion();
  const rows = [
    { label: "PROBLEMA", text: caseStudy.problem },
    { label: "SOLUÇÃO", text: caseStudy.solution },
    caseStudy.decisions[0] && { label: "DECISÃO", text: caseStudy.decisions[0].title },
  ].filter(Boolean) as { label: string; text: string }[];

  return (
    <motion.article
      className="flex flex-col lg:flex-row rounded-xl border overflow-hidden"
      style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-default)" }}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      aria-labelledby="hero-case-title"
      data-vt-card
    >
      <div
        data-vt="cover"
        className="lg:w-1/2 border-b lg:border-b-0 lg:border-r"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <ProjectCover
          repo={project.name}
          title={project.title}
          primaryLanguage={project.primaryLanguage}
          className="h-full lg:aspect-auto lg:min-h-[360px]"
        />
      </div>

      <div className="lg:w-1/2 p-5 sm:p-8 lg:p-10 flex flex-col justify-center gap-5">
        <span
          className="self-start rounded-full px-2.5 py-0.5 text-xs"
          style={{ backgroundColor: "var(--chip-bg)", color: "var(--syntax-type)" }}
        >
          Estudo de caso
        </span>
        <h2
          id="hero-case-title"
          data-vt="title"
          className="text-2xl md:text-3xl font-medium tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {caseStudy.title}
        </h2>

        <dl className="flex flex-col gap-3.5 text-[15px] leading-relaxed">
          {rows.map(({ label, text }) => (
            <div key={label} className="flex flex-col sm:flex-row gap-1 sm:gap-4">
              <dt
                className="sm:w-24 flex-shrink-0 font-mono text-xs sm:pt-1"
                style={{ color: "var(--text-muted)" }}
              >
                {label}
              </dt>
              <dd className="line-clamp-3" style={{ color: "var(--text-secondary)" }}>
                {text}
              </dd>
            </div>
          ))}
        </dl>

        <ul className="flex flex-wrap gap-1.5" aria-label="Tecnologias">
          {caseStudy.stack.slice(0, 5).map((tech) => (
            <li
              key={tech}
              className="rounded-full px-2.5 py-0.5 font-mono text-xs"
              style={{ backgroundColor: "var(--chip-bg)", color: "var(--text-secondary)" }}
            >
              {tech}
            </li>
          ))}
        </ul>

        <CtaGroup
          animateOnMount={false}
          className="pt-1 [&>div]:w-full sm:[&>div]:w-auto [&_a]:w-full sm:[&_a]:w-auto"
          actions={[
            {
              href: `/projects/${caseStudy.slug}`,
              label: "Ler estudo completo",
              icon: FileText,
              variant: "primary",
            },
            { href: project.link, label: "Código no GitHub", icon: ExternalLink, external: true },
          ]}
        />
      </div>
    </motion.article>
  );
}

export default function ProjectsPage() {
  const { projects, status, error, retry } = useProjects();

  const [language, setLanguage] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selectedProject, setSelectedProject] = useState<RepoProject | null>(null);
  const prefersReduced = useReducedMotion();

  const languages = useMemo(() => collectLanguages(projects), [projects]);
  const featured = useMemo(() => pickFeatured(projects), [projects]);

  /* O primeiro destaque COM estudo de caso vira o card grande; os outros, cards normais. */
  const hero = useMemo(() => {
    for (const project of featured) {
      const caseStudy = getCaseStudy(project.name);
      if (caseStudy) return { project, caseStudy };
    }
    return null;
  }, [featured]);
  const otherFeatured = useMemo(
    () => featured.filter((p) => p.id !== hero?.project.id),
    [featured, hero],
  );

  /*
      Os modais casam tag com ícone por nome. Só entram aqui as linguagens que têm logo
      em public/language_icons — as demais renderizariam <Image> com caminho inexistente.
  */
  const technologiesForModals = useMemo(
    () =>
      languages
        .map((name) => ({ name, icon: getLanguageIcon(name) }))
        .filter((tech): tech is { name: string; icon: string } => tech.icon !== null),
    [languages],
  );

  /* Os modais exigem `description: string`; o fallback é resolvido num ponto só. */
  const modalProject = useMemo(
    () =>
      selectedProject
        ? {
            ...selectedProject,
            description:
              getCuratedSummary(selectedProject.name) ?? describeProject(selectedProject),
          }
        : null,
    [selectedProject],
  );

  // Escape fecha o Quick Look aberto
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedProject) setSelectedProject(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);

  const chooseLanguage = (next: string | null) => {
    setLanguage(next);
    setVisible(PAGE_SIZE);
  };

  const filteredProjects = useMemo(
    () =>
      projects
        .filter((p) => language === null || p.languages.includes(language))
        .sort((a, b) => {
          /* Projetos com estudo de caso ficam no topo, qualquer que seja a ordenação. */
          const pinned = Number(!!getCaseStudy(b.name)) - Number(!!getCaseStudy(a.name));
          if (pinned !== 0) return pinned;
          const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
          return sortOrder === "newest" ? -diff : diff;
        }),
    [projects, language, sortOrder],
  );

  const shownProjects = filteredProjects.slice(0, visible);

  const renderCard = (project: RepoProject, index: number) => {
    const caseStudy = getCaseStudy(project.name);
    const topics = displayTopics(project, 3);
    const lang = project.primaryLanguage;

    return (
      <ContextMenu key={project.id}>
        <ContextMenuTrigger asChild>
          <motion.article
            layout={!prefersReduced}
            initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
            animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
            exit={prefersReduced ? {} : { opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
              delay: prefersReduced ? 0 : Math.min(index, 8) * 0.04,
            }}
            whileHover={{ y: -2 }}
            data-vt-card
            className="lang-tint group relative flex flex-col gap-3 p-5 sm:p-6 rounded-xl border transition-colors focus-within:ring-2 focus-within:ring-[var(--ide-accent)]"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-default)",
              // Faixa de 2px na cor da linguagem (.lang-tint): a grade ganha cor sem gradiente.
              ["--lang" as string]: lang ? getLanguageColor(lang) : undefined,
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {lang && (
                  <>
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getLanguageColor(lang) }}
                      aria-hidden="true"
                    />
                    <span className="font-mono text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                      {lang}
                    </span>
                  </>
                )}
              </div>
              {project.stars > 0 && (
                <span
                  className="flex items-center gap-1 text-xs font-mono flex-shrink-0"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Star className="w-3 h-3" aria-hidden="true" />
                  {project.stars}
                  <span className="sr-only">estrelas no GitHub</span>
                </span>
              )}
            </div>

            <h3 data-vt="title" className="text-[17px] font-medium tracking-tight" style={{ color: "var(--text-primary)" }}>
              {/*
                  O botão do título estica sobre o card inteiro (after:inset-0): o card todo
                  abre o Quick Look, mas os links internos continuam clicáveis por cima.
              */}
              <button
                type="button"
                onClick={() => setSelectedProject(project)}
                onKeyDown={(e) => {
                  if (e.code === "Space" || e.key === " ") {
                    e.preventDefault();
                    setSelectedProject(project);
                  }
                }}
                className="text-left focus:outline-none after:absolute after:inset-0 after:content-['']"
                aria-label={`Abrir detalhes de ${project.title}`}
              >
                {project.title}
              </button>
            </h3>

            <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>
              {getCuratedSummary(project.name) ?? describeProject(project)}
            </p>

            {topics.length > 0 && (
              <ul className="flex flex-wrap gap-1.5" aria-label="Tópicos do projeto">
                {topics.map((topic) => (
                  <li
                    key={topic}
                    className="rounded-full px-2 py-0.5 text-[11px] font-mono"
                    style={{ backgroundColor: "var(--chip-bg)", color: "var(--text-secondary)" }}
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            )}

            <div
              className="flex items-center justify-between gap-3 text-xs pt-3 border-t"
              style={{ color: "var(--text-muted)", borderColor: "var(--border-subtle)" }}
            >
              <span>atualizado {formatRelativeDate(project.date)}</span>
              <div className="flex items-center gap-3">
                {project.homepage && (
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3" aria-hidden="true" />
                    demo
                  </span>
                )}
                {caseStudy && (
                  <Link
                    href={`/projects/${caseStudy.slug}`}
                    className="relative z-10 inline-flex items-center gap-1 font-medium hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ide-accent)] rounded"
                    style={{ color: "var(--ide-accent-text)" }}
                    aria-label={`Ler o estudo de caso de ${project.title}`}
                  >
                    Estudo de caso
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          </motion.article>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setSelectedProject(project)}>
            <Eye className="w-3.5 h-3.5 mr-2 text-primary" />
            Quick Look / Detalhes
            <ContextMenuShortcut>Espaço</ContextMenuShortcut>
          </ContextMenuItem>
          {caseStudy && (
            <ContextMenuItem asChild>
              <Link href={`/projects/${caseStudy.slug}`}>
                <FileText className="w-3.5 h-3.5 mr-2 text-[var(--ide-accent)]" />
                Ler estudo de caso
              </Link>
            </ContextMenuItem>
          )}
          <ContextMenuItem onClick={() => window.open(project.link, "_blank")}>
            <ExternalLink className="w-3.5 h-3.5 mr-2 text-[var(--ide-accent)]" />
            Abrir no GitHub
            <ContextMenuShortcut>⌘↵</ContextMenuShortcut>
          </ContextMenuItem>
          {project.homepage && (
            <ContextMenuItem onClick={() => window.open(project.homepage!, "_blank")}>
              <Globe className="w-3.5 h-3.5 mr-2 text-[var(--ide-accent-green)]" />
              Abrir demo
            </ContextMenuItem>
          )}
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => {
              navigator.clipboard.writeText(project.link);
              toast.success("Link do repositório copiado!");
            }}
          >
            <Copy className="w-3.5 h-3.5 mr-2 text-[var(--text-muted)]" />
            Copiar Link do Repositório
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  return (
    <div
      className="min-h-[calc(100vh-var(--chrome-height))] w-full transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 pt-8 sm:pt-16 pb-28 flex flex-col gap-10 sm:gap-14">
        <motion.header
          className="flex flex-col gap-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={fadeUp}
            className="font-mono text-sm"
            style={{ color: "var(--syntax-comment)" }}
          >
            {"// projects/"}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl font-medium tracking-tight"
          >
            Projetos
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-[15px] md:text-[17px] leading-relaxed max-w-2xl"
            style={{ color: "var(--text-secondary)" }}
          >
            Estudos de caso curados no topo; o restante do GitHub logo abaixo, sempre
            atualizado.
          </motion.p>
        </motion.header>

        {/* Carregando — esqueletos com a mesma caixa do conteúdo final */}
        {status === "loading" && (
          <div className="flex flex-col gap-10" aria-busy="true" aria-live="polite">
            <span className="sr-only">Carregando projetos do GitHub…</span>
            <div
              className="h-[360px] rounded-xl border animate-pulse"
              style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-default)" }}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-44 rounded-xl border animate-pulse"
                  style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-default)" }}
                />
              ))}
            </div>
          </div>
        )}

        {status === "error" && (
          <motion.div
            className="flex flex-col items-center justify-center text-center py-24 gap-4"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <AlertCircle className="w-8 h-8" style={{ color: "var(--ide-accent-red)" }} />
            <p className="text-sm max-w-md" style={{ color: "var(--text-secondary)" }}>
              {error}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <motion.button
                onClick={retry}
                whileTap={{ scale: 0.97 }}
                transition={appleSpring}
                className="inline-flex items-center gap-2 min-h-11 px-5 rounded-[10px] border text-sm"
                style={{ color: "var(--text-primary)", borderColor: "var(--border-default)" }}
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Tentar novamente
              </motion.button>
              <a
                href={SOCIAL.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 min-h-11 px-5 rounded-[10px] border text-sm"
                style={{ color: "var(--text-primary)", borderColor: "var(--border-default)" }}
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                Ver no GitHub
              </a>
            </div>
          </motion.div>
        )}

        {status === "ready" && (
          <>
            {hero && <CaseStudyHero project={hero.project} caseStudy={hero.caseStudy} />}

            {otherFeatured.length > 0 && (
              <section aria-labelledby="more-featured-title" className="flex flex-col gap-5">
                <h2
                  id="more-featured-title"
                  className="font-mono text-sm"
                  style={{ color: "var(--syntax-comment)" }}
                >
                  {"// também em destaque"}
                </h2>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {otherFeatured.map((project) => (
                    <FeaturedCard key={project.id} project={project} onOpen={setSelectedProject} />
                  ))}
                </motion.div>
              </section>
            )}

            <section aria-labelledby="all-repos-title" className="flex flex-col gap-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h2
                  id="all-repos-title"
                  className="text-xl sm:text-2xl font-medium tracking-tight"
                >
                  Todos os repositórios
                  <span className="sr-only"> ({filteredProjects.length})</span>
                  <span className="ml-2 font-mono text-sm" style={{ color: "var(--text-muted)" }} aria-hidden="true">
                    {filteredProjects.length}
                  </span>
                </h2>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
                  {/*
                      Chips de linguagem. No celular a fileira rola na horizontal
                      (-mx/px devolvem a sangria até a borda da tela) em vez de quebrar
                      em três linhas e empurrar a grade para baixo.
                  */}
                  <div
                    role="group"
                    aria-label="Filtrar por linguagem"
                    className="flex gap-2 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap pb-1 sm:pb-0 no-scrollbar"
                  >
                    <Chip active={language === null} onClick={() => chooseLanguage(null)}>
                      Todos
                    </Chip>
                    {languages.slice(0, MAX_LANGUAGE_CHIPS).map((lang) => (
                      <Chip
                        key={lang}
                        active={language === lang}
                        onClick={() => chooseLanguage(language === lang ? null : lang)}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getLanguageColor(lang) }}
                          aria-hidden="true"
                        />
                        {lang}
                      </Chip>
                    ))}
                  </div>

                  <div
                    role="group"
                    aria-label="Ordenar por data"
                    className="flex gap-0.5 p-1 rounded-full border self-start flex-shrink-0"
                    style={{ borderColor: "var(--border-default)" }}
                  >
                    {(["newest", "oldest"] as const).map((order) => (
                      <button
                        key={order}
                        type="button"
                        onClick={() => setSortOrder(order)}
                        aria-pressed={sortOrder === order}
                        className="relative min-h-8 px-3 rounded-full text-xs font-medium"
                        style={{
                          color: sortOrder === order ? "var(--text-primary)" : "var(--text-secondary)",
                        }}
                      >
                        {sortOrder === order && (
                          <motion.span
                            layoutId="projectsSortPill"
                            className="absolute inset-0 rounded-full"
                            style={{
                              backgroundColor: "var(--surface-subtle)",
                              // Contorno na cor de assinatura: o controle ativo ganha cor sem gradiente.
                              border: "1px solid color-mix(in srgb, var(--brand-signal) 55%, transparent)",
                            }}
                            transition={prefersReduced ? { duration: 0 } : appleSpring}
                          />
                        )}
                        <span className="relative">
                          {order === "newest" ? "Recentes" : "Antigos"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center text-center py-16 gap-3">
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Nenhum projeto em {language}.
                  </p>
                  <button
                    onClick={() => chooseLanguage(null)}
                    className="text-sm font-medium underline underline-offset-4"
                    style={{ color: "var(--ide-accent-text)" }}
                  >
                    Ver todos
                  </button>
                </div>
              ) : (
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" layout={!prefersReduced}>
                  <AnimatePresence mode="popLayout">{shownProjects.map(renderCard)}</AnimatePresence>
                </motion.div>
              )}

              {visible < filteredProjects.length && (
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="self-center w-full sm:w-auto min-h-12 px-6 rounded-[10px] border text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}
                >
                  Carregar mais ({filteredProjects.length - visible} restantes)
                </button>
              )}
            </section>

            {/* Fecho da página: quem rolou até aqui já demonstrou interesse. */}
            <motion.div
              className="pt-10 border-t flex flex-col items-center gap-4 text-center"
              style={{ borderColor: "var(--border-subtle)" }}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
            >
              <p className="text-sm max-w-md" style={{ color: "var(--text-secondary)" }}>
                Achou algo interessante? Posso explicar as decisões técnicas de qualquer um
                destes projetos.
              </p>
              <CtaGroup
                animateOnMount={false}
                className="justify-center"
                actions={[
                  { href: "/contact", label: "Falar comigo", icon: Mail, variant: "primary" },
                  { href: SOCIAL.github, label: "Ver perfil no GitHub", icon: ExternalLink, external: true },
                ]}
              />
            </motion.div>
          </>
        )}
      </main>

      {/* Projetos em C/C++ abrem o README; os demais abrem o navegador de arquivos */}
      <ProjectModal
        project={modalProject && prefersReadmeView(modalProject) ? modalProject : null}
        onClose={() => setSelectedProject(null)}
        technologies={technologiesForModals}
      />
      <RepoModal
        project={modalProject && !prefersReadmeView(modalProject) ? modalProject : null}
        onClose={() => setSelectedProject(null)}
        technologies={technologiesForModals}
      />
    </div>
  );
}
