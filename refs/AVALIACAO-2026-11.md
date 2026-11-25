# Avaliação do Portfólio — 25/11/2026

Branch avaliada: `DEV` (commit `2cd953c`). Método: leitura do código (app/, components/, lib/, globals.css),
`vitest run` (191/191 ✅), `tsc --noEmit` (0 erros ✅) e inspeção visual no navegador (desktop e mobile 375px),
nas quatro rotas: `/`, `/about`, `/projects`, `/contact`.

---

## Parte 1 — Nota: **69 / 100**

| # | Critério | Peso | Nota | Resumo |
|---|---|---|---|---|
| 1 | Conteúdo e narrativa | 20 | **15** | Proposta de valor clara ("Software que conversa com o hardware"), estudos de caso reais, números ao vivo do GitHub. Falta **prova visual**: nenhuma foto, vídeo ou render de hardware num portfólio de embarcados. |
| 2 | Identidade visual | 20 | **12** | Coerente e limpa, mas **plana e monocromática**: tudo é cinza + um azul. O laranja de "hardware" é a melhor ideia de cor do site e aparece em uma palavra só. Cards e seções têm o mesmo peso, sem ritmo. Capas de projeto são linhas falsas de código, iguais entre si. |
| 3 | Motion e interação | 15 | **6** | É aqui que está o "falta WOW". Só existe `fadeUp` na montagem. Sem transição de rota, sem coreografia no hero (todos os elementos animam ao mesmo tempo), sem scroll storytelling, sem contadores, sem microinterações com resposta física. |
| 4 | UX e navegação | 10 | **8** | A metáfora de IDE é bem resolvida: rotas como arquivos, ⌘K, terminal, abas, status bar. Ponto forte do projeto. |
| 5 | Acessibilidade | 10 | **9** | Contraste WCAG AA documentado e testado, `useReducedMotion`, menu de acessibilidade, `lang="pt-BR"`, nomes acessíveis. Nível acima da média. |
| 6 | Engenharia de código | 15 | **11** | 191 testes, TypeScript limpo, comentários explicando o porquê. Mas: ~35 componentes shadcn sem uso, dependências mortas, páginas de 600–700 linhas, mistura de `style={{}}` inline com Tailwind. |
| 7 | Performance e SEO | 10 | **8** | OG images, sitemap, robots, fontes auto-hospedadas. Mas o conteúdo nasce com `opacity: 0` no HTML do servidor (ver P0-1). |
| | **Total** | **100** | **69** | |

**Leitura da nota:** um portfólio **tecnicamente sólido e honesto**, acima da média de portfólios de estudante em
engenharia e acessibilidade. Ele perde pontos onde o visitante decide em 5 segundos se o site é "de designer": **cor,
movimento e imagem**. Hoje o site parece um bom tema de editor, mas ainda não parece uma peça autoral.

### Achados concretos

**Problemas reais (corrigir antes de adicionar efeitos)**

1. **Conteúdo invisível até a hidratação.** Todo `motion.*` com `initial="hidden"` é renderizado no servidor com
   `opacity:0`. No mobile, 6s depois de carregar em dev, o hero ainda estava a meio fade e os CTAs não apareciam.
   Em produção a janela é menor, mas continua lá: piora o LCP, e quem tem JS lento vê uma tela vazia.
   (`app/page.tsx`, `app/projects/page.tsx`, `components/about/about-view.tsx`, `app/contact/page.tsx`)
2. **Hero sem coreografia.** Cada elemento do hero tem o próprio `initial`/`animate`, sem um pai com `staggerChildren`.
   Tudo entra no mesmo frame. É o oposto de "cinematográfico". (`app/page.tsx:473-520`)
3. **Cursor piscando com `ease: 'linear'`.** Ele faz fade em vez de piscar. O CLAUDE.md pede `steps(1)`. (`app/page.tsx:608`)
4. **Sem transição entre páginas.** Não existe `app/template.tsx` nem View Transitions. A troca de rota é um corte seco,
   e só o sublinhado do header desliza.
5. **Números com "–" no primeiro paint.** Os stats vêm do GitHub pelo cliente (`useProjects`). Poderiam vir do servidor
   com ISR e entrar com contagem animada.

**Dívida técnica**

- Componentes em `components/ui/` sem nenhum import: accordion, alert, alert-dialog, aspect-ratio, avatar, badge,
  breadcrumb, calendar, card, carousel, chart, checkbox, collapsible, drawer, dropdown-menu, form, glass-card, hover-card,
  input-otp, menubar, navigation-menu, pagination, popover, progress, radio-group, scroll-area, select, sidebar, slider,
  split-text, switch, table, tabs, textarea, toaster, toggle-group.
- Dependências sem uso ou só em código morto: `animejs` (só em `split-text`/`use-anime-reveal`, que ninguém importa),
  `liquid-glass-react`, `recharts`, `embla-carousel-react`, `react-day-picker`, `input-otp`, `vaul`, `cmdk`*
  (*conferir: o command palette usa `ui/command`).
