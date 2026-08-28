import type { Project } from '@/components/projects/project-modal';

/*
    Modelo dos projetos vindos do GitHub.

    Estende `Project` (o contrato que ProjectModal e RepoModal já consomem) em vez de
    substituí-lo, para que os dois modais continuem funcionando sem alteração.
*/
export interface RepoProject extends Omit<Project, 'description'> {
  /** Nome cru do repositório — usado nas URLs da API. */
  name: string;
  /** Descrição do GitHub. Pode ser null: a maioria dos repositórios está sem descrição. */
  description: string | null;
  homepage: string | null;
  createdAt: string;
  stars: number;
  forks: number;
  /** Linguagens ordenadas por bytes, da mais presente para a menos. */
  languages: string[];
  languageBytes: Record<string, number>;
  primaryLanguage: string | null;
}

/**
 * Converte `Flight-Management-Software` em `Flight Management Software`.
 *
 * Não força capitalização: repositórios como `PROJETO-EXT24` e `MIT_6.002.1x` já vêm
 * com a grafia certa, e title-case cego os estragaria.
 */
export function humanizeRepoName(name: string): string {
  return name
    .split(/[-_]+/)
    .filter(Boolean)
    .join(' ')
    .trim();
}

/*
    Ícones de linguagem.

    O diretório public/language_icons cobre só parte das linguagens que aparecem na conta
    (não há arquivo de TypeScript, por exemplo — e o código antigo apontava para
    "Typescript.png", que nunca existiu, deixando o ícone quebrado em silêncio).
    Por isso: quem tem logo usa logo, quem não tem cai no ponto colorido do GitHub.
*/
const LANGUAGE_ICONS: Record<string, string> = {
  'C': '/language_icons/C.svg',
  'C++': '/language_icons/C++.svg',
  'Python': '/language_icons/Python.svg',
  'JavaScript': '/language_icons/JavaScript.svg',
  'HTML': '/language_icons/HTML5.svg',
};

/** Cores oficiais do linguist do GitHub — familiares para quem lê código. */
const LANGUAGE_COLORS: Record<string, string> = {
  'C': '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  'CSS': '#663399',
  'Go': '#00ADD8',
  'HTML': '#e34c26',
  'Java': '#b07219',
  'JavaScript': '#f1e05a',
  'Jupyter Notebook': '#DA5B0B',
  'Makefile': '#427819',
  'PHP': '#4F5D95',
  'Prolog': '#74283c',
  'Python': '#3572A5',
  'Ruby': '#701516',
  'Rust': '#dea584',
  'Shell': '#89e051',
  'SCSS': '#c6538c',
  'TypeScript': '#3178c6',
  'Vue': '#41b883',
};

const FALLBACK_COLOR = '#8b949e';

export function getLanguageIcon(language: string): string | null {
  return LANGUAGE_ICONS[language] ?? null;
}

export function getLanguageColor(language: string): string {
  return LANGUAGE_COLORS[language] ?? FALLBACK_COLOR;
}

/**
 * Abreviação exibida no lugar do logo quando a linguagem não tem ícone.
 * `Jupyter Notebook` vira `JN`, `TypeScript` vira `TS`, `C++` fica `C++`.
 */
export function getLanguageAbbrev(language: string): string {
  if (language.length <= 3) return language;

  const words = language.split(/\s+/);
  if (words.length > 1) {
    return words.map((w) => w[0]).join('').toUpperCase().slice(0, 3);
  }

  // Palavra única: iniciais das partes em CamelCase (TypeScript → TS), com recuo
  // para as duas primeiras letras quando não há maiúscula interna (Python → PY).
  const capitals = language.match(/[A-Z]/g);
  if (capitals && capitals.length > 1) return capitals.join('').slice(0, 3);
  return language.slice(0, 2).toUpperCase();
}

/**
 * Descrição de fallback para repositórios sem `description` no GitHub.
 *
 * Deliberadamente não inventa o propósito do projeto: descreve só o que é verificável
 * a partir dos metadados. A correção de verdade é preencher a descrição no GitHub —
 * o que também melhora o perfil.
 */
export function describeProject(project: RepoProject): string {
  if (project.description) return project.description;

  const langs = project.languages.slice(0, 3);
  if (langs.length === 0) return 'Repositório sem descrição no GitHub.';
  if (langs.length === 1) return `Projeto em ${langs[0]}.`;

  return `Projeto em ${langs.slice(0, -1).join(', ')} e ${langs[langs.length - 1]}.`;
}

/** Formata a data de último push como "há 3 meses" / "ontem". */
export function formatRelativeDate(iso: string): string {
  const then = new Date(iso).getTime();
  const days = Math.floor((Date.now() - then) / 86_400_000);

  if (days <= 0) return 'hoje';
  if (days === 1) return 'ontem';
  if (days < 30) return `há ${days} dias`;

  const months = Math.floor(days / 30);
  if (months < 12) return `há ${months} ${months === 1 ? 'mês' : 'meses'}`;

  const years = Math.floor(months / 12);
  return `há ${years} ${years === 1 ? 'ano' : 'anos'}`;
}

/**
 * Linguagens presentes no conjunto, ordenadas por quantidade de projetos.
 * Alimenta o filtro lateral — que antes era uma lista fixa de 10 tecnologias
 * escrita à mão e desconectada dos dados.
 */
export function collectLanguages(projects: RepoProject[]): string[] {
  const counts = new Map<string, number>();

  for (const project of projects) {
    for (const language of project.languages) {
      counts.set(language, (counts.get(language) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([language]) => language);
}

/**
 * Projetos de sistemas embarcados abrem o README direto (ProjectModal); os demais abrem
 * o navegador de arquivos (RepoModal). Regra herdada do comportamento anterior, que
 * usava a tag "Hardware" — inexistente agora que as tags vêm das linguagens reais.
 * Repositórios em C/C++ costumam ser um ou dois arquivos, onde a árvore não agrega nada.
 */
export function prefersReadmeView(project: RepoProject): boolean {
  return project.primaryLanguage === 'C' || project.primaryLanguage === 'C++';
}
