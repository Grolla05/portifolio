import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import NotFound from '@/app/not-found';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/404',
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark', resolvedTheme: 'dark', setTheme: vi.fn() }),
}));

describe('NotFound (404) macOS Dialog Component', () => {
  it('should render 404 title and return to home button', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /voltar ao início/i })).toBeInTheDocument();
  });

  it('should include traffic light window elements or macOS dialog structure', () => {
    const { container } = render(<NotFound />);
    expect(container.querySelector('.glass-panel')).toBeInTheDocument();
  });
});
