"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Search, Menu } from "lucide-react";
import AccessibilityMenu from "./accessibility-menu";
import { appleSpring } from "@/lib/animations/variants";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/*
    Redesign — topbar de janela (canvas "Avaliação e Redesign do Portfólio").

    Antes: pills arredondadas com ícone e rótulo em inglês ("About Me", "Projects").
    Agora: cada rota é um ARQUIVO aberto na janela (hello.tsx, about-me.md, projects/,
    contact.ts) com sublinhado deslizante, como as abas de um editor. É o que amarra a
    estética de IDE ao conteúdo, em vez de ser só decoração.

    Sem os três botões de janela do macOS no canto: num site eles são decoração que
    parece clicável e não faz nada — removidos após a primeira versão.

    O nome do arquivo é o rótulo visível; o nome humano da página vai junto como texto
    só para leitores de tela. Assim o nome acessível CONTÉM o texto visível (WCAG 2.5.3,
    quem usa controle por voz diz "hello.tsx") e ainda explica para onde o link leva.
*/
export const navLinks = [
  { href: "/", file: "hello.tsx", label: "Início" },
  { href: "/about", file: "about-me.md", label: "Sobre mim" },
  { href: "/projects", file: "projects/", label: "Projetos" },
  { href: "/contact", file: "contact.ts", label: "Contato" },
];

/** Rota ativa: /projects/[slug] continua marcando "projects/". */
function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/*
    Tempo da animação de saída do drawer (`data-[state=closed]:duration-300` em
    components/ui/sheet.tsx). Ver `openPaletteFromDrawer` abaixo.
*/
const SHEET_CLOSE_MS = 300;

export default function Header() {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const current = navLinks.find((link) => isActive(pathname, link.href));

  const openCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  /*
      A partir do drawer, o palette só pode abrir DEPOIS que o Sheet terminou de fechar:
      são dois diálogos Radix e, sobrepostos, o Sheet devolve o foco ao fechar e o rouba
      do input de busca que acabou de montar.
  */
  const openPaletteFromDrawer = () => {
    setMenuOpen(false);
    window.setTimeout(openCommandPalette, prefersReduced ? 0 : SHEET_CLOSE_MS);
  };

  return (
    <header
      className="sticky top-0 z-50 h-16 w-full border-b transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border-default)",
      }}
    >
      <nav className="w-full h-full px-4 sm:px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-5 min-w-0">
          <Link
            href="/"
            /*
                `whitespace-nowrap`: sem isso o nome quebrava em duas linhas a 375px,
                estourando a altura do header.
            */
            className="text-sm font-medium tracking-tight whitespace-nowrap transition-opacity hover:opacity-75"
            style={{ color: "var(--text-primary)" }}
          >
            Felipe Grolla
          </Link>
          {/* Mobile: o arquivo aberto aparece ao lado do nome, como no design. */}
          {current && (
            <span
              className="md:hidden font-mono text-xs truncate"
              style={{ color: "var(--text-muted)" }}
              aria-hidden="true"
            >
              {current.file}
            </span>
          )}
        </div>

        {/*
            Abas desktop. `hidden md:flex`: abaixo de 768px as quatro abas não cabem ao
            lado do nome e dos controles; lá elas dão lugar ao drawer.
        */}
        <div className="hidden md:flex items-stretch h-full font-mono text-[13px]">
          {navLinks.map(({ href, file, label }) => {
            const active = isActive(pathname, href);
            return (
              <motion.div
                key={href}
                className="relative flex"
                whileHover={prefersReduced || active ? {} : { opacity: 0.75 }}
              >
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className="relative flex items-center px-4 transition-colors duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ide-accent)]"
                  style={{
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  {file}
                  <span className="sr-only"> — {label}</span>
                </Link>
                {active && (
                  /* layoutId: o sublinhado desliza de uma aba para a outra ao navegar. */
                  <motion.span
                    layoutId="navUnderline"
                    className="absolute left-0 right-0 bottom-0 h-[2px]"
                    style={{ backgroundColor: "var(--ide-accent)" }}
                    transition={prefersReduced ? { duration: 0 } : appleSpring}
                    aria-hidden="true"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openCommandPalette}
            className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg border text-[13px] transition-colors hover:bg-black/5 dark:hover:bg-white/5 select-none cursor-pointer"
            style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
            title="Abrir Command Palette (⌘K)"
          >
            <Search className="w-3.5 h-3.5" aria-hidden="true" />
            Buscar
            <kbd className="font-mono text-[12px]" style={{ color: "var(--text-primary)" }}>
              ⌘K
            </kbd>
          </button>

          {/*
              Drawer de navegação (só mobile). Usa o Sheet (Radix Dialog): focus trap,
              Esc, aria-modal e trava de scroll. O conteúdo só monta quando aberto, então
              não duplica os rótulos das rotas no DOM.
          */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Abrir menu de navegação"
                className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg select-none cursor-pointer"
                style={{ color: "var(--text-primary)" }}
              >
                <Menu className="w-5 h-5" aria-hidden="true" />
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[280px] p-0 flex flex-col gap-0 border-l"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-default)",
              }}
              overlayClassName="bg-black/40 backdrop-blur-sm"
            >
              <SheetHeader
                className="px-5 pt-5 pb-4 border-b space-y-0"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <SheetTitle
                  className="text-[11px] font-medium tracking-[0.08em] text-left"
                  style={{ color: "var(--text-muted)" }}
                >
                  EXPLORER
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Links para as páginas do portfólio
                </SheetDescription>
              </SheetHeader>

              <nav className="flex-1 flex flex-col gap-1 px-3 py-3">
                {navLinks.map(({ href, file, label }) => {
                  const active = isActive(pathname, href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      /* `min-h-[44px]`: alvo de toque mínimo do Apple HIG. */
                      className="flex items-center justify-between gap-3 min-h-[44px] px-3 rounded-lg transition-colors"
                      style={{
                        color: active ? "var(--text-primary)" : "var(--text-secondary)",
                        backgroundColor: active ? "var(--accent-soft)" : "transparent",
                      }}
                    >
                      <span className="font-mono text-[13px]">{file}</span>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {label}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              <div
                className="px-3 pb-5 pt-3 border-t"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <button
                  type="button"
                  onClick={openPaletteFromDrawer}
                  className="w-full flex items-center gap-3 min-h-[44px] px-3 rounded-lg text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Search className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Buscar</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>

          <AccessibilityMenu />
        </div>
      </nav>
    </header>
  );
}
