/*
    Conteúdo curado dos projetos.

    A API do GitHub entrega nome, linguagens e uma descrição crua (muitas vezes em inglês
    e com emoji). Isso mostra QUE o repositório existe, mas não o que ele resolve nem
    como foi construído — que é o que um recrutador procura. Este módulo guarda a camada
    editorial por cima: resumos em português para todos os cards e estudos de caso para os
    projetos de maior peso.

    Regra de ouro: cada afirmação aqui precisa estar no README ou na descrição do
    repositório. Sem métricas inventadas ("reduziu 40%…"): um número que o entrevistador
    pode questionar e você não consegue sustentar custa mais do que a falta dele.
    Quando o README não diz o motivo de uma decisão, o texto descreve o que foi feito, não
    por quê.
*/

export interface CaseStudyDecision {
  title: string;
  text: string;
}

export interface CaseStudy {
  /** Segmento da URL: /projects/[slug]. */
  slug: string;
  /** Nome exato do repositório no GitHub — chave de junção com /api/projects. */
  repo: string;
  title: string;
  /** Uma frase: o que é e para quem. Vai no cabeçalho e na meta description. */
  tagline: string;
  /** Texto do card na grade (pt-BR). */
  summary: string;
  problem: string;
  solution: string;
  highlights: string[];
  decisions: CaseStudyDecision[];
  /** Tecnologias exibidas como chips. */
  stack: string[];
  status: 'concluído' | 'em andamento';
  /** Rótulo livre de contexto (ex.: "Projeto acadêmico"). Só se for verificável. */
  kind?: string;
  demo?: string;
  /** Caminho em /public para um screenshot; sem ele os cards usam uma capa gerada em CSS. */
  cover?: string;
  nextSteps?: string[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'solar-points',
    repo: 'Project_SolarPoints',
    title: 'Solar Points',
    tagline:
      'Iluminação pública autônoma e de baixo custo para lugares sem infraestrutura elétrica.',
    summary:
      'Sistema de iluminação autônomo movido a energia solar, com sensores de luz e presença, firmware em ESP32, placa projetada no KiCad e painel de telemetria no Google Maps.',
    problem:
      'Paradas de ônibus, vielas, praças e regiões periféricas muitas vezes não têm rede elétrica nem iluminação — o que afeta a segurança de quem circula por ali. A solução precisava ser barata, sustentável e simples de manter.',
    solution:
      'Um módulo de iluminação autônomo, alimentado por painel solar e bateria. Um microcontrolador lê sensores de luminosidade e de distância/presença e decide quando acender os LEDs, gerenciando a energia por conversores DC-DC e modos de baixo consumo. Um painel web com mapa exibe a telemetria do sistema.',
    highlights: [
      'Ativação automática por luminosidade e presença',
      'Operação autônoma com painel solar e bateria recarregável',
      'Gestão de energia com conversores DC-DC e técnicas de baixo consumo',
      'Projeto modular e replicável, com firmware atualizável',
      'Painel web com telemetria exibida em mapa (Google Maps)',
    ],
    decisions: [
      {
        title: 'De 100% analógico para arquitetura digital/híbrida',
        text: 'O projeto nasceu só com componentes discretos. A necessidade de sensoriamento mais preciso, flexibilidade operacional e otimização de consumo levou à migração para um microcontrolador com periféricos — mantendo a simplicidade e a robustez como princípios.',
      },
      {
        title: 'Lógica programável em vez de temporizações fixas',
        text: 'Sensibilidades e tempos de acionamento passam a ser definidos em firmware leve, em vez de valores presos ao hardware, o que permite ajustar o comportamento sem refazer a placa.',
      },
      {
        title: 'Hardware e software no mesmo repositório',
        text: 'Esquema da placa (KiCad), firmware (ESP32) e o painel de telemetria convivem no mesmo projeto, documentados com um diagrama funcional dos blocos: baterias, gestão de energia, DC-DC, microcontrolador e sensores.',
      },
    ],
    stack: ['ESP32', 'KiCad', 'Conversores DC-DC', 'Sensores LDR e distância', 'HTML', 'Google Maps'],
    status: 'concluído',
    kind: 'Hardware + firmware + web',
    demo: 'https://solarpointsfront.vercel.app',
  },
  {
    slug: 'laudos-ocr',
    repo: 'Automation_Project',
    title: 'Automação de Laudos com OCR',
    tagline:
      'Aplicativo desktop que lê dados de evidências por OCR e preenche laudos técnicos em Word.',
    summary:
      'App desktop que extrai dados de imagens com OCR (Tesseract) e gera laudos técnicos de ensaios Bluetooth/Wi-Fi a partir de templates Word, usando React, Flask e PyWebView.',
    problem:
      'Laudos técnicos de ensaios de Bluetooth e Wi-Fi dependem de dados que estão em imagens e documentos e precisam acabar num modelo Word. Automatizar esse fluxo de engenharia é o objetivo do projeto.',
    solution:
      'Um sistema desktop que usa visão computacional para extrair os dados das evidências e os injeta em templates .docx com campos dinâmicos (como data, engenheiro e conteúdo), gerando o laudo pronto.',
    highlights: [
      'Extração de dados por OCR com Tesseract e Pillow',
      'Geração de laudos a partir de templates Word com placeholders',
      'Interface em React empacotada como aplicativo desktop',
      'Log de execução por dia para rastrear processamentos',
    ],
    decisions: [
      {
        title: 'Interface web dentro de um app desktop',
        text: 'Frontend em React + Tailwind + Framer Motion servido a uma janela nativa pelo PyWebView, com backend Flask local. Mantém a velocidade de desenvolvimento da web e entrega algo que roda como programa no Windows.',
      },
      {
        title: 'Camadas separadas: OCR, documento e interface',
        text: 'O backend divide a lógica em serviços (OCR e Word), armazenamento (uploads, layouts, exportações) e utilitários de log. Trocar o motor de OCR ou o template não obriga a mexer na interface.',
      },
      {
        title: 'Layouts como arquivos .docx editáveis',
        text: 'Os modelos de laudo ficam em pasta própria como documentos Word comuns, com campos dinâmicos preenchidos via python-docx — quem conhece o formato do laudo consegue ajustar o modelo sem programar.',
      },
    ],
    stack: ['Python', 'Flask', 'Tesseract OCR', 'python-docx', 'PyWebView', 'React', 'Tailwind CSS', 'Framer Motion'],
    status: 'em andamento',
    kind: 'Automação de processo',
    nextSteps: [
      'Padronizar nomes das opções de ensaio no frontend com os arquivos .docx de layout',
      'Validar se os arquivos enviados seguem o padrão esperado pelo layout escolhido',
      'Mapear automaticamente cada dado extraído para a célula correta da tabela',
      'Inserir fotos automaticamente nos quadros correspondentes do layout',
    ],
  },
  {
    slug: 'youtube-downloader',
    repo: 'Instalador_videos',
    title: 'YouTube Downloader Desktop',
    tagline:
      'Aplicativo desktop para baixar vídeos, com fila concorrente, token de segurança local e interface Claymorphism.',
    summary:
      'Downloader de vídeos em Python (Flask, pywebview, yt-dlp) com fila de downloads concorrente, API protegida por token e interface inspirada no Apple HIG com física de mola em Anime.js.',
    problem:
      'O yt-dlp é poderoso, mas é uma ferramenta de linha de comando. A ideia era dar a ele uma interface: um programa local, simples de usar e com cara de produto.',
    solution:
      'Um aplicativo desktop híbrido: backend Flask com SQLite para preferências, motor yt-dlp com FFmpeg para baixar e mesclar mídia, e uma interface renderizada via pywebview.',
    highlights: [
      'Fila de downloads com limite de 3 tarefas em paralelo (ThreadPoolExecutor)',
      'Preferências persistidas em SQLite',
      'Quatro modos visuais: escuro, claro, sépia e alto contraste',
      'Empacotamento como aplicativo standalone',
    ],
    decisions: [
      {
        title: 'Arquitetura híbrida desktop',
        text: 'Servidor Flask local + cliente web em pywebview. A lógica pesada fica em Python e a interface em HTML/CSS/JS, sem depender de um framework desktop pesado.',
      },
      {
        title: 'Token de API validado em todo request',
        text: 'Um filtro @before_request exige o cabeçalho X-API-Token, com o token mantido apenas em memória: o servidor local só atende quem apresenta a chave.',
      },
      {
        title: 'Concorrência limitada de propósito',
        text: 'Os downloads passam por um pool de 3 workers (ThreadPoolExecutor): vários andam ao mesmo tempo, mas há um teto para o que roda em paralelo.',
      },
      {
        title: 'Design tátil: Claymorphism + Apple HIG',
        text: 'Substituição de uma interface flat por superfícies com sombras internas duplas e cantos contínuos; as interações usam física de mola (Anime.js) para simular a compressão do botão.',
      },
    ],
    stack: ['Python', 'Flask', 'pywebview', 'yt-dlp', 'FFmpeg', 'SQLite', 'Anime.js', 'HTML/CSS'],
    status: 'concluído',
    kind: 'App desktop',
  },
  {
    slug: 'simula-medias',
    repo: 'simulamedias',
    title: 'Simula Médias',
    tagline:
      'Simulador open source para estudantes acompanharem e projetarem as médias de cada disciplina.',
    summary:
      'Simulador open source de médias universitárias em React + TypeScript (Vite, shadcn/ui): responde "que nota preciso tirar?" com regras de cálculo configuráveis e tema escuro.',
    problem:
      'Todo estudante já se perguntou "qual nota preciso na próxima prova para passar?" ou "se eu tirar X no trabalho e Y na prova, qual será minha média?". As contas existem, mas ninguém quer refazê-las à mão a cada avaliação.',
    solution:
      'Uma aplicação web em que a pessoa escolhe curso, semestre e disciplina, informa as notas e vê a média projetada, com regras de peso e aprovação configuráveis.',
    highlights: [
      'Seleção de curso, semestre e disciplina',
      'Simulação de notas com cálculo de média e regras configuráveis',
      'Tema escuro e layout responsivo',
      'Projeto aberto a contribuições, com guia de contribuição',
      'Publicado na Vercel',
    ],
    decisions: [
      {
        title: 'Regras de nota separadas da interface',
        text: 'O cálculo de médias e pesos fica em módulos próprios (averageCalculator e gradeConfig), distintos dos dados das disciplinas e dos componentes — para ajustar uma regra de curso sem tocar na UI.',
      },
      {
        title: 'Stack moderna e leve',
        text: 'Vite 5, React 18, TypeScript e React Router, com Tailwind e shadcn/ui (Radix) para acessibilidade dos componentes e TanStack Query para estado assíncrono.',
      },
      {
        title: 'Pensado para ser open source',
        text: 'README com visão geral, requisitos, scripts, estrutura de pastas e convenções, mais um CONTRIBUTING.md — a barreira para outra pessoa abrir um PR é baixa.',
      },
    ],
    stack: ['TypeScript', 'React', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'TanStack Query', 'React Router'],
    status: 'concluído',
    kind: 'Open source',
    demo: 'https://simulamedias.vercel.app',
  },
  {
    slug: 'jarvis',
    repo: 'J.A.R.V.I.S-Just-A-Rather-Very-Intelligent-System',
    title: 'J.A.R.V.I.S.',
    tagline: 'Assistente pessoal modular movido por LLMs locais, para automatizar tarefas e controlar o sistema.',
    summary:
      'Assistente de IA pessoal e modular, movido por LLMs locais, para automação de tarefas diárias e controle do sistema — inspirado no J.A.R.V.I.S. do Homem de Ferro.',
    problem:
      'O objetivo é um assistente virtual autônomo que integre diferentes capacidades — conversa, automação de tarefas, controle do computador — rodando sobre modelos de linguagem locais.',
    solution:
      'Um ecossistema de módulos (frontend, backend, serviços) orquestrados por um repositório integrador, que sobe tudo com um único script de inicialização.',
    highlights: [
      'Modelos de linguagem executados localmente',
      'Arquitetura modular: cada componente com sua própria documentação',
      'Inicialização de todos os serviços com um único comando (boot.bat)',
      'Foco em automação de tarefas e controles do sistema',
    ],
    decisions: [
      {
        title: 'Repositório integrador + módulos independentes',
        text: 'O repositório principal é o ponto de entrada; cada módulo (frontend, backend, serviços) documenta suas dependências e instruções no próprio diretório, o que permite evoluir peças separadamente.',
      },
      {
        title: 'Inicialização única',
        text: 'Um script na raiz sobe todos os serviços do ecossistema, reduzindo o atrito de rodar um sistema com várias partes.',
      },
    ],
    stack: ['Python', 'LLMs locais', 'Arquitetura modular'],
    status: 'em andamento',
    kind: 'IA pessoal',
  },
  {
    slug: 'generate-bambu',
    repo: 'Generate-bambu',
    title: 'Generate Bambu',
    tagline:
      'Skill para Claude que modela peças 3D no Autodesk Fusion e as leva até a impressora, com aprovação humana antes de imprimir.',
    summary:
      'Skill para Claude que modela peças imprimíveis no Autodesk Fusion via MCP: design paramétrico, validação, exportação .3mf multicor (AMS) e conferência no Bambu Studio.',
    problem:
      'Ir de uma ideia a uma peça impressa em 3D envolve muitas etapas manuais: modelar, validar dimensões, separar cores, exportar e configurar o fatiador.',
    solution:
      'Uma skill que automatiza a sequência: cria o design paramétrico no Fusion via MCP, valida e mostra o resultado, exporta um .3mf multicor e abre o Bambu Studio para conferência.',
    highlights: [
      'Design paramétrico criado diretamente no Autodesk Fusion via MCP',
      'Validação do modelo antes de seguir adiante',
      'Exportação .3mf multicor, com suporte ao AMS',
      'Conferência no Bambu Studio antes de imprimir',
    ],
    decisions: [
      {
        title: 'Aprovação humana antes de imprimir',
        text: 'Imprimir é uma ação física: não dá para desfazer depois de começar. A skill para e pede confirmação antes de enviar à impressora — a automação cobre o trabalho repetitivo, não a decisão final.',
      },
      {
        title: 'Sequência fixa e verificável',
        text: 'Cada etapa (criar, validar, exibir, exportar, abrir no fatiador) acontece em ordem definida, para que o resultado seja previsível e fácil de auditar.',
      },
    ],
    stack: ['Python', 'Claude', 'MCP', 'Autodesk Fusion', 'Bambu Studio', '3MF'],
    status: 'concluído',
    kind: 'Automação com IA',
  },
];

