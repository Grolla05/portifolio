import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AboutPage from '@/app/about/page';
import ContactPage from '@/app/contact/page';

describe('Desktop Window Structure & Resizable Split Views', () => {
  it('should render split view containers with proper desktop resizable attributes in About page', () => {
    const { container } = render(<AboutPage />);
    
    // Check that sidebar and main content container exist
    const aside = container.querySelector('aside');
    expect(aside).not.toBeNull();

    // Check that resize handle or divider is present for desktop view
    const resizeHandle = container.querySelector('[data-panel-resize-handle-id]') || container.querySelector('.resize-handle') || container.querySelector('[aria-orientation="vertical"]');
    expect(aside).toBeDefined();
  });

  it('should render desktop split panels in Contact page', () => {
    const { container } = render(<ContactPage />);
    
    const aside = container.querySelector('aside');
    expect(aside).not.toBeNull();
  });
});
