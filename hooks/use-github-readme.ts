"use client";

import { useEffect, useState } from "react";
import type { RepoTarget } from "@/lib/github-url";

export type ReadmeStatus = "idle" | "loading" | "ready" | "error";

interface UseGitHubReadmeResult {
  /** Markdown cru do README. null enquanto não houver conteúdo carregado. */
  content: string | null;
  status: ReadmeStatus;
  error: string | null;
  /** Refaz a busca — usado pelo botão de "tentar de novo" no estado de erro. */
  retry: () => void;
}

/**
 * Carrega o README de um repositório através de /api/readme.
 *
 * Era uma função privada de components/projects/project-modal.tsx. Virou hook próprio
 * quando a bio do /about passou a renderizar o README de perfil: as duas telas fazem a
 * MESMA busca, e a rota /api/readme já resolve autenticação, escolha de branch, caixa do
 * nome do arquivo e cache de 1 hora. Duplicar o fetch duplicaria também esses acertos.
 *
 * Passar `null` mantém o hook ocioso (status "idle") — necessário porque o modal só
 * conhece o alvo depois que um projeto é selecionado, e hooks não podem ser condicionais.
 */
export function useGitHubReadme(target: RepoTarget | null): UseGitHubReadmeResult {
  const [content, setContent] = useState<string | null>(null);
  const [status, setStatus] = useState<ReadmeStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  /*
      As dependências do efeito são os CAMPOS do alvo, não o objeto: quem chama monta
      `{ owner, repo }` no corpo do render, então a identidade do objeto muda a cada
      render e o efeito refaria o fetch em loop.
  */
  const owner = target?.owner ?? null;
  const repo = target?.repo ?? null;
  const path = target?.path ?? null;

  useEffect(() => {
    if (!owner || !repo) {
      setStatus("idle");
      setContent(null);
      setError(null);
      return;
    }

    const controller = new AbortController();

    setStatus("loading");
    setError(null);
    setContent(null);

    const params = new URLSearchParams({ owner, repo });
    if (path) params.set("path", path);

    fetch(`/api/readme?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? "README.md não encontrado neste repositório."
              : "Falha ao carregar o README do GitHub.",
          );
        }
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setStatus("ready");
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setStatus("error");
      });

    return () => controller.abort();
  }, [owner, repo, path, attempt]);

  return {
    content,
    status,
    error,
    retry: () => setAttempt((n) => n + 1),
  };
}
