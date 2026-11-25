/*
    Conteúdo da página /about.

    Vivia espalhado em arrays dentro de components/about/education.tsx e hobbie.tsx — com
    a formação escrita DUAS vezes no mesmo arquivo (a versão "código" e a versão "card"),
    o que já tinha divergido nos rótulos. Agora é uma fonte só, consumida pela página e
    pela linha do tempo.

    Mesma regra de lib/case-studies.ts: só entra o que é verdade hoje. Campo sem dado
    confirmado fica de fora em vez de virar placeholder na interface.
*/

export interface EducationItem {
  period: string;
  title: string;
  institution: string;
  level: string;
  note?: string;
  tags: string[];
  current?: boolean;
  /** Token de cor do marcador na linha do tempo. */
  accent: string;
}

export const EDUCATION: EducationItem[] = [
  {
    period: 'desde 2025 · em andamento',
    title: 'Engenharia de Controle e Automação',
    institution: 'PUC-Campinas',
    level: 'Bacharelado',
    tags: ['Automação', 'Robótica'],
    current: true,
    accent: 'var(--accent-purple-text)',
  },
  {
    period: '2024',
    title: 'Engenharia de Computação',
    institution: 'PUC-Campinas',
    level: 'Bacharelado',
    tags: ['Programação', 'Eletrônica básica'],
    accent: 'var(--ide-accent)',
  },
  {
    period: '2021 – 2023',
    title: 'Ensino Médio',
    institution: 'Colégio Objetivo',
    level: 'Ensino Médio',
    tags: [],
    accent: 'var(--syntax-type)',
  },
];

/** Cursos livres. Mesmos nomes usados no profile.ts da home. */
export const COURSES = [
  { name: 'CS50x', detail: 'Harvard · Introdução à Ciência da Computação' },
  { name: 'MIT 6.002.1x', detail: 'MIT · Circuitos e Eletrônica' },
];

export interface Hobby {
  id: 'games' | 'music' | 'sports';
  name: string;
  description: string;
  tags: string[];
}

export const HOBBIES: Hobby[] = [
  {
    id: 'games',
    name: 'Games',
    description: 'Explorando novos mundos e desafios estratégicos.',
    tags: ['Valorant', 'CS2', 'Fortnite'],
  },
  {
    id: 'music',
    name: 'Música',
    description: 'Jovem de 20 anos com alma de 67 (Spotify).',
    tags: ['MPB', 'Rock', 'Pop'],
  },
  {
    id: 'sports',
    name: 'Futebol e basquete',
    description: 'Amante dos dois esportes.',
    tags: ['Corinthians', 'Lakers'],
  },
];

/** Cartão `felipe.json` ao lado da bio. */
export const QUICK_FACTS = [
  { key: 'idade', value: '20' },
  { key: 'curso', value: 'Eng. Controle e Automação' },
  { key: 'stack', value: 'C · C++ · Python · TypeScript' },
  { key: 'estudando', value: 'CS50x · MIT 6.002.1x' },
];

/*
    Conteúdo do card my-bio.md. Fatos tirados do README do perfil (Grolla05/Grolla05):
    semestre, o que está estudando e certificações. Escrito como markdown porque o card
    mostra o mesmo texto cru (Código) ou renderizado (Prévia).

    Ao mudar de semestre ou concluir um curso, é aqui que se atualiza.
*/
export const BIO_MARKDOWN = `## Sobre mim

Estou no **4º semestre de Engenharia de Controle e Automação** na PUC-Campinas, depois de
começar em Engenharia de Computação na mesma universidade.

Gosto de projetos que juntam hardware e software: firmware em C/C++ para ESP32 e
Arduino, ferramentas em Python e interfaces web em TypeScript.

## Estudando agora

- Estruturas de Dados
- Estatística e Análise de Dados
- Inteligência Artificial
- Circuitos elétricos

## Certificações

- **CS50x**: Introdução à Ciência da Computação (Harvard)
- **6.002.1x**: Circuits and Electronics (MIT)
`;
