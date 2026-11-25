import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Header from '@/components/header';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark', resolvedTheme: 'dark', setTheme: vi.fn() }),
}));

describe('UI Typography & Consistency Tests', () => {
  /*
      Redesign: o NOME continua em fonte proporcional (é identidade, não código), e as
      abas de navegação passam a ser nomes de arquivo em monoespaçada, como num editor.
      O nome humano da rota acompanha o link como texto para leitores de tela.
  */
  it('mantém o nome em fonte proporcional e as abas como arquivos em monoespaçada', () => {
    render(<Header />);
    const logo = screen.getByText('Felipe Grolla');
    expect(logo.className).not.toContain('font-mono');

    const home = screen.getByRole('link', { name: /hello\.tsx/ });
    expect(home.closest('.font-mono')).not.toBeNull();
    expect(home.textContent).toContain('Início');
  });
});