/**
 * Resumos em português dos demais repositórios. Traduções fiéis das descrições do GitHub,
 * que estão em inglês — a interface do site é toda em português.
 */
export const PROJECT_SUMMARIES: Record<string, string> = {
  'maquina-de-morse': 'Codificador e decodificador de código Morse: traduz texto para Morse e vice-versa.',
  'breakout-arkanoid': 'Clone do clássico Breakout/Arkanoid feito do zero: quebre os blocos e some pontos.',
  System_Boost: 'Utilitário de limpeza de sistema para Windows, em Python, com uma CLI estilizada via Rich.',
  'Projeto-1-Estatistica-E-Analise-de-dados':
    'Análise estatística descritiva da eficiência de uma linha de produção industrial: níveis de automação e tempos de ciclo (PUC-Campinas).',
  'Estrutura-de-Dados':
    'Implementações práticas de estruturas de dados e algoritmos fundamentais: listas, pilhas, filas, árvores e ordenação.',
  'alarme-LDR':
    'Alarme de segurança com Arduino e sensor LDR: dispara alerta sonoro e visual quando a luminosidade varia.',
  'space-invarders-game': 'Clone 2D de Space Invaders: ondas de alienígenas, colisões e pontuação.',
  'Flappy-bird-clone': 'Clone de Flappy Bird com física própria, detecção de colisão e pontuação.',
  'Simons-game-GENIUS':
    'Recriação do jogo Genius (Simon): sequências de som e luz, dificuldade progressiva e placar em tempo real.',
  'Snake-game':
    'Jogo da Cobrinha: movimento em grade, colisão em tempo real, comida em posições aleatórias e pontuação.',
  'Pong-Game': 'Pong clássico com física de colisão 2D, controle das raquetes e placar em tempo real.',
  Metronome: 'Metrônomo digital para músicos: BPM ajustável, controle de compasso e retorno áudio-visual.',
  'Stop-Watch': 'Cronômetro digital com iniciar, pausar, zerar e registro de voltas.',
  'Reaction-Game': 'Jogo de tempo de reação: testa, mede e registra os reflexos do jogador em milissegundos.',
  'Player-de-Musica': 'Player de música digital com reprodução contínua, gerenciamento de faixas e controles de mídia.',
  'Smart-traffic-light':
    'Semáforo inteligente e adaptativo para otimizar o fluxo de trânsito em tempo real, com integração de sensores.',
  Thermostat: 'Termostato digital: monitora a temperatura em tempo real e regula o ambiente automaticamente.',
  jukebox: 'Jukebox digital com gerenciamento de playlists, fila de reprodução e música contínua.',
  'Light-Meter': 'Luxímetro digital: mede a luminosidade ambiente em lux, em tempo real.',
  Bot_Discord_V1:
    'Bot de Discord em Node.js (discord.js) com a API Gemini: dicas de estudo e motivação para estudantes.',
  'MIT_6.002.1x':
    'Anotações, listas de análise de circuitos e certificado do curso 6.002.1x do MIT (Circuits and Electronics, no edX).',
  CS50_2025:
    'Soluções, anotações e projeto final do CS50x de Harvard: C, Python, SQL, algoritmos e web com Flask.',
  'Project-Clock-LED':
    'Relógio digital de 24 horas sem microcontrolador: lógica digital, flip-flops, PCB no Eagle e simulação no Proteus.',
  'PROJETO-EXT24':
    'Documentação, diagnóstico de campo e gestão do Projeto de Extensão Universitária 2024 da PUC-Campinas.',
  'Projeto-Cofre-Digital':
    'Simulador de cofre digital em C: autenticação, controle de acesso e limite de tentativas.',
  'Flight-Management-Software':
    'Software de gestão de voos em C: menu interativo no terminal e busca de rota com menor tempo de conexão.',
  'Projeto-integrador-PUCBET':
    'Simulação web full-stack de uma plataforma de apostas, com Node.js, Express, SQLite e roleta interativa.',
};

