import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommandPalette } from '@/components/command-palette';

// Mock next/navigation useRouter
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'dark',
    setTheme: vi.fn(),
  }),
}));

// Mock ResizeObserver and scrollIntoView for cmdk in jsdom
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('Global Command Palette (Cmd+K)', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('should render trigger hint or respond to Cmd+K shortcut', () => {
    render(<CommandPalette />);
    
    // Simulate pressing Cmd+K
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    
    // The Command Palette input dialog should appear
    expect(screen.getByPlaceholderText(/buscar páginas, arquivos, comandos/i)).toBeDefined();
  });

  it('should list main navigation pages and quick actions in groups', () => {
    render(<CommandPalette />);
    
    // Open palette
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    
    // Check navigation items
    expect(screen.getByText('Início / Home')).toBeDefined();
    expect(screen.getByText('Sobre / About')).toBeDefined();
    expect(screen.getByText('Projetos / Projects')).toBeDefined();
    expect(screen.getByText('Contato / Contact')).toBeDefined();
    
    // Check files and quick actions
    expect(screen.getByText('my-bio.md')).toBeDefined();
    expect(screen.getByText('hobbies.ts')).toBeDefined();
    expect(screen.getByText('Education.tsx')).toBeDefined();
  });

  it('should navigate to page on item selection', () => {
    render(<CommandPalette />);
    
    // Open palette
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    
    // Click on Projects
    const projectsItem = screen.getByText('Projetos / Projects');
    fireEvent.click(projectsItem);
    
    expect(mockPush).toHaveBeenCalledWith('/projects');
  });
});
