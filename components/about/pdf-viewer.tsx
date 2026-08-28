"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { appleSpring } from "@/lib/animations/variants";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

/*
    Visualizador de PDF no estilo do preview de PDF do VS Code.

    Por que não um <iframe src="arquivo.pdf">: o Chrome no Android não renderiza PDF
    embutido — baixa o arquivo e deixa um retângulo em branco na página. Também não há
    controle sobre a barra de ferramentas nativa, que destoa completamente da interface.

    react-pdf renderiza em <canvas> via pdf.js e adiciona uma camada de texto invisível
    por cima, então o texto continua selecionável e pesquisável pelo Ctrl+F do navegador.

    Este componente NÃO deve ser importado direto: pdf.js acessa APIs de browser no
    módulo, o que quebra o SSR. Use components/about/papers.tsx, que faz o import
    dinâmico com `ssr: false`.
*/

/*
    O worker é resolvido pelo bundler a partir do pacote instalado, em vez de um arquivo
    copiado à mão para public/. Copiar significa versionar um binário de ~1MB que precisa
    ser atualizado manualmente a cada bump do pdfjs-dist — e um worker fora de sincronia
    com a lib falha com erro obscuro de versão.
*/
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_STEP = 0.25;

interface PdfViewerProps {
  url: string;
  title: string;
}

