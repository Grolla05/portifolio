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

  /*
      A aba de bio (components/about/bio.tsx) busca o README de perfil em /api/readme no
      mount. Sem stub, o jsdom tenta resolver a URL relativa, falha, e a aba renderiza o
      estado de erro — que é tratado, mas deixa o teste dependente de como o ambiente
      trata fetch relativo. O corpo não importa aqui: o que estes testes cobrem é a
      montagem das abas, não o conteúdo remoto.
  */
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response('# README de teste', { status: 200 })),
  );
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

/*
    Redesign: /about virou página única. Os artigos deixaram de abrir em aba com painel
    lateral e passaram a ser cards na seção "Pesquisa e extensão"; o visualizador de PDF
    próprio abre num diálogo pelo botão "Ler o artigo".
*/
describe('Página Sobre — seção research', () => {
  it('não mostra a pasta research quando não há PDF na pasta', () => {
    render(<AboutView papers={[]} />);

    expect(screen.queryByText('research')).toBeNull();
    expect(screen.queryByText('Pesquisa e extensão')).toBeNull();
  });

  it('lista qualquer PDF varrido de public/papers, com ou sem metadados', () => {
    render(<AboutView papers={[buildPaper(REGISTERED), buildPaper(UNREGISTERED)]} />);

    expect(screen.getAllByText('research').length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByRole('heading', { name: /Qualificação Formal da População em Situação de Rua/ }),
    ).toBeDefined();
    expect(screen.getByRole('heading', { name: 'Rascunho sem metadados' })).toBeDefined();
    expect(screen.getAllByRole('button', { name: 'Ler o artigo' })).toHaveLength(2);
  });

  it('mostra os metadados registrados no card do artigo', () => {
    render(<AboutView papers={[buildPaper(REGISTERED)]} />);

    expect(screen.getAllByText(/COBENGE 2025/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Felipe Grolla Freitas')).toBeDefined();
    expect(screen.getByRole('link', { name: /DOI/ }).getAttribute('href')).toContain('doi.org');
  });

  it('omite DOI para PDF sem metadados e mantém o download', () => {
    render(<AboutView papers={[buildPaper(UNREGISTERED)]} />);

    expect(screen.queryByRole('link', { name: /DOI/ })).toBeNull();
    expect(screen.getByRole('link', { name: /Baixar PDF/ }).getAttribute('href')).toBe(
      '/papers/Rascunho%20sem%20metadados.pdf',
    );
  });

  it('abre o visualizador no diálogo apontando para o arquivo em public/papers', async () => {
    render(<AboutView papers={[buildPaper(REGISTERED)]} />);

    fireEvent.click(screen.getByRole('button', { name: 'Ler o artigo' }));

    /*
        Timeout acima do padrão (1s): o visualizador entra por `next/dynamic`, e resolver
        o import sob carga paralela do vitest passa de um segundo com facilidade.
    */
    const viewer = await screen.findByTestId('pdf-viewer', {}, { timeout: 5000 });
    expect(viewer.getAttribute('data-url')).toBe(
      '/papers/Artigo%20Qualifica%C3%A7%C3%A3o%20Formal%20de%20PSR.pdf',
    );
    expect(screen.getByRole('dialog')).toBeDefined();
  });

  it('monta o my-bio.md próprio, com Código/Prévia, junto com as demais seções', () => {
    render(<AboutView papers={[]} />);

    // A bio deixou de buscar o README de perfil: o conteúdo é síncrono, vem de lib/about.ts.
    expect(screen.getByRole('heading', { name: 'Sobre mim' })).toBeDefined();
    expect(screen.getByText('Estruturas de Dados')).toBeDefined();
    expect(screen.getByRole('link', { name: /README completo no GitHub/ })).toBeDefined();
    expect(screen.getByText('Formação')).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: 'Ver o markdown cru' }));
    // No modo Código o markdown aparece cru (tokenizado), sem virar <h2>.
    expect(screen.queryByRole('heading', { name: 'Sobre mim' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Ver o markdown cru' }).getAttribute('aria-pressed')).toBe('true');
  });
});
