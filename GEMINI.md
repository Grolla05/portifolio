# GEMINI

## CONTEXTO DO PROJETO

Este é um site de portfólio pessoal com estética de IDE/editor de código
(inspirado em VS Code e Antigravity IDE). A stack utiliza React + Next.js + TypeScript.
O objetivo é refatorar TODA a interface gráfica para que seja
mais moderna, fluída e com qualidade de design Apple (macOS/SF Design),
mantendo o conceito visual de IDE. Framer Motion será usado
como biblioteca principal de animações.

## Workflow obrigatório de funcionamento

1 -> A partir do prompt gere os testes para verificação da feature antes mesmo de começar a desenvolver, todos os testes unitários tem que ser criados dentro da pasta tests na raiz do projeto, caso a pasta não exista crie ela na raiz do repositório.
2 -> Com os testes escritos explore as opções e caminhos nos quais podem ser seguidos para o desenvolvimento
3 -> Escreva o plano de ação para implementar a feature
4 -> Desenvolva o plano proposto, dividindo a atividade do plano em task's
5 -> Após o desenvolvimento execute os testes escritos no passo 1, para validar oque foi gerado, se não passar em algum teste, identifique oque deu problema e conserte e rode o teste novamente
6 -> Após ter ocorrido tudo corretamente por favor crie, edite caso já exista, o arquivo CHANGES.md na raiz do projeto, no qual este por sua vez deve documentar tudo nos mínimos detalhes do que foi feito
7 -> Após ter ter documentado tudo no CHANGES.md atualize a documentação do arquivo README.md da raiz do projeto de maneira na qual fique sempre atualizado a documentação do projeto, sempre se baseie no CHANGES.md para atualizar o README.md.
8 -> Após ter ter documentado tudo no README.md na raiz do projeto prepare para gerar o commit, baseado nas alterações documentadas no CHANGES.md, ou seja deve ser feito baseado neste arquivo o commit mensage, mas espere a validação e comando do usuário.
9 -> Com a validação do usuário siga o processo de commit -> push (sync changes) -> Pull Request. Não é necessário abrir uma branch nova para cada feature, apenas utilize a branch main para realizar este processo

---

## 2. Regra obrigatória: pasta `refs/`

Antes de tomar qualquer decisão de produto, regra de negócio, nomenclatura de
domínio ou copy visível ao usuário, **consulte os arquivos em `refs/` na raiz
do projeto**. Eles são a fonte da verdade para:

- Regras regulatórias e de consentimento (Open Finance, Pix Automático,
  vocabulário proibido, os 5 parâmetros do usuário)
- Estrutura de diretórios do `lib/` e convenções do projeto
  (`ORGANIZACAO.md`)
- Estilização de telas, cores, tipografia, animações e afins (`stylesheet.md`)
- Riscos conhecidos e decisões em aberto.

**Se uma tarefa tocar em regra de negócio, compliance, ou nomenclatura de
domínio e o contexto necessário não estiver claro no pedido, leia os arquivos
relevantes de `refs/` antes de escrever código.** Nunca invente regra de
negócio, taxa, prazo ou nome de campo que não esteja documentado ali — pergunte
ou sinalize a lacuna em vez de assumir.

Ao adicionar uma decisão nova e relevante (ex.: definição de periodicidade,
escolha de parceiro), atualize o arquivo correspondente em `refs/` — não deixe
a decisão só implícita no código.
