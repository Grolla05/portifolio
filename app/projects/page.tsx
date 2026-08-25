"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  X,
  Calendar,
  ExternalLink,
  Copy,
  FolderGit2,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  slideInLeft,
  fadeUp,
  staggerContainer,
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
import Image from "next/image";
import {
  ProjectModal,
  type Project,
} from "@/components/projects/project-modal";
import { RepoModal } from "@/components/projects/repo-modal";
import { useIsMobile } from "@/hooks/use-mobile";

const projects: Project[] = [
  {
    id: 1,
    title: "Projeto 1",
    slug: "_sistema-de-irrigacao",
    description:
      "Sistema de irrigação inteligente de baixo custo para pequenos e médios agricultores familiares.",
    date: "2024-03-01",
    tags: ["C++", "Arduino", "Hardware"],
    link: "https://github.com/Grolla05/Sistema-de-irrigacao",
  },
  {
    id: 2,
    title: "Projeto 2",
    slug: "_landing-page-advocacia",
    description:
      "Landing Page moderna e responsiva desenvolvida para um escritório de advocacia.",
    date: "2024-02-15",
    tags: ["React", "TypeScript", "Next.js"],
    link: "https://github.com/Grolla05/Landing-page-advocacia",
  },
  {
    id: 3,
    title: "Projeto 3",
    slug: "_medidor-de-temperatura",
    description:
      "Medidor de temperatura e umidade com display LCD e conectividade Bluetooth.",
    date: "2023-11-20",
    tags: ["C++", "Arduino", "Hardware"],
    link: "https://github.com/Grolla05/Medidor-de-temperatura",
  },
  {
    id: 4,
    title: "Projeto 4",
    slug: "_portifolio-pessoal",
    description:
      "Meu portfólio pessoal inspirado na interface do VS Code, desenvolvido com Next.js e Tailwind CSS.",
    date: "2024-04-01",
    tags: ["React", "TypeScript", "Next.js"],
    link: "https://github.com/Grolla05/portifolio",
  },
  {
    id: 5,
    title: "Projeto 5",
    slug: "_api-gerenciamento",
    description:
      "API RESTful para gerenciamento de tarefas e projetos com autenticação JWT.",
    date: "2023-09-10",
    tags: ["Python", "Flask"],
    link: "https://github.com/Grolla05/api-gerenciamento",
  },
  {
    id: 6,
    title: "Projeto 6",
    slug: "_dashboard-vendas",
    description:
      "Dashboard interativo para análise de dados de vendas com gráficos em tempo real.",
    date: "2024-01-05",
    tags: ["React", "TypeScript", "Vite"],
    link: "https://github.com/Grolla05/dashboard-vendas",
  },
  {
    id: 7,
    title: "Projeto 7",
    slug: "_bot-discord",
    description:
      "Bot para Discord com comandos de moderação, música e mini-jogos integrado a APIs.",
    date: "2023-08-22",
    tags: ["Node.js", "TypeScript"],
    link: "https://github.com/Grolla05/bot-discord",
  },
  {
    id: 8,
    title: "Projeto 8",
    slug: "_extensao-navegador",
    description:
      "Extensão para navegadores que bloqueia anúncios e rastreadores, melhorando privacidade.",
    date: "2023-12-01",
    tags: ["React", "TypeScript"],
    link: "https://github.com/Grolla05/extensao-navegador",
  },
  {
    id: 9,
    title: "Projeto 9",
    slug: "_app-clima",
    description:
      "Aplicativo de previsão do tempo com geolocalização e mapas interativos.",
    date: "2024-02-28",
    tags: ["React", "TypeScript", "Vite"],
    link: "https://github.com/Grolla05/app-clima",
  },
  {
    id: 10,
    title: "Projeto 10",
    slug: "_web-scraper",
    description:
      "Script em Python para coleta automatizada de dados de produtos em e-commerces.",
    date: "2023-07-15",
    tags: ["Python"],
    link: "https://github.com/Grolla05/web-scraper",
  },
  {
    id: 11,
    title: "Projeto 11",
    slug: "_chat-tempo-real",
    description:
      "Aplicação de chat em tempo real utilizando WebSockets com salas privadas.",
    date: "2024-01-20",
    tags: ["Node.js", "React", "TypeScript"],
    link: "https://github.com/Grolla05/chat-tempo-real",
  },
  {
    id: 12,
    title: "Projeto 12",
    slug: "_gerador-senhas",
    description:
      "Gerador de senhas seguras com opções personalizáveis e verificação de força.",
    date: "2023-06-30",
    tags: ["React", "TypeScript"],
    link: "https://github.com/Grolla05/gerador-senhas",
  },
];

