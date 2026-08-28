"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, FileText, Link2, Languages, Users, Download } from "lucide-react";
import { fadeUp, staggerContainer, appleSpring } from "@/lib/animations/variants";
import { type Paper, paperUrl, paperCitation } from "@/lib/papers";

/*
    Aba de artigo acadêmico: PDF renderizado à esquerda, metadados à direita.
    Segue a mesma divisão de hobbie.tsx (editor + painel de preview), para que a troca de
    abas não mude a estrutura da tela.

    O visualizador entra por import dinâmico com `ssr: false` porque o pdf.js toca
    `DOMMatrix`, `Path2D` e `canvas` no escopo do módulo — coisas que não existem no
    Node e derrubariam o build da rota. Como consequência, o bundle do pdf.js (~300kb gz)
    só é baixado quando alguém abre um artigo; as demais abas de /about não pagam por ele.
*/
const PdfViewer = dynamic(() => import("./pdf-viewer").then((m) => m.PdfViewer), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: "var(--bg-tertiary)" }}>
      <span className="font-mono text-xs" style={{ color: "var(--syntax-comment)" }}>
        {"// carregando visualizador..."}
      </span>
    </div>
  ),
});

interface PapersProps {
  paper: Paper;
}

function MetaRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon
        className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
        style={{ color: "var(--text-muted)" }}
        aria-hidden="true"
      />
      <div className="min-w-0">
        <dt className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "var(--text-muted)" }}>
          {label}
        </dt>
        <dd className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {children}
        </dd>
      </div>
    </div>
  );
}

export default function Papers({ paper }: PapersProps) {
  const prefersReduced = useReducedMotion();
  const url = paperUrl(paper);
  const citation = paperCitation(paper);

  return (
    <>
      {/* ESQUERDA — documento */}
      <main
        className="flex-1 flex flex-col min-h-[500px] min-w-0 border-r transition-colors duration-300"
        style={{ borderColor: "var(--border-default)" }}
      >
        <PdfViewer url={url} title={paper.title} />
      </main>

      {/* DIREITA — metadados do artigo */}
      <aside
        className="hidden xl:flex w-[380px] flex-col border-l transition-colors duration-300 flex-shrink-0"
        style={{ borderColor: "var(--border-default)" }}
      >
        <div
          className="h-10 flex items-center px-4 border-b transition-colors duration-300 flex-shrink-0"
          style={{ borderColor: "var(--border-default)" }}
        >
          <span
            className="text-xs font-semibold tracking-tight uppercase"
            style={{ color: "var(--text-secondary)" }}
          >
            Paper info
          </span>
        </div>

        <motion.div
          className="flex-1 overflow-y-auto p-4 space-y-5"
          variants={prefersReduced ? {} : staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={prefersReduced ? {} : fadeUp}>
            <h2
              className="text-sm font-semibold tracking-tight leading-snug mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              {paper.title}
            </h2>
            {citation && (
              <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                {citation}
              </p>
            )}
          </motion.div>

          {/*
              Blocos condicionais: um PDF colocado em public/papers/ sem entrada em
              PAPER_METADATA é listado e aberto normalmente, só sem resumo, ano e venue.
              Renderizar rótulo com valor vazio seria pior que omitir a seção.
          */}
          {paper.abstract && (
            <motion.div
              className="rounded-2xl p-4 border shadow-sm"
              style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-default)" }}
              variants={prefersReduced ? {} : fadeUp}
            >
              <h3
                className="text-[10px] uppercase tracking-wide mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Resumo
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {paper.abstract}
              </p>
            </motion.div>
          )}

          <motion.dl className="space-y-4" variants={prefersReduced ? {} : fadeUp}>
            {paper.year && (
              <MetaRow icon={Calendar} label="Ano">
                {paper.year}
              </MetaRow>
            )}

            {paper.venue && (
              <MetaRow icon={FileText} label="Publicado em">
                {paper.venue}
              </MetaRow>
            )}

            {paper.authors && paper.authors.length > 0 && (
              <MetaRow icon={Users} label="Autoria">
                {paper.authors.join(", ")}
              </MetaRow>
            )}

            {paper.language && (
              <MetaRow icon={Languages} label="Idioma">
                {paper.language === "pt-BR" ? "Português" : "Inglês"}
              </MetaRow>
            )}

            {paper.doi && (
              <MetaRow icon={Link2} label="Publicação">
                <a
                  href={paper.doi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 break-all"
                  style={{ color: "var(--ide-accent)" }}
                >
                  {paper.doi.replace(/^https?:\/\//, "")}
                </a>
              </MetaRow>
            )}
          </motion.dl>

          {paper.keywords && paper.keywords.length > 0 && (
            <motion.div variants={prefersReduced ? {} : fadeUp}>
              <h3
                className="text-[10px] uppercase tracking-wide mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Palavras-chave
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {paper.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                    style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div variants={prefersReduced ? {} : fadeUp}>
            <motion.a
              href={url}
              download
              whileHover={prefersReduced ? {} : { scale: 1.02 }}
              whileTap={prefersReduced ? {} : { scale: 0.97 }}
              transition={appleSpring}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-tight bg-primary text-primary-foreground shadow-sm hover:opacity-95 transition-opacity"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              Baixar PDF
            </motion.a>
          </motion.div>
        </motion.div>
      </aside>
    </>
  );
}
