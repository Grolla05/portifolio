"use client";

import { useEffect, useRef } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";

/*
    ⌘B / Ctrl+B alterna a barra lateral, como no VS Code.

    Usa a API imperativa do react-resizable-panels em vez de desmontar o painel: assim a
    largura escolhida pelo usuário é preservada ao reexpandir, e o `autoSaveId` continua
    guardando o layout no localStorage. Desmontar perderia as duas coisas.
*/

export function useSidebarToggle() {
  const panelRef = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'b' || event.key === 'B') && (event.metaKey || event.ctrlKey)) {
        // Não intercepta ⌘⇧B nem ⌘⌥B, que os navegadores usam para outras coisas.
        if (event.shiftKey || event.altKey) return;

        event.preventDefault();
        const panel = panelRef.current;
        if (!panel) return;

        if (panel.isCollapsed()) {
          panel.expand();
        } else {
          panel.collapse();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return panelRef;
}
