import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AboutView from '@/components/about/about-view';

/*
    Redesign de /about: página única em rolagem. O explorer (e, antes, a barra de abas) deixou de
    abrir/fechar arquivos e viraram o SUMÁRIO da página — cada arquivo é uma âncora para
    a sua seção, e a aba ativa acompanha a rolagem.
*/
describe('About — explorer e abas como sumário da página única', () => {
  it('renderiza todas as seções de uma vez, sem esconder conteúdo atrás de abas', () => {
    render(<AboutView papers={[]} />);

    expect(screen.getByRole('heading', { level: 1, name: /Oi, eu sou o Felipe/ })).toBeDefined();
    expect(screen.getByRole('heading', { name: 'Formação' })).toBeDefined();
    expect(screen.getByRole('heading', { name: 'Fora do editor' })).toBeDefined();
    expect(screen.getByText('Engenharia de Controle e Automação')).toBeDefined();
  });

  /*
      A barra de abas do desktop saiu (duplicava o explorer). O explorer é o sumário:
      cada arquivo é âncora da sua seção e marca a seção atual.
  */
  const explorer = () =>
    screen.getAllByRole('navigation', { name: 'Seções da página' }).find((nav) => !nav.className.includes('md:hidden'))!;

  it('não renderiza mais a barra de abas no desktop', () => {
    render(<AboutView papers={[]} />);
    expect(screen.queryByRole('navigation', { name: 'Arquivos abertos' })).toBeNull();
  });

  it('cada arquivo do explorer é um link para a seção correspondente', () => {
    render(<AboutView papers={[]} />);

    expect(within(explorer()).getByRole('link', { name: 'my-bio.md' }).getAttribute('href')).toBe('#bio');
    expect(within(explorer()).getByRole('link', { name: 'Education.tsx' }).getAttribute('href')).toBe('#formacao');
    expect(within(explorer()).getByRole('link', { name: 'hobbies.ts' }).getAttribute('href')).toBe('#hobbies');
  });

  it('clicar num arquivo do explorer marca a seção como atual', () => {
    render(<AboutView papers={[]} />);

    const hobbies = within(explorer()).getByRole('link', { name: 'hobbies.ts' });
    expect(hobbies.getAttribute('aria-current')).toBeNull();

    fireEvent.click(hobbies);

    expect(hobbies.getAttribute('aria-current')).toBe('location');
    expect(within(explorer()).getByRole('link', { name: 'my-bio.md' }).getAttribute('aria-current')).toBeNull();
  });

  it('oferece navegação em chips para o celular, com as mesmas seções', () => {
    render(<AboutView papers={[]} />);

    const navs = screen.getAllByRole('navigation', { name: 'Seções da página' });
    // Uma no explorer desktop, outra nos chips do celular.
    expect(navs).toHaveLength(2);
    const chips = navs.find((nav) => nav.className.includes('md:hidden'))!;
    expect(within(chips).getAllByRole('link')).toHaveLength(3);
  });
});
