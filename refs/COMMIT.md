# Guia de Commits e Pull Requests — Arbo

> Fonte da verdade de **como escrever commit e abrir PR** neste repositório.
> Complementa [ORGANIZACAO.md](ORGANIZACAO.md) (onde o código mora),
> [APIs.md](APIs.md) (contrato com o BFF) e
> [PARAMETROS.md](PARAMETROS.md) (decisões de produto).
>
> O `CLAUDE.md` da raiz define **quando** commitar (passo 8 do workflow
> obrigatório). Este arquivo define **como** — formato, conteúdo e critério de
> aceite. Vale para pessoas e para assistentes de IA, sem exceção.

---

## Sumário

1. [Regra de ouro](#1-regra-de-ouro)
2. [Quando commitar](#2-quando-commitar)
3. [Granularidade: o que cabe em um commit](#3-granularidade-o-que-cabe-em-um-commit)
4. [Anatomia da mensagem](#4-anatomia-da-mensagem)
5. [Tipos permitidos](#5-tipos-permitidos)
6. [Escopos deste repositório](#6-escopos-deste-repositório)
7. [Corpo: o porquê](#7-corpo-o-porquê)
8. [Rodapé e trailers](#8-rodapé-e-trailers)
9. [Exemplos](#9-exemplos)
10. [Checklist antes do commit](#10-checklist-antes-do-commit)
11. [O que nunca entra em um commit](#11-o-que-nunca-entra-em-um-commit)
12. [Branches, push e histórico](#12-branches-push-e-histórico)
13. [Pull Request](#13-pull-request)
14. [Corrigir commit errado](#14-corrigir-commit-errado)

---

## 1. Regra de ouro

**O diff mostra o *quê*. A mensagem existe para mostrar o *porquê*.**

Se a mensagem só repete em português o que qualquer pessoa leria no diff, ela
não está pronta. Isso vale em dobro quando a mudança toca regra regulatória,
vocabulário visível ao usuário, os 5 parâmetros ou o fluxo de consentimento —
nesses casos a razão da mudança é a única coisa que não dá para reconstruir
seis meses depois.

---

## 2. Quando commitar

O commit é o **passo 8** do workflow obrigatório do `CLAUDE.md`. Só acontece
depois que:

1. os testes da feature existem e **passam** (`flutter test`);
2. o [CHANGES.md](../CHANGES.md) foi atualizado nos mínimos detalhes;
3. o [README.md](../README.md) foi atualizado a partir do `CHANGES.md`;
4. **o usuário validou.** Preparar a mensagem é livre; executar `git commit`
   sem validação explícita, não.

A mensagem do commit **se deriva do `CHANGES.md`** — é o resumo executivo dele,
não um texto escrito do zero. Se os dois discordam, o `CHANGES.md` está certo e
a mensagem está errada.

---

## 3. Granularidade: o que cabe em um commit

| Princípio | Na prática |
|---|---|
| Um commit = uma unidade lógica | Uma tela, um bug, uma refatoração — não os três juntos |
| O repositório compila em todo commit | Nada de "parte 1 de 3" que não roda |
| Refactor não viaja de carona | Renomear meio arquivo dentro de um `feat` esconde a mudança de comportamento no meio do ruído |
| Formatação isolada | `dart format` em arquivo que você não alterou vira commit `style:` separado |
| Sem commit de WIP na `DEV` | A `DEV` é branch integrada; rascunho fica no seu working tree |

Commit grande demais não é pecado quando a unidade lógica é grande de fato (uma
tela nova com model, service mock e teste é **um** commit). Commit
artificialmente picado em "salvei o arquivo" é.

---

## 4. Anatomia da mensagem

```text
<tipo>(<escopo>): <assunto no imperativo>
                                            ← linha em branco obrigatória
<corpo: por que a mudança existe, wrap em 72 colunas>

<rodapé: refs, breaking change, trailers>
```

### Regras do assunto (primeira linha)

| Regra | Detalhe |
|---|---|
| Formato | `tipo(escopo): assunto` — Conventional Commits |
| Idioma | **pt-BR** no assunto e no corpo; `tipo` e `escopo` em inglês/kebab-case |
| Modo verbal | **Imperativo**: "adiciona", "corrige", "remove" — nunca "adicionado", "adicionando", "adicionei" |
| Tamanho | Alvo **≤ 50 caracteres**; teto rígido **72** |
| Caixa | Minúscula depois dos dois-pontos (exceto nome próprio: `Pix`, `Figma`, `Tesouro Reserva`) |
| Pontuação | **Sem ponto final** |
| Escopo | Obrigatório sempre que a mudança couber em um escopo da [§6](#6-escopos-deste-repositório); omitir só quando for transversal |

### O teste da frase

O assunto tem que completar esta frase sem estranheza:

> *"Se aplicado, este commit ______."*

`feat(parametros): adiciona tela de teto por período` → "Se aplicado, este
commit **adiciona tela de teto por período**." ✅

`bug` → "Se aplicado, este commit **bug**." ❌

---

## 5. Tipos permitidos

| Tipo | Usar quando | Exige corpo? |
|---|---|---|
| `feat` | Comportamento novo visível ao usuário (tela, campo, fluxo) | Sim |
| `fix` | Correção de defeito | Sim — descreva o sintoma e a causa |
| `refactor` | Reorganização sem mudar comportamento | Sim — por que valeu a pena |
| `perf` | Ganho de performance mensurável | Sim — o número antes/depois |
| `docs` | `README.md`, `CHANGES.md`, `refs/`, comentários de doc | Se registrar decisão nova |
| `style` | Formatação, `dart format`, ordenação de imports | Não |
| `test` | Só testes: cria, corrige ou amplia cobertura | Não |
| `build` | `pubspec.yaml`, `pubspec.lock`, assets, config nativa | Sim, se mudar dependência |
| `chore` | Tarefa de manutenção que não entra em nada acima (`.gitignore`, scripts) | Não |
| `revert` | Desfaz um commit anterior (ver [§14](#14-corrigir-commit-errado)) | Sim — por que reverteu |

Não invente tipo novo. Se nada encaixa, o commit provavelmente está misturando
duas mudanças — separe.

---

## 6. Escopos deste repositório

Derivados da estrutura real de `front/lib/` ([ORGANIZACAO.md](ORGANIZACAO.md)) e
das faixas do Figma:

| Escopo | Cobre |
|---|---|
| `signup` | Cadastro, CPF, validação de dados do usuário |
| `termos` | Termos de Uso e aceite |
| `open-finance` | Conexão, consentimento e status de Open Finance |
| `parametros` | Faixa 2: regra de arredondamento, teto, periodicidade, simulação, revisão |
| `theme` | `app_colors`, `app_typography`, `app_spacing`, `app_theme` |
| `widgets` | Componentes reutilizáveis de `lib/widgets/` |
| `models` | Modelos de domínio |
| `services` | Serviços HTTP e mocks |
| `utils` | Formatters, validators |
| `nav` | Rotas e navegação |
| `refs` | Documentos de `refs/` |
| `deps` | Dependências do `pubspec.yaml` |

Escopo composto (`feat(parametros,widgets)`) é permitido, mas quase sempre
indica que são dois commits.

---

## 7. Corpo: o porquê

O corpo é **obrigatório** quando a mudança:

- toca **regra regulatória, consentimento ou vocabulário visível ao usuário**;
- altera o comportamento de qualquer um dos **5 parâmetros**;
- muda o **contrato com o BFF** (então `refs/APIs.md` também muda);
- registra uma **decisão de produto** (periodicidade, faixa, limite, copy);
- remove, adia ou reordena **tela mandatória** (simulação pré-ativação, aviso
  de IOF, cancelamento em um toque);
- corrige bug cuja causa não é óbvia no diff.

Estrutura esperada:

```text
Por que: o problema, a decisão ou a exigência que motivou a mudança.
O que muda: só o necessário para orientar quem lê o diff.
O que fica em aberto: débito, workaround, dependência de decisão externa.
```

Regras práticas:

- Wrap em **72 colunas** — o `git log` de terminal não quebra linha sozinho.
- Cite o documento de `refs/` que embasa a decisão. Se a decisão é **nova**,
  ela precisa estar em `refs/` **no mesmo commit** — decisão só na mensagem de
  commit é decisão perdida.
- Datas **absolutas** (`2026-08-22`), nunca "ontem" ou "semana passada".
- Nunca afirme regra fiscal, taxa, prazo ou nome de endpoint que não esteja em
  `refs/`. Se falta, escreva a lacuna: *"pendente de definição do BFF"*.

---

## 8. Rodapé e trailers

| Trailer | Formato | Quando |
|---|---|---|
| Referência a documento | `Refs: refs/APIs.md §7.6` | Sempre que o corpo se apoiar em `refs/` |
| Issue | `Closes #12` / `Refs #12` | Quando existir issue |
| Quebra de contrato | `BREAKING CHANGE: <o que quebrou e o que fazer>` | Mudança incompatível de contrato, rota ou modelo |
| Coautoria | `Co-Authored-By: Nome <email>` | Pair programming ou commit assistido por IA |

`BREAKING CHANGE` no rodapé é obrigatório mesmo quando o assunto já usa `!`
(`feat(services)!: ...`) — o `!` chama atenção, o rodapé explica a migração.

---

## 9. Exemplos

### ✅ Bons

```text
feat(parametros): adiciona tela de teto por período

Por que: o Figma (node 1216:477) define o teto como parâmetro obrigatório
antes da periodicidade — sem ele o usuário não consegue limitar quanto do
arredondamento vira investimento no ciclo, o que é exigência dos 5
parâmetros.

O que muda: nova `teto_periodo_screen.dart`, campo `tetoPeriodo` em
`ParametrosInvestimento` e o widget `valor_slider_card`. Nenhuma rota nova
de API: a escolha trafega em memória via argumento de rota.

Em aberto: persistência depende do contrato do BFF.

Refs: refs/PARAMETROS.md §1
```

```text
fix(open-finance): encerra polling de status após 30 s

Por que: sem o corte, a tela de conexão consultava o status
indefinidamente quando o BFF não respondia, drenando bateria e sem dar
saída ao usuário. O limite de 2 s por tentativa e 30 s de janela é o que
refs/APIs.md §7 prevê.

O que muda: `aguardarConexao` passa a lançar timeout e a tela exibe erro
com ação "Tentar novamente". Não conflita com a regra de "sem retry
automático": ali o proibido é repetir POST que grava dado pessoal.

Refs: refs/APIs.md §2, §7
```

```text
docs(refs): registra periodicidade quinzenal como opção válida

Por que: decisão do time em 2026-08-22. Estava só no Figma; sem registro
em refs/ o próximo contribuidor trataria como valor inventado.
```

### ❌ Ruins — e por quê

| Mensagem | Problema |
|---|---|
| `bug` | Não diz o que quebrou, onde, nem por quê. Sem tipo, sem escopo, sem corpo |
| `feat` | Assunto vazio; o `git log` vira uma coluna de `feat` indistinguíveis |
| `ajustes` / `wip` / `.` | Não descreve nada e polui o histórico permanentemente |
| `feat(parametros): adicionado tela de teto e corrigido bug do slider e formatação` | Três mudanças, verbo no particípio, 90+ caracteres |
| `fix: corrige tela` | Sem escopo, sem sintoma, sem causa |
| `feat(parametros): muda arredondamento pra 1 real` | Regra de negócio nova sem corpo, sem `refs/` e sem fonte da decisão |

> O histórico atual do repositório (`bug`, `feat`, `docs` soltos) é dívida
> conhecida. Não serve de precedente — a partir deste documento, vale a §4.

---

## 10. Checklist antes do commit

```bash
cd front
dart format .          # 1. formatação
flutter analyze        # 2. tem que sair limpo, zero warning
flutter test           # 3. tudo verde
git status             # 4. confira o que está staged, arquivo por arquivo
git diff --staged      # 5. leia o próprio diff antes de descrever
```

- [ ] `flutter analyze` **sem nenhum** aviso — não "só warnings".
- [ ] Testes da feature escritos **antes** do código e passando.
- [ ] `CHANGES.md` atualizado; `README.md` atualizado a partir dele.
- [ ] Decisão de produto nova registrada em `refs/`, **neste commit**.
- [ ] Nenhuma chave, token, credencial ou dado real de usuário no diff.
- [ ] Nenhum arquivo gerado (`build/`, `.dart_tool/`, `.idea/`) staged.
- [ ] Assunto passa no [teste da frase](#o-teste-da-frase).
- [ ] Usuário validou o commit.

---

## 11. O que nunca entra em um commit

- ❌ Chave, token, certificado ou credencial — de Open Finance, Figma, API ou
  qualquer parceiro. Nem em exemplo, nem em mock, nem comentado.
- ❌ Dado real de usuário: CPF, nome, extrato, saldo. Mock usa dado
  claramente fictício.
- ❌ `build/`, `.dart_tool/`, `.metadata`, `.idea/`, `*.iml` — gerados ou
  locais de IDE.
- ❌ `pubspec.lock` editado à mão (só o gerado por `flutter pub get`).
- ❌ Screenshot ou export do Figma com dado sensível.
- ❌ Código comentado "para não perder" — o histórico é o backup.

Se um segredo já foi commitado: **não basta remover no commit seguinte**.
Rotacione o segredo imediatamente e avise o time — o valor continua no
histórico e deve ser tratado como vazado.

---

## 12. Branches, push e histórico

- **Trabalhe na `DEV`.** `CLAUDE.md` e `ORGANIZACAO.md` dispensam branch por
  feature. `origin/DEV` já existe no remoto
  (`https://github.com/Arbo-LTDA/frontend.git`) — a divergência registrada no
  `README.md` §9 está resolvida.
- `main` é protegida por convenção: **só recebe código via Pull Request** a
  partir da `DEV`. Nunca commite direto nela.
- Ordem do ciclo: `commit` → `push` (sync changes) → **Pull Request**.
- **Nunca reescreva histórico já publicado** — sem `--force`, sem `--amend`,
  sem rebase em commit que já está no `origin/DEV`.
- `--amend` só é aceitável enquanto o commit é **local e não pushado**.
- Nunca use `--no-verify` para pular hook. Hook falhou? Conserte a causa.

---

## 13. Pull Request

### Quando abrir

Ao final de uma unidade entregável (uma feature, uma faixa de telas, uma
correção), depois de `push` na `DEV`. Base `main`, head `DEV`.

### Título

**Mesmo formato do assunto de commit** — `tipo(escopo): assunto no imperativo`,
pt-BR, ≤ 72 caracteres, sem ponto final.

- ✅ `feat(parametros): implementa Faixa 2 até a tela de teto`
- ❌ `Atualizações da sprint`
- ❌ `DEV → main`

PR com um único commit repete o assunto dele. PR com vários commits usa um
título que descreva a **entrega inteira**, não o último commit.

### Descrição

Use este template:

```markdown
## Contexto

Por que esta entrega existe. Qual problema do usuário, exigência regulatória
ou decisão de produto motivou. Cite refs/ e o node do Figma.

## O que muda

- Arquivo/tela/serviço → o que passou a fazer
- Um item por mudança relevante, não um item por arquivo tocado

## Telas afetadas

| Tela | Node Figma | Situação |
|---|---|---|
| Teto por período | `1216:477` | ✅ implementada |

## Como testar

1. Passo a passo reproduzível a partir de `flutter run`
2. O que se espera ver em cada passo

## Testes

- `test/...` — o que cobre
- Resultado de `flutter test` e `flutter analyze`

## Impacto regulatório

Toca consentimento, vocabulário visível, os 5 parâmetros ou tela mandatória?
Se **não**, escreva "Nenhum" — explicitamente, não em branco.

## Em aberto

Débitos, workarounds e dependências de decisão externa (BFF, parceiro).

## Refs

- refs/PARAMETROS.md §1
- CHANGES.md — entrada de 2026-08-22
```

### Regras do PR

- **Screenshot ou gravação é obrigatório** em qualquer PR que mude UI. Sem
  isso, o revisor precisa rodar o app só para ver um botão.
- **Nada de PR "misto"**: feature + refactor amplo + upgrade de dependência no
  mesmo PR torna a revisão inútil. Separe.
- O corpo do PR **não substitui** o `CHANGES.md` — o `CHANGES.md` é o registro
  permanente no repositório; o PR é a conversa de revisão.
- Marque como **draft** enquanto os testes não estiverem verdes.
- Merge só com `flutter analyze` limpo e `flutter test` verde.
- Preferir **squash merge** quando o histórico da `DEV` tiver commits de ajuste
  intermediário — a mensagem final do squash segue a [§4](#4-anatomia-da-mensagem).
- Respondeu a um comentário de revisão? O commit de resposta é normal
  (`fix(...)`, `refactor(...)`), nunca `ajustes do review`.

---

## 14. Corrigir commit errado

| Situação | O que fazer |
|---|---|
| Commit local, ainda não pushado, mensagem ruim | `git commit --amend` |
| Commit já pushado, mensagem ruim | Deixe. Não reescreva histórico por texto — acerte no próximo |
| Commit já pushado introduziu defeito | `git revert <sha>`, com corpo explicando **por que** reverteu |
| Segredo commitado | Rotacione o segredo primeiro, avise o time, depois trate o histórico com o time — nunca sozinho |

Mensagem de revert:

```text
revert(open-finance): desfaz polling sem limite de tempo

Reverte d12e77d. O corte de 30 s previsto em refs/APIs.md §7 não estava
implementado, e a tela de conexão travava o usuário sem saída.
```

---

*Documento vivo — atualizar quando a convenção mudar. Convenção que existe só
na cabeça de alguém não é convenção.*
