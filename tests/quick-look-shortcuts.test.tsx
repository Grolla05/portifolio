import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ProjectsPage from '@/app/projects/page';

/*
    Estes testes assertavam sobre o texto "Project 1" — rótulo dos 12 projetos fictícios
    que viviam hardcoded em app/projects/page.tsx e apontavam para repositórios
    inexistentes. Com a lista vindo de /api/projects, o teste passa a exercitar o caminho
    real: resposta da API → card → Quick Look.
*/

const FIXTURE = {
  projects: [
    {
      id: 101,
      name: 'Flight-Management-Software',
      title: 'Flight Management Software',
      slug: 'Flight-Management-Software',
      description: 'Sistema de gestão de voos em C.',
      link: 'https://github.com/Grolla05/Flight-Management-Software',
      homepage: null,
      date: '2025-04-30T17:21:39Z',
      createdAt: '2025-01-02T10:00:00Z',
      stars: 3,
      forks: 0,
      // C como linguagem dominante roteia para o ProjectModal (visão de README).
      languages: ['C'],
      languageBytes: { C: 12000 },
      primaryLanguage: 'C',
      tags: ['C'],
    },
    {
      id: 102,
      name: 'simulamedias',
      title: 'simulamedias',
      slug: 'simulamedias',
      description: null,
      link: 'https://github.com/Grolla05/simulamedias',
      homepage: null,
      date: '2025-12-02T14:09:40Z',
      createdAt: '2025-10-01T10:00:00Z',
      stars: 0,
      forks: 0,
      languages: ['TypeScript', 'CSS'],
      languageBytes: { TypeScript: 209643, CSS: 2781 },
      primaryLanguage: 'TypeScript',
      tags: ['TypeScript', 'CSS'],
    },
  ],
};

function jsonResponse(body: unknown) {
  return {
    ok: true,
    status: 200,
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as unknown as Response;
}

function textResponse(body: string) {
  return {
    ok: true,
    status: 200,
    json: async () => ({}),
    text: async () => body,
  } as unknown as Response;
}

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.startsWith('/api/projects')) return Promise.resolve(jsonResponse(FIXTURE));
      if (url.startsWith('/api/readme')) return Promise.resolve(textResponse('# Flight Management\n'));
      if (url.startsWith('/api/repo')) return Promise.resolve(jsonResponse({ type: 'dir', items: [] }));
      return Promise.reject(new Error(`URL não mockada: ${url}`));
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Projects Page — Quick Look (Espaço) e navegação por teclado', () => {
  it('carrega os projetos da API e abre o Quick Look com Espaço', async () => {
    render(<ProjectsPage />);

    const title = await screen.findByText('Flight Management Software');
    expect(title).toBeDefined();

    const cardButton = title.closest('.group')?.querySelector('button');
    expect(cardButton).toBeDefined();

    cardButton!.focus();
    expect(document.activeElement).toBe(cardButton);

    fireEvent.keyDown(cardButton!, { key: ' ', code: 'Space' });

    await waitFor(() => {
      expect(
        screen.getAllByText(/readme\.md|detalhes do projeto|arquivos do repositório/i).length,
      ).toBeGreaterThanOrEqual(1);
    });
  });

  it('fecha o Quick Look com Escape', async () => {
    render(<ProjectsPage />);

    const title = await screen.findByText('Flight Management Software');
    const cardButton = title.closest('.group')?.querySelector('button');

    fireEvent.click(cardButton!);

    await waitFor(() => {
      expect(
        screen.getAllByText(/readme\.md|detalhes do projeto|arquivos do repositório/i).length,
      ).toBeGreaterThanOrEqual(1);
    });

    fireEvent.keyDown(window, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryAllByText(/readme\.md/i).length).toBe(0);
    });
  });

  it('usa descrição derivada das linguagens quando o repositório não tem descrição', async () => {
    render(<ProjectsPage />);

    // simulamedias vem com description: null — o texto do card é gerado a partir
    // das linguagens em vez de ficar vazio.
    expect(await screen.findByText('Projeto em TypeScript e CSS.')).toBeDefined();
  });
});
