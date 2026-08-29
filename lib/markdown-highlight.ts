/*
    Realce de sintaxe para markdown CRU.

    Existe para a view "código" da bio (components/about/bio.tsx). Sem realce, o modo
    código seria um <pre> cinza — e todo o resto do site mostra código colorido, então a
    exceção justamente no arquivo principal do /about salta aos olhos.

    Não é um parser de markdown: é um tokenizador de UMA linha por vez, deliberadamente
    raso. Nunca lança, nunca reordena e nunca descarta caractere — `tokens.map(t => t.text)
    .join('')` reconstrói a linha original exatamente. Essa é a única garantia que importa:
    o modo código promete mostrar o arquivo como ele é.
*/

export type TokenKind =
  /** Texto comum. */
  | 'text'
  /** Sinal de marcação: #, -, >, *, backtick, colchete, parêntese. */
  | 'marker'
  /** Conteúdo de um título. */
  | 'heading'
  /** Conteúdo de código (inline ou dentro de cerca). */
  | 'code'
  /** URL — de link, de imagem ou solta no texto. */
  | 'url'
  /** Rótulo visível de um link. */
  | 'link'
  /** Ênfase: negrito ou itálico. */
  | 'emphasis'
  /** Tag HTML crua. */
  | 'html';

export interface Token {
  text: string;
  kind: TokenKind;
}

/** Cor de cada tipo de token. Sempre token CSS, nunca hex literal. */
export const TOKEN_COLORS: Record<TokenKind, string> = {
  text: 'var(--text-secondary)',
  marker: 'var(--text-muted)',
  heading: 'var(--text-primary)',
  code: 'var(--syntax-string)',
  url: 'var(--syntax-string)',
  link: 'var(--ide-accent-text)',
  emphasis: 'var(--syntax-type)',
  html: 'var(--syntax-keyword)',
};

/*
    Varredura inline. A ordem das alternativas importa:
      1. código entre crases vem primeiro — dentro dele nada mais é marcação;
      2. imagem antes de link, senão `![alt](src)` casaria como link e sobraria um `!`;
      3. negrito antes de itálico, senão `**x**` casaria como dois itálicos vazios;
      4. tag HTML antes de URL solta, para não fatiar `<https://...>` ao meio.

    Grupos NOMEADOS, não numerados. Com numeração, a retro-referência do negrito
    (`(\*\*|__)...\1`) apontava para o grupo 1 desta alternância concatenada — as crases
    do código inline — em vez do próprio marcador, e nenhum negrito era reconhecido.
    `\k<nome>` não tem como escorregar quando uma alternativa ganha ou perde um grupo.
*/
const INLINE = new RegExp(
  [
    '(?<codeTicks>`+)(?<codeBody>[^`]*?)\\k<codeTicks>', // código inline
    '(?<imgOpen>!\\[)(?<imgAlt>[^\\]]*)(?<imgMid>\\]\\()(?<imgUrl>[^)]*)(?<imgClose>\\))',
    '(?<linkOpen>\\[)(?<linkText>[^\\]]*)(?<linkMid>\\]\\()(?<linkUrl>[^)]*)(?<linkClose>\\))',
    '(?<boldMark>\\*\\*|__)(?<boldBody>(?:(?!\\k<boldMark>).)+)\\k<boldMark>',
    '(?<italicMark>[*_])(?<italicBody>(?:(?!\\k<italicMark>).)+)\\k<italicMark>',
    '(?<html><\\/?[A-Za-z][^>]*>)',
    '(?<url>https?:\\/\\/[^\\s)<>\\]]+)',
  ].join('|'),
  'g',
);

function pushText(tokens: Token[], text: string, kind: TokenKind = 'text') {
  if (text) tokens.push({ text, kind });
}

