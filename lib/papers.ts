/*
    Artigos, papers e produção acadêmica.

    Publicar um artigo é UM passo: colocar o PDF em `public/papers/`.
    A pasta é varrida durante o build, e todo `.pdf` encontrado vira um arquivo na pasta
    `research` da barra lateral de /about — sem precisar registrar nada em código.

    O registro abaixo (PAPER_METADATA) é OPCIONAL e só enriquece o painel lateral com
    resumo, DOI, coautoria e afins. Um PDF sem entrada aqui continua sendo listado e
    aberto normalmente; apenas mostra menos informação ao lado.

    A varredura vive em lib/papers-server.ts, que usa `fs` e por isso não pode ser
    importada por componente de cliente.
*/

export interface Paper {
  /** Derivado do nome do arquivo, em kebab-case. Identifica a aba. */
  id: string;
  /** Título exibido. Vem do metadado quando existe; senão, do nome do arquivo. */
  title: string;
  /** Nome do arquivo dentro de public/papers/, com extensão. */
  file: string;
  year?: number;
  /** Revista, congresso, disciplina ou instituição. */
  venue?: string;
  abstract?: string;
  /** Todos os autores, na ordem em que assinam o trabalho. */
  authors?: string[];
  keywords?: string[];
  /** DOI ou link da publicação. */
  doi?: string;
  language?: 'pt-BR' | 'en';
}

/** Metadados opcionais de um artigo, sem os campos que a varredura já resolve. */
export type PaperMetadata = Omit<Paper, 'id' | 'file' | 'title'> & {
  /** Sobrescreve o título derivado do nome do arquivo. */
  title?: string;
};

/*
    Chave = nome exato do arquivo em public/papers/, com acentos e espaços.
    Renomear o PDF sem atualizar a chave não quebra a listagem: o artigo continua
    aparecendo, apenas sem os metadados.
*/
export const PAPER_METADATA: Record<string, PaperMetadata> = {
  'Artigo Qualificação Formal de PSR.pdf': {
    title:
      'Qualificação Formal da População em Situação de Rua: Instalações Elétricas Prediais de Baixa Tensão',
    year: 2025,
    venue: 'COBENGE 2025 — Congresso Brasileiro de Educação em Engenharia',
    abstract:
      'Apresenta ações do projeto de extensão Promoção da Qualificação Formal da População ' +
      'em Situação de Rua (PSR) da PUC-Campinas, voltado à autonomia, cidadania e valorização ' +
      'pessoal da PSR acolhida pela instituição parceira. A proposta baseia-se em aprendizagem ' +
      'baseada em problemas e gameficação, materializada num jogo de tabuleiro que simula o ' +
      'planejamento e a execução de uma instalação elétrica residencial monofásica de baixa ' +
      'tensão. O público foi capacitado para dimensionamento elétrico a partir da carga prevista ' +
      'e análise de custo, usando peças LEGO como recurso didático.',
    authors: [
      'Vitória Marques Pires',
      'Eduarda Barbosa Kauffmann',
      'Felipe Grolla Freitas',
      'Amilton da Costa Lamas',
    ],
    keywords: ['Extensão Universitária', 'PBL', 'População em Situação de Rua'],
    doi: 'https://doi.org/10.37702/2175-957X.COBENGE.2025.6099',
    language: 'pt-BR',
  },
};

/**
 * `Artigo Qualificação Formal de PSR.pdf` → `artigo-qualificacao-formal-de-psr`.
 *
 * Acentos saem via NFD: o id vira prefixo de aba e atributo de DOM, onde caractere
 * acentuado só cria ruído.
 */
export function slugifyFileName(file: string): string {
  return file
    .replace(/\.pdf$/i, '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** `Artigo Qualificação Formal de PSR.pdf` → `Artigo Qualificação Formal de PSR`. */
export function humanizeFileName(file: string): string {
  return file.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' ').trim();
}

/**
 * Monta um `Paper` a partir do nome do arquivo, aplicando os metadados quando existirem.
 * Ponto único que decide o que aparece para um PDF recém-adicionado à pasta.
 */
export function buildPaper(file: string): Paper {
  const metadata = PAPER_METADATA[file] ?? {};

  return {
    id: slugifyFileName(file),
    file,
    title: metadata.title ?? humanizeFileName(file),
    year: metadata.year,
    venue: metadata.venue,
    abstract: metadata.abstract,
    authors: metadata.authors,
    keywords: metadata.keywords,
    doi: metadata.doi,
    language: metadata.language,
  };
}

/**
 * Caminho público do PDF.
 *
 * O nome é codificado porque os arquivos têm espaços e acentos — sem isso o navegador
 * pediria `/papers/Artigo Qualificação...pdf` cru e receberia 404.
 */
export function paperUrl(paper: Paper): string {
  return `/papers/${encodeURIComponent(paper.file)}`;
}

/** Linha de citação curta. Omite o que não foi informado. */
export function paperCitation(paper: Paper): string {
  return [paper.venue, paper.year].filter(Boolean).join(', ');
}

/** Mais recentes primeiro; sem ano definido vão para o fim, em ordem alfabética. */
export function sortPapers(papers: Paper[]): Paper[] {
  return [...papers].sort((a, b) => {
    if (a.year && b.year && a.year !== b.year) return b.year - a.year;
    if (a.year && !b.year) return -1;
    if (!a.year && b.year) return 1;
    return a.title.localeCompare(b.title, 'pt-BR');
  });
}