- 15 cores hex hardcoded fora de `components/ui` (traffic lights, `not-found.tsx`) e 13 usos de `font-bold`/`font-semibold`,
  contra as regras do CLAUDE.md.
- Arquivos grandes: `app/projects/page.tsx` (695), `components/about/about-view.tsx` (665), `app/contact/page.tsx` (574).
- `variants.ts` mora em `lib/animations/`, mas o CLAUDE.md fala em `src/animations/`. Basta alinhar o documento.

---

## Parte 2 — Plano para "cara de designer" e efeito WOW

### Princípio

"Cinematográfico" não quer dizer mais animação. Quer dizer **direção**: uma sequência com começo, meio e fim, um
elemento assinatura e movimento com intenção (cada animação conta algo). A metáfora de IDE já é o roteiro, então basta
encená-la.

> ⚠️ **Conflito com o CLAUDE.md:** a regra "sem gradientes decorativos / sem neon" segura parte do que costuma dar
> WOW (glow e spotlight colorido). Este plano trabalha **dentro** da regra, com luz sutil, recorte e movimento.
> As poucas ideias que exigem afrouxar a regra estão marcadas com 🔓. A decisão é sua.

### P0 — Fundação (sem isso, os efeitos vão parecer travados)

| Item | O quê | Como |
|---|---|---|
| P0-1 | Conteúdo visível sem JS | Fazer o primeiro paint por CSS (`@keyframes` com `animation-fill-mode: both`) ou dar ao `MotionConfig` um `initial` que não esconda o LCP. O hero precisa estar legível mesmo sem hidratar. |
| P0-2 | `MotionConfig` global | `<MotionConfig reducedMotion="user" transition={appleSpring}>` no layout. Assim não é preciso repetir `prefersReduced ? {} : fadeUp` em cada elemento (hoje são dezenas de repetições). |
| P0-3 | `LazyMotion` + `m.*` | `LazyMotion features={domAnimation}` corta cerca de 30 KB do bundle de motion. |
| P0-4 | Limpar código morto | Remover os componentes e dependências listados acima. |
| P0-5 | Tokens de motion | Adicionar a `variants.ts` as durações (`--dur-xs 120ms … --dur-xl 900ms`), as curvas (`easeOutExpo [0.16,1,0.3,1]`, `easeInOutQuint`) e os delays de cena. O site inteiro passa a respirar no mesmo tempo. |

### P1 — O "WOW" (maior impacto percebido)

**1. Abertura do hero como cena (≈1,4s, uma vez por sessão)**
Sequência coreografada com um único `staggerContainer` pai:
1. `// Felipe Grolla · desenvolvedor de software` digitado caractere a caractere (mono, 18ms por caractere).
2. O h1 entra **por palavra com máscara**: cada palavra fica num `overflow:hidden` e sobe de `y:110%` para `0`,
   com stagger de 60ms e curva `easeOutExpo`. É o efeito "título de trailer" e usa só transform.
3. "hardware" ganha a cor laranja depois do resto: começa em `--text-primary` e faz um *wipe* para `--syntax-type`
   com `clip-path: inset(0 100% 0 0)` animado até `inset(0 0 0 0)` sobre uma cópia colorida.
4. Parágrafo e CTAs entram em `fadeUp`.
5. O `profile.ts` **se digita sozinho**, token a token, com as cores de sintaxe aparecendo (stagger de 0,02s por token,
   como o CLAUDE.md já pede). O cursor pisca com `steps(1)` no final.
Guardar em `sessionStorage` para tocar só na primeira visita. Na navegação interna, entrar direto.

**2. Elemento assinatura: o traço do osciloscópio** ⭐
É o que torna o site **seu**. Uma linha SVG fina, como um sinal de osciloscópio, que sai da palavra "hardware" e
"conduz" até o painel `profile.ts`, desenhada com `pathLength 0→1`. Depois de desenhada, ela ondula de leve com o
mouse (amplitude via `useSpring`). Liga visualmente as duas metades do seu posicionamento: hardware e software.
Reaparece como divisor entre seções. Fica dentro das regras: traço de 1px na cor do token, sem glow.

**3. Transições de rota no estilo "troca de aba"**
O Next 16 + React 19 têm `<ViewTransition>` (`experimental.viewTransition` no `next.config.mjs`). Use para:
- trocar de página com um crossfade curto e deslocamento de 8px, como trocar de arquivo no editor;
- **shared element**: a capa do card em `/projects` *vira* o hero de `/projects/[slug]` (`viewTransitionName` por slug).
  É o efeito que mais parece produto Apple.
Plano B, sem flag experimental: `app/template.tsx` com `motion.main` em `fadeUp`.

**4. Scroll storytelling na home**
- **Stats com contagem**: `useInView` + `useSpring` de 0 até o valor (37, 15, 4, 1) com `tabular-nums`, para os números
  não pularem de largura.
