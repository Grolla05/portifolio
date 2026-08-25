import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('macOS Dark Mode Design Tokens', () => {
  const cssPath = path.resolve(__dirname, '../app/globals.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');

  it('should define authentic macOS dark mode background surfaces (#1e1e1e, #252526 / #282828)', () => {
    expect(cssContent).toMatch(/--bg-primary:\s*#1e1e1e/);
    expect(cssContent).toMatch(/--bg-secondary:\s*(#252526|#282828)/);
  });

  it('should define macOS primary and secondary text tokens (#f5f5f7, #a1a1a6)', () => {
    expect(cssContent).toMatch(/--text-primary:\s*#f5f5f7/);
    expect(cssContent).toMatch(/--text-secondary:\s*#a1a1a6/);
  });

  it('should define Apple macOS Dark accent blue (#0a84ff)', () => {
    expect(cssContent).toMatch(/--ide-accent:\s*#0a84ff/);
  });

  it('should include enhanced Liquid Glass diffuse elevation in dark mode', () => {
    expect(cssContent).toMatch(/\.dark \.glass-panel/);
    expect(cssContent).toMatch(/backdrop-filter:\s*blur\(20px\)\s*saturate\(180%\)/);
  });
});
