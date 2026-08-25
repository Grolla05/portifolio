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
  useTheme: () => ({ theme: 'dark', setTheme: vi.fn() }),
}));

describe('Header & Navigation Component', () => {
  it('renders navigation links properly', () => {
    render(<Header />);
    expect(screen.getByText('Felipe Grolla')).toBeInTheDocument();
  });
});
