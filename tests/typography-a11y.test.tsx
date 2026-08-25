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
  it('should render Header with SF Pro (proportional) text classes and not font-mono in logo or nav links', () => {
    const { container } = render(<Header />);
    const logo = screen.getByText('Felipe Grolla');
    expect(logo).toBeInTheDocument();
    expect(logo.className).not.toContain('font-mono');

    // Nav links should not use font-mono
    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.parentElement?.className).not.toContain('font-mono');
  });
});
