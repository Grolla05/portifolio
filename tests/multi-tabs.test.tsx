import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AboutView from '@/components/about/about-view';

describe('About Page — Concurrent Tabs & Clean macOS Sidebar', () => {
  it('should not contain the static inerte 48px activity bar (terminal/gamepad dummy icons)', () => {
    const { container } = render(<AboutView papers={[]} />);
    
    // Check that dummy 48px aside with static items is removed
    const w12Aside = container.querySelector('aside.w-12');
    expect(w12Aside).toBeNull();
  });

  it('should render the active tab in the editor tab bar and allow opening multiple tabs', () => {
    render(<AboutView papers={[]} />);
    
    // Initial tab is my-bio.md (in sidebar and tab bar)
    expect(screen.getAllByText('my-bio.md').length).toBeGreaterThanOrEqual(1);

    // Click on hobbies folder or file to open hobbies.ts
    const hobbiesBtn = screen.getAllByText('hobbies')[0];
    fireEvent.click(hobbiesBtn);

    // Now hobbies.ts should appear in the tab bar
    expect(screen.getAllByText('hobbies.ts').length).toBeGreaterThanOrEqual(1);
  });

  it('should allow closing a tab and show empty state when all tabs are closed', () => {
    render(<AboutView papers={[]} />);

    // Find the close button for the initial tab (my-bio.md)
    const closeBtn = screen.getAllByLabelText(/Fechar aba my-bio\.md/i)[0];
    expect(closeBtn).toBeDefined();

    // Close the tab
    fireEvent.click(closeBtn);

    // Should display clean empty state when no tabs are open
    expect(screen.getAllByText(/Nenhum arquivo aberto/i).length).toBeGreaterThanOrEqual(1);
  });
});
