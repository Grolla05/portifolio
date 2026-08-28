import { describe, it, expect, vi } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import React from 'react';
import Header from '@/components/header';

/*
    Regressão do header em viewport móvel.

    A 375px o header montava as quatro pills de navegação, o logo e os controles da
    direita num único flex sem regra responsiva: o conteúdo transbordava, "Contact" saía
    da tela e o menu de acessibilidade ficava inalcançável — uma das quatro rotas e a
    feature de acessibilidade inteira perdidas no celular.

    Como o corte é feito com `hidden md:flex` (só CSS, que o jsdom não aplica), estes
    testes verificam a ESTRUTURA que produz o comportamento: a lista desktop carrega a
    classe de corte, existe um gatilho de drawer exclusivo do mobile, e o drawer entrega
    as quatro rotas.
*/

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark', resolvedTheme: 'dark', setTheme: vi.fn() }),
}));

describe('Header — navegação mobile', () => {
  it('esconde a lista de pills abaixo de md', () => {
    render(<Header />);

    // A pill da rota ativa vive dentro do container que precisa sumir no mobile.
    const desktopNav = screen.getByText('Projects').closest('div.hidden');

    expect(desktopNav).not.toBeNull();
    expect(desktopNav?.className).toContain('hidden');
    expect(desktopNav?.className).toContain('md:flex');
  });

  it('expõe um gatilho de menu com nome acessível, visível só no mobile', () => {
    render(<Header />);

    const trigger = screen.getByRole('button', { name: 'Abrir menu de navegação' });

    expect(trigger).toBeInTheDocument();
    expect(trigger.className).toContain('md:hidden');
  });

  it('mantém o menu de acessibilidade alcançável em qualquer largura', () => {
    render(<Header />);

    const a11y = screen.getByRole('button', { name: 'Accessibility options' });

    expect(a11y).toBeInTheDocument();
    // Não pode ganhar corte responsivo: era ele que sumia no mobile.
    expect(a11y.className).not.toContain('hidden');
  });

  it('não duplica os rótulos das rotas enquanto o drawer está fechado', () => {
    render(<Header />);

    // O conteúdo do Sheet só monta quando aberto (portal Radix), então cada rótulo
    // aparece uma única vez — getByText lançaria se houvesse dois.
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('abre o drawer com as quatro rotas', async () => {
    render(<Header />);

    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu de navegação' }));

    const drawer = await screen.findByRole('dialog');

    for (const label of ['Home', 'About Me', 'Projects', 'Contact']) {
      expect(within(drawer).getByRole('link', { name: label })).toBeInTheDocument();
    }
  });

  it('dá aos links do drawer alvo de toque de 44px (Apple HIG)', async () => {
    render(<Header />);

    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu de navegação' }));

    const drawer = await screen.findByRole('dialog');
    const home = within(drawer).getByRole('link', { name: 'Home' });

    expect(home.className).toContain('min-h-[44px]');
  });
});
