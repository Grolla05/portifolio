import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
} from '@/components/ui/context-menu';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';

describe('macOS Native Context Menu & Tooltips', () => {
  it('should render ContextMenu wrapper correctly', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div>Arquivo de Teste</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            Copiar Código
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    expect(screen.getByText('Arquivo de Teste')).toBeDefined();
  });

  it('should render Tooltip wrapper correctly with provider', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button aria-label="Copiar">Copiar</button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copiar para área de transferência</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByRole('button', { name: /copiar/i })).toBeDefined();
  });
});
