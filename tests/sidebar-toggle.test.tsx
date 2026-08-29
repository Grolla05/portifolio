import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';

/*
    O comportamento real do colapso depende de layout, que o jsdom não calcula — isso foi
    conferido no navegador. O que este teste protege em CI é a lógica do atalho: quais
    combinações de tecla disparam o toggle e quais devem passar batido para o navegador.
*/

const panel = {
  collapsed: false,
  collapse: vi.fn(),
  expand: vi.fn(),
  isCollapsed: vi.fn(),
};

function Probe() {
  const ref = useSidebarToggle();
  // O hook devolve um ref pensado para o <ResizablePanel>; aqui injeta-se um dublê com
  // a mesma superfície imperativa (collapse/expand/isCollapsed).
  ref.current = panel as never;
  return <div />;
}

function press(key: string, modifiers: Partial<KeyboardEventInit> = {}) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...modifiers }));
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  panel.isCollapsed.mockReturnValue(false);
});

describe('useSidebarToggle — atalho ⌘B / Ctrl+B', () => {
  it('colapsa quando a barra está aberta', () => {
    panel.isCollapsed.mockReturnValue(false);
    render(<Probe />);

    press('b', { metaKey: true });

    expect(panel.collapse).toHaveBeenCalledTimes(1);
    expect(panel.expand).not.toHaveBeenCalled();
  });

  it('reexpande quando a barra está colapsada', () => {
    panel.isCollapsed.mockReturnValue(true);
    render(<Probe />);

    press('b', { ctrlKey: true });

    expect(panel.expand).toHaveBeenCalledTimes(1);
    expect(panel.collapse).not.toHaveBeenCalled();
  });

  it('aceita B maiúsculo (Caps Lock ligado)', () => {
    render(<Probe />);
    press('B', { metaKey: true });
    expect(panel.collapse).toHaveBeenCalledTimes(1);
  });

  it('ignora ⌘⇧B e ⌘⌥B, que os navegadores reservam', () => {
    render(<Probe />);

    press('b', { metaKey: true, shiftKey: true });
    press('b', { metaKey: true, altKey: true });

    expect(panel.collapse).not.toHaveBeenCalled();
    expect(panel.expand).not.toHaveBeenCalled();
  });

  it('ignora B sem modificador, para não sequestrar a digitação', () => {
    render(<Probe />);
    press('b');
    expect(panel.collapse).not.toHaveBeenCalled();
  });

  it('remove o listener ao desmontar', () => {
    const { unmount } = render(<Probe />);
    unmount();

    press('b', { metaKey: true });

    expect(panel.collapse).not.toHaveBeenCalled();
  });
});
