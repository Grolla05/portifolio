import { GITHUB_USER } from '@/lib/site';

/*
    Parsing de URL do GitHub — lado do CLIENTE.

    Vive separado de lib/github.ts de propósito: aquele módulo lê process.env.GITHUB_TOKEN
    em githubHeaders() e só deve rodar no servidor. Importá-lo de um componente 'use client'
    arrastaria o segredo para o grafo do bundle.

    A função abaixo estava duplicada, idêntica, em components/projects/project-modal.tsx e
    em components/projects/repo-modal.tsx.
*/

export interface RepoTarget {
  owner: string;
  repo: string;
  /** Subpasta dentro do repositório (monorepos). Ausente = raiz. */
  path?: string;
}

/**
 * Extrai owner/repo (e a subpasta, quando houver) de uma URL do GitHub.
 * Retorna null para qualquer coisa que não seja uma URL de repositório.
 *
 * O `path` sai em forma NATURAL (decodificado): `docs/Tailwind CSS`, não
 * `docs/Tailwind%20CSS`. É o contrato que /api/repo e /api/readme esperam — ambas
 * chamam `safeContentPath`, que codifica segmento a segmento na saída.
 *
 * As duas cópias anteriores divergiam exatamente aqui: a de repo-modal.tsx decodificava,
 * a de project-modal.tsx não — e /api/readme compensava com um decode extra do lado do
 * servidor. Ver o comentário em app/api/readme/route.ts.
 */
export function parseGitHubUrl(url: string): RepoTarget | null {
  // github.com/owner/repo/tree/branch/caminho/da/pasta
  const treeMatch = url.match(/github\.com\/([^/]+)\/([^/]+)\/tree\/[^/]+\/(.+)/);
  if (treeMatch) {
    return {
      owner: treeMatch[1],
      repo: treeMatch[2],
      path: decodeURIComponent(treeMatch[3]),
    };
  }

  // github.com/owner/repo
  const repoMatch = url.match(/github\.com\/([^/]+)\/([^/?#]+)/);
  if (!repoMatch) return null;

  return { owner: repoMatch[1], repo: repoMatch[2] };
}

/**
 * README de perfil do dono do site — o repositório `usuario/usuario`, cujo README o
 * GitHub exibe na página de perfil.
 *
 * Derivado de GITHUB_USER e não escrito à mão: trocar o handle em lib/site.ts precisa
 * mover junto os projetos, o link social E esta bio, sem sobrar uma URL literal para
 * alguém esquecer. `isOwnRepo` (lib/github.ts) aprova o alvo porque owner === GITHUB_USER.
 */
export const PROFILE_README: RepoTarget = {
  owner: GITHUB_USER,
  repo: GITHUB_USER,
};

/** URL pública do repositório de um alvo — usada nos links "ver no GitHub". */
export function repoUrl({ owner, repo }: RepoTarget): string {
  return `https://github.com/${owner}/${repo}`;
}
