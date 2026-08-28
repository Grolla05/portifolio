import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import { buildPaper, sortPapers, type Paper } from './papers';

/*
    Varredura de public/papers/.

    Roda no servidor durante o `next build` — /about é uma página estática, então o
    resultado é congelado no HTML e não custa nada em runtime. Consequência importante:
    **um PDF novo só aparece depois de um novo build/deploy**, o que é exatamente o que
    acontece quando o arquivo é commitado no repositório.

    Por que não ler a pasta numa rota de API em runtime: na Vercel os arquivos de
    `public/` são servidos pela CDN e não necessariamente existem no sistema de arquivos
    da função serverless — o `readdir` voltaria vazio em produção enquanto funcionava
    perfeitamente em localhost.

    Este módulo só pode ser importado por Server Component. Importá-lo de um componente
    marcado com "use client" quebra o build no bundling do `node:fs`.
*/

const PAPERS_DIR = join(process.cwd(), 'public', 'papers');

export function readPapers(): Paper[] {
  let entries: string[];

  try {
    entries = readdirSync(PAPERS_DIR);
  } catch {
    // Pasta ausente é estado válido: o portfólio simplesmente não tem artigos ainda.
    return [];
  }

  const papers = entries
    .filter((name) => name.toLowerCase().endsWith('.pdf'))
    .map(buildPaper);

  return sortPapers(papers);
}
