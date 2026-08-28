"use client";

import { useEffect, useState } from "react";
import type { RepoProject } from "@/lib/projects";

type Status = "loading" | "ready" | "error";

interface UseProjectsResult {
  projects: RepoProject[];
  status: Status;
  error: string | null;
  /** Refaz a busca — usado pelo botão de "tentar de novo" no estado de erro. */
  retry: () => void;
}

/**
 * Carrega os projetos de /api/projects (espelho da conta do GitHub).
 *
 * A rota é cacheada no servidor por 1 hora, então este fetch é barato mesmo em
 * navegação repetida; não vale a pena duplicar cache no cliente.
 */
export function useProjects(): UseProjectsResult {
  const [projects, setProjects] = useState<RepoProject[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setStatus("loading");
    setError(null);

    fetch("/api/projects", { signal: controller.signal })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.error ?? "Falha ao carregar os projetos.");
        }
        return data as { projects: RepoProject[] };
      })
      .then((data) => {
        setProjects(data.projects ?? []);
        setStatus("ready");
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setStatus("error");
      });

    return () => controller.abort();
  }, [attempt]);

  return {
    projects,
    status,
    error,
    retry: () => setAttempt((n) => n + 1),
  };
}
