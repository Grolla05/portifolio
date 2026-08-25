# Histórico de Mudanças (CHANGES.md)

Todas as alterações notáveis deste projeto são documentadas neste arquivo, seguindo as diretrizes de design Apple Human Interface Guidelines (macOS / SF Design).

---

## [Split Views Redimensionáveis, Command Palette Global (Cmd+K) e Quick Look] - 2026-08-25

### 🪟 1. Estrutura de Janela Desktop e Split Views Redimensionáveis
- **Componentes de Divisão de Painel ([components/ui/resizable.tsx](file:///d:/GitHub/portifolio/components/ui/resizable.tsx)):**
  - Implementados `ResizablePanelGroup`, `ResizablePanel` e `ResizableHandle` com estilização autêntica de divisores macOS (`w-[1px]`, cor `var(--border-default)` e transição suave para `var(--ide-accent)` no hover/foco).
  - Alça central em pílula translúcida com ícone `GripVertical` revelada no hover state.
- **Integração nas Telas Desktop:**
  - **Página Sobre ([app/about/page.tsx](file:///d:/GitHub/portifolio/app/about/page.tsx)):** Split horizontal entre a barra lateral (Source List) e a área de edição com limites flexíveis (`minSize={14}`, `maxSize={35}`).
  - **Página de Projetos ([app/projects/page.tsx](file:///d:/GitHub/portifolio/app/projects/page.tsx)):** Split horizontal entre os filtros de tecnologias/ordenação e a grade de cards de projetos.
  - **Página de Contato ([app/contact/page.tsx](file:///d:/GitHub/portifolio/app/contact/page.tsx)):** Split view de 3 painéis (Sidebar de Contatos, Formulário de Envio e Preview JS em tempo real).
  - Fallback gracioso e empilhado mantido para visualizações mobile e tablet.

### 🔍 2. Command Palette Global (Cmd+K Spotlight)
- **Componente Spotlight ([components/command-palette.tsx](file:///d:/GitHub/portifolio/components/command-palette.tsx) & [components/ui/command.tsx](file:///d:/GitHub/portifolio/components/ui/command.tsx)):**
  - Diálogo modal Liquid Glass inspirado no Spotlight do macOS (`backdrop-blur-2xl bg-[var(--bg-glass)]/90 border border-white/20 dark:border-white/10 rounded-3xl elevation-3 shadow-2xl`).
  - **Ouvintes Globais de Teclado:**
    - `⌘K` / `Ctrl+K`: Alterna abertura e fechamento da Command Palette.
    - `⌘1`: Navega instantaneamente para a Home (`/`).
    - `⌘2`: Navega instantaneamente para o Sobre (`/about`).
    - `⌘3`: Navega instantaneamente para Projetos (`/projects`).
    - `⌘4`: Navega instantaneamente para Contato (`/contact`).
    - `⌘T`: Alterna o tema entre Modo Claro e Modo Escuro.
  - **Grupos de Busca e Ações:**
    - *Navegação:* Início, Sobre, Projetos, Contato.
    - *Arquivos do Editor:* `my-bio.md`, `hobbies.ts`, `Education.tsx`.
    - *Ações Rápidas:* Alternar Tema, Copiar E-mail, Copiar Telefone.
    - *Links Externos:* GitHub e LinkedIn.
- **Botão Gatilho no Header ([components/header.tsx](file:///d:/GitHub/portifolio/components/header.tsx)):** Adicionado botão de busca com badge `⌘K` na barra de navegação para acionamento direto com o mouse.
- **Registro Global ([app/layout.tsx](file:///d:/GitHub/portifolio/app/layout.tsx)):** Registrado no Root Layout com suporte ao `Toaster` do Sonner.

### 👁️ 3. Quick Look (Espaço) e Navegação por Teclado em Projetos
- **Acionamento por Barra de Espaço (`Space`):**
  - Nos cards de projetos em [app/projects/page.tsx](file:///d:/GitHub/portifolio/app/projects/page.tsx), focar um card e pressionar a barra de espaço abre instantaneamente o modal Quick Look com os detalhes e o README do projeto.
  - Pressionar a tecla `Escape` (`Esc`) fecha o modal instantaneamente.
  - Adicionado badge sutil "Espaço: Quick Look" nos cards de projetos.
  - Acessibilidade e foco aprimorados via `tabIndex={0}` e navegação por teclado.

### 🧪 4. Suíte de Testes Automatizados ([tests/](file:///d:/GitHub/portifolio/tests/))
- Criado `tests/command-palette.test.tsx`: Teste de abertura por `Cmd+K`, listagem de grupos e navegação (3/3 aprovados).
- Criado `tests/split-views.test.tsx`: Validação de contêineres e atributos de split view redimensionável (2/2 aprovados).
- Criado `tests/quick-look-shortcuts.test.tsx`: Validação de Quick Look via tecla `Space` e fechamento com `Escape` (2/2 aprovados).
- **Status Geral:** 100% de aprovação em todos os 32 testes em 11 arquivos de suíte via Vitest.
- **Typecheck Estático:** `npx tsc --noEmit` concluído com 0 erros.

---

## [Menus de Contexto Nativos, Abas Concorrentes e Tokens Dark Mode macOS] - 2026-08-25

### 🌓 1. Refinamento de Cores e Vibrâncias do Dark Mode (Tokens Autênticos macOS)
- **Eliminação de Paletas Genéricas / GitHub Primer:** Substituídos tons azulados escuros (`#0D1117`, `#161B22`) pelos materiais dark slate autênticos do macOS Sonoma/Sequoia:
  - `--bg-primary: #1e1e1e` (Superfície principal / janela nativa macOS).
  - `--bg-secondary: #252526` (Barra lateral / Source List macOS e abas).
  - `--bg-tertiary: #323234` (Contêineres elevados e cards).
  - `--bg-glass: rgba(30, 30, 30, 0.75)` (Modais, menus de contexto e tooltips translúcidos).
  - `--text-primary: #f5f5f7` (Apple White de alto contraste).
  - `--text-secondary: #a1a1a6` (Cinza neutro de leitura).
  - `--text-muted: #6e6e73` (Comentários de código e atalhos).
  - `--ide-accent: #0a84ff` (Apple Dark Mode Accent Blue vibrante).
- **Elevação e Iluminação Especular macOS:** Atualizadas as classes `.dark .glass-panel` e `.dark .glass-pill` com realce de luz na borda superior (`box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08)`) simulando profundidade e reflexo físico da luz sobre o vidro.
- **Sincronização do Design System ([refs/stylesheet.md](file:///d:/GitHub/portifolio/refs/stylesheet.md)):** Atualizadas todas as tabelas de cores, superfícies, acentos Apple HIG e elevação.

### 🗂️ 2. Eliminação de Elementos Inertes e Suporte a Abas Concorrentes Reais
- **Remoção da Activity Bar Inerte de 48px:**
  - Removido o trilho lateral estático (`Terminal`, `Gamepad2`, círculo inerte) em `app/about/page.tsx`, `app/projects/page.tsx` e `app/contact/page.tsx`.
  - A barra lateral de navegação (Source List) foi expandida de forma limpa e contínua até a borda da janela, respeitando a arquitetura macOS.
- **Gerenciador de Abas Concorrentes Unificado ([app/about/page.tsx](file:///d:/GitHub/portifolio/app/about/page.tsx)):**
  - Implementado estado multi-aba (`openTabs: string[]`, `activeTab: string`) permitindo manter múltiplos arquivos abertos simultaneamente (`my-bio.md`, `hobbies.ts`, `Education.tsx`).
  - Barra de abas unificada com indicador de aba ativa animado via Framer Motion (`layoutId="activeEditorTabIndicator"` com `appleSpring`).
  - Botão de fechamento individual de aba (`X`) com `aria-label="Fechar aba"`, tooltip dedicado e parada de propagação de clique.
  - Removidas as barras de abas fixas duplicadas dos componentes filhos (`bio.tsx`, `hobbie.tsx`, `education.tsx`).
  - **macOS Empty State:** Renderização de um card vítreo elegante quando todas as abas são fechadas, com ícone de pasta aberta e botão rápido "Abrir my-bio.md".

### 🖱️ 3. Menus de Contexto Nativos e Tooltips Refinados (macOS Liquid Glass)
- **Componentes do Design System ([components/ui/context-menu.tsx](file:///d:/GitHub/portifolio/components/ui/context-menu.tsx) e [components/ui/tooltip.tsx](file:///d:/GitHub/portifolio/components/ui/tooltip.tsx)):**
  - Estilização completa com cantos arredondados contínuos (`rounded-2xl` e `rounded-xl`), blur de 20px, bordas semitransparentes, sombras difusas e badge de atalhos de teclado macOS (`ContextMenuShortcut`).
  - Itens de menu com estados de hover suaves e realce no padrão macOS.
- **Integração nas Telas:**
  - **Página Inicial ([app/page.tsx](file:///d:/GitHub/portifolio/app/page.tsx)):** Menu de contexto em cada bloco de código (SQL, Python, JavaScript) com "Copiar Trecho de Código" (`⌘C`) e "Ver no GitHub". Tooltips informativos nas redes sociais e handle do GitHub.
  - **Página Sobre ([app/about/page.tsx](file:///d:/GitHub/portifolio/app/about/page.tsx)):** Menu de contexto nas abas superiores e nos arquivos da árvore lateral com "Abrir Arquivo", "Copiar Caminho" (`⌘C`), "Fechar Aba" (`⌘W`) e "Fechar Outras Abas".
  - **Página de Projetos ([app/projects/page.tsx](file:///d:/GitHub/portifolio/app/projects/page.tsx)):** Menu de contexto em todos os cards de projetos com "Ver Detalhes do Projeto", "Abrir no GitHub" (`⌘↵`) e "Copiar Link do Repositório" (`⌘C`). Tooltip no botão de limpar filtros.
  - **Página de Contato ([app/contact/page.tsx](file:///d:/GitHub/portifolio/app/contact/page.tsx)):** Menu de contexto no painel de preview JavaScript com "Copiar Código JavaScript" (`⌘C`) e "Limpar Formulário" (`⌘⌫`). Tooltips no botão de envio e cópia de código.

### 🧪 4. Suíte de Testes Automatizados ([tests/](file:///d:/GitHub/portifolio/tests/))
- **Criados Novos Testes Unitários:**
  - `tests/macos-dark-tokens.test.ts`: Validação dos tokens CSS autênticos do macOS Dark Mode no `globals.css` (4/4 testes aprovados).
  - `tests/context-menu-tooltips.test.tsx`: Validação da renderização e classes dos componentes de menu de contexto e tooltip (2/2 testes aprovados).
  - `tests/multi-tabs.test.tsx`: Validação da remoção da barra inerte de 48px, abertura concorrente de múltiplas abas, fechamento e estado vazio (3/3 testes aprovados).
- **Status Geral:** 100% de aprovação em todos os 25 testes em 8 arquivos de suíte via Vitest.

---

## [Refatoração Tipográfica SF Pro, Microinterações e Página 404 macOS] - 2026-08-25

### 🔤 1. Padronização Tipográfica Global (SF Pro para UI, SF Mono estritamente para Código)
- **Eliminação de Fontes Mono na Interface:** Removida a classe `font-mono` de contêineres raiz, cabeçalhos, barras de navegação, sidebars, badges, botões, modais e formulários.
- **Hierarquia Tipográfica Apple HIG:**
  - Títulos e Headers: SF Pro Semibold/Bold com tracking negativo (`tracking-tight`).
  - Subtítulos e Labels: SF Pro Medium (`font-medium`).
  - Texto de corpo: SF Pro Regular com altura de linha generosa (`leading-relaxed`).
  - Blocos de Código: Preservada a fonte `SF Mono` exclusivamente em `<pre>`, `<code>` e editores de sintaxe.
- **Ajustes por Componente:**
  - `components/header.tsx`: Logotipo e itens de navegação atualizados para SF Pro proporcional com ícones do Lucide React (`Home`, `User`, `FolderGit2`, `Mail`).
  - `components/accessibility-menu.tsx`: Cabeçalho do menu, opções de tema e botões de tamanho de fonte atualizados para SF Pro; removida marcação duplicada.
  - `app/page.tsx`: Headers de snippets de código, títulos e textos atualizados para SF Pro.
  - `app/about/page.tsx` & `components/about/*`: Explorer de arquivos, títulos de abas e cards de preview (Bio, Hobbies, Education) convertidos para SF Pro.
  - `app/projects/page.tsx`: Sidebar de linguagens, ordenação e títulos de projetos atualizados para SF Pro.
  - `components/projects/project-modal.tsx` & `repo-modal.tsx`: Títulos, botões de ação e chips de tecnologia padronizados em SF Pro.
  - `app/contact/page.tsx`: Labels de formulário, inputs, botões e listas de contatos convertidos para SF Pro.

### ⚡ 2. Física de Mola e Microinterações Apple (Spring Physics)
- **Feedback Tátil Elástico:** Implementado `whileTap={{ scale: 0.96 }}` e `whileTap={{ scale: 0.98 }}` em todos os elementos interativos (botões, links, cards de projetos, pastas e itens da sidebar).
- **Semáforos macOS Interativos (`TrafficLights`):** Adicionado componente de semáforos com física de hover (`×`, `−`, `+` visíveis no hover state) no Header e na Página 404.
- **Feedback de Notificações com Sonner:**
  - Substituídos `window.alert()` nativos no formulário de contato por toasts elegantes via `sonner` (`toast.success()`, `toast.error()`, `toast.loading()`).
  - Adicionado toast visual de confirmação ao copiar snippets de código para a área de transferência.

### 🧭 3. Refatoração Completa da Página 404 ([app/not-found.tsx](file:///d:/GitHub/portifolio/app/not-found.tsx))
- **macOS Dialog / Alert Card com Arte ASCII:**
  - Estrutura de diálogo centralizado com estética **Liquid Glass** (`glass-panel rounded-3xl elevation-3 border border-white/30 dark:border-white/10`).
  - Arte 404 em ASCII centralizada com destaque e estilização temática responsiva.
  - Semáforos macOS integrados na barra superior da janela com status `404_NOT_FOUND`.
  - Título em SF Pro Bold: `404 — Página Não Encontrada` e descrição do erro.
  - Botões de ação em estilo push button macOS: "Voltar ao Início" (com ícone `Home` e `appleSpring`) e "Ver Projetos" (com pílula translúcida `glass-pill`).

### 🧪 4. Suíte de Testes Automatizados ([tests/](file:///d:/GitHub/portifolio/tests/))
- Criado `tests/typography-a11y.test.tsx` para assegurar tipografia SF Pro proporcional no Header e navegação.
- Criado `tests/not-found.test.tsx` para validar a estrutura de diálogo macOS, painel de vidro e botões de navegação na página 404.
- 100% dos testes aprovados (16/16 testes em 5 arquivos de teste via Vitest).
- Typecheck TypeScript (`tsc --noEmit`) validado com sucesso sem erros.

---

## [Modernização UI & Liquid Glass] - 2026-08-25

### ✨ Novas Funcionalidades & Melhorias Visuais

1. **Liquid Glass nos Modais de Código ([app/page.tsx](file:///d:/GitHub/portifolio/app/page.tsx)):**
   - Os 3 blocos de código (SQL Query, Python Function e JavaScript Function) foram transformados em cards com a estética **Liquid Glass** (`glass-panel rounded-2xl`).
   - Adicionada borda vítrea sutil (`border border-white/30 dark:border-white/10`) com efeito translúcido e `backdrop-filter: blur(20px) saturate(180%)`.
   - Adicionada barra superior com controle de semáforo estilo macOS e física de mola no hover (`whileHover={{ y: -4, scale: 1.01 }} transition={appleSpring}`).

2. **Header com Liquid Glass e `lucide-react` ([components/header.tsx](file:///d:/GitHub/portifolio/components/header.tsx)):**
   - Barra de navegação atualizada para fundo com efeito vítreo (`backdrop-blur-xl bg-[var(--bg-glass)]`).
   - Nome "Felipe Grolla" com tipografia limpa em SF Pro.
   - Todos os links de navegação agrupados em uma única cápsula central Liquid Glass (`glass-panel`) com ícones modernos.
   - Indicador de aba ativa translúcido refinado com transição de mola elástica suave (`layoutId="headerNavPill"`).

3. **Tokens e Fundação do Design System ([app/globals.css](file:///d:/GitHub/portifolio/app/globals.css), [tailwind.config.ts](file:///d:/GitHub/portifolio/tailwind.config.ts), [lib/animations/variants.ts](file:///d:/GitHub/portifolio/lib/animations/variants.ts)):**
   - Adicionadas classes utilitárias `.glass-panel`, `.glass-pill`, `.elevation-1`, `.elevation-2`, `.elevation-3`.
   - Definidas configurações de física de mola Apple HIG (`appleSpring`, `gentleSpring`, `bouncySpring`).
   - Mapeados tamanhos de squircles no Tailwind (`rounded-2xl`, `rounded-3xl`, `rounded-4xl`).

4. **Suíte de Testes Automatizados ([tests/](file:///d:/GitHub/portifolio/tests/)):**
   - Adicionados testes de validação do design system (`design-tokens.test.ts`), variantes de animação (`animations.test.ts`) e renderização do Header (`header.test.tsx`).
