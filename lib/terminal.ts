import { SITE_NAME, SITE_TAGLINE, SOCIAL, GITHUB_USER } from './site';
import type { Paper } from './papers';
import { paperUrl } from './papers';
import type { RepoProject } from './projects';
import { describeProject, formatRelativeDate } from './projects';

/*
    Motor do terminal integrado.

    Toda a lógica de comandos vive aqui, separada do componente: são funções puras que
    recebem argumentos e devolvem linhas, então dá para testá-las sem montar DOM nem
    simular digitação. O componente só cuida de entrada, histórico e rolagem.

    Efeitos colaterais (navegar, abrir aba, trocar tema) não são executados aqui — são
    DEVOLVIDOS como um `effect` para o componente aplicar. Isso mantém os comandos
    testáveis e concentra o acesso a `router`, `window` e `next-themes` num lugar só.
*/

export type LineKind = 'output' | 'error' | 'muted' | 'accent' | 'command';

export interface TerminalLine {
  kind: LineKind;
  text: string;
}

export type TerminalEffect =
  | { type: 'navigate'; to: string }
  | { type: 'open'; url: string }
  | { type: 'theme'; value: 'dark' | 'light' | 'toggle' }
  | { type: 'clear' }
  | { type: 'close' };

export interface CommandResult {
  lines: TerminalLine[];
  effect?: TerminalEffect;
}

/** Dados que o terminal precisa e que só existem em runtime. */
export interface TerminalContext {
  papers: Paper[];
  /** Projetos do GitHub. `null` enquanto a busca não terminou. */
  projects: RepoProject[] | null;
  theme: string | undefined;
}

interface CommandSpec {
  name: string;
  /** Uso resumido, exibido pelo `help`. */
  usage: string;
  description: string;
  /** Nomes alternativos aceitos na linha de comando. */
  aliases?: string[];
  run: (args: string[], context: TerminalContext) => CommandResult;
}

const out = (text: string): TerminalLine => ({ kind: 'output', text });
const muted = (text: string): TerminalLine => ({ kind: 'muted', text });
const accent = (text: string): TerminalLine => ({ kind: 'accent', text });
const error = (text: string): TerminalLine => ({ kind: 'error', text });

const ROUTES: Record<string, string> = {
  '/': '/',
  home: '/',
  inicio: '/',
  about: '/about',
  sobre: '/about',
  projects: '/projects',
  projetos: '/projects',
  contact: '/contact',
  contato: '/contact',
};

/** Alinha `name` num bloco de largura fixa para as listagens ficarem em colunas. */
function pad(text: string, width: number): string {
  return text.length >= width ? text : text + ' '.repeat(width - text.length);
}