function tokenizeInline(line: string, baseKind: TokenKind = 'text'): Token[] {
  const tokens: Token[] = [];
  let last = 0;

  INLINE.lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = INLINE.exec(line)) !== null) {
    // Alternativa de largura zero travaria o laço em lastIndex.
    if (m[0] === '') {
      INLINE.lastIndex += 1;
      continue;
    }

    pushText(tokens, line.slice(last, m.index), baseKind);

    const g = m.groups ?? {};

    if (g.codeTicks !== undefined) {
      // Código inline: as crases são marcação, o miolo é código.
      pushText(tokens, g.codeTicks, 'marker');
      pushText(tokens, g.codeBody, 'code');
      pushText(tokens, g.codeTicks, 'marker');
    } else if (g.imgOpen !== undefined) {
      // Imagem: ![alt](src)
      pushText(tokens, g.imgOpen, 'marker');
      pushText(tokens, g.imgAlt, 'link');
      pushText(tokens, g.imgMid, 'marker');
      pushText(tokens, g.imgUrl, 'url');
      pushText(tokens, g.imgClose, 'marker');
    } else if (g.linkOpen !== undefined) {
      // Link: [texto](url)
      pushText(tokens, g.linkOpen, 'marker');
      pushText(tokens, g.linkText, 'link');
      pushText(tokens, g.linkMid, 'marker');
      pushText(tokens, g.linkUrl, 'url');
      pushText(tokens, g.linkClose, 'marker');
    } else if (g.boldMark !== undefined) {
      // Abertura e fechamento são o mesmo texto por definição da retro-referência.
      pushText(tokens, g.boldMark, 'marker');
      pushText(tokens, g.boldBody, 'emphasis');
      pushText(tokens, g.boldMark, 'marker');
    } else if (g.italicMark !== undefined) {
      pushText(tokens, g.italicMark, 'marker');
      pushText(tokens, g.italicBody, 'emphasis');
      pushText(tokens, g.italicMark, 'marker');
    } else if (g.html !== undefined) {
      pushText(tokens, g.html, 'html');
    } else if (g.url !== undefined) {
      pushText(tokens, g.url, 'url');
    }

    last = m.index + m[0].length;
  }

  pushText(tokens, line.slice(last), baseKind);

  return tokens;
}

const FENCE = /^(\s*)(```+|~~~+)(.*)$/;
const HEADING = /^(\s*#{1,6}\s+)(.*)$/;
const BLOCKQUOTE = /^(\s*>+\s?)(.*)$/;
const LIST_ITEM = /^(\s*(?:[-*+]|\d+[.)])\s+)(.*)$/;
const RULE = /^\s*([-*_])(?:\s*\1){2,}\s*$/;
const TABLE_DIVIDER = /^\s*\|?[\s:|-]+\|[\s:|-]*$/;

/**
 * Tokeniza um markdown inteiro, uma lista de tokens por linha.
 *
 * Preserva linhas vazias (viram `[]`) para que o numerador de linhas da view de código
 * bata com o arquivo real.
 */
export function highlightMarkdown(source: string): Token[][] {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const out: Token[][] = [];

  let insideFence = false;
  let fenceMarker = '';

  for (const line of lines) {
    const fence = line.match(FENCE);

    if (fence) {
      const [, indent, marker, info] = fence;

      if (!insideFence) {
        insideFence = true;
        fenceMarker = marker[0];
        // A cerca de abertura carrega a linguagem: ```ts
        out.push([
          ...(indent ? [{ text: indent, kind: 'text' as TokenKind }] : []),
          { text: marker, kind: 'marker' },
          ...(info ? [{ text: info, kind: 'emphasis' as TokenKind }] : []),
        ]);
        continue;
      }

      // Só fecha com o MESMO caractere de cerca: ~~~ não encerra um bloco aberto com ```.
      if (marker[0] === fenceMarker) {
        insideFence = false;
        out.push([
          ...(indent ? [{ text: indent, kind: 'text' as TokenKind }] : []),
          { text: marker + info, kind: 'marker' },
        ]);
        continue;
      }
    }

    if (insideFence) {
      out.push(line ? [{ text: line, kind: 'code' }] : []);
      continue;
    }

    if (line === '') {
      out.push([]);
      continue;
    }

    if (RULE.test(line) || TABLE_DIVIDER.test(line)) {
      out.push([{ text: line, kind: 'marker' }]);
      continue;
    }

    const heading = line.match(HEADING);
    if (heading) {
      out.push([
        { text: heading[1], kind: 'marker' },
        ...tokenizeInline(heading[2], 'heading'),
      ]);
      continue;
    }

    const quote = line.match(BLOCKQUOTE);
    if (quote) {
      out.push([{ text: quote[1], kind: 'marker' }, ...tokenizeInline(quote[2])]);
      continue;
    }

    const item = line.match(LIST_ITEM);
    if (item) {
      out.push([{ text: item[1], kind: 'marker' }, ...tokenizeInline(item[2])]);
      continue;
    }

    out.push(tokenizeInline(line));
  }

  return out;
}
