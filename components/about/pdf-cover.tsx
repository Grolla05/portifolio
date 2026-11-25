"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FileText } from "lucide-react";

/*
    Capa do artigo: a primeira página do próprio PDF, renderizada pelo pdf.js.

    Antes o card mostrava um ícone genérico escrito "PDF". Renderizar a página 1 em vez de
    um PNG pré-gerado mantém o fluxo de publicação em UM passo (soltar o PDF em
    public/papers/): a capa sai do arquivo, sem script nem imagem extra para lembrar.

    Mesmas regras do pdf-viewer: pdf.js toca APIs de browser no módulo, então este arquivo
    só entra via `dynamic(..., { ssr: false })` (components/about/about-view.tsx). Sem
    camadas de texto/anotação — é miniatura, não leitura. Se o PDF falhar, volta ao ícone.
*/
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export function CoverFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
      <FileText className="w-9 h-9" style={{ color: "var(--ide-accent-purple)" }} strokeWidth={1.4} />
      <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
        PDF
      </span>
    </div>
  );
}

export function PdfCover({ url, width }: { url: string; width: number }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <CoverFallback />;

  return (
    <Document
      file={url}
      loading={<CoverFallback />}
      error={<CoverFallback />}
      onLoadError={() => setFailed(true)}
      className="flex justify-center"
    >
      <Page
        pageNumber={1}
        width={width}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        loading={<CoverFallback />}
        className="shadow-lg"
      />
    </Document>
  );
}