const technologies = [
  { name: "React", icon: "/language_icons/React.png" },
  { name: "TypeScript", icon: "/language_icons/Typescript.png" },
  { name: "Python", icon: "/language_icons/Python.svg" },
  { name: "C++", icon: "/language_icons/C++.svg" },
  { name: "Arduino", icon: "/language_icons/Arduino.png" },
  { name: "Next.js", icon: "/language_icons/NextJS.png" },
  { name: "Flask", icon: "/language_icons/Flask.png" },
  { name: "Node.js", icon: "/language_icons/NodeJS.png" },
  { name: "Vite", icon: "/language_icons/Vite.png" },
  { name: "Hardware", icon: "/language_icons/Hardware.png" },
];

export default function ProjectsPage() {
  const [selectedTechs, setSelectedTechs] = useState<string[]>(
    technologies.map((t) => t.name),
  );
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isSortingOpen, setIsSortingOpen] = useState(true);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();

  // Escape key closes open project preview modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedProject) {
        setSelectedProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);

  const toggleTech = (tech: string) => {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech],
    );
  };

  const filteredProjects = (
    selectedTechs.length === 0
      ? [...projects]
      : projects.filter((p) => p.tags.some((t) => selectedTechs.includes(t)))
  ).sort((a, b) => {
    const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
    return sortOrder === "newest" ? -diff : diff;
  });

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
        <ChevronDown
          className="w-4 h-4 mr-2"
          style={{ color: "var(--text-muted)" }}
        />
        <span className="text-xs font-semibold tracking-tight uppercase" style={{ color: "var(--text-secondary)" }}>
          projects
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {/* Language Filter */}
        <div>
          <motion.button
            onClick={() => setIsProjectsOpen(!isProjectsOpen)}
            whileTap={prefersReduced ? {} : { scale: 0.98 }}
            className="w-full flex items-center px-4 py-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-md"
          >
            <motion.span
              animate={{ rotate: isProjectsOpen ? 90 : 0 }}
              transition={{ duration: 0.15 }}
              className="inline-flex"
            >
              <ChevronRight
                className="w-3 h-3 mr-2"
                style={{ color: "var(--text-muted)" }}
              />
            </motion.span>
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
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
                {technologies.map((tech) => (
                  <motion.div
                    key={tech.name}
                    whileTap={prefersReduced ? {} : { scale: 0.98 }}
                    className="flex items-center px-4 py-1.5 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-md"
                    onClick={() => toggleTech(tech.name)}
                  >
                    <div
                      className="w-3.5 h-3.5 mr-2.5 border rounded flex items-center justify-center transition-colors flex-shrink-0"
                      style={{
                        backgroundColor: selectedTechs.includes(tech.name)
                          ? "var(--ide-accent)"
                          : "transparent",
                        borderColor: selectedTechs.includes(tech.name)
                          ? "var(--ide-accent)"
                          : "var(--border-default)",
                      }}
                    >
                      {selectedTechs.includes(tech.name) && (
                        <span className="text-white text-[10px]">✓</span>
                      )}
                    </div>
                    <div
                      className="flex items-center"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <div className="mr-2 relative w-4 h-4 flex-shrink-0">
                        <Image
                          src={tech.icon}
                          alt={tech.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-xs font-medium">{tech.name}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sorting Filter */}
        <div
          className="mt-4 pt-4 border-t"
          style={{ borderColor: "var(--border-default)" }}
        >
          <motion.button
            onClick={() => setIsSortingOpen(!isSortingOpen)}
            whileTap={prefersReduced ? {} : { scale: 0.98 }}
            className="w-full flex items-center px-4 py-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-md"
          >
            <motion.span
              animate={{ rotate: isSortingOpen ? 90 : 0 }}
              transition={{ duration: 0.15 }}
              className="inline-flex"
            >
              <ChevronRight
                className="w-3 h-3 mr-2"
                style={{ color: "var(--text-muted)" }}
              />
            </motion.span>
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
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
                  <motion.div
                    key={order}
                    whileTap={prefersReduced ? {} : { scale: 0.98 }}
                    className="flex items-center px-4 py-1.5 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-md"
                    onClick={() => setSortOrder(order)}
                  >
                    <div
                      className="w-3.5 h-3.5 mr-2.5 border rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                      style={{
                        borderColor:
                          sortOrder === order
                            ? "var(--ide-accent)"
                            : "var(--border-default)",
                      }}
                    >
                      {sortOrder === order && (
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: "var(--ide-accent)" }}
                        />
                      )}
                    </div>
                    <div
                      className="flex items-center"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <Calendar className="w-3.5 h-3.5 mr-2" />
                      <span className="text-xs font-medium">
                        {order === "newest"
                          ? "Mais recentes"
                          : "Mais antigos"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
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
          {selectedTechs.length > 0 ? (
            <span className="truncate max-w-xs">
              {selectedTechs.join("; ")}
            </span>
          ) : (
            <span className="italic">no filters selected</span>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setSelectedTechs([])}
                className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Limpar filtros"
              >
                <X className="w-3.5 h-3.5 cursor-pointer flex-shrink-0 hover:opacity-70" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              Limpar todos os filtros
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 md:p-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
          variants={prefersReduced ? {} : staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ContextMenu key={project.id}>
                <ContextMenuTrigger asChild>
                  <motion.div
                    layout
                    initial={
                      prefersReduced ? {} : { opacity: 0, scale: 0.92, y: 16 }
                    }
                    animate={prefersReduced ? {} : { opacity: 1, scale: 1, y: 0 }}
                    exit={prefersReduced ? {} : { opacity: 0, scale: 0.92, y: 8 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.4, 0, 0.2, 1],
                      delay: prefersReduced ? 0 : index * 0.04,
                    }}
                    whileHover={prefersReduced ? {} : { y: -4 }}
                    whileTap={prefersReduced ? {} : { scale: 0.98 }}
                    className="group focus-within:ring-2 focus-within:ring-[var(--ide-accent)] rounded-2xl outline-none"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-semibold tracking-tight"
                          style={{ color: "var(--ide-accent)" }}
                        >
                          Project {project.id}
                        </span>
                        <span
                          className="text-xs font-mono"
                          style={{ color: "var(--text-muted)" }}
                        >
                          // {project.slug}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-muted-foreground border border-black/5 dark:border-white/5 transition-opacity">
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
                      className="block w-full text-left focus:outline-none"
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
                          <div className="relative w-12 h-12 opacity-50 grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110">
                            <Image
                              src={
                                technologies.find(
                                  (t) => t.name === project.tags[0],
                                )?.icon || "/placeholder.svg"
                              }
                              alt={project.tags[0]}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div
                            className="absolute top-3 right-3 backdrop-blur-md p-1.5 rounded-lg shadow-sm flex items-center gap-2"
                            style={{ backgroundColor: "var(--bg-glass)" }}
                          >
                            {project.tags.map((tag) => {
                              const tech = technologies.find(
                                (t) => t.name === tag,
                              );
                              if (!tech) return null;
                              return (
                                <div
                                  key={tag}
                                  className="relative w-5 h-5"
                                  title={tag}
                                >
                                  <Image
                                    src={tech.icon}
                                    alt={tag}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="p-6 flex flex-col gap-4 flex-1">
                          <p
                            className="text-sm leading-relaxed font-normal"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {project.description}
                          </p>
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
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => {
                    navigator.clipboard.writeText(project.link);
                    toast.success("Link do repositório copiado!");
                  }}>
                    <Copy className="w-3.5 h-3.5 mr-2 text-[var(--text-muted)]" />
                    Copiar Link do Repositório
                    <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </AnimatePresence>
        </motion.div>
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
        {/*
            Render ÚNICO da árvore.
            Antes havia dois blocos irmãos (`hidden md:flex` + `flex md:hidden`) que montavam
            sidebar e conteúdo duas vezes no DOM, contando apenas com CSS para ocultar um deles
            — o que duplicava a interface na tela. Agora só uma variante é montada, escolhida
            em runtime por `useIsMobile()`.
        */}
        {isMobile ? (
          /* Mobile: pilha vertical (sidebar acima, conteúdo abaixo) */
          <div className="flex flex-1 min-h-0 flex-col w-full">
            {renderSidebar()}
            {renderMainContent()}
          </div>
        ) : (
          /* Desktop: split view redimensionável — `min-h-0` deixa o filho encolher dentro do flex */
          <div className="flex flex-1 min-h-0 w-full">
            <ResizablePanelGroup direction="horizontal" className="w-full h-full">
              <ResizablePanel defaultSize={20} minSize={14} maxSize={32} className="min-w-[200px]">
                {renderSidebar()}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={80}>
                {renderMainContent()}
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        )}

        {/* Hardware projects → README modal */}
        <ProjectModal
          project={selectedProject?.tags.includes("Hardware") ? selectedProject : null}
          onClose={() => setSelectedProject(null)}
          technologies={technologies}
        />
        {/* Other projects → repo file browser */}
        <RepoModal
          project={selectedProject && !selectedProject.tags.includes("Hardware") ? selectedProject : null}
          onClose={() => setSelectedProject(null)}
          technologies={technologies}
        />
      </div>
    </TooltipProvider>
  );
}
