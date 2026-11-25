import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AboutView from '@/components/about/about-view';
import ContactPage from '@/app/contact/page';

/*
    Redesign: as páginas trocaram os painéis redimensionáveis por layouts fluidos. O que
    continua valendo é a estrutura de "janela": explorer lateral em /about e painel de
    prévia ao lado do formulário em /contact.
*/
describe('Estrutura de janela das páginas', () => {
  it('About tem explorer lateral', () => {
    const { container } = render(<AboutView papers={[]} />);
    expect(container.querySelector('aside')).not.toBeNull();
    expect(screen.getByText('EXPLORER')).toBeDefined();
  });

  it('Contact tem canais diretos, formulário e prévia ao vivo', () => {
    render(<ContactPage />);
    expect(screen.getByRole('region', { name: 'Canais diretos' })).toBeDefined();
    expect(screen.getByLabelText('Nome')).toBeDefined();
    expect(screen.getByRole('complementary', { name: 'Prévia ao vivo' })).toBeDefined();
  });
});
