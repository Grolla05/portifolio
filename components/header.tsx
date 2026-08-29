"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Home, User, FolderGit2, Mail, Search, Menu } from "lucide-react";
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

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About Me", icon: User },
  { href: "/projects", label: "Projects", icon: FolderGit2 },
  { href: "/contact", label: "Contact", icon: Mail },
];

/*
    Tempo da animação de saída do drawer (`data-[state=closed]:duration-300` em
    components/ui/sheet.tsx). Ver `openPaletteFromDrawer` abaixo.
*/
const SHEET_CLOSE_MS = 300;

export default function Header() {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();
  const [menuOpen, setMenuOpen] = React.useState(false);

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
    <motion.header
      className="sticky top-0 z-50 h-16 w-full backdrop-blur-xl bg-[var(--bg-glass)] border-b border-[var(--border-default)] transition-colors duration-300 shadow-sm"
      initial={prefersReduced ? {} : { opacity: 0, y: -10 }}
      animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav className="w-full h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Logo / Name with SF Pro */}
        <motion.div whileTap={prefersReduced ? {} : { scale: 0.96 }} transition={appleSpring}>
          <Link
            href="/"
            /*
                `whitespace-nowrap`: sem isso o nome quebrava em duas linhas a 375px,
                estourando a altura de 64px do header.
            */
            className="text-sm font-semibold tracking-tight whitespace-nowrap transition-colors duration-200 hover:text-primary"
            style={{ color: "var(--text-primary)" }}
          >
            Felipe Grolla
          </Link>
        </motion.div>

        {/*
            Navegação desktop.

            `hidden md:flex`: abaixo de 768px as quatro pills não cabiam ao lado do logo e
            dos controles da direita. O flex simplesmente transbordava — "Contact" saía da
            tela e o menu de acessibilidade ficava inalcançável. No mobile esta lista dá
            lugar ao drawer, logo abaixo.
        */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-full glass-panel">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <motion.div
                key={href}
                whileTap={prefersReduced ? {} : { scale: 0.96 }}
                transition={appleSpring}
                className="relative"
              >
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className="relative flex items-center gap-2 px-4 py-1.5 text-xs font-medium tracking-tight rounded-full transition-colors duration-200 select-none"
                  style={{
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="headerNavPill"
                      className="absolute inset-0 rounded-full bg-white/70 dark:bg-white/10 shadow-sm border border-white/30 dark:border-white/15"
                      transition={appleSpring}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10 text-primary" />
                  <span className="relative z-10">{label}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Right — Command Palette trigger, drawer mobile & Accessibility Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button
            onClick={openCommandPalette}
            whileHover={prefersReduced ? {} : { scale: 1.02 }}
            whileTap={prefersReduced ? {} : { scale: 0.96 }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] glass-panel transition-colors border border-white/20 dark:border-white/10 select-none cursor-pointer"
            title="Abrir Command Palette (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-[var(--ide-accent)]" />
            <span className="text-[11px]">Buscar...</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-muted-foreground border border-black/5 dark:border-white/5">
              ⌘K
            </kbd>
          </motion.button>

          {/*
              Drawer de navegação (só mobile).

              Usa o Sheet (Radix Dialog) que já existia no projeto em vez de um painel
              próprio: traz focus trap, fechar no Esc, aria-modal e trava de scroll — tudo
              que uma implementação manual erraria. O conteúdo só monta quando aberto, então
              não duplica os rótulos das rotas no DOM.
          */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <motion.button
                type="button"
                whileTap={prefersReduced ? {} : { scale: 0.96 }}
                transition={appleSpring}
                aria-label="Abrir menu de navegação"
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-full glass-panel border border-white/20 dark:border-white/10 select-none cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
              >
                <Menu className="w-4 h-4 text-primary" />
              </motion.button>
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
                  className="text-sm font-semibold tracking-tight text-left"
                  style={{ color: "var(--text-primary)" }}
                >
                  Navegação
                </SheetTitle>
                {/* Radix exige um descritor acessível; visualmente o título já basta. */}
                <SheetDescription className="sr-only">
                  Links para as páginas do portfólio
                </SheetDescription>
              </SheetHeader>

              <nav className="flex-1 flex flex-col gap-1 px-3 py-3">
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      /*
                          `min-h-[44px]`: alvo de toque mínimo do Apple HIG. As pills do
                          desktop têm ~28px de altura, insuficiente para o dedo.
                      */
                      className="flex items-center gap-3 min-h-[44px] px-3 rounded-xl text-sm font-medium tracking-tight transition-colors"
                      style={{
                        color: active ? "var(--ide-accent-text)" : "var(--text-secondary)",
                        backgroundColor: active ? "var(--accent-soft)" : "transparent",
                        border: "1px solid",
                        borderColor: active ? "var(--accent-ring)" : "transparent",
                      }}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{label}</span>
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
                  className="w-full flex items-center gap-3 min-h-[44px] px-3 rounded-xl text-sm font-medium tracking-tight transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Search className="w-4 h-4 flex-shrink-0 text-[var(--ide-accent)]" />
                  <span>Buscar</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>

          <AccessibilityMenu />
        </div>
      </nav>
    </motion.header>
  );
}
