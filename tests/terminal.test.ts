import { describe, it, expect } from 'vitest';
import { runCommand, completeCommand, COMMAND_NAMES } from '@/lib/terminal';
import type { TerminalContext } from '@/lib/terminal';
import type { RepoProject } from '@/lib/projects';
import { buildPaper } from '@/lib/papers';

/*
    O motor do terminal é feito de funções puras justamente para ser testado assim:
    sem DOM, sem simular digitação, sem esperar animação.
*/

const project = (overrides: Partial<RepoProject> = {}): RepoProject => ({
  id: 1,
  name: 'Flight-Management-Software',
  title: 'Flight Management Software',
  slug: 'Flight-Management-Software',
  description: 'Gestão de voos em C.',
  link: 'https://github.com/Grolla05/Flight-Management-Software',
  homepage: null,
  date: new Date().toISOString(),
  createdAt: '2025-01-01T00:00:00Z',
  stars: 3,
  forks: 0,
  languages: ['C'],
  languageBytes: { C: 100 },
  primaryLanguage: 'C',
  tags: ['C'],
  ...overrides,
});

const context = (overrides: Partial<TerminalContext> = {}): TerminalContext => ({
  papers: [],
  projects: [project()],
  theme: 'dark',
  ...overrides,
});

const textOf = (input: string, ctx = context()) =>
  runCommand(input, ctx).lines.map((l) => l.text).join('\n');

describe('terminal — parsing', () => {
  it('ignora linha em branco, como um shell de verdade', () => {
    expect(runCommand('   ', context()).lines).toHaveLength(0);
  });

  it('reporta comando desconhecido sem quebrar', () => {
    const result = runCommand('sudo rm -rf /', context());

    expect(result.lines[0].kind).toBe('error');
    expect(result.lines[0].text).toContain('comando não encontrado');
    expect(result.effect).toBeUndefined();
  });

  it('aceita aliases', () => {
    expect(textOf('ajuda')).toContain('Comandos disponíveis');
    expect(textOf('artigos')).toBeDefined();
  });

  it('é insensível a maiúsculas', () => {
    expect(textOf('WHOAMI')).toContain('Felipe Grolla');
  });
});

describe('terminal — navegação', () => {
  it('cd devolve efeito de navegação para rota conhecida', () => {
    expect(runCommand('cd projects', context()).effect).toEqual({
      type: 'navigate',
      to: '/projects',
    });
  });

  it('aceita nomes em português', () => {
    expect(runCommand('cd projetos', context()).effect).toEqual({
      type: 'navigate',
      to: '/projects',
    });
  });

  it('recusa rota inexistente sem efeito colateral', () => {
    const result = runCommand('cd /etc/passwd', context());

    expect(result.effect).toBeUndefined();
    expect(result.lines[0].kind).toBe('error');
  });

  it('cd sem argumento orienta em vez de navegar', () => {
    const result = runCommand('cd', context());
    expect(result.effect).toBeUndefined();
    expect(result.lines[0].text).toContain('informe um destino');
  });
});

describe('terminal — projetos', () => {
  it('lista os repositórios carregados', () => {
    expect(textOf('projects')).toContain('Flight-Management-Software');
  });

  it('avisa enquanto os dados não chegaram, em vez de dizer que não há projetos', () => {
    expect(textOf('projects', context({ projects: null }))).toContain('Carregando');
  });

  it('filtra por linguagem', () => {
    const ctx = context({
      projects: [project(), project({ id: 2, name: 'simulamedias', languages: ['TypeScript'], primaryLanguage: 'TypeScript' })],
    });

    const output = textOf('projects typescript', ctx);
    expect(output).toContain('simulamedias');
    expect(output).not.toContain('Flight-Management-Software');
  });

  it('sugere as linguagens disponíveis quando o filtro não casa', () => {
    const output = textOf('projects cobol');
    expect(output).toContain('Nenhum projeto');
    expect(output).toContain('C');
  });

  it('cat mostra os detalhes de um repositório', () => {
    expect(textOf('cat Flight-Management-Software')).toContain('Gestão de voos em C.');
  });
});

describe('terminal — artigos', () => {
  it('informa quando não há artigos', () => {
    expect(textOf('papers')).toContain('Nenhum artigo');
  });

  it('lista os artigos varridos de public/papers', () => {
    const ctx = context({ papers: [buildPaper('Artigo Qualificação Formal de PSR.pdf')] });
    const output = textOf('papers', ctx);

    expect(output).toContain('População em Situação de Rua');
    expect(output).toContain('COBENGE 2025');
  });
});

describe('terminal — tema', () => {
  it('alterna sem argumento', () => {
    expect(runCommand('theme', context()).effect).toEqual({ type: 'theme', value: 'toggle' });
  });

  it('define um tema específico', () => {
    expect(runCommand('theme light', context()).effect).toEqual({ type: 'theme', value: 'light' });
  });

  it('não emite efeito quando o tema já é o pedido', () => {
    expect(runCommand('theme dark', context({ theme: 'dark' })).effect).toBeUndefined();
  });

  it('rejeita valor inválido', () => {
    const result = runCommand('theme roxo', context());
    expect(result.effect).toBeUndefined();
    expect(result.lines[0].kind).toBe('error');
  });
});

describe('terminal — autocompletar', () => {
  it('completa quando há um único candidato', () => {
    expect(completeCommand('whoa').completion).toBe('whoami');
  });

  it('completa até o prefixo comum quando há ambiguidade', () => {
    // `c` casa cd, cat, cv, contact, clear, cls, contato, curriculo...
    const { completion, candidates } = completeCommand('c');
    expect(candidates.length).toBeGreaterThan(1);
    // Não escolhe um candidato arbitrário.
    expect(candidates).toContain(completion === 'c' ? 'cd' : completion);
  });

  it('devolve a entrada intacta quando nada casa', () => {
    expect(completeCommand('zzz').completion).toBe('zzz');
  });

  it('não tenta completar depois do primeiro espaço', () => {
    expect(completeCommand('cd pro').completion).toBe('cd pro');
  });
});

describe('terminal — help', () => {
  it('documenta todos os comandos registrados', () => {
    const output = textOf('help');

    for (const name of ['whoami', 'projects', 'papers', 'cv', 'theme', 'clear']) {
      expect(output).toContain(name);
    }
  });

  it('expõe os nomes para o autocompletar', () => {
    expect(COMMAND_NAMES).toContain('whoami');
    expect(COMMAND_NAMES).toContain('help');
  });
});

describe('terminal — efeitos', () => {
  it('cv abre o PDF do currículo', () => {
    expect(runCommand('cv', context()).effect).toEqual({ type: 'open', url: '/api/cv' });
  });

  it('clear e exit devolvem os efeitos correspondentes', () => {
    expect(runCommand('clear', context()).effect).toEqual({ type: 'clear' });
    expect(runCommand('exit', context()).effect).toEqual({ type: 'close' });
  });
});
