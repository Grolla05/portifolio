/**
 * Configuração canônica do site.
 *
 * Motivo: `metadataBase`, `sitemap`, `robots` e a imagem de OG precisam todos da MESMA
 * URL absoluta. Espalhar isso em quatro arquivos garante divergência na primeira mudança
 * de domínio, então centraliza aqui.
 *
 * Ordem de resolução:
 *   1. NEXT_PUBLIC_SITE_URL — override manual (preview branches, domínio novo)
 *   2. VERCEL_PROJECT_PRODUCTION_URL — injetada automaticamente pela Vercel no build
 *   3. www.grolla.codes — domínio de produção atual
 *
 * Nota: o apex `grolla.codes` NÃO resolve hoje (sem DNS/TLS); só o subdomínio `www`.
 * Por isso o canonical aponta para `www` — apontar para um host que não responde
 * faria o Google indexar uma URL morta.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://www.grolla.codes")
).replace(/\/$/, "");

export const SITE_NAME = "Felipe Grolla";

export const SITE_TAGLINE = "Desenvolvedor de Software";

export const SITE_DESCRIPTION =
  "Portfólio de Felipe Grolla, desenvolvedor de software. Projetos em C, C++, Python, " +
  "TypeScript e sistemas embarcados, apresentados numa interface inspirada em IDE.";

/**
 * Disponibilidade exibida como selo na home ("Aberto a ...").
 * `null` esconde o selo. Preencher só com algo que seja verdade hoje, ex.:
 * "Aberto a estágio e projetos freelance".
 */
export const AVAILABILITY: string | null = null;

/** Handle do GitHub — fonte dos projetos exibidos em /projects. */
export const GITHUB_USER = "Grolla05";

export const SOCIAL = {
  github: `https://github.com/${GITHUB_USER}`,
  linkedin: "https://www.linkedin.com/in/felipegrolla/",
  email: "fegrolla0210@gmail.com",
} as const;

/**
 * Documento do currículo no Google Docs.
 * Só o ID fica aqui; a rota /api/cv monta a URL de export em PDF.
 * Assim o currículo publicado acompanha automaticamente as edições do documento.
 */
export const CV_DOC_ID = "1lE3vys3oCWSytIz2LLhqu9BrRyn6E-o57RZZ5qsNPSk";

/*
    Integrações da seção "Fora do editor" (/about). Só entra link que for verdade hoje:
    enquanto estiverem `null`, os cartões de Música e Games aparecem sem o botão
    correspondente — nada de perfil inventado.

    SPOTIFY.embed: trecho da URL de compartilhamento depois de open.spotify.com/, ex.:
      "playlist/37i9dQZF1DXcBWIGoYBM5M"  ou  "artist/..."  ou  "album/..."
    Com ele preenchido, o cartão ganha um player real (carregado só ao clicar em "Ouvir").
*/
export const SPOTIFY: { profileUrl: string | null; embed: string | null } = {
  profileUrl: "https://open.spotify.com/user/feextreme_gamer",
  embed: null, // embed de usuário não existe (404); usar playlist/álbum/artista, ex.: "playlist/<id>"
};

/*
    STEAM.steamId64: ID público do perfil (aparece na página do perfil). Com ele e a variável
    de ambiente STEAM_API_KEY (servidor, nunca no repositório) a rota /api/steam lista os
    jogos com mais horas da conta inteira. Sem a chave, usa só os jogos que o perfil exibe.
*/
export const STEAM: { profileUrl: string | null; steamId64: string | null } = {
  profileUrl: "https://steamcommunity.com/id/Grolla/",
  steamId64: "76561198269348966",
};
