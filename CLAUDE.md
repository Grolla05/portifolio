# CLAUDE.md — Portfólio IDE UI Redesign

## CONTEXTO DO PROJETO
Este é um site de portfólio pessoal com estética de IDE/editor de código
(inspirado em VS Code e Antigravity IDE). A stack utiliza [PREENCHA: React/Next.js/Vue/etc].
O objetivo desta sessão é refatorar TODA a interface gráfica para que seja
mais moderna, fluída e com qualidade de design Apple (macOS/SF Design),
mantendo o conceito visual de IDE. Framer Motion deve ser usado
como biblioteca principal de animações.

## ANÁLISE PRÉVIA — EXECUTE ANTES DE QUALQUER ALTERAÇÃO
1. Mapeie todos os arquivos de estilo (CSS, SCSS, Tailwind, styled-components)
2. Liste todos os componentes de UI e sua hierarquia
3. Identifique as rotas/páginas: _hello, _about-me, _projects, _contact-me
4. Verifique se framer-motion já está instalado; se não, instale:
   npm install framer-motion
5. Documente o que deve ser PRESERVADO (lógica, rotas, dados)


## SISTEMA DE DESIGN — TOKENS

Paleta Dark (padrão):
--bg-primary:     #0D1117
--bg-secondary:   #161B22
--bg-tertiary:    #1C2128
--bg-glass:       rgba(22,27,34,0.85)
--border-subtle:  rgba(240,246,252,0.10)
--border-default: rgba(240,246,252,0.15)
--accent:         #388BFD
--accent-purple:  #BC8CFF
--text-primary:   #E6EDF3
--text-secondary: #8B949E
--text-muted:     #484F58
--syntax-keyword: #FF7B72
--syntax-string:  #A5D6FF
--syntax-type:    #FFA657
--syntax-comment: #8B949E

Tipografia:
--font-ui:   'Inter', 'SF Pro Text', system-ui, sans-serif
--font-mono: 'JetBrains Mono', 'SF Mono', monospace
Pesos: apenas 400 e 500. Nunca 700.

Espaçamento base 4px:
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48px


## FRAMER MOTION — PADRÕES DE ANIMAÇÃO OBRIGATÓRIOS

1. Variantes globais reutilizáveis
Criar arquivo: src/animations/variants.ts

export const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }
}

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" } }
}

export const slideInLeft = {
  hidden:  { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }
}

export const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
}

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }
}

2. Onde aplicar cada variante

Sidebar (tree de arquivos):
- Container: motion.aside com slideInLeft
- Cada item de arquivo/pasta: motion.li com fadeUp + stagger via pai
- Expand/collapse de pasta: AnimatePresence + fadeUp nos filhos
- Ícone de seta: motion.span com rotate: isOpen ? 90 : 0

Tab bar:
- Nova aba entrando: AnimatePresence mode="popLayout" + scaleIn
- Indicador de aba ativa (underline): motion.div com layoutId="activeTab"
  (isso cria o efeito de sliding automático entre abas)

Conteúdo do editor (troca de página/rota):
- Usar AnimatePresence mode="wait" no router
- Cada página: motion.main com fadeUp no mount, fadeIn invertido no unmount
- Linhas de texto: staggerContainer + cada linha com fadeUp

Cards de código (painel direito):
- Container: staggerContainer
- Cada card: motion.article com fadeUp
- Hover: whileHover={{ y: -2 }} diretamente na motion tag
- Tokens de sintaxe: animar entrada com stagger de 0.02s por token

Topbar / nav links:
- Links: motion.a com whileHover={{ opacity: 0.75 }}
- Indicador de rota ativa: motion.span com layoutId="navUnderline"

Theme toggle (dark/light):
- Ícone: motion.svg com animate={{ rotate: isDark ? 0 : 180 }}
  transition={{ duration: 0.4, ease: "anticipate" }}

Cursor piscante (simulação de editor):
- motion.span com animate={{ opacity: [1, 0, 1] }}
  transition={{ duration: 1, repeat: Infinity, ease: "steps(1)" }}

3. Regras de performance obrigatórias
- Usar will-change: transform apenas em elementos que realmente animam
- Preferir animações em transform e opacity (GPU-accelerated)
- NUNCA animar width, height, top, left diretamente
- Usar useReducedMotion() do framer-motion e desativar animações se true:
  const prefersReduced = useReducedMotion()
  const variants = prefersReduced ? {} : fadeUp


## COMPONENTES A REFATORAR (ordem de execução)

[ ] 1. design-tokens.css — centralizar todas as variáveis CSS
[ ] 2. src/animations/variants.ts — criar arquivo de variantes
[ ] 3. Topbar / Window Chrome
[ ] 4. Sidebar (file explorer)
[ ] 5. Tab bar do editor
[ ] 6. Layout de página / router transition
[ ] 7. Área de conteúdo principal (editor)
[ ] 8. Painel direito (code snippets)
[ ] 9. Tema dark/light com toggle animado
[ ] 10. Responsividade (mobile drawer, tablet)


## REGRAS INVIOLÁVEIS
✗ NÃO usar gradientes decorativos ou efeitos neon
✗ NÃO usar border-radius acima de 12px em containers principais
✗ NÃO quebrar nenhuma funcionalidade ou rota existente
✗ NÃO hardcodar cores — sempre via variáveis CSS
✗ NÃO animar propriedades que causam layout reflow (width, height, top, left)
✓ Sempre usar variáveis CSS centralizadas
✓ Garantir contraste WCAG AA (4.5:1) em todos os textos
✓ Respeitar prefers-reduced-motion via useReducedMotion()
✓ Comentar cada seção alterada com o motivo da mudança
✓ Executar de forma incremental, componente por componente

## ENTREGÁVEIS
1. Relatório de análise do projeto (antes de alterar qualquer coisa)
2. Arquivo design-tokens.css ou equivalente
3. Arquivo src/animations/variants.ts com todas as variantes
4. Todos os componentes refatorados
5. Checklist de QA: contraste, responsividade, acessibilidade, performance