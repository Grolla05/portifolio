import { describe, it, expect } from 'vitest';
import { highlightMarkdown, TOKEN_COLORS, type Token } from '@/lib/markdown-highlight';

/** Reconstrói o texto de uma linha a partir dos tokens. */
const join = (tokens: Token[]) => tokens.map((t) => t.text).join('');

/** Recompõe o documento inteiro, do jeito que a view de código o exibe. */
const reconstruct = (source: string) =>
  highlightMarkdown(source)
    .map(join)
    .join('\n');

const kindsOf = (tokens: Token[]) => tokens.map((t) => t.kind);
const textOfKind = (tokens: Token[], kind: Token['kind']) =>
  tokens.filter((t) => t.kind === kind).map((t) => t.text);

describe('highlightMarkdown', () => {
  /*
      A garantia central. A view de "código" promete mostrar o README como ele é: se o
      tokenizador engolir, duplicar ou reordenar um caractere, a promessa quebra em
      silêncio — nada na tela indica que o texto foi adulterado. Todo o resto deste
      arquivo é secundário perto disto.
  */
  describe('fidelidade — os tokens sempre reconstroem a fonte', () => {
    const samples: [string, string][] = [
      ['título', '# Olá, eu sou o Felipe'],
      ['ênfase', 'Texto com **negrito**, *itálico* e `código`.'],
      ['link', 'Veja o [meu perfil](https://github.com/Grolla05) agora.'],
      ['imagem', '![badge](https://img.shields.io/badge/C++-blue)'],
      ['html cru', '<h1 align="center">Felipe</h1>'],
      ['citação', '> uma citação com [link](http://x.dev)'],
      ['lista', '- item com `code` e **negrito**'],
      ['lista numerada', '3. terceiro item'],
      ['régua', '---'],
      ['tabela', '| a | b |\n|---|---|\n| 1 | 2 |'],
      ['url solta', 'acesse https://exemplo.com/a?b=1 hoje'],
      ['cerca', '```ts\nconst x: number = 1;\n// **não** é negrito aqui\n```'],
      ['cerca til', '~~~\nlivre ``` dentro\n~~~'],
      ['linhas vazias', 'a\n\n\nb'],
      ['asterisco solto', 'multiplicação 3 * 4 * 5'],
      ['underscore em nome', 'a variável user_id_max fica intacta'],
      ['colchete sem link', 'array[0] e [texto solto]'],
      ['crases múltiplas', 'use ``código com ` dentro`` aqui'],
      ['CRLF', '# título\r\ncorpo\r\n'],
      ['vazio', ''],
    ];

    for (const [label, source] of samples) {
      it(`preserva a fonte: ${label}`, () => {
        expect(reconstruct(source)).toBe(source.replace(/\r\n/g, '\n'));
      });
    }
  });

  describe('contagem de linhas', () => {
    it('mantém uma entrada por linha, incluindo as vazias', () => {
      // O numerador de linhas da view de código depende disto: uma linha comida
      // dessincroniza o gutter do conteúdo do resto do arquivo para baixo.
      expect(highlightMarkdown('a\n\nb\n\n\nc')).toHaveLength(6);
    });

    it('trata string vazia como um documento de uma linha vazia', () => {
      expect(highlightMarkdown('')).toEqual([[]]);
    });
  });

  describe('classificação de tokens', () => {
    it('separa os sinais do título do seu conteúdo', () => {
      const [line] = highlightMarkdown('## Sobre mim');
      expect(kindsOf(line)).toEqual(['marker', 'heading']);
      expect(textOfKind(line, 'marker')).toEqual(['## ']);
      expect(textOfKind(line, 'heading')).toEqual(['Sobre mim']);
    });

    it('separa rótulo e URL de um link', () => {
      const [line] = highlightMarkdown('[perfil](https://github.com/Grolla05)');
      expect(textOfKind(line, 'link')).toEqual(['perfil']);
      expect(textOfKind(line, 'url')).toEqual(['https://github.com/Grolla05']);
    });

    it('marca o conteúdo de um bloco cercado como código', () => {
      const lines = highlightMarkdown('```py\nprint("oi")\n```');
      expect(kindsOf(lines[1])).toEqual(['code']);
    });

    it('não interpreta marcação dentro de um bloco cercado', () => {
      // Dentro de uma cerca, `**x**` é código literal — não negrito.
      const lines = highlightMarkdown('```\n**x** e [y](z)\n```');
      expect(lines[1]).toEqual([{ text: '**x** e [y](z)', kind: 'code' }]);
    });

    it('não fecha uma cerca ``` com uma cerca ~~~', () => {
      const lines = highlightMarkdown('```\n~~~\nainda dentro\n```');
      expect(kindsOf(lines[1])).toEqual(['code']);
      expect(kindsOf(lines[2])).toEqual(['code']);
    });

    it('reconhece HTML cru, que READMEs de perfil usam bastante', () => {
      const [line] = highlightMarkdown('<img src="x.png" align="right" />');
      expect(kindsOf(line)).toEqual(['html']);
    });

    it('prefere imagem a link para a sintaxe ![...](...)', () => {
      const [line] = highlightMarkdown('![alt](src.png)');
      // O `!` faz parte do marcador de abertura; nenhum token de texto sobra solto.
      expect(line[0]).toEqual({ text: '![', kind: 'marker' });
      expect(textOfKind(line, 'url')).toEqual(['src.png']);
    });

    it('prefere negrito a dois itálicos vazios', () => {
      const [line] = highlightMarkdown('**forte**');
      expect(textOfKind(line, 'emphasis')).toEqual(['forte']);
      expect(textOfKind(line, 'marker')).toEqual(['**', '**']);
    });
  });

  describe('paleta', () => {
    it('define cor para todo tipo de token, sempre via token CSS', () => {
      const kinds = new Set<string>();
      const source = '# t\n> q\n- l `c` **b** [a](u) <i>h</i>\nhttps://x.dev\n```js\nx\n```';
      for (const line of highlightMarkdown(source)) {
        for (const token of line) kinds.add(token.kind);
      }

      // Se um tipo novo entrar no tokenizador sem cor, a view o renderiza com
      // `color: undefined` e ele herda a cor do pai — some sem erro nenhum.
      for (const kind of kinds) {
        expect(TOKEN_COLORS[kind as Token['kind']], `sem cor para "${kind}"`).toMatch(
          /^var\(--[a-z-]+\)$/,
        );
      }
    });
  });
});
