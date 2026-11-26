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
/*
    Cursos livres com certificado. `logo`: arquivo em public/logos/ da instituição;
    `certificate`: imagem do certificado em public/thumbnails/ (aberta em nova aba).
*/
export const COURSES = [
  {
    name: 'CS50x',
    title: 'Introdução à Ciência da Computação',
    school: 'Harvard University',
    platform: 'Harvard · edX',
    issued: '2025',
    logo: '/logos/harvard.svg',
    certificate: '/thumbnails/CS50.jpg',
  },
  {
    name: 'MIT 6.002.1x',
    title: 'Circuits and Electronics 1: Basic Circuit Analysis',
    school: 'Massachusetts Institute of Technology',
    platform: 'MITx · edX',
    issued: 'jul 2025',
    logo: '/logos/mit.svg',
    certificate: '/thumbnails/MIT.jpg',
  },
];

export interface Hobby {
  id: 'games' | 'music';
  name: string;
  description: string;
  tags: string[];
}

export const HOBBIES: Hobby[] = [
  {
    id: 'games',
    name: 'Games',
    description: 'Explorando novos mundos e desafios estratégicos.',
    tags: ['CS2', 'Fortnite', 'Deadlock'],
  },
  {
    id: 'music',
    name: 'Música',
    description: 'Jovem de 20 anos com alma de 67 (Spotify).',
    tags: ['MPB', 'Rock', 'Pop'],
  },
];

/** Cartão `felipe.json` ao lado da bio. */
export const QUICK_FACTS = [
  { key: 'idade', value: '20' },
  { key: 'curso', value: 'Eng. Controle e Automação' },
  { key: 'stack', value: 'C · Python · NextJS' },
  { key: 'Certificados', value: 'CS50x · MIT 6.002.1x' },
];

/*
    Jogos do cartão "Games" (/about → Fora do editor). `accent` é a cor de marca do jogo,
    usada só em detalhe gráfico; `genre` é o gênero (fato, não opinião).

    Jogos que NÃO estão na Steam (hoje só o Fortnite, da Epic) não têm API pública de
    horas, então `hours` é informado à mão aqui e entra no mesmo ranking da Steam,
    ordenado junto. `hours: null` = ainda não informado (a linha aparece por último, sem
    número). `cover` é arte local em public/ (arte oficial da loja da Epic).
*/
export interface GameEntry {
  name: string;
  mono: string;
  genre: string;
  accent: string;
  platform: 'steam' | 'epic';
  /** Só para jogos fora da Steam: horas informadas à mão. */
  hours?: number | null;
  cover?: string;
  url?: string;
}

export const GAMES: readonly GameEntry[] = [
  { name: 'CS2', mono: 'CS2', genre: 'FPS tático · 5v5', accent: '#de9b35', platform: 'steam' },
  {
    name: 'Fortnite',
    mono: 'FN',
    genre: 'Battle royale',
    accent: '#8f6bff',
    platform: 'epic',
    hours: 266.1, // 266 h 8 min, informado à mão (Epic não tem API de horas)
    cover: '/images/games/fortnite.jpg',
    url: 'https://www.fortnite.com/',
  },
];
