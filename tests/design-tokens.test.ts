import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Design System Tokens & CSS Utilities', () => {
  const globalsCssPath = path.resolve(__dirname, '../app/globals.css');
  const stylesheetMdPath = path.resolve(__dirname, '../refs/stylesheet.md');

  it('should have globals.css file present', () => {
    expect(fs.existsSync(globalsCssPath)).toBe(true);
  });

  it('should define glassmorphism utilities (.glass-panel) in globals.css', () => {
    const cssContent = fs.readFileSync(globalsCssPath, 'utf-8');
    expect(cssContent).toContain('.glass-panel');
    expect(cssContent).toContain('backdrop-filter');
  });

  it('should define Apple HIG system accents in CSS tokens or theme variables', () => {
    const cssContent = fs.readFileSync(globalsCssPath, 'utf-8');
    expect(cssContent).toContain('--primary');
  });

  it('should verify stylesheet.md exists in refs directory as single source of truth', () => {
    expect(fs.existsSync(stylesheetMdPath)).toBe(true);
    const mdContent = fs.readFileSync(stylesheetMdPath, 'utf-8');
    expect(mdContent).toContain('Liquid Glass');
    expect(mdContent).toContain('Spring Physics');
  });
});
