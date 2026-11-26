import { githubHeaders, isOwnRepo } from '@/lib/github';
import { GITHUB_USER } from '@/lib/site';

/*
    Dados públicos de um repositório do dono do site, para a página de estudo de caso
    (/projects/[slug]): tópicos (a "Stack" da ficha), linguagens, descrição e demo.

    Roda no servidor (usa githubHeaders → GITHUB_TOKEN). Cache de 1h via fetch.revalidate:
    o GitHub recebe no máximo ~2 chamadas por repositório por hora, não uma por visitante.

    Devolve null quando o repositório não existe OU a chamada falha (rate limit, rede). Na
    página, null significa "sem dados do GitHub": o estudo curado cai na stack escrita à mão
    e um slug sem estudo curado vira 404 — nunca uma página vazia.
*/
const REVALIDATE_SECONDS = 3600;

export interface RepoInfo {
  name: string;
  description: string | null;
  homepage: string | null;
  htmlUrl: string;
  /** Tópicos do GitHub, na ordem da API (kebab-case). */
  topics: string[];
  /** Linguagens ordenadas por bytes, da mais presente para a menos. */
  languages: string[];
  /**
   * Mesmo critério de /api/projects: false para fork, arquivado, repositório de perfil e
   * `.github` — eles não são projetos do portfólio e não ganham página própria.
   */
  listed: boolean;
}

interface GitHubRepoResponse {
  name: string;
  description: string | null;
  homepage: string | null;
  html_url: string;
  topics?: unknown;
  language: string | null;
  languages_url: string;
  fork: boolean;
  archived: boolean;
}

async function fetchLanguages(url: string, fallback: string | null): Promise<string[]> {
  try {
    const res = await fetch(url, { headers: githubHeaders(), next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) throw new Error(String(res.status));
    const bytes = (await res.json()) as Record<string, number>;
    return Object.entries(bytes)
      .sort(([, a], [, b]) => b - a)
      .map(([name]) => name);
  } catch {
    return fallback ? [fallback] : [];
  }
}

export async function getRepoInfo(repo: string): Promise<RepoInfo | null> {
  if (!isOwnRepo(GITHUB_USER, repo)) return null;

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${repo}`, {
      headers: githubHeaders(),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as GitHubRepoResponse;
    const topics = Array.isArray(data.topics)
      ? data.topics.filter((t): t is string => typeof t === 'string' && t.length > 0)
      : [];

    return {
      name: data.name,
      description: data.description,
      homepage: data.homepage && data.homepage.length > 0 ? data.homepage : null,
      htmlUrl: data.html_url,
      topics,
      languages: await fetchLanguages(data.languages_url, data.language),
      listed:
        !data.fork &&
        !data.archived &&
        data.name.toLowerCase() !== GITHUB_USER.toLowerCase() &&
        data.name !== '.github',
    };
  } catch {
    return null;
  }
}
