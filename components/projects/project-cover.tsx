"use client";

import React, { useEffect, useRef, useState } from "react";
import { LanguageIcon } from "@/components/projects/language-icon";
import { getExplicitCover } from "@/lib/case-studies";
import { getLanguageColor } from "@/lib/projects";
import { cn } from "@/lib/utils";

/*
    Capa de projeto.

    Os cards eram um quadrado cinza com o logo da linguagem — idêntico para os ~28
    repositórios, então nenhum se distinguia.

    Ordem de preferência:
      1. imagem própria (`cover` do estudo de caso ou miniatura local em /public)
      2. capa gerada em CSS: janela de editor com o nome do repositório e linhas de código
         na cor da linguagem, com larguras derivadas do nome (estáveis entre renders)

    Uma primeira versão usava a prévia social do GitHub (opengraph.githubassets.com) como
    padrão. Descartada: o serviço devolve 429 sob carga, e uma grade de 28 cards dispara 28
    requisições de uma vez. A capa gerada não faz rede, respeita o tema e nunca quebra.
    Screenshots reais entram só pelo campo `cover` — melhor sem imagem do que com uma
    imagem que pode não carregar.
*/

interface ProjectCoverProps {
  repo: string;
  title: string;
  primaryLanguage: string | null;
  className?: string;
}

/** Hash simples e estável (FNV-1a) — só para variar as larguras das linhas por projeto. */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const LINE_WIDTHS = [38, 52, 64, 76, 44, 58, 70, 32];

function GeneratedCover({
  repo,
  primaryLanguage,
}: Pick<ProjectCoverProps, "repo" | "primaryLanguage">) {
  const seed = hash(repo);
  const color = primaryLanguage ? getLanguageColor(primaryLanguage) : "var(--text-muted)";

  // 5 linhas; recuo alternado imita código aninhado.
  const lines = Array.from({ length: 5 }, (_, i) => ({
    width: LINE_WIDTHS[(seed >> (i * 3)) % LINE_WIDTHS.length],
    indent: (seed >> (i + 11)) % 3 === 0 ? 0 : (i % 2) * 14,
    accent: (seed >> (i + 5)) % 4 === 0,
  }));

  return (
    <div className="absolute inset-0 flex flex-col" aria-hidden="true">
      <div
        className="h-7 flex items-center gap-1.5 px-3 border-b flex-shrink-0"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "var(--border-default)" }}
          />
        ))}
        <span
          className="ml-2 text-[10px] font-mono truncate"
          style={{ color: "var(--text-muted)" }}
        >
          {repo}
        </span>
      </div>

      <div className="flex-1 flex items-center justify-between gap-4 px-5">
        <div className="flex-1 space-y-2.5 min-w-0">
          {lines.map((line, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full"
              style={{
                width: `${line.width}%`,
                marginLeft: line.indent,
                backgroundColor: line.accent ? color : "var(--border-default)",
                opacity: line.accent ? 0.7 : 1,
              }}
            />
          ))}
        </div>

        {primaryLanguage && (
          <div className="opacity-60 flex-shrink-0">
            <LanguageIcon language={primaryLanguage} size={40} decorative />
          </div>
        )}
      </div>
    </div>
  );
}

export function ProjectCover({ repo, title, primaryLanguage, className }: ProjectCoverProps) {
  const explicit = getExplicitCover(repo);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  /*
      `onError` não dispara se a imagem falhar ANTES da hidratação (SSR + rede ruim): o
      evento já passou quando o React anexa o handler. Conferir `complete` +
      `naturalWidth === 0` no mount cobre esse caso.
  */
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  const showImage = explicit && !failed;

  return (
    <div
      className={cn("relative overflow-hidden aspect-[2/1] w-full", className)}
      style={{ backgroundColor: "var(--bg-tertiary)" }}
    >
      {showImage ? (
        // <img> simples: o arquivo é estático e `images.unoptimized` já está ligado.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={explicit}
          alt={`Capa do projeto ${title}`}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      ) : (
        <GeneratedCover repo={repo} primaryLanguage={primaryLanguage} />
      )}
    </div>
  );
}

export default ProjectCover;
