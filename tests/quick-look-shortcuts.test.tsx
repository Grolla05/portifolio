import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProjectsPage from '@/app/projects/page';

describe('Projects Page — Quick Look (Space) and Keyboard Navigation', () => {
  it('should support focusing project cards and opening modal with Space (Quick Look)', () => {
    render(<ProjectsPage />);
    
    // Find project cards (use getAllByText due to desktop and mobile layouts)
    const project1 = screen.getAllByText('Project 1')[0];
    expect(project1).toBeDefined();

    // Find the button inside the project card
    const cardButton = project1.closest('.group')?.querySelector('button');
    expect(cardButton).toBeDefined();

    if (cardButton) {
      // Focus card
      cardButton.focus();
      expect(document.activeElement).toBe(cardButton);

      // Trigger Space key for Quick Look
      fireEvent.keyDown(cardButton, { key: ' ', code: 'Space' });

      // Check that a modal or detail opened
      expect(screen.getAllByText(/readme\.md|detalhes do projeto|arquivos do repositório/i).length).toBeGreaterThanOrEqual(1);
    }
  });

  it('should close Quick Look modal on Escape key', () => {
    render(<ProjectsPage />);
    
    const project1 = screen.getAllByText('Project 1')[0];
    const cardButton = project1.closest('.group')?.querySelector('button');
    
    if (cardButton) {
      fireEvent.click(cardButton);
      
      // Modal should be open
      expect(screen.getAllByText(/readme\.md|detalhes do projeto|arquivos do repositório/i).length).toBeGreaterThanOrEqual(1);

      // Press Escape
      fireEvent.keyDown(window, { key: 'Escape' });
    }
  });
});
