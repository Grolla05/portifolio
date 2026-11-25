import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'dark' }),
}));

import { StatusBar } from '@/components/status-bar';

/*
    Linha de boot da status bar (Sprint 4): aparece só na primeira visita da sessão,
    mostra o tempo real de carregamento e devolve o caminho da rota.
*/
describe('StatusBar — linha de boot', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('na primeira visita compila, mostra "ready in" e volta para a rota', () => {
    render(<StatusBar />);
    expect(screen.getByText('compiling portfolio…')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(screen.getByText(/✓ ready in \d+\.\d{2}s/)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1600);
    });
    expect(screen.getByText('~/home')).toBeInTheDocument();
  });

  it('em visita repetida da sessão mostra a rota direto', () => {
    sessionStorage.setItem('boot-seen', '1');
    render(<StatusBar />);
    expect(screen.queryByText('compiling portfolio…')).not.toBeInTheDocument();
    expect(screen.getByText('~/home')).toBeInTheDocument();
  });
});