- **Projetos em destaque**: reveal escalonado com `whileInView`, `viewport={{ once: true, margin: '-15%' }}`.
- **Trajetória como `git log --graph`**: a linha vertical do grafo se desenha com o scroll (`scaleY` ligado ao
  `useScroll`, `transform-origin: top`) e cada commit "acende" quando a linha o alcança.
- **Parallax leve** no painel `profile.ts` (`useTransform(scrollY, [0,400], [0,-40])`), com profundidade sem exagero.
- Opcional e de alto impacto: uma seção **"Do circuito à interface"** com sticky. Ao rolar, um painel fixo troca de
  esquemático (KiCad) para firmware (C++) e depois para dashboard (web), contando o fluxo do Solar Points.

**5. Microinterações com física**
- **Cards com tilt 3D**: `rotateX/rotateY` (±4°) seguindo o cursor com `useSpring`, `perspective: 1000px` e borda que
  clareia do lado da luz. Usa só transform.
- **CTA magnético**: o botão primário é atraído até 6px na direção do cursor.
- **Copiar e-mail**: o ícone faz morph de `Copy` para `Check` com `AnimatePresence mode="popLayout"` e a pílula ganha
  um *ping* de escala.
- **Theme toggle com revelação circular**: `document.startViewTransition` + `clip-path: circle()` expandindo do botão.
  Troca de tema que parece mágica, sem violar nenhuma regra.
- **Hover nos links do header**: o sublinhado já desliza (`layoutId`). Falta um *pré-hover*, um sublinhado fantasma
  a 30% de opacidade que segue o mouse.

### P2 — Cor e imagem (resolve a monocromia)

**6. Sistema de cor com dois acentos de marca**
Hoje o acento é só azul. Proposta:
- **Azul `--ide-accent`** = ação (links, CTA, foco).
- **Laranja `--syntax-type`** = assinatura "hardware" (traço do osciloscópio, palavras-chave da narrativa, marcadores
  da timeline, estado ativo da sidebar). Vira um token próprio: `--brand-signal`.
- **Tint por linguagem nos cards**: a borda superior de 2px e o hover usam `getLanguageColor()`, que já existe.
  A grade de projetos ganha cor sem gradiente.
- Superfícies escuras com um leve toque frio (`#1c1d20` em vez de `#1e1e1e` neutro) dão mais profundidade ao contraste
  com o laranja. Validar contraste com o `tests/contrast.test.ts`, que já existe.
- 🔓 Se quiser ir além: um *spotlight* radial muito sutil (opacidade de 4–6%) que segue o cursor dentro dos cards.
  Exige liberar "gradiente funcional" no CLAUDE.md.

**7. Imagens reais: o maior salto de credibilidade**
Portfólio de embarcados sem foto de hardware perde o principal argumento. Prioridade:
- Foto ou **vídeo em loop, mudo e curto (3–5s)** do Solar Points funcionando, da PCB, do Arduino montado.
- Renders 3D do KiCad (o KiCad exporta) como capas.
- Screenshots reais das interfaces web.
- Nas capas, o `ProjectCover` já aceita `cover`; basta alimentar. Com a imagem, adicionar um *Ken Burns* leve no hover
  (`scale 1→1.04` em 6s).

**8. Tipografia com mais contraste de escala**
O h1 já é grande, mas as seções seguintes (h2 de 30–36px) achatam a hierarquia. Sugestão: títulos de seção com o rótulo
mono `// projects/featured` acima e o h2 em 44–56px com `tracking-tight`, mantendo o peso 500. Mais espaço entre seções
(`py-32`) para cada uma "entrar em cena".

### P3 — Detalhes de acabamento

- **Boot screen opcional** (≤600ms, só na primeira visita): a status bar aparece primeiro e escreve
  `compiling portfolio… done in 0.42s`, depois a janela abre. É a assinatura da IDE.
- **Terminal com easter eggs** (`sudo hire felipe`, `neofetch`), porque recrutador técnico adora.
- **Page de projeto como README vivo**: o índice lateral acende conforme a seção visível (`useInView`).
- **Cursor customizado** só no hero, como caret de texto, e só em pointer fine.
- **Som**: não. Seria um anti-padrão em portfólio.

---

## Roadmap sugerido

| Sprint | Itens | Nota esperada |
|---|---|---|
| 1 — Fundação | P0-1 a P0-5 + correção do cursor | 69 → **73** |
| 2 — Cena | Hero coreografado, traço do osciloscópio, transições de rota, stats com contagem | 73 → **83** |
| 3 — Cor e imagem | Acento `--brand-signal`, tint por linguagem, fotos e vídeos reais, tipografia | 83 → **90** |
| 4 — Acabamento | Tilt, CTA magnético, theme reveal, timeline desenhada, boot screen | 90 → **93+** |

**Regra de ouro para manter o "Apple feel":** toda animação ≤ 400ms em interação e ≤ 1,4s em cena. Só `transform`,
`opacity` e `clip-path`. Tudo desligado com `prefers-reduced-motion`. Uma ideia forte (o traço do osciloscópio)
vale mais que dez efeitos genéricos.
