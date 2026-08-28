import { describe, it, expect } from 'vitest';
import { isOwnRepo, safeContentPath, githubHeaders } from '@/lib/github';
import { GITHUB_USER } from '@/lib/site';

/*
    Guardas das rotas que falam com a API do GitHub.

    O caso que motivou o arquivo: /api/repo interpolava `path` cru na URL, e o parser de
    URL normaliza dot-segments — `../../../../user/repos` escapava do prefixo
    `/repos/{owner}/{repo}/contents` e chegava em `https://api.github.com/user/repos`,
    endpoint autenticado que devolve os repositórios PRIVADOS da conta.
*/

/** Byte nulo montado em runtime para não deixar caractere de controle no fonte. */
const NUL = String.fromCharCode(0);

describe('safeContentPath', () => {
  it('rejeita travessia que escaparia do prefixo /contents', () => {
    expect(safeContentPath('../../../../user/repos')).toBeNull();
    expect(safeContentPath('..')).toBeNull();
    expect(safeContentPath('src/../../../user')).toBeNull();
    expect(safeContentPath('./secret')).toBeNull();
  });

  it('rejeita byte nulo', () => {
    expect(safeContentPath(`src/main${NUL}.c`)).toBeNull();
  });

  it('preserva caminhos legítimos', () => {
    expect(safeContentPath('src/main.c')).toBe('src/main.c');
    expect(safeContentPath('README.md')).toBe('README.md');
  });

  it('aceita caminho vazio — é a raiz do repositório', () => {
    expect(safeContentPath('')).toBe('');
  });

  it('codifica cada segmento e mantém a barra como separador', () => {
    // Antes nada era codificado: um espaço no nome gerava URL malformada.
    expect(safeContentPath('docs/Tailwind CSS.png')).toBe('docs/Tailwind%20CSS.png');
    expect(safeContentPath('a b/c d')).toBe('a%20b/c%20d');
  });

  it('tolera barra inicial, final e duplicada', () => {
    expect(safeContentPath('/src/')).toBe('src');
    expect(safeContentPath('src//lib')).toBe('src/lib');
  });
});

describe('isOwnRepo', () => {
  it('aceita repositórios do dono do site', () => {
    expect(isOwnRepo(GITHUB_USER, 'JARVIS')).toBe(true);
    expect(isOwnRepo(GITHUB_USER, 'Estrutura-de-Dados')).toBe(true);
    expect(isOwnRepo(GITHUB_USER, 'MIT_6.002.1x')).toBe(true);
  });

  it('ignora a caixa do usuário — o GitHub também ignora', () => {
    expect(isOwnRepo(GITHUB_USER.toLowerCase(), 'JARVIS')).toBe(true);
    expect(isOwnRepo(GITHUB_USER.toUpperCase(), 'JARVIS')).toBe(true);
  });

  it('recusa qualquer outra conta — a rota não é proxy aberto do GitHub', () => {
    expect(isOwnRepo('torvalds', 'linux')).toBe(false);
    expect(isOwnRepo('', 'linux')).toBe(false);
  });

  it('recusa nome de repositório fora do charset do GitHub', () => {
    expect(isOwnRepo(GITHUB_USER, '../other')).toBe(false);
    expect(isOwnRepo(GITHUB_USER, 'a/b')).toBe(false);
    expect(isOwnRepo(GITHUB_USER, 'x?y')).toBe(false);
    expect(isOwnRepo(GITHUB_USER, '..')).toBe(false);
    expect(isOwnRepo(GITHUB_USER, '')).toBe(false);
  });
});

describe('githubHeaders', () => {
  it('usa o Accept padrão da API e permite sobrepô-lo', () => {
    expect(githubHeaders().Accept).toBe('application/vnd.github+json');
    expect(githubHeaders('application/vnd.github.raw+json').Accept).toBe(
      'application/vnd.github.raw+json',
    );
  });

  it('só envia Authorization quando GITHUB_TOKEN existe', () => {
    const original = process.env.GITHUB_TOKEN;

    delete process.env.GITHUB_TOKEN;
    expect(githubHeaders().Authorization).toBeUndefined();

    process.env.GITHUB_TOKEN = 'token-de-teste';
    expect(githubHeaders().Authorization).toBe('Bearer token-de-teste');

    if (original === undefined) delete process.env.GITHUB_TOKEN;
    else process.env.GITHUB_TOKEN = original;
  });
});