const COMMANDS: CommandSpec[] = [
  {
    name: 'help',
    usage: 'help',
    description: 'Lista os comandos disponíveis.',
    aliases: ['?', 'ajuda'],
    run: () => ({
      lines: [
        accent('Comandos disponíveis'),
        ...COMMANDS.map((command) =>
          out(`  ${pad(command.usage, 22)} ${command.description}`),
        ),
        muted(''),
        muted('Use ↑ e ↓ para navegar no histórico, Tab para completar, Esc para fechar.'),
      ],
    }),
  },
  {
    name: 'whoami',
    usage: 'whoami',
    description: 'Quem sou eu, em três linhas.',
    run: () => ({
      lines: [
        accent(SITE_NAME),
        out(SITE_TAGLINE),
        muted(`github.com/${GITHUB_USER} · disponível para oportunidades`),
      ],
    }),
  },
  {
    name: 'ls',
    usage: 'ls',
    description: 'Lista as seções do site.',
    aliases: ['dir'],
    run: () => ({
      lines: [
        out(`${pad('home/', 14)} apresentação`),
        out(`${pad('about/', 14)} bio, formação, interesses e artigos`),
        out(`${pad('projects/', 14)} repositórios do GitHub`),
        out(`${pad('contact/', 14)} formulário e canais diretos`),
      ],
    }),
  },
  {
    name: 'cd',
    usage: 'cd <seção>',
    description: 'Navega até uma seção (ex.: cd projects).',
    aliases: ['open', 'goto'],
    run: (args) => {
      const target = (args[0] ?? '').replace(/\/+$/, '').toLowerCase();

      if (!target) {
        return { lines: [error('cd: informe um destino. Use `ls` para ver as opções.')] };
      }

      const route = ROUTES[target];
      if (!route) {
        return {
          lines: [error(`cd: seção não encontrada: ${target}`), muted('Use `ls` para ver as opções.')],
        };
      }

      return { lines: [muted(`→ ${route}`)], effect: { type: 'navigate', to: route } };
    },
  },
  {
    name: 'projects',
    usage: 'projects [linguagem]',
    description: 'Lista os repositórios, opcionalmente filtrando por linguagem.',
    aliases: ['repos'],
    run: (args, { projects }) => {
      if (projects === null) {
        return { lines: [muted('Carregando repositórios do GitHub...')] };
      }

      if (projects.length === 0) {
        return { lines: [error('Nenhum repositório retornado pela API do GitHub.')] };
      }

      const filter = args[0]?.toLowerCase();
      const filtered = filter
        ? projects.filter((p) => p.languages.some((l) => l.toLowerCase() === filter))
        : projects;

      if (filtered.length === 0) {
        return {
          lines: [
            error(`Nenhum projeto em "${args[0]}".`),
            muted(`Linguagens: ${[...new Set(projects.flatMap((p) => p.languages))].join(', ')}`),
          ],
        };
      }

      return {
        lines: [
          accent(`${filtered.length} repositório(s)`),
          ...filtered.map((project) =>
            out(
              `  ${pad(project.name, 30)} ${pad(project.primaryLanguage ?? '—', 14)} ${formatRelativeDate(project.date)}`,
            ),
          ),
          muted(''),
          muted('Detalhes em /projects — use `cd projects`.'),
        ],
      };
    },
  },
  {
    name: 'cat',
    usage: 'cat <repositório>',
    description: 'Mostra a descrição de um repositório.',
    run: (args, { projects }) => {
      const name = args[0];
      if (!name) return { lines: [error('cat: informe o nome do repositório.')] };
      if (projects === null) return { lines: [muted('Carregando repositórios do GitHub...')] };

      const project = projects.find((p) => p.name.toLowerCase() === name.toLowerCase());
      if (!project) {
        return { lines: [error(`cat: repositório não encontrado: ${name}`)] };
      }

      return {
        lines: [
          accent(project.name),
          out(describeProject(project)),
          muted(`${project.languages.join(', ') || 'sem linguagem detectada'} · ${project.stars} ★`),
          muted(project.link),
        ],
      };
    },
  },
  {
    name: 'papers',
    usage: 'papers',
    description: 'Lista os artigos publicados.',
    aliases: ['artigos'],
    run: (_args, { papers }) => {
      if (papers.length === 0) {
        return { lines: [muted('Nenhum artigo publicado ainda.')] };
      }

      return {
        lines: [
          accent(`${papers.length} artigo(s)`),
          ...papers.flatMap((paper) => [
            out(`  ${paper.title}`),
            muted(`    ${[paper.venue, paper.year].filter(Boolean).join(', ') || 'sem metadados'}`),
            muted(`    ${paperUrl(paper)}`),
          ]),
        ],
      };
    },
  },
  {
    name: 'cv',
    usage: 'cv',
    description: 'Abre o currículo em PDF.',
    aliases: ['curriculo'],
    run: () => ({
      lines: [muted('Abrindo currículo em PDF...')],
      effect: { type: 'open', url: '/api/cv' },
    }),
  },
  {
    name: 'contact',
    usage: 'contact',
    description: 'Mostra os canais de contato.',
    aliases: ['contato'],
    run: () => ({
      lines: [
        out(`${pad('e-mail', 12)} ${SOCIAL.email}`),
        out(`${pad('github', 12)} ${SOCIAL.github}`),
        out(`${pad('linkedin', 12)} ${SOCIAL.linkedin}`),
        muted(''),
        muted('Formulário em /contact — use `cd contact`.'),
      ],
    }),
  },
  {
    name: 'github',
    usage: 'github',
    description: 'Abre o perfil no GitHub.',
    run: () => ({
      lines: [muted(`Abrindo ${SOCIAL.github}`)],
      effect: { type: 'open', url: SOCIAL.github },
    }),
  },
  {
    name: 'linkedin',
    usage: 'linkedin',
    description: 'Abre o perfil no LinkedIn.',
    run: () => ({
      lines: [muted(`Abrindo ${SOCIAL.linkedin}`)],
      effect: { type: 'open', url: SOCIAL.linkedin },
    }),
  },
  {
    name: 'theme',
    usage: 'theme [dark|light]',
    description: 'Troca o tema. Sem argumento, alterna.',
    aliases: ['tema'],
    run: (args, { theme }) => {
      const requested = args[0]?.toLowerCase();

      if (!requested) {
        return { lines: [muted('Alternando tema.')], effect: { type: 'theme', value: 'toggle' } };
      }

      if (requested !== 'dark' && requested !== 'light') {
        return { lines: [error(`theme: valor inválido "${args[0]}". Use dark ou light.`)] };
      }

      if (requested === theme) {
        return { lines: [muted(`Tema já está em ${requested}.`)] };
      }

      return {
        lines: [muted(`Tema alterado para ${requested}.`)],
        effect: { type: 'theme', value: requested },
      };
    },
  },
  {
    name: 'echo',
    usage: 'echo <texto>',
    description: 'Repete o texto informado.',
    run: (args) => ({ lines: [out(args.join(' '))] }),
  },
  {
    name: 'clear',
    usage: 'clear',
    description: 'Limpa o terminal.',
    aliases: ['cls'],
    run: () => ({ lines: [], effect: { type: 'clear' } }),
  },
  {
    name: 'exit',
    usage: 'exit',
    description: 'Fecha o terminal.',
    aliases: ['quit'],
    run: () => ({ lines: [], effect: { type: 'close' } }),
  },
];