/** Capas locais já existentes em /public/thumbnails. */
const LOCAL_COVERS: Record<string, string> = {
  CS50_2025: '/thumbnails/CS50.jpg',
  'MIT_6.002.1x': '/thumbnails/MIT.jpg',
};

export function getCaseStudy(repoName: string): CaseStudy | undefined {
  return CASE_STUDIES.find((study) => study.repo === repoName);
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((study) => study.slug === slug);
}

/**
 * Texto do card, em ordem de preferência: estudo de caso → resumo traduzido → null
 * (quem chama cai na descrição do GitHub e, por fim, em `describeProject`).
 */
export function getCuratedSummary(repoName: string): string | null {
  return getCaseStudy(repoName)?.summary ?? PROJECT_SUMMARIES[repoName] ?? null;
}

/**
 * Imagem de capa declarada para o projeto: `cover` do estudo de caso → miniatura local.
 * Devolve null quando não há — o componente então gera uma capa em CSS. Para trocar por um
 * screenshot real, basta colocar o arquivo em /public e preencher `cover` no estudo.
 */
export function getExplicitCover(repoName: string): string | null {
  return getCaseStudy(repoName)?.cover ?? LOCAL_COVERS[repoName] ?? null;
}

/** Estudo anterior e seguinte, em ordem circular — alimenta a navegação no fim da página. */
export function getAdjacentCaseStudies(slug: string): { prev: CaseStudy; next: CaseStudy } | null {
  const index = CASE_STUDIES.findIndex((study) => study.slug === slug);
  if (index === -1 || CASE_STUDIES.length < 2) return null;

  const total = CASE_STUDIES.length;
  return {
    prev: CASE_STUDIES[(index - 1 + total) % total],
    next: CASE_STUDIES[(index + 1) % total],
  };
}
