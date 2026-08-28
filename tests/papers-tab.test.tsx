import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { buildPaper, sortPapers, slugifyFileName, paperUrl, paperCitation } from '@/lib/papers';

/*
    O visualizador é mockado: pdf.js precisa de canvas, DOMMatrix e Worker, que o jsdom
    não implementa. O que se cobre aqui é a integração da página — que o PDF varrido da
    pasta vira arquivo na árvore, abre em aba e monta o painel certo.
*/
vi.mock('@/components/about/pdf-viewer', () => ({
  PdfViewer: ({ url, title }: { url: string; title: string }) => (
    <div data-testid="pdf-viewer" data-url={url} data-title={title} />
  ),
}));

import AboutView from '@/components/about/about-view';

const REGISTERED = 'Artigo Qualificação Formal de PSR.pdf';
const UNREGISTERED = 'Rascunho sem metadados.pdf';

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('lib/papers — derivação a partir do nome do arquivo', () => {
  it('deriva id sem acento a partir do nome do arquivo', () => {
    expect(slugifyFileName(REGISTERED)).toBe('artigo-qualificacao-formal-de-psr');
  });

  it('usa os metadados registrados quando existem', () => {
    const paper = buildPaper(REGISTERED);

    expect(paper.title).toContain('População em Situação de Rua');
    expect(paper.year).toBe(2025);
    expect(paper.doi).toContain('10.37702');
    expect(paper.authors).toContain('Felipe Grolla Freitas');
  });

  it('aceita PDF sem metadados, derivando o título do nome do arquivo', () => {
    const paper = buildPaper(UNREGISTERED);

    expect(paper.title).toBe('Rascunho sem metadados');
    expect(paper.year).toBeUndefined();
    expect(paper.abstract).toBeUndefined();
    // Sem venue nem ano, a linha de citação some em vez de virar ", ".
    expect(paperCitation(paper)).toBe('');
  });

  it('codifica espaços e acentos na URL do PDF', () => {
    // Sem codificar, o navegador pediria o caminho cru e receberia 404.
    expect(paperUrl(buildPaper(REGISTERED))).toBe(
      '/papers/Artigo%20Qualifica%C3%A7%C3%A3o%20Formal%20de%20PSR.pdf',
    );
  });

  it('ordena por ano decrescente, com os sem ano no fim', () => {
    const ordered = sortPapers([
      buildPaper(UNREGISTERED),
      buildPaper(REGISTERED),
    ]);

    expect(ordered[0].file).toBe(REGISTERED);
    expect(ordered[1].file).toBe(UNREGISTERED);
  });
});

describe('Página Sobre — pasta research', () => {
  it('não mostra a pasta research quando não há PDF na pasta', () => {
    render(<AboutView papers={[]} />);

    expect(screen.queryByText('research')).toBeNull();
  });

  it('lista qualquer PDF varrido de public/papers', () => {
    render(<AboutView papers={[buildPaper(REGISTERED), buildPaper(UNREGISTERED)]} />);

    expect(screen.getAllByText('research').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(REGISTERED).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(UNREGISTERED).length).toBeGreaterThanOrEqual(1);
  });

  it('abre o artigo em aba e monta o painel de informações', async () => {
    render(<AboutView papers={[buildPaper(REGISTERED)]} />);

    fireEvent.click(screen.getAllByText(REGISTERED)[0]);

    /*
        Asserta MONTAGEM, não visibilidade: o framer-motion anima via requestAnimationFrame,
        que não roda no jsdom, então o wrapper permanece no estado `initial` (opacity 0)
        mesmo funcionando no navegador. Verificar opacidade aqui daria falso negativo.
    */
    await waitFor(() => {
      expect(screen.getByText('Paper info')).toBeDefined();
    });

    // O venue aparece duas vezes: na linha de citação e na linha "Publicado em".
    expect(screen.getAllByText(/COBENGE 2025/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Extensão Universitária/)).toBeDefined();
  });

  it('monta o painel mesmo para PDF sem metadados, omitindo as seções vazias', async () => {
    render(<AboutView papers={[buildPaper(UNREGISTERED)]} />);

    fireEvent.click(screen.getAllByText(UNREGISTERED)[0]);

    await waitFor(() => {
      expect(screen.getByText('Paper info')).toBeDefined();
    });

    expect(screen.getByText('Rascunho sem metadados')).toBeDefined();
    expect(screen.queryByText('Resumo')).toBeNull();
    expect(screen.queryByText('Ano')).toBeNull();
  });

  it('aponta o visualizador para o arquivo em public/papers', async () => {
    render(<AboutView papers={[buildPaper(REGISTERED)]} />);

    fireEvent.click(screen.getAllByText(REGISTERED)[0]);

    const viewer = await screen.findByTestId('pdf-viewer');
    expect(viewer.getAttribute('data-url')).toBe(
      '/papers/Artigo%20Qualifica%C3%A7%C3%A3o%20Formal%20de%20PSR.pdf',
    );
  });

  it('troca de aba monta o componente correspondente', async () => {
    render(<AboutView papers={[]} />);

    expect(screen.getByText(/About me/i)).toBeDefined();

    fireEvent.click(screen.getAllByText('hobbies')[0]);
    fireEvent.click(screen.getAllByText('hobbies.ts')[0]);

    await waitFor(() => {
      expect(screen.getByText(/Hobbies preview/i)).toBeDefined();
    });
  });
});