export function PdfViewer({ url, title }: PdfViewerProps) {
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  /** null = ajustar à largura; número = zoom manual. */
  const [scale, setScale] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  /*
      Mede o container para o modo "ajustar à largura".
      ResizeObserver em vez de window.resize: o painel do editor é redimensionável pelo
      usuário (react-resizable-panels), e arrastar o divisor não dispara resize da janela.
  */
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      // -32px compensa o padding horizontal do container.
      setContainerWidth(Math.max(240, entry.contentRect.width - 32));
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Troca de artigo reinicia a paginação — senão a aba nova abre na página 7 da anterior.
  useEffect(() => {
    setPageNumber(1);
    setNumPages(null);
    setError(null);
  }, [url]);

  const goToPage = useCallback(
    (target: number) => {
      setPageNumber((current) => {
        const total = numPages ?? 1;
        return Math.min(Math.max(1, target), total);
      });
    },
    [numPages],
  );

  const changeScale = useCallback(
    (delta: number) => {
      setScale((current) => {
        // Sair do modo "ajustar" preserva o zoom atual como ponto de partida,
        // em vez de saltar para 100% e desorientar quem está lendo.
        const base = current ?? 1;
        return Math.min(MAX_SCALE, Math.max(MIN_SCALE, base + delta));
      });
    },
    [],
  );

  /*
      Atalhos escopados ao container (não em window): a página /about já escuta teclas
      globalmente para navegação, e sequestrar as setas no documento inteiro quebraria
      a rolagem normal fora do visualizador.
  */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      goToPage(pageNumber - 1);
    } else if (event.key === "ArrowRight" || event.key === "PageDown") {
      event.preventDefault();
      goToPage(pageNumber + 1);
    } else if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      changeScale(SCALE_STEP);
    } else if (event.key === "-") {
      event.preventDefault();
      changeScale(-SCALE_STEP);
    } else if (event.key === "0") {
      event.preventDefault();
      setScale(null);
    }
  };

  const pageProps = useMemo(
    () =>
      scale === null
        ? { width: containerWidth ?? undefined }
        : { scale, width: undefined },
    [scale, containerWidth],
  );

  const zoomLabel = scale === null ? "Ajustar" : `${Math.round(scale * 100)}%`;

  const toolbarButton =
    "p-1.5 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/10 " +
    "disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none " +
    "focus-visible:ring-2 focus-visible:ring-[var(--ide-accent)]";

  return (
    <div
      className="flex-1 flex flex-col min-h-0 outline-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`Visualizador de PDF: ${title}`}
    >
      {/* Barra de ferramentas — mesma altura e borda das barras de aba do editor */}
      <div
        className="h-10 flex items-center gap-1 px-3 border-b flex-shrink-0"
        style={{
          borderColor: "var(--border-default)",
          backgroundColor: "var(--bg-secondary)",
        }}
      >
        <button
          onClick={() => goToPage(pageNumber - 1)}
          disabled={pageNumber <= 1}
          className={toolbarButton}
          aria-label="Página anterior"
          style={{ color: "var(--text-secondary)" }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span
          className="text-[11px] font-mono px-2 tabular-nums"
          style={{ color: "var(--text-secondary)" }}
          aria-live="polite"
        >
          {numPages ? `${pageNumber} / ${numPages}` : "— / —"}
        </span>

        <button
          onClick={() => goToPage(pageNumber + 1)}
          disabled={numPages === null || pageNumber >= numPages}
          className={toolbarButton}
          aria-label="Próxima página"
          style={{ color: "var(--text-secondary)" }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <span
          className="w-px h-4 mx-2"
          style={{ backgroundColor: "var(--border-default)" }}
          aria-hidden="true"
        />

        <button
          onClick={() => changeScale(-SCALE_STEP)}
          className={toolbarButton}
          aria-label="Diminuir zoom"
          style={{ color: "var(--text-secondary)" }}
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={() => setScale(null)}
          className={`${toolbarButton} text-[11px] font-mono px-2 min-w-[62px]`}
          aria-label="Ajustar à largura"
          style={{ color: "var(--text-secondary)" }}
        >
          {zoomLabel}
        </button>

        <button
          onClick={() => changeScale(SCALE_STEP)}
          className={toolbarButton}
          aria-label="Aumentar zoom"
          style={{ color: "var(--text-secondary)" }}
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <span
          className="w-px h-4 mx-2"
          style={{ backgroundColor: "var(--border-default)" }}
          aria-hidden="true"
        />

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={toolbarButton}
          aria-label="Abrir PDF em nova aba"
          style={{ color: "var(--text-secondary)" }}
        >
          <ExternalLink className="w-4 h-4" />
        </a>

        <a
          href={url}
          download
          className={toolbarButton}
          aria-label="Baixar PDF"
          style={{ color: "var(--text-secondary)" }}
        >
          <Download className="w-4 h-4" />
        </a>

        <span
          className="ml-auto text-[10px] font-mono hidden md:inline"
          style={{ color: "var(--text-muted)" }}
        >
          ← → páginas · +/− zoom · 0 ajustar
        </span>
      </div>

      {/* Área do documento */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 flex justify-center"
        style={{ backgroundColor: "var(--bg-tertiary)" }}
      >
        {error ? (
          <div className="flex flex-col items-center justify-center gap-3 text-center py-16">
            <AlertCircle className="w-7 h-7" style={{ color: "var(--ide-accent-red)" }} />
            <p className="text-sm max-w-xs" style={{ color: "var(--text-secondary)" }}>
              {error}
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold glass-pill"
              style={{ color: "var(--text-primary)" }}
            >
              <ExternalLink className="w-3.5 h-3.5 text-primary" />
              Abrir o arquivo direto
            </a>
          </div>
        ) : (
          <Document
            file={url}
            onLoadSuccess={({ numPages: total }) => {
              setNumPages(total);
              setError(null);
            }}
            onLoadError={() =>
              setError(
                "Não foi possível renderizar este PDF aqui. O arquivo continua acessível pelo link abaixo.",
              )
            }
            loading={
              <div
                className="animate-pulse rounded-lg mt-4"
                style={{
                  width: containerWidth ?? 480,
                  // Proporção A4 (√2) para o esqueleto ocupar o mesmo espaço da página real
                  // e a renderização não empurrar o layout ao terminar.
                  height: (containerWidth ?? 480) * 1.414,
                  backgroundColor: "var(--surface-subtle)",
                }}
                aria-label="Carregando documento"
              />
            }
            error={null}
            externalLinkTarget="_blank"
          >
            <motion.div
              key={pageNumber}
              initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
              animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
              transition={appleSpring}
              /*
                  Fundo branco explícito: PDFs assumem papel branco. No tema escuro, uma
                  página transparente sobre o fundo escuro deixaria o texto preto ilegível.
                  Não usar filtro de inversão — destruiria gráficos e figuras do artigo.
              */
              className="shadow-lg rounded-sm overflow-hidden bg-white"
            >
              <Page
                pageNumber={pageNumber}
                {...pageProps}
                renderAnnotationLayer
                renderTextLayer
              />
            </motion.div>
          </Document>
        )}
      </div>
    </div>
  );
}

export default PdfViewer;
