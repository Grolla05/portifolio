import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/*
    Trava de regressão de contraste WCAG AA.

    Motivo: os tokens de cor vivem em CSS puro, fora do alcance do TypeScript, e um ajuste
    de "deixa esse cinza mais suave" reprova o critério sem quebrar nenhum teste nem
    aparecer no code review. Três tokens já tinham escorregado dessa forma:
    --text-muted (2.85:1 no claro, 3.29:1 no escuro) e o acento aplicado a texto (4.02:1).

    O teste lê app/globals.css como fonte da verdade — não uma cópia dos valores — e
    recalcula os ratios. Cada token de texto é conferido contra TODAS as superfícies em
    que pode aparecer, porque passar sobre --bg-primary e reprovar sobre --bg-secondary
    é justamente o modo de falha que escapa numa conferência manual.
*/

const cssContent = fs.readFileSync(
  path.resolve(__dirname, '../app/globals.css'),
  'utf-8',
);

/** Contraste relativo WCAG 2.1 (§1.4.3). */
function contrastRatio(hexA: string, hexB: string): number {
  const luminance = (hex: string) => {
    const h = hex.replace('#', '');
    const channel = (v: number) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return (
      0.2126 * channel(parseInt(h.slice(0, 2), 16)) +
      0.7152 * channel(parseInt(h.slice(2, 4), 16)) +
      0.0722 * channel(parseInt(h.slice(4, 6), 16))
    );
  };
  const [l1, l2] = [luminance(hexA), luminance(hexB)];
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/**
 * Lê um token hex do bloco `:root` (tema claro) ou `.dark` (tema escuro).
 *
 * O corte por bloco importa: os dois temas declaram os mesmos nomes de token, e uma
 * busca no arquivo inteiro devolveria sempre a primeira ocorrência — validando o tema
 * claro duas vezes e o escuro nenhuma.
 */
function readToken(token: string, theme: 'light' | 'dark'): string {
  const block =
    theme === 'light'
      ? cssContent.slice(cssContent.indexOf(':root {'), cssContent.indexOf('.dark {'))
      : cssContent.slice(cssContent.indexOf('.dark {'));

  const match = block.match(new RegExp(`--${token}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`Token --${token} não encontrado no tema ${theme}`);
  return match[1];
}

const AA_NORMAL_TEXT = 4.5;

// Tokens que sempre pintam texto de corpo, em qualquer tamanho.
const TEXT_TOKENS = [
  'text-primary',
  'text-secondary',
  'text-muted',
  'ide-accent-text',
  'syntax-keyword',
  'syntax-string',
  'syntax-type',
  'syntax-comment',
];

// Superfícies sobre as quais esse texto pode cair.
const SURFACE_TOKENS = ['bg-primary', 'bg-secondary', 'bg-tertiary'];

describe('Contraste WCAG AA dos tokens de texto', () => {
  for (const theme of ['light', 'dark'] as const) {
    describe(`tema ${theme}`, () => {
      for (const textToken of TEXT_TOKENS) {
        for (const surfaceToken of SURFACE_TOKENS) {
          it(`--${textToken} sobre --${surfaceToken} atinge ${AA_NORMAL_TEXT}:1`, () => {
            const ratio = contrastRatio(
              readToken(textToken, theme),
              readToken(surfaceToken, theme),
            );
            expect(
              ratio,
              `${readToken(textToken, theme)} sobre ${readToken(surfaceToken, theme)} = ${ratio.toFixed(2)}:1`,
            ).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
          });
        }
      }
    });
  }

  /*
      --ide-accent existe para preenchimento, borda e ícone — não para texto. O mínimo
      aplicável é o de componente não-textual (WCAG 1.4.11), 3:1. Se algum dia ele passar
      a valer 4.5:1 também, o token --ide-accent-text perde a razão de existir.
  */
  it('--ide-accent atinge 3:1 (mínimo de elemento não-textual) nos dois temas', () => {
    for (const theme of ['light', 'dark'] as const) {
      const ratio = contrastRatio(readToken('ide-accent', theme), readToken('bg-primary', theme));
      expect(ratio, `tema ${theme}: ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(3);
    }
  });
});
