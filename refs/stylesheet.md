# Stylesheet & Design System

> Guia de estilo visual do projeto **Portfólio**
> **Stack:** Next.js (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Radix UI / Lucide React.
>
> **Escopo:** cores, tipografia, iconografia, espaçamento, raios, componentes,
> estados, física de mola (Spring Physics), glassmorphism (Liquid Glass) e o mapeamento de cada token para CSS / Tailwind / Next.js.
>
> **Diretriz de Design:** Apple Human Interface Guidelines (HIG), Glassmorphism, Squircles, Spring Physics e Minimalismo Premium.
>
> **Status:** Documento vivo adaptado para a aplicação Web Next.js.

---

## Sumário

1. [Fundamentos](#1-fundamentos)
2. [Cores](#2-cores)
3. [Tipografia](#3-tipografia)
4. [Iconografia](#4-iconografia)
5. [Espaçamento e layout](#5-espaçamento-e-layout)
6. [Raios, bordas e elevação](#6-raios-bordas-e-elevação)
7. [Liquid Glass & Glassmorphism](#7-liquid-glass--glassmorphism)
8. [Componentes](#8-componentes)
9. [Bibliotecas e Stack](#9-bibliotecas-e-stack)
10. [Inventário de Telas e Seções](#10-inventário-de-telas-e-seções)
11. [Implementação em Next.js](#11-implementação-em-nextjs)
12. [Lacunas e Dívidas de Design](#12-lacunas-e-dívidas-de-design)
13. [Status de Verificação e Referências](#13-status-de-verificação-e-referências)

---

## 1. Fundamentos

| Propriedade | Valor |
|---|---|
| Plataforma-alvo | Web responsiva (Desktop macOS experience + Mobile iOS feel) |
| Grid / Viewport base | Mobile: 390–414 px / Desktop: 1280–1440 px (Container max-w: 1200px) |
| Raio base de contêineres | 16 px a 24 px (squircles / rounded-2xl / rounded-3xl) |
| Fundo da tela (Light) | `#FFFFFF` (superfícies) / `#F6F8FA` ou `#EFEFF0` (fundo geral) |
| Fundo da tela (Dark) | `#0D1117` / `#161B22` / `#000000` |
| Largura útil de conteúdo | Mobile: `calc(100% - 32px)` / Desktop: `max-w-6xl` centralizado |
| Margem lateral mobile | 16 px a 24 px |
| Margem lateral desktop | Auto (centralizado com padding horizontal 24px–32px) |
| Modo suportado | **Light & Dark Mode** (via `next-themes` e classes Tailwind) |
| Idioma da UI | pt-BR |

**Identidade visual:** Inspirada no ecossistema Apple HIG (SF Pro / Inter + Liquid Glass + Acentos Apple) com acabamento minimalista de alto padrão. Elementos translúcidos com desfoque de fundo (`backdrop-filter: blur(20px)`), bordas sutis com gradientes alfa e animações conduzidas por física de mola (Spring).

---

## 2. Cores

### 2.1 Paleta de Marca e Superfície (macOS Dark Mode & Light Mode)

| Token | Hex / RGBA | Uso / Tailwind Class |
|---|---|---|
| `--bg-primary` (Dark) | `#1e1e1e` | Superfície principal do editor / janela macOS |
| `--bg-secondary` (Dark) | `#252526` | Barra lateral (Source List), abas e cabeçalhos |
| `--bg-tertiary` (Dark) | `#323234` | Contêineres elevados, cards internos |
| `--bg-glass` (Dark) | `rgba(30, 30, 30, 0.75)` | Modais, menus de contexto, tooltips com blur 20px |
| `--text-primary` (Dark) | `#f5f5f7` | Títulos e textos de alto contraste (Apple White) |
| `--text-secondary` (Dark)| `#a1a1a6` | Subtítulos, navegação e descrições |
| `--text-muted` (Dark) | `#6e6e73` | Comentários de código, placeholders, atalhos |
| `--ide-accent` (Dark) | `#0a84ff` | Acento vibrante macOS iOS Blue |
| `primary-light` | `#007AFF` | Ação primária em modo claro |
| `background-light` | `#FFFFFF` / `#F6F8FA` | Fundo principal da aplicação em modo claro |
| `surface-glass-light`| `rgba(255, 255, 255, 0.75)` | Fundo de cards, modais e navbar em modo claro |
| `surface-glass-dark` | `rgba(30, 30, 30, 0.85)` | Fundo de cards, modais e navbar em modo escuro |

### 2.2 Acentos de Sistema (Apple HIG)

| Token | Hex | Uso |
|---|---|---|
| `accent-green` | `#30d158` / `#34C759` | Sucesso, badges positivos, confirmações |
| `accent-blue` | `#0a84ff` / `#007AFF` | Links interativos, seleção ativa, indicador de aba |
| `accent-purple`| `#bf5af2` / `#AF52DE` | Tags de tecnologia, badges especiais |
| `accent-yellow`| `#ffd60a` / `#FFCC00` | Alertas, avisos de atenção |
| `accent-red` | `#ff453a` / `#FF3B30` | Erros, ações destrutivas |

### 2.3 Bordas, Separadores e Elevação

| Token | CSS / RGBA | Uso |
|---|---|---|
| `border-subtle` | `rgba(0, 0, 0, 0.06)` (Light) / `rgba(255, 255, 255, 0.08)` (Dark) | Bordas de cards e divisores leves |
| `border-default`| `rgba(0, 0, 0, 0.12)` (Light) / `rgba(255, 255, 255, 0.12)` (Dark) | Inputs, botões outline, modais, painéis |
| `border-glass` | `rgba(255, 255, 255, 0.20)` (Top highlight) | Borda superior para efeito de luz e relevo specular |

---

## 3. Tipografia

A tipografia prioriza legibilidade máxima, hierarquia rigorosa e tracking levemente negativo para títulos, seguindo o padrão Apple HIG.

### 3.1 Famílias Tipográficas

1. **SF Pro / Inter (`--font-ui`):** Família primária para toda a interface, títulos, botões e labels.
2. **JetBrains Mono / SF Mono (`--font-mono`):** Família secundária para trechos de código, comandos e detalhes técnicos.

Carregamento via `next/font/google` ou font stack nativa do sistema:
```css
--font-ui: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Inter", system-ui, sans-serif;
--font-mono: "SF Mono", "JetBrains Mono", "Fira Code", monospace;
```

### 3.2 Escala Tipográfica (Desktop & Mobile)

| Papel | Tamanho (px / rem) | Peso | Line-Height | Letter-Spacing | Tailwind Class |
|---|---|---|---|---|---|
| **Display / Hero** | 48px – 64px (`3rem`–`4rem`) | Bold / Heavy (700–800) | 1.1 | `-0.03em` | `text-4xl md:text-6xl font-bold tracking-tight` |
| **Título 1 (H1)** | 32px – 40px (`2rem`–`2.5rem`) | Bold (700) | 1.2 | `-0.025em` | `text-3xl md:text-4xl font-bold tracking-tight` |
| **Título 2 (H2)** | 24px – 28px (`1.5rem`–`1.75rem`) | Semibold (600) | 1.25 | `-0.02em` | `text-2xl md:text-3xl font-semibold tracking-tight` |
| **Título 3 (H3)** | 20px (`1.25rem`) | Semibold (600) | 1.3 | `-0.015em` | `text-xl font-semibold` |
| **Headline / Card Title** | 17px – 18px (`1.0625rem`–`1.125rem`) | Semibold (600) | 1.4 | `-0.01em` | `text-lg font-semibold` |
| **Corpo (Body)** | 15px – 16px (`0.9375rem`–`1rem`) | Regular (400) | 1.6 | `0` | `text-base font-normal leading-relaxed` |
| **Subtítulo / Muted** | 14px (`0.875rem`) | Medium (500) | 1.5 | `0` | `text-sm font-medium` |
| **Legenda / Badge / Tag**| 12px – 13px (`0.75rem`–`0.8125rem`) | Semibold (600) | 1.4 | `+0.01em` | `text-xs font-semibold` |
| **Código / Mono** | 13px – 14px (`0.8125rem`–`0.875rem`) | Regular (400) | 1.5 | `0` | `font-mono text-xs md:text-sm` |

---

## 4. Iconografia

### 4.1 Biblioteca e Padrão

- **Lucide React (`lucide-react`):** Biblioteca padrão de ícones para o projeto Next.js.
- **Tamanhos Padronizados:**
  - Micro / Inline: `14 × 14 px` (com `strokeWidth={1.5}` ou `2`)
  - Padrão em botões e inputs: `16 × 16 px` a `18 × 18 px`
  - Cards e destaque de navegação: `20 × 20 px` a `24 × 24 px`
  - Hero / Features principais: `32 × 32 px` a `40 × 40 px`
- **Regras de Estilização:**
  - Traço suave com cantos arredondados (`stroke-linecap="round"` e `stroke-linejoin="round"`).
  - Ícones em botões devem alinhar perfeitamente com a baseline do texto e animar suavemente no hover (`scale: 1.05` ou translação sutil de 2px).

---

## 5. Espaçamento e Layout

### 5.1 Escala de Espaçamento (Base 4px / Tailwind)

| Nome | Valor | Tailwind | Uso Principal |
|---|---|---|---|
| `2xs` | 4 px | `gap-1`, `p-1` | Ajustes finos de micro-alinhamento |
| `xs` | 8 px | `gap-2`, `p-2` | Espaço entre ícone e texto, gaps compactos |
| `sm` | 12 px | `gap-3`, `p-3` | Espaço entre itens de lista e badges |
| `md` | 16 px | `gap-4`, `p-4` | Padding padrão de botões, inputs e cards mobile |
| `lg` | 24 px | `gap-6`, `p-6` | Padding interno de cards desktop e grids |
| `xl` | 32 px | `gap-8`, `p-8` | Margem entre seções e blocos de conteúdo |
| `2xl` | 48 px | `gap-12`, `p-12` | Separação de grandes seções na página |
| `3xl` | 64 px | `gap-16`, `py-16` | Margem vertical do Hero e rodapé |
| `4xl` | 80–120 px | `py-20 md:py-28`| Espaçamento de grandes seções no desktop |

### 5.2 Layout e Estrutura de Página (Next.js)

```tsx
<main className="min-h-screen bg-background text-foreground flex flex-col items-center">
  {/* Navbar Fixa com Glassmorphism */}
  <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/70 border-b border-border/50">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      {/* Brand & Links */}
    </div>
  </header>

  {/* Conteúdo Principal Centralizado */}
  <div className="w-full max-w-6xl px-4 sm:px-6 py-12 md:py-20 flex flex-col gap-16 md:gap-24">
    {/* Seções da aplicação */}
  </div>
</main>
```

---

## 6. Raios, Bordas e Elevação

### 6.1 Raios de Curvatura (Squircles)

| Elemento | Raio (px / rem) | Tailwind |
|---|---|---|
| Badges, tags e botões pílula | `9999px` | `rounded-full` |
| Inputs e botões regulares | `12px` (`0.75rem`) | `rounded-xl` |
| Cards médios e modais | `16px` a `20px` (`1rem`–`1.25rem`) | `rounded-2xl` |
| Contêineres de destaque e janelas macOS | `24px` (`1.5rem`) | `rounded-3xl` |

### 6.2 Sombras e Profundidade (Elevation)

Evite sombras escuras e duras. Utilize elevação difusa com baixíssima opacidade:

```css
/* Elevação 1 — Cards e botões em repouso */
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02);

/* Elevação 2 — Cards no hover e menus flutuantes */
box-shadow: 0 12px 36px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04);

/* Elevação 3 — Modais e Diálogos */
box-shadow: 0 24px 60px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06);
```

---

## 7. Liquid Glass & Glassmorphism

O efeito **Liquid Glass** é o pilar estético da interface. Ele simula superfícies vítreas com transmissão de luz, reflexo e desfoque espacial.

### 7.1 Implementação em CSS / Tailwind

```css
/* Classe Utilitária para Glassmorphism */
.glass-panel {
  background: rgba(255, 255, 255, 0.70);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.04);
}

.dark .glass-panel {
  background: rgba(22, 27, 34, 0.75);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.30);
}
```

### 7.2 Física de Mola (Spring Physics) com Framer Motion

Toda interação de clique ou hover **deve** usar física de mola elástica em vez de curvas lineares (`ease`, `linear`).

Configuração padrão de Spring:
```ts
export const appleSpring = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 0.8,
};

export const gentleSpring = {
  type: "spring",
  stiffness: 300,
  damping: 25,
};
```

---

## 8. Componentes

### 8.1 Botão Primário (Liquid Glass / Accent Button)

```tsx
"use client";

import { motion } from "framer-motion";
import { appleSpring } from "@/lib/animations";

export function GlassButton({ children, onClick, variant = "primary" }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={appleSpring}
      onClick={onClick}
      className={`
        relative px-6 py-3 rounded-full font-medium text-sm
        transition-colors duration-200 overflow-hidden
        ${variant === "primary"
          ? "bg-primary text-primary-foreground shadow-sm hover:opacity-95"
          : "glass-panel text-foreground hover:bg-white/80 dark:hover:bg-white/10"
        }
      `}
    >
      {children}
    </motion.button>
  );
}
```

### 8.2 Card com Efeito Glassmorphism & Hover Reativo

```tsx
"use client";

import { motion } from "framer-motion";
import { appleSpring } from "@/lib/animations";

export function GlassCard({ children, className = "" }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -4 }}
      transition={appleSpring}
      className={`glass-panel rounded-2xl p-6 transition-shadow hover:shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}
```

### 8.3 Input de Formulário Customizado

- `border-radius: 12px` (`rounded-xl`).
- Fundo translúcido com foco em anel suave (`focus:ring-2 focus:ring-primary/40`).
- Label com tracking sutil e cor secundária.

### 8.4 Split Views Redimensionáveis (`ResizablePanelGroup`)

Estrutura de divisores de painel no padrão macOS (`react-resizable-panels`):
- Divisores finos (`w-[1px]`) com transição suave para `var(--ide-accent)` no hover/foco.
- Limitadores de arrasto mínimo e máximo (`minSize={14}`, `maxSize={35}`) e alça central opcional (`withHandle`).
- Aplicado nas telas `/about`, `/projects` e `/contact`.

### 8.5 Command Palette Global (`Cmd+K` Spotlight)

Diálogo de busca modal inspirado no Spotlight / Alfred:
- Atalho global `⌘K` / `Ctrl+K` e atalhos rápidos `⌘1` a `⌘4`, `⌘T`.
- Agrupamento em "Navegação", "Arquivos do Editor", "Ações Rápidas" e "Links Externos".
- Estética Liquid Glass (`backdrop-blur-2xl bg-[var(--bg-glass)]/90 border border-white/20 dark:border-white/10 rounded-3xl elevation-3`).

### 8.6 Quick Look e Navegação por Teclado

Navegação por foco e pré-visualização instantânea na página de projetos:
- **Barra de Espaço (`Space`)**: Abre a visualização rápida (Quick Look) do projeto selecionado.
- **Escape (`Esc`)**: Fecha o modal de Quick Look instantaneamente.
- **Setas de Navegação / Tab**: Foco sequencial acessível entre cards de projetos.

---

## 9. Bibliotecas e Stack

| Biblioteca | Papel no Projeto |
|---|---|
| **Next.js 16+ (App Router)** | Framework React full-stack, Server Components, SSR/SSG, rotas otimizadas |
| **React 19** | Biblioteca de componentes UI |
| **Tailwind CSS** | Motor de estilização atômico com suporte a dark mode e plugins |
| **Framer Motion 12+** | Animações declarativas, física de mola (Spring), `layoutId` e `<AnimatePresence>` |
| **Lucide React** | Conjunto uniforme de ícones SVG leves |
| **Radix UI** | Primitivas de acessibilidade (Dialog, Tooltip, Dropdown, Accordion) |
| **next-themes** | Gerenciamento de tema (Light / Dark / System) com suporte a SSR sem flicker |

---

## 10. Inventário de Telas e Seções

Estrutura das rotas e seções da aplicação de portfólio:

| Rota / Seção | Tipo | Descrição |
|---|---|---|
| `/` (Home) | Página Principal | Hero com apresentação, estatísticas, projetos em destaque, habilidades e CTA |
| `/about` | Página Sobre | Biografia, trajetória profissional, timeline de experiências e formação |
| `/projects` | Galeria de Projetos | Catálogo de projetos com filtros interativos, tags e links para repositórios/demos |
| `/contact` | Contato | Formulário interativo com validação, links sociais e canais de comunicação |
| `not-found.tsx` | 404 Interativa | Tela estilizada com animação e atalho de retorno à Home |

---

## 11. Implementação em Next.js

A arquitetura do projeto organiza-se da seguinte forma:

```
d:/GitHub/portifolio/
├── app/                      ← Rotas e páginas (Next.js App Router)
│   ├── globals.css           ← Tokens CSS globais, @layer e variáveis
│   ├── layout.tsx            ← RootLayout com ThemeProvider e fontes
│   ├── page.tsx              ← Home page
│   ├── about/page.tsx        ← Página Sobre
│   ├── projects/page.tsx     ← Galeria de Projetos
│   └── contact/page.tsx      ← Página de Contato
├── components/               ← Componentes React reutilizáveis
│   ├── ui/                   ← Primitivas UI (buttons, cards, dialogs, inputs)
│   ├── navbar.tsx            ← Barra de navegação com Glassmorphism
│   ├── footer.tsx            ← Rodapé da aplicação
│   └── theme-toggle.tsx      ← Alternador de tema Light/Dark
├── hooks/                    ← Custom React hooks
├── lib/                      ← Utilitários, constantes e helpers
│   ├── utils.ts              ← Helper cn() (clsx + twMerge)
│   └── animations.ts         ← Variantes e configurações de Spring do Framer Motion
├── public/                   ← Assets estáticos (imagens, favicons, logos)
├── refs/                     ← Guias de referência, arquitetura e documentação
│   ├── stylesheet.md         ← Este guia de estilo
│   ├── ORGANIZACAO.md        ← Estrutura do projeto
│   └── COMMIT.md             ← Padrões de commit
├── tailwind.config.ts        ← Configuração de tema e extensões do Tailwind
└── package.json              ← Dependências do projeto
```

### 11.1 Configuração de Animações (`lib/animations.ts`)

```ts
import { Transition, Variants } from "framer-motion";

export const springTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 0.8,
};

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};
```

---

## 12. Lacunas e Dívidas de Design

| # | Item | Impacto | Ação Recomendada |
|---|---|---|---|
| 1 | **Sincronização de Tokens Dark/Light** | Garantir que todos os cards preservem contraste ideal em ambos os temas | Utilizar variáveis CSS semânticas (`--bg-primary`, `--text-primary`) |
| 2 | **Física de Mola Unificada** | Algumas transições pontuais usavam `duration: 0.3` fixo | Padronizar todas as interações interativas com `springTransition` do Framer Motion |
| 3 | **Otimização de Imagens** | Imagens de projetos carregadas sem blur placeholder | Utilizar `next/image` com `placeholder="blur"` e prioridade nos elementos do Hero |
| 4 | **Acessibilidade de Redução de Movimento** | Usuários com preferência de movimento reduzido | Garantir respeito a `prefers-reduced-motion` em todos os wrappers de animação |

---

## 13. Status de Verificação e Referências

- **Apple Human Interface Guidelines:** https://developer.apple.com/design/human-interface-guidelines
- **Next.js Documentation:** https://nextjs.org/docs
- **Tailwind CSS Documentation:** https://tailwindcss.com/docs
- **Framer Motion Documentation:** https://motion.dev
- **Radix UI Primitives:** https://www.radix-ui.com

---

*Documento adaptado para a stack Next.js / Web do Portfólio. Atualizar sempre que novas convenções ou componentes de design system forem introduzidos.*
