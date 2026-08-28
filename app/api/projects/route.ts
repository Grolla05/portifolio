import { NextResponse } from 'next/server';
import { GITHUB_USER } from '@/lib/site';
import type { RepoProject } from '@/lib/projects';
import { humanizeRepoName } from '@/lib/projects';
import { githubHeaders } from '@/lib/github';

/*
    Fonte única dos projetos exibidos em /projects.

    Antes a lista era um array fixo de 12 objetos escritos à mão em app/projects/page.tsx.
    Todos apontavam para repositórios inexistentes — os 12 links retornavam 404 na API do
    GitHub. Agora a lista vem da conta real, então é impossível um card apontar para um
    repositório que não existe.

    Filtros aplicados:
      - forks fora: código de outra pessoa não é portfólio
      - arquivados fora
      - o repositório de perfil (Grolla05/Grolla05) fora: é o README do perfil, não projeto
      - `.github` fora: repositório de configuração

    Segurança: usa `/users/{user}/repos`, que devolve SOMENTE repositórios públicos,
    mesmo com GITHUB_TOKEN presente. Não trocar por `/user/repos` — aquele endpoint é
    autenticado, inclui os repositórios privados e publicaria os nomes deles no site.

    Custo de rate limit: 1 chamada de listagem + 1 por repositório (linguagens).
    Com `revalidate: 3600` isso é ~28 chamadas por hora no total — não por visitante —
    contra o limite de 60/h sem autenticação. Definir GITHUB_TOKEN sobe para 5000/h e é
    recomendado assim que o site pegar tráfego.
*/

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  fork: boolean;
  archived: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  created_at: string;
  languages_url: string;
  topics?: string[];
}

const REVALIDATE_SECONDS = 3600;

/**
 * Busca o breakdown de linguagens de um repositório, em bytes.
 *
 * Os `topics` da conta estão todos vazios, então as linguagens são a única fonte real
 * de tags para o filtro lateral. O breakdown por bytes é melhor que o campo `language`
 * sozinho: um repositório TypeScript com CSS e HTML aparece nos três filtros, como
 * deveria, em vez de só no dominante.
 */
async function fetchLanguages(
  repo: GitHubRepo,
): Promise<Record<string, number>> {
  try {
    const res = await fetch(repo.languages_url, {
      headers: githubHeaders(),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()) as Record<string, number>;
  } catch {
    // Degradação suave: sem o breakdown, usa a linguagem dominante que já veio na
    // listagem. Perde granularidade, não perde o card.
    return repo.language ? { [repo.language]: 1 } : {};
  }
}

/** Executa `tasks` com no máximo `limit` em voo — evita 28 conexões simultâneas ao GitHub. */
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  task: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await task(items[index]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  );
  return results;
}

export async function GET() {
  const listUrl =
    `https://api.github.com/users/${GITHUB_USER}/repos` +
    `?per_page=100&sort=pushed&type=owner`;

  let repos: GitHubRepo[];

  try {
    const res = await fetch(listUrl, {
      headers: githubHeaders(),
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          error:
            res.status === 403
              ? 'Limite de requisições do GitHub atingido. Defina GITHUB_TOKEN para elevá-lo.'
              : 'Não foi possível listar os repositórios.',
        },
        { status: res.status === 403 ? 429 : 502 },
      );
    }

    repos = (await res.json()) as GitHubRepo[];
  } catch {
    return NextResponse.json(
      { error: 'Não foi possível contatar a API do GitHub.' },
      { status: 502 },
    );
  }

  const visible = repos.filter(
    (repo) =>
      !repo.fork &&
      !repo.archived &&
      repo.name !== GITHUB_USER &&
      repo.name !== '.github',
  );

  const languageMaps = await mapWithConcurrency(visible, 6, fetchLanguages);

  const projects: RepoProject[] = visible.map((repo, index) => {
    const languageBytes = languageMaps[index];
    const languages = Object.entries(languageBytes)
      .sort(([, a], [, b]) => b - a)
      .map(([name]) => name);

    return {
      id: repo.id,
      name: repo.name,
      title: humanizeRepoName(repo.name),
      slug: repo.name,
      description: repo.description,
      link: repo.html_url,
      homepage: repo.homepage && repo.homepage.length > 0 ? repo.homepage : null,
      date: repo.pushed_at,
      createdAt: repo.created_at,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      languages,
      languageBytes,
      primaryLanguage: languages[0] ?? repo.language ?? null,
      // `tags` mantém o nome que os modais já consomem para casar ícone com linguagem.
      tags: languages,
    };
  });

  return NextResponse.json(
    { projects },
    {
      headers: {
        'Cache-Control':
          'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  );
}
