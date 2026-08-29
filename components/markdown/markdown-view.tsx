"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { Components } from "react-markdown";

/*
    Vocabulário visual do markdown renderizado.

    Estava embutido em components/projects/project-modal.tsx. Saiu de lá quando a bio do
    /about passou a renderizar o README de perfil: dois mapas de componentes divergem no
    primeiro ajuste de espaçamento, e o site passaria a ter dois markdowns com aparências
    diferentes.

    Todas as cores vêm de tokens — nada de hex literal. Pesos ficam em 400/500, como o
    resto da interface.
*/
export const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1
      style={{
        color: "var(--text-primary)",
        fontSize: "1.375rem",
        fontWeight: 500,
        marginBottom: "16px",
        borderBottom: "1px solid var(--border-subtle)",
        paddingBottom: "8px",
      }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      style={{
        color: "var(--text-primary)",
        fontSize: "1.125rem",
        fontWeight: 500,
        marginBottom: "12px",
        marginTop: "24px",
      }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      style={{
        color: "var(--ide-accent-text)",
        fontSize: "1rem",
        fontWeight: 500,
        marginBottom: "8px",
        marginTop: "20px",
      }}
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p style={{ color: "var(--text-secondary)", lineHeight: "1.75", marginBottom: "12px" }}>
      {children}
    </p>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = !!className;
    if (isBlock) {
      return (
        <code
          className={className}
          style={{
            fontSize: "0.875em",
            color: "var(--text-primary)",
            fontFamily: "var(--font-mono)",
          }}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        style={{
          backgroundColor: "var(--bg-primary)",
          color: "var(--syntax-string)",
          padding: "2px 6px",
          borderRadius: "4px",
          fontSize: "0.875em",
          fontFamily: "var(--font-mono)",
        }}
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre
      style={{
        backgroundColor: "var(--bg-primary)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "8px",
        padding: "16px",
        overflow: "auto",
        marginBottom: "16px",
        fontFamily: "var(--font-mono)",
        fontSize: "0.875rem",
      }}
    >
      {children}
    </pre>
  ),
  ul: ({ children }) => (
    <ul
      style={{
        color: "var(--text-secondary)",
        paddingLeft: "20px",
        marginBottom: "12px",
        listStyleType: "disc",
      }}
    >
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol
      style={{
        color: "var(--text-secondary)",
        paddingLeft: "20px",
        marginBottom: "12px",
        listStyleType: "decimal",
      }}
    >
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li style={{ marginBottom: "6px", lineHeight: "1.65", color: "var(--text-secondary)" }}>
      {children}
    </li>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "var(--ide-accent-text)", textDecoration: "none" }}
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote
      style={{
        borderLeft: "3px solid var(--ide-accent)",
        paddingLeft: "16px",
        margin: "16px 0",
        color: "var(--text-muted)",
      }}
    >
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ color: "var(--syntax-type)", fontStyle: "italic" }}>{children}</em>
  ),
  hr: () => (
    <hr style={{ borderColor: "var(--border-subtle)", margin: "24px 0", borderTopWidth: 1 }} />
  ),
  table: ({ children }) => (
    <div style={{ overflowX: "auto", marginBottom: "16px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th
      style={{
        padding: "8px 12px",
        textAlign: "left",
        backgroundColor: "var(--bg-tertiary)",
        color: "var(--text-primary)",
        borderBottom: "1px solid var(--border-default)",
        fontSize: "0.875rem",
        fontWeight: 500,
      }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td
      style={{
        padding: "8px 12px",
        color: "var(--text-secondary)",
        borderBottom: "1px solid var(--border-subtle)",
        fontSize: "0.875rem",
      }}
    >
      {children}
    </td>
  ),
  img: ({ src, alt, width, height }) => {
    /*
        READMEs de perfil são majoritariamente badges (shields.io, github-readme-stats).
        Tratadas como imagem de bloco, cada uma quebraria linha e a bio viraria uma coluna
        vertical de selos. Inline preserva a fileira que o autor escreveu.
    */
    const isBadge =
      typeof src === "string" &&
      (src.includes("shields.io") ||
        src.includes("badge") ||
        src.includes("img.shields") ||
        (typeof width === "number" && width < 200) ||
        (typeof height === "number" && height < 40));

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? ""}
        style={
          isBadge
            ? { display: "inline-block", verticalAlign: "middle", margin: "2px 4px" }
            : { maxWidth: "100%", borderRadius: "8px", display: "block", margin: "12px 0" }
        }
      />
    );
  },
};

/**
 * Markdown renderizado com o vocabulário visual do site.
 *
 * `rehypeRaw` é necessário porque READMEs de perfil usam HTML cru o tempo todo
 * (`<img align="right">`, `<h1 align="center">`, `<details>`). Sem ele esses blocos
 * apareceriam como texto literal.
 */
export function MarkdownView({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  );
}
