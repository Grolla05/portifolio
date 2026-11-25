import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AboutView from '@/components/about/about-view';

/*
    Redesign de /about: página única em rolagem. O explorer e a barra de abas deixaram de
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

  it('cada aba é um link para a seção correspondente', () => {
    render(<AboutView papers={[]} />);

    const tabs = screen.getByRole('navigation', { name: 'Arquivos abertos' });
    expect(within(tabs).getByRole('link', { name: 'my-bio.md' }).getAttribute('href')).toBe('#bio');
    expect(within(tabs).getByRole('link', { name: 'Education.tsx' }).getAttribute('href')).toBe('#formacao');
    expect(within(tabs).getByRole('link', { name: 'hobbies.ts' }).getAttribute('href')).toBe('#hobbies');
  });

  it('clicar numa aba marca a seção como atual', () => {
    render(<AboutView papers={[]} />);

    const tabs = screen.getByRole('navigation', { name: 'Arquivos abertos' });
    const hobbies = within(tabs).getByRole('link', { name: 'hobbies.ts' });
    expect(hobbies.getAttribute('aria-current')).toBeNull();

    fireEvent.click(hobbies);

    expect(hobbies.getAttribute('aria-current')).toBe('location');
    expect(within(tabs).getByRole('link', { name: 'my-bio.md' }).getAttribute('aria-current')).toBeNull();
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
