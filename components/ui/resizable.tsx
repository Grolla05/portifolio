"use client";

import * as React from "react";
import { GripVertical } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "@/lib/utils";

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col select-none",
      className
    )}
    {...props}
  />
);

const ResizablePanel = ResizablePrimitive.Panel;

/*
    O handle precisa ter LARGURA REAL, não 1px + pseudo-elemento.

    react-resizable-panels escuta pointer events na raiz do documento e decide qual handle
    ativar em `recalculateIntersectingHandles`. Quando o ponteiro cai apenas dentro da margem
    de tolerância (`hitAreaMargins.fine`, 5px por padrão) e não sobre o elemento do handle,
    a lib compara a ordem de empilhamento entre o handle e o elemento realmente apontado —
    e DESCARTA o handle, sem erro nenhum, se o alvo estiver por cima e sobrepor o retângulo
    dele. Com um handle de 1px quase toda a área útil dependia desse caminho frágil: basta
    um filho dos painéis criar contexto de empilhamento (transform do framer-motion, sombra,
    backdrop-filter) perto da divisa para o arrasto morrer silenciosamente.

    Aqui o elemento passa a ter 6px. Assim o ponteiro atinge o próprio handle, caso em que a
    lib faz curto-circuito (`dragHandleElement === targetElement`) e nem chega a comparar
    empilhamento. A linha de 1px vira decoração via `::before`, preservando o visual.
*/
const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
}) => (
  <ResizablePrimitive.PanelResizeHandle
    hitAreaMargins={{ coarse: 20, fine: 8 }}
    className={cn(
      "relative flex w-1.5 flex-shrink-0 items-center justify-center bg-transparent cursor-col-resize select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ide-accent)]",
      // Linha visual de 1px centralizada no alvo de 6px
      "before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-[var(--border-default)] before:transition-colors",
      "hover:before:bg-[var(--ide-accent)] data-[resize-handle-state=drag]:before:bg-[var(--ide-accent)]",
      // Orientação vertical: alvo vira altura, linha vira largura total
      "data-[panel-group-direction=vertical]:h-1.5 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:cursor-row-resize",
      "data-[panel-group-direction=vertical]:before:inset-x-0 data-[panel-group-direction=vertical]:before:inset-y-auto data-[panel-group-direction=vertical]:before:top-1/2 data-[panel-group-direction=vertical]:before:h-px data-[panel-group-direction=vertical]:before:w-full data-[panel-group-direction=vertical]:before:translate-x-0 data-[panel-group-direction=vertical]:before:-translate-y-1/2",
      "group",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="pointer-events-none z-10 flex h-6 w-3.5 items-center justify-center rounded-full glass-panel border border-white/20 dark:border-white/10 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-3 w-3 text-muted-foreground" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