/** Todos os nomes aceitos, incluindo aliases — usado pelo autocompletar do Tab. */
export const COMMAND_NAMES: string[] = COMMANDS.flatMap((c) => [c.name, ...(c.aliases ?? [])]).sort();

function findCommand(name: string): CommandSpec | undefined {
  const lower = name.toLowerCase();
  return COMMANDS.find((c) => c.name === lower || c.aliases?.includes(lower));
}

/**
 * Executa uma linha digitada.
 * Entrada vazia devolve nada — o comportamento de shell para Enter em linha em branco.
 */
export function runCommand(input: string, context: TerminalContext): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };

  const [name, ...args] = trimmed.split(/\s+/);
  const command = findCommand(name);

  if (!command) {
    return {
      lines: [
        error(`comando não encontrado: ${name}`),
        muted('Digite `help` para ver os comandos disponíveis.'),
      ],
    };
  }

  return command.run(args, context);
}

/**
 * Completa um nome de comando parcial.
 * Devolve o prefixo comum a todos os candidatos — o mesmo comportamento do bash, que
 * completa até onde não há ambiguidade em vez de escolher um candidato arbitrário.
 */
export function completeCommand(partial: string): { completion: string; candidates: string[] } {
  const prefix = partial.trimStart().toLowerCase();

  if (!prefix || prefix.includes(' ')) return { completion: partial, candidates: [] };

  const candidates = COMMAND_NAMES.filter((name) => name.startsWith(prefix));
  if (candidates.length === 0) return { completion: partial, candidates: [] };
  if (candidates.length === 1) return { completion: candidates[0], candidates };

  let common = candidates[0];
  for (const candidate of candidates.slice(1)) {
    while (!candidate.startsWith(common)) common = common.slice(0, -1);
  }

  return { completion: common, candidates };
}

export const WELCOME_LINES: TerminalLine[] = [
  accent(`${SITE_NAME} — terminal`),
  muted('Digite `help` para ver os comandos. Ctrl+` fecha.'),
];
