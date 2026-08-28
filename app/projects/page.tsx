"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  ChevronRight,
  X,
  Calendar,
  ExternalLink,
  Copy,
  Eye,
  Star,
  GitBranch,
  AlertCircle,
  RefreshCw,
  Globe,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  slideInLeft,
  fadeUp,
  staggerContainer,
  appleSpring,
} from "@/lib/animations/variants";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ProjectModal } from "@/components/projects/project-modal";
import { RepoModal } from "@/components/projects/repo-modal";
import { LanguageIcon } from "@/components/projects/language-icon";
import { CtaGroup } from "@/components/cta-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProjects } from "@/hooks/use-projects";
import {
  type RepoProject,
  collectLanguages,
  describeProject,
  formatRelativeDate,
  getLanguageIcon,
  prefersReadmeView,
} from "@/lib/projects";
import { SOCIAL } from "@/lib/site";

/*
    A lista de projetos vinha de um array fixo de 12 objetos escritos à mão neste arquivo.
    Nenhum deles existia: os 12 repositórios linkados retornavam 404 na API do GitHub,
    então todo "Abrir no GitHub" levava a uma página de erro.

    Agora a página consome /api/projects, que espelha a conta real. Efeitos colaterais:
      - as tags do filtro passam a ser as linguagens reais de cada repositório
      - o filtro lateral é derivado dos dados, não uma lista fixa de 10 tecnologias
      - cada card mostra estrelas e data do último commit, que só existem se o repo existe
*/

