"use client";

import React from "react";
import { Folder, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { fadeUp } from "@/lib/animations/variants";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";

/*
    Uma pasta da árvore de arquivos de /about.

    Extraído de app/about/page.tsx, onde cada pasta era um bloco de ~110 linhas de JSX
    praticamente idêntico aos outros — variando só a chave, o rótulo, a cor e o arquivo
    dentro. Adicionar a pasta `research` por cópia teria levado o arquivo a mais de 700
    linhas com quatro cópias do mesmo menu de contexto.
*/

export interface TreeFile {
  id: string;
  /** Nome exibido, com extensão: `my-bio.md`. */
  name: string;
  icon: React.ElementType;
  /** Cor do ícone — token CSS ou hex. */
  color: string;
  /** Caminho falso copiado pelo menu de contexto: `about/bio/my-bio.md`. */
  path: string;
}

interface FileTreeFolderProps {
  /** Rótulo exibido. Pode diferir da chave interna da pasta. */
  label: string;
  /** Cor de preenchimento do ícone de pasta. */
  color: string;
  open: boolean;
  onToggle: () => void;
  files: TreeFile[];
  activeTab: string;
  openTabs: string[];
  onOpenFile: (id: string) => void;
  onCloseTab: (id: string) => void;
  onCloseOtherTabs: (id: string) => void;
  onCopyPath: (path: string) => void;
}

export function FileTreeFolder({
  label,
  color,
  open,
  onToggle,
  files,
  activeTab,
  openTabs,
  onOpenFile,
  onCloseTab,
  onCloseOtherTabs,
  onCopyPath,
}: FileTreeFolderProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div variants={prefersReduced ? {} : fadeUp}>
      <motion.button
        onClick={onToggle}
        whileTap={prefersReduced ? {} : { scale: 0.98 }}
        className="w-full flex items-center px-4 py-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-md"
        aria-expanded={open}
      >
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.15 }}
          className="inline-flex"
        >
          <ChevronRight className="w-3 h-3 mr-2" style={{ color: "var(--text-muted)" }} />
        </motion.span>
        <Folder className="w-3.5 h-3.5 mr-2" style={{ color }} fill={color} />
        <span style={{ color: open ? "var(--text-primary)" : "var(--text-secondary)" }}>
          {label}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
            className="ml-4 pl-2"
          >
            {files.map((file) => {
              const Icon = file.icon;
              const isActive = activeTab === file.id;

              return (
                <ContextMenu key={file.id}>
                  <ContextMenuTrigger asChild>
                    <motion.div
                      onClick={() => onOpenFile(file.id)}
                      whileTap={prefersReduced ? {} : { scale: 0.98 }}
                      className={`flex items-center px-4 py-1.5 cursor-pointer transition-colors rounded-md ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)]"
                      }`}
                    >
                      <Icon
                        className="w-3.5 h-3.5 mr-2 flex-shrink-0"
                        style={{ color: file.color }}
                      />
                      <span className="truncate">{file.name}</span>
                    </motion.div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => onOpenFile(file.id)}>
                      Abrir Arquivo
                      <ContextMenuShortcut>↵</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => onCopyPath(file.path)}>
                      Copiar Caminho
                      <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                    </ContextMenuItem>
                    {openTabs.includes(file.id) && (
                      <>
                        <ContextMenuSeparator />
                        <ContextMenuItem onClick={() => onCloseOtherTabs(file.id)}>
                          Fechar Outras Abas
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => onCloseTab(file.id)}>
                          Fechar Aba
                          <ContextMenuShortcut>⌘W</ContextMenuShortcut>
                        </ContextMenuItem>
                      </>
                    )}
                  </ContextMenuContent>
                </ContextMenu>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default FileTreeFolder;
