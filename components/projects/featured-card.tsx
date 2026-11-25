"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ExternalLink, Globe, Eye, FileText } from "lucide-react";
import { LanguageIcon } from "@/components/projects/language-icon";
import { appleSpring, fadeUp } from "@/lib/animations/variants";
import { getCaseStudy } from "@/lib/case-studies";
import { type RepoProject, describeProject, displayTopics } from "@/lib/projects";

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
  const prefersReduced = useReducedMotion();
  const topics = displayTopics(project);
  const caseStudy = getCaseStudy(project.name);

  return (
    <motion.article
      variants={prefersReduced ? {} : fadeUp}
      whileHover={prefersReduced ? {} : { y: -4 }}
      transition={appleSpring}
      className="flex flex-col rounded-2xl border overflow-hidden h-full"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border-default)",
      }}
    >
      <div
        className="h-28 flex items-center justify-center gap-3 border-b"
        style={{
          backgroundColor: "var(--bg-tertiary)",
          borderColor: "var(--border-subtle)",
        }}
      >
        {project.languages.slice(0, 3).map((language) => (
          <LanguageIcon key={language} language={language} size={36} />
        ))}
      </div>

      <div className="flex flex-col gap-4 p-6 flex-1">
        <h3
          className="text-lg font-medium tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {project.title}
        </h3>

        <p
          className="text-sm leading-relaxed flex-1"
          style={{ color: "var(--text-secondary)" }}
        >
          {describeProject(project)}
        </p>

        {topics.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Tópicos do projeto">
            {topics.map((topic) => (
              <li
                key={topic}
                className="rounded-full px-2.5 py-0.5 text-[11px] font-mono"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
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
