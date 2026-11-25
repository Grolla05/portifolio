"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink, Globe, Eye, FileText } from "lucide-react";
import { ProjectCover } from "@/components/projects/project-cover";
import { appleSpring, fadeUp } from "@/lib/animations/variants";
import { getCaseStudy, getCuratedSummary } from "@/lib/case-studies";
import { type RepoProject, describeProject, displayTopics, getLanguageColor } from "@/lib/projects";

/*
    Card de projeto em destaque.

    Compartilhado entre a home e o topo de /projects para que o mesmo projeto tenha a
    mesma cara nos dois lugares. Tudo vem do repositório (descrição, topics, demo,
    linguagens); só a curadoria de QUAIS projetos aparecem é manual (FEATURED_REPOS).

    Com `onOpen`, o card ganha o botão "Detalhes" que abre o Quick Look da página de
    projetos; sem ele (home), os links levam direto ao GitHub e à demo.
*/

interface FeaturedCardProps {
  project: RepoProject;
  onOpen?: (project: RepoProject) => void;
}

const linkClasses =
  "inline-flex items-center gap-1.5 text-xs font-medium rounded-md px-1 py-1 " +
  "transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-[var(--ide-accent)]";

export function FeaturedCard({ project, onOpen }: FeaturedCardProps) {
  const topics = displayTopics(project);
  const caseStudy = getCaseStudy(project.name);

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={appleSpring}
      data-vt-card
      className="group relative flex flex-col rounded-xl border overflow-hidden h-full"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border-default)",
      }}
    >
      {/*
          Redesign: capa no topo do card (screenshot quando existe, capa gerada em CSS
          quando não) no lugar da faixa com três logos de linguagem — o design pede
          imagem do projeto, e a capa é a mesma que a grade de /projects já usa.
      */}
      {/* Faixa de 2px na cor da linguagem principal, por cima da capa. */}
      {project.primaryLanguage && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-0.5 z-10"
          style={{ backgroundColor: getLanguageColor(project.primaryLanguage) }}
        />
      )}
      <div data-vt="cover" className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <ProjectCover
          repo={project.name}
          title={project.title}
          primaryLanguage={project.primaryLanguage}
        />
      </div>

      <div className="flex flex-col gap-4 p-6 flex-1">
        <h3
          data-vt="title"
          className="text-lg font-medium tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {project.title}
        </h3>

        <p
          className="text-sm leading-relaxed flex-1"
          style={{ color: "var(--text-secondary)" }}
        >
          {getCuratedSummary(project.name) ?? describeProject(project)}
        </p>

        {topics.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Tópicos do projeto">
            {topics.map((topic) => (
              <li
                key={topic}
                className="rounded-full px-2.5 py-0.5 text-[12px] font-mono"
                style={{
                  backgroundColor: "var(--chip-bg)",
                  color: "var(--text-secondary)",
                }}
              >
                {topic}
              </li>
            ))}
          </ul>
        )}

        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 border-t"
          style={{ borderColor: "var(--border-subtle)", color: "var(--ide-accent-text)" }}
        >
          {onOpen && (
            <button
              type="button"
              onClick={() => onOpen(project)}
              className={linkClasses}
              aria-label={`Abrir detalhes de ${project.title}`}
            >
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              Detalhes
            </button>
          )}
          {caseStudy && (
            <Link href={`/projects/${caseStudy.slug}`} className={linkClasses}>
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              Estudo de caso
            </Link>
          )}
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClasses}
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            GitHub
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
          {project.homepage && (
            <a
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
            >
              <Globe className="w-3.5 h-3.5" aria-hidden="true" />
              Demo
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