export default function ProjectsPage() {
  const { projects, status, error, retry } = useProjects();

  const [deselectedLanguages, setDeselectedLanguages] = useState<string[]>([]);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isSortingOpen, setIsSortingOpen] = useState(true);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedProject, setSelectedProject] = useState<RepoProject | null>(null);
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();

  const languages = useMemo(() => collectLanguages(projects), [projects]);

  /*
      O filtro guarda o que foi DESmarcado, não o que foi marcado.
      Antes o estado era a lista de selecionados, inicializada com as 10 tecnologias fixas;
      com dados assíncronos isso obrigaria a re-sincronizar o estado toda vez que a lista
      chegasse — e qualquer linguagem nova nasceria desmarcada. Guardando as exclusões,
      "tudo marcado" é o estado vazio e linguagens novas aparecem ligadas por padrão.
  */
  const selectedLanguages = useMemo(
    () => languages.filter((language) => !deselectedLanguages.includes(language)),
    [languages, deselectedLanguages],
  );

  /*
      Os modais casam tag com ícone por nome. Só entram aqui as linguagens que têm logo
      em public/language_icons — as demais renderizariam <Image> com caminho inexistente
      dentro dos modais, que não conhecem o fallback de LanguageIcon.
  */
  const technologiesForModals = useMemo(
    () =>
      languages
        .map((name) => ({ name, icon: getLanguageIcon(name) }))
        .filter((tech): tech is { name: string; icon: string } => tech.icon !== null),
    [languages],
  );

  /*
      Os modais exigem `description: string`, mas o GitHub devolve null na maioria dos
      repositórios. Resolve o fallback aqui, num ponto só, em vez de espalhar `?? ""`
      pelos componentes de modal.
  */
  const modalProject = useMemo(
    () =>
      selectedProject
        ? { ...selectedProject, description: describeProject(selectedProject) }
        : null,
    [selectedProject],
  );

  // Escape fecha o Quick Look aberto
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedProject) {
        setSelectedProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);

  const toggleLanguage = (language: string) => {
    setDeselectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language],
    );
  };

  const filteredProjects = useMemo(
    () =>
      projects
        .filter(
          (p) =>
            selectedLanguages.length === 0 ||
            p.languages.some((l) => selectedLanguages.includes(l)) ||
            // Repositório sem linguagem detectada (só markdown, por exemplo) some se
            // filtrado por linguagem; só aparece quando nenhum filtro está ativo.
            (p.languages.length === 0 &&
              selectedLanguages.length === languages.length),
        )
        .sort((a, b) => {
          const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
          return sortOrder === "newest" ? -diff : diff;
        }),
    [projects, selectedLanguages, languages.length, sortOrder],
  );

  const renderSidebar = () => (
    <motion.aside
      className="w-full h-full flex flex-col transition-colors duration-300 flex-shrink-0 select-none overflow-hidden"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border-default)",
      }}
      variants={prefersReduced ? {} : slideInLeft}
      initial="hidden"
      animate="visible"
    >
      <div
        className="h-10 flex items-center px-4 border-b transition-colors duration-300 select-none flex-shrink-0"
        style={{ borderColor: "var(--border-default)" }}
      >
        <ChevronDown className="w-4 h-4 mr-2" style={{ color: "var(--text-muted)" }} />
        <span
          className="text-xs font-semibold tracking-tight uppercase"
          style={{ color: "var(--text-secondary)" }}
        >
          projects
        </span>
        {status === "ready" && (
          <span
            className="ml-auto text-[10px] font-mono"
            style={{ color: "var(--text-muted)" }}
          >
            {projects.length}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {/* Filtro de linguagens */}
        <div>
          <motion.button
            onClick={() => setIsProjectsOpen(!isProjectsOpen)}
            whileTap={prefersReduced ? {} : { scale: 0.98 }}
            className="w-full flex items-center px-4 py-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-md"
            aria-expanded={isProjectsOpen}
          >
            <motion.span
              animate={{ rotate: isProjectsOpen ? 90 : 0 }}
              transition={{ duration: 0.15 }}
              className="inline-flex"
            >
              <ChevronRight className="w-3 h-3 mr-2" style={{ color: "var(--text-muted)" }} />
            </motion.span>
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              Linguagens
            </span>
          </motion.button>

          <AnimatePresence>
            {isProjectsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
                className="ml-4 pl-0 mt-2 space-y-1"
              >
                {status === "loading" && (
                  <div className="px-4 py-1.5 space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-3.5 rounded animate-pulse"
                        style={{
                          backgroundColor: "var(--surface-subtle)",
                          width: `${70 - i * 8}%`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {languages.map((language) => {
                  const checked = selectedLanguages.includes(language);
                  return (
                    <motion.button
                      key={language}
                      whileTap={prefersReduced ? {} : { scale: 0.98 }}
                      className="w-full flex items-center px-4 py-1.5 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-left"
                      onClick={() => toggleLanguage(language)}
                      role="checkbox"
                      aria-checked={checked}
                    >
                      <span
                        className="w-3.5 h-3.5 mr-2.5 border rounded flex items-center justify-center transition-colors flex-shrink-0"
                        style={{
                          backgroundColor: checked ? "var(--ide-accent)" : "transparent",
                          borderColor: checked ? "var(--ide-accent)" : "var(--border-default)",
                        }}
                      >
                        {checked && <span className="text-white text-[10px]">✓</span>}
                      </span>
                      <span
                        className="flex items-center min-w-0"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <LanguageIcon language={language} size={16} className="mr-2" decorative />
                        <span className="text-xs font-medium truncate">{language}</span>
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ordenação */}
        <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border-default)" }}>
          <motion.button
            onClick={() => setIsSortingOpen(!isSortingOpen)}
            whileTap={prefersReduced ? {} : { scale: 0.98 }}
            className="w-full flex items-center px-4 py-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-md"
            aria-expanded={isSortingOpen}
          >
            <motion.span
              animate={{ rotate: isSortingOpen ? 90 : 0 }}
              transition={{ duration: 0.15 }}
              className="inline-flex"
            >
              <ChevronRight className="w-3 h-3 mr-2" style={{ color: "var(--text-muted)" }} />
            </motion.span>
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              Ordenar por data
            </span>
          </motion.button>

          <AnimatePresence>
            {isSortingOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
                className="ml-4 pl-0 mt-2 space-y-1"
              >
                {(["newest", "oldest"] as const).map((order) => (
                  <motion.button
                    key={order}
                    whileTap={prefersReduced ? {} : { scale: 0.98 }}
                    className="w-full flex items-center px-4 py-1.5 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-left"
                    onClick={() => setSortOrder(order)}
                    role="radio"
                    aria-checked={sortOrder === order}
                  >
                    <span
                      className="w-3.5 h-3.5 mr-2.5 border rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                      style={{
                        borderColor:
                          sortOrder === order ? "var(--ide-accent)" : "var(--border-default)",
                      }}
                    >
                      {sortOrder === order && (
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: "var(--ide-accent)" }}
                        />
                      )}
                    </span>
                    <span className="flex items-center" style={{ color: "var(--text-secondary)" }}>
                      <Calendar className="w-3.5 h-3.5 mr-2" />
                      <span className="text-xs font-medium">
                        {order === "newest" ? "Mais recentes" : "Mais antigos"}
                      </span>
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );

  const renderCard = (project: RepoProject, index: number) => (
    <ContextMenu key={project.id}>
      <ContextMenuTrigger asChild>
        <motion.div
          layout
          initial={prefersReduced ? {} : { opacity: 0, scale: 0.92, y: 16 }}
          animate={prefersReduced ? {} : { opacity: 1, scale: 1, y: 0 }}
          exit={prefersReduced ? {} : { opacity: 0, scale: 0.92, y: 8 }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
            delay: prefersReduced ? 0 : Math.min(index, 8) * 0.04,
          }}
          whileHover={prefersReduced ? {} : { y: -4 }}
          whileTap={prefersReduced ? {} : { scale: 0.98 }}
          className="group focus-within:ring-2 focus-within:ring-[var(--ide-accent)] rounded-2xl outline-none"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {/*
                  Antes o cabeçalho dizia "Project 1" com um slug inventado ao lado.
                  Agora traz o nome real do repositório — que é também o que a pessoa
                  vai encontrar no GitHub ao clicar.
              */}
              <span
                className="text-xs font-semibold tracking-tight truncate"
                style={{ color: "var(--ide-accent)" }}
              >
                {project.title}
              </span>
              {project.stars > 0 && (
                <span
                  className="flex items-center gap-0.5 text-[10px] font-mono flex-shrink-0"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Star className="w-3 h-3" aria-hidden="true" />
                  {project.stars}
                  <span className="sr-only">estrelas no GitHub</span>
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-muted-foreground border border-black/5 dark:border-white/5 transition-opacity flex-shrink-0">
              Espaço: Quick Look
            </span>
          </div>

          <button
            onClick={() => setSelectedProject(project)}
            onKeyDown={(e) => {
              if (e.code === "Space" || e.key === " ") {
                e.preventDefault();
                setSelectedProject(project);
              } else if (e.key === "Enter") {
                setSelectedProject(project);
              }
            }}
            className="block w-full text-left focus:outline-none h-full"
            aria-label={`Abrir detalhes de ${project.title}`}
          >
            <div
              className="rounded-2xl overflow-hidden shadow-sm flex flex-col cursor-pointer h-full border transition-all duration-300 hover:shadow-md"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-default)",
              }}
            >
              <div
                className="h-32 flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: "var(--bg-tertiary)" }}
              >
                {project.primaryLanguage ? (
                  <div className="opacity-50 grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110">
                    <LanguageIcon language={project.primaryLanguage} size={48} decorative />
                  </div>
                ) : (
                  <GitBranch
                    className="w-10 h-10 opacity-30"
                    style={{ color: "var(--text-muted)" }}
                    aria-hidden="true"
                  />
                )}

                {project.languages.length > 0 && (
                  <div
                    className="absolute top-3 right-3 backdrop-blur-md p-1.5 rounded-lg shadow-sm flex items-center gap-1.5"
                    style={{ backgroundColor: "var(--bg-glass)" }}
                  >
                    {project.languages.slice(0, 4).map((language) => (
                      <LanguageIcon key={language} language={language} size={18} />
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col gap-4 flex-1">
                <p
                  className="text-sm leading-relaxed font-normal flex-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {describeProject(project)}
                </p>

                {/*
                    Rodapé com sinal de atividade. Data do último push é o que separa
                    um portfólio vivo de um abandonado — e só pode ser exibida porque
                    o dado vem do repositório de verdade.
                */}
                <div
                  className="flex items-center justify-between text-[11px] font-mono pt-3 border-t"
                  style={{
                    color: "var(--text-muted)",
                    borderColor: "var(--border-subtle)",
                  }}
                >
                  <span>{formatRelativeDate(project.date)}</span>
                  {project.homepage && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" aria-hidden="true" />
                      demo
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        </motion.div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => setSelectedProject(project)}>
          <Eye className="w-3.5 h-3.5 mr-2 text-primary" />
          Quick Look / Detalhes
          <ContextMenuShortcut>Espaço</ContextMenuShortcut>
        </ContextMenuItem>
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

  const renderMainContent = () => (
    <main className="flex-1 h-full flex flex-col overflow-hidden">
      <div
        className="h-10 flex border-b transition-colors duration-300 flex-shrink-0"
        style={{ borderColor: "var(--border-default)" }}
      >
        <div
          className="px-4 flex items-center border-r space-x-2 text-xs font-medium"
          style={{
            borderColor: "var(--border-default)",
            color: "var(--text-secondary)",
          }}
        >
          {deselectedLanguages.length > 0 ? (
            <span className="truncate max-w-xs">{selectedLanguages.join("; ")}</span>
          ) : (
            <span className="italic">todas as linguagens</span>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setDeselectedLanguages([])}
                className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Limpar filtros"
              >
                <X className="w-3.5 h-3.5 cursor-pointer flex-shrink-0 hover:opacity-70" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Limpar todos os filtros</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 md:p-12">
        {/* Carregando — esqueletos com a mesma caixa dos cards, sem salto de layout */}
        {status === "loading" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div
                  className="h-3.5 w-32 rounded mb-3"
                  style={{ backgroundColor: "var(--surface-subtle)" }}
                />
                <div
                  className="rounded-2xl border overflow-hidden"
                  style={{
                    borderColor: "var(--border-default)",
                    backgroundColor: "var(--bg-secondary)",
                  }}
                >
                  <div className="h-32" style={{ backgroundColor: "var(--bg-tertiary)" }} />
                  <div className="p-6 space-y-3">
                    <div
                      className="h-3 rounded w-full"
                      style={{ backgroundColor: "var(--surface-subtle)" }}
                    />
                    <div
                      className="h-3 rounded w-4/5"
                      style={{ backgroundColor: "var(--surface-subtle)" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {status === "error" && (
          <motion.div
            className="flex flex-col items-center justify-center text-center py-24 gap-4"
            variants={prefersReduced ? {} : fadeUp}
            initial="hidden"
            animate="visible"
          >
            <AlertCircle className="w-8 h-8" style={{ color: "var(--ide-accent-red)" }} />
            <p className="text-sm max-w-md" style={{ color: "var(--text-secondary)" }}>
              {error}
            </p>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={retry}
                whileHover={prefersReduced ? {} : { scale: 1.02 }}
                whileTap={prefersReduced ? {} : { scale: 0.97 }}
                transition={appleSpring}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold glass-pill"
                style={{ color: "var(--text-primary)" }}
              >
                <RefreshCw className="w-4 h-4 text-primary" />
                Tentar novamente
              </motion.button>
              <a
                href={SOCIAL.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold glass-pill"
                style={{ color: "var(--text-primary)" }}
              >
                <ExternalLink className="w-4 h-4 text-primary" />
                Ver no GitHub
              </a>
            </div>
          </motion.div>
        )}

        {status === "ready" && filteredProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-24 gap-3">
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Nenhum projeto bate com os filtros ativos.
            </p>
            <button
              onClick={() => setDeselectedLanguages([])}
              className="text-xs font-medium underline underline-offset-4"
              style={{ color: "var(--ide-accent)" }}
            >
              Limpar filtros
            </button>
          </div>
        )}

        {status === "ready" && filteredProjects.length > 0 && (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              layout
              variants={prefersReduced ? {} : staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map(renderCard)}
              </AnimatePresence>
            </motion.div>

            {/*
                Fecho da página. Quem rola até o fim da grade de projetos já demonstrou
                interesse e antes não tinha nenhum próximo passo — a página simplesmente
                acabava.
            */}
            <motion.div
              className="mt-16 pt-10 border-t flex flex-col items-center gap-4 text-center"
              style={{ borderColor: "var(--border-subtle)" }}
              variants={prefersReduced ? {} : fadeUp}
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
                actions={[
                  { href: "/contact", label: "Falar comigo", icon: Mail, variant: "primary" },
                  {
                    href: SOCIAL.github,
                    label: "Ver perfil no GitHub",
                    icon: ExternalLink,
                    external: true,
                  },
                ]}
              />
            </motion.div>
          </>
        )}
      </div>
    </main>
  );

  return (
    <TooltipProvider>
      <div
        /*
            Desktop usa ALTURA DEFINIDA (`h-`), não `min-h-`: `h-full` dos filhos resolve
            contra `height` do pai; só com `min-height` a porcentagem vira `auto` e o split
            view colapsa na altura do conteúdo, cortando a interface no meio.
            No mobile a pilha precisa crescer, então lá continua `min-h-`.
        */
        className={`w-full flex flex-col transition-colors duration-300 ${
          isMobile ? "min-h-[calc(100vh-4rem)]" : "h-[calc(100vh-4rem)]"
        }`}
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        {isMobile ? (
          /* Mobile: pilha vertical (sidebar acima, conteúdo abaixo) */
          <div className="flex flex-1 min-h-0 flex-col w-full">
            {renderSidebar()}
            {renderMainContent()}
          </div>
        ) : (
          /* Desktop: split view redimensionável — `min-h-0` deixa o filho encolher no flex */
          <div className="flex flex-1 min-h-0 w-full">
            {/*
                `autoSaveId` persiste a largura escolhida no localStorage: quem ajustou o
                painel encontra o mesmo layout na próxima visita, como num editor de verdade.
            */}
            <ResizablePanelGroup
              direction="horizontal"
              className="w-full h-full"
              autoSaveId="projects-layout"
            >
              <ResizablePanel defaultSize={20} minSize={14} maxSize={32} className="min-w-[200px]">
                {renderSidebar()}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={80}>{renderMainContent()}</ResizablePanel>
            </ResizablePanelGroup>
          </div>
        )}

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
    </TooltipProvider>
  );
}
