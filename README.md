# Portfolio Profissional - Felipe Grolla

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/felipe-grolla-freitas-projects/v0-professional-resume-page)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Apple HIG Inspired](https://img.shields.io/badge/UI%2FUX-Apple%20HIG-0071e3?style=for-the-badge&logo=apple)](https://developer.apple.com/design/human-interface-guidelines/)

## 📋 Visão Geral

Portfolio profissional de alta fidelidade visual e interativa com design inspirado no macOS e nos princípios do **Apple Human Interface Guidelines (HIG)**, desenvolvido com Next.js 15, React 19, TypeScript e Tailwind CSS. A interface integra estética **Liquid Glass**, física de mola com **Framer Motion**, tipografia **San Francisco (SF Pro)** para elementos de UI e **SF Mono** estritamente para blocos de código.

---

## ✨ Características Principais & Design System

### 🎨 1. Apple Human Interface Guidelines (HIG) & Liquid Glass
- **Tokens Autênticos Dark Mode macOS**: Paleta slate nativa (`#1e1e1e` base, `#252526` sidebar, `#323234` cards, `#0a84ff` Apple Blue accent e `#f5f5f7` Apple White) eliminando paletas genéricas.
- **Glassmorphism & Materiais macOS**:
  - Superfícies translúcidas com `backdrop-filter: blur(20px) saturate(180%)`.
  - Bordas semi-transparentes com gradientes alfa sutis (`border-white/30` / `border-white/10`).
  - Elevação e profundidade em camadas (`elevation-1`, `elevation-2`, `elevation-3`) com realce de luz especular (`box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08)`).
  - Squircles contínuos com cantos generosos (`rounded-2xl`, `rounded-3xl`, `rounded-full`).
- **Física de Mola (Spring Physics)**:
  - Microinterações elásticas em todos os elementos táteis (`whileTap={{ scale: 0.96 }}` a `0.98}`).
  - Variantes de mola Apple HIG (`appleSpring`: `{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }`).
  - Semáforos macOS interativos com glifos revelados no hover (`×`, `−`, `+`).

### 🪟 2. Estrutura Desktop Unificada & Split Views Redimensionáveis
- **Split Views macOS (`react-resizable-panels`)**:
  - Divisores de painel finos (`w-[1px]`) com realce de foco/hover para `var(--ide-accent)` e alça central `GripVertical`.
  - Redimensionamento suave com limites inteligentes (`minSize` e `maxSize`) nas páginas `/about`, `/projects` e `/contact`.
  - Fallback fluido e responsivo para mobile e tablet.

### 🔍 3. Command Palette Global (`Cmd+K` Spotlight) & Atalhos Rápidos
- **Spotlight Modal**: Acionamento por atalho de teclado `⌘K` / `Ctrl+K` ou pelo botão de busca no Header.
- **Navegação Expressa por Teclado**:
  - `⌘1`: Início / Home
  - `⌘2`: Sobre / About
  - `⌘3`: Projetos / Projects
  - `⌘4`: Contato / Contact
  - `⌘T`: Alternância dinâmica do tema Claro / Escuro
- **Ações Rápidas & Busca**: Filtro de arquivos (`my-bio.md`, `hobbies.ts`, `Education.tsx`), cópia de e-mail e telefone, links para GitHub e LinkedIn.

### 👁️ 4. Quick Look (Espaço) e Navegação por Teclado em Projetos
- **Barra de Espaço (`Space`)**: Focar um card de projeto e teclar Espaço abre a pré-visualização instantânea (Quick Look) do projeto.
- **Escape (`Esc`)**: Fechamento rápido do modal de detalhes.
- **Acessibilidade e Foco**: Suporte total a navegação sequencial por teclado (`Tab`, `Space`, `Enter`).

### 🖱️ 5. Menus de Contexto Nativos & Tooltips Refinados
- **Liquid Glass Context Menu**: Menus acionados com botão direito em blocos de código, abas e cards de projetos com atalhos de teclado macOS (`⌘C`, `⌘W`, `⌘↵`, `⌘⌫`).
- **Tooltips macOS**: Cápsulas translúcidas com cantos suaves (`rounded-xl`), animações de entrada sutis e explicações de contexto em botões de ação e redes sociais.

### 🗂️ 6. Abas Concorrentes Reais & Eliminação de Elementos Inertes
- **Remoção de Trilhos Inertes**: Removido o rail estático de 48px, proporcionando uma Source List macOS contínua e espaçosa.
- **Gerenciador Multi-Aba**: Suporte para manter múltiplas abas abertas simultaneamente (`openTabs`), fechamento individual (`X`), indicador animado via Framer Motion e Empty State vítreo para quando não houver arquivos abertos.

### 🔤 7. Tipografia Proporcional San Francisco (SF Pro)
- **UI Chrome & Textos**: Tipografia padrão do macOS (`-apple-system`, `SF Pro Text`, `SF Pro Display`, `Inter`).
- **Hierarquia de Pesos**:
  - Títulos: Bold / Semibold com tracking levemente negativo (`tracking-tight`).
  - Subtítulos e Labels: Medium (`font-medium`).
  - Corpo de texto: Regular com altura de linha espaçada (`leading-relaxed`).
- **Código**: A fonte `SF Mono` / `JetBrains Mono` é reservada com exclusividade para blocos `<pre>`, `<code>` e sintaxe.

### 🔔 8. Notificações & Feedback com Sonner
- Substituição de caixas de diálogo nativas por toasts modernos (`sonner`).
- Toasts visuais para envio de mensagens no formulário de contato e cópia de snippets de código.

---

## 🧭 Páginas da Aplicação

### 🏠 1. Página Inicial (`app/page.tsx`)
- **Hero Section**: Apresentação profissional com tipografia SF Pro e efeitos de gradiente sutis.
- **Modais de Código Liquid Glass com Menu de Contexto**:
  - 3 cards de demonstração (SQL Query, Python Function, JavaScript Function) com semáforos macOS, menu de contexto para cópia de código e tooltips.

### 👤 2. Página Sobre (`app/about/page.tsx`)
- **Desktop Split View**: Divisor redimensionável entre a Source List e o editor multi-abas.
- **File Explorer Sidebar**: Navegação em árvore de diretórios com menu de contexto em pastas e arquivos.
- **Gerenciador de Abas Concorrentes**: Suporte para manter múltiplos arquivos abertos simultaneamente (`my-bio.md`, `hobbies.ts`, `Education.tsx`), fechar abas individuais e Empty State.

### 💼 3. Página de Projetos (`app/projects/page.tsx`)
- **Desktop Split View**: Divisor redimensionável entre a barra lateral de filtros e a grade de cards.
- **Quick Look via Barra de Espaço (`Space`)**: Abertura rápida do modal de detalhes/README sem necessidade de clique do mouse.
- **Cards de Projetos com ContextMenu**: Menu de contexto nativo com "Ver Detalhes", "Abrir no GitHub" (`⌘↵`) e "Copiar Link" (`⌘C`).

### 📧 4. Página de Contato (`app/contact/page.tsx`)
- **Desktop 3-Pane Split View**: Divisores redimensionáveis entre Contatos, Formulário e Preview JavaScript.
- **Formulário de Contato**: Inputs com foco refinado e integração com EmailJS.
- **Live JavaScript Code Preview com ContextMenu**: Menu de contexto para cópia do snippet e limpeza de formulário.

### ⚠️ 5. Página 404 (`app/not-found.tsx`)
- **macOS Dialog / Alert Card**: Caixa de alerta inspirada no Finder com painel Liquid Glass (`glass-panel rounded-3xl elevation-3`), arte 404 em ASCII centralizada, semáforos interativos com status `404_NOT_FOUND` e botões de retorno rápido.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Biblioteca UI** | [React 19](https://react.dev/) |
| **Tipagem** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Estilização** | [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS Tokens |
| **Animações** | [Framer Motion](https://www.framer.com/motion/) |
| **Ícones** | [Lucide React](https://lucide.dev/) |
| **Notificações** | [Sonner](https://sonner.emilkowal.ski/) |
| **Testes** | [Vitest](https://vitest.dev/) & [Testing Library](https://testing-library.com/) |

---

## 📁 Estrutura do Projeto

```
portifolio/
├── app/
│   ├── about/            # Página Sobre (Explorer + Bio + Hobbies + Education)
│   ├── contact/          # Página de Contato (Formulário + Live Preview)
│   ├── projects/         # Página de Projetos (Filtros + Grid + Modais)
│   ├── globals.css       # Design System Tokens, Liquid Glass & Tipografia
│   ├── layout.tsx        # Root Layout com Provedores e Menu de Acessibilidade
│   ├── page.tsx          # Página Inicial com Code Snippets
│   └── not-found.tsx     # Alerta 404 em estilo macOS Dialog
├── components/
│   ├── about/            # Componentes de Bio, Educação e Hobbies
│   ├── projects/         # Modais de README e Repositório GitHub
│   ├── accessibility-menu.tsx # Menu flutuante de acessibilidade e temas
│   └── header.tsx        # Barra de navegação Liquid Glass
├── lib/
│   └── animations/       # Variantes de animação e constantes de mola
├── refs/                 # Fonte da verdade para design tokens e regras
├── tests/                # Suíte de testes automatizados (Vitest)
├── CHANGES.md            # Histórico detalhado de alterações
└── README.md             # Documentação do projeto
```

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- Node.js 18+
- npm ou pnpm

### 2. Instalação e Execução
```bash
# Clone o repositório
git clone https://github.com/Grolla05/portifolio.git

# Acesse o diretório
cd portifolio

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### 3. Execução de Testes
```bash
# Executar a suíte de testes unitários
npx vitest run

# Checagem estática de tipos
npx tsc --noEmit
```

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👤 Autor

**Felipe Grolla**
- GitHub: [@Grolla05](https://github.com/Grolla05)
- LinkedIn: [felipegrolla](https://www.linkedin.com/in/felipegrolla/)
- Email: fegrolla0210@gmail.com
