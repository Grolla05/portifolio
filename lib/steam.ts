/*
    Jogos da Steam para o cartão "Games" (/about).

    A Web API da Steam exige chave e o endpoint /games?xml=1 pede login, então a única
    fonte pública é a página do perfil, que lista os jogos "em destaque/recentes" com as
    horas totais ("488 hrs on record"). parseSteamProfile lê esse bloco.

    É raspagem de HTML: se a Steam mudar a marcação, devolve lista vazia e o cartão cai no
    estado estático — nunca quebra a página. O que sai daqui vira atributo `src` de <img>,
    então só passam URLs https de domínios da Steam.
*/

export interface SteamGame {
  appId: string;
  name: string;
  hours: number;
  /** "25 Nov" — texto da Steam, já em formato curto. */
  lastPlayed: string | null;
  cover: string | null;
  url: string;
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#039': "'", '#39': "'" };

function decode(text: string): string {
  return text.replace(/&(#?\w+);/g, (m, e: string) => ENTITIES[e] ?? m).trim();
}

/** Aceita só https em domínios de CDN/loja da Steam. */
function safeSteamUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(decode(url));
    return u.protocol === 'https:' && /(^|\.)(steamstatic\.com|steamcommunity\.com|steampowered\.com)$/.test(u.hostname)
      ? u.toString()
      : null;
  } catch {
    return null;
  }
}

export function parseSteamProfile(html: string): SteamGame[] {
  const flat = html.replace(/\s+/g, ' ');
  const blocks = flat.split('<div class="recent_game">').slice(1);
  const games: SteamGame[] = [];

  for (const block of blocks) {
    // Corta no próximo bloco de jogo — o split já faz isso; limita o resto do HTML da página.
    const chunk = block.slice(0, 6000);
    const link = chunk.match(/<div class="game_name"><a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/);
    if (!link) continue;
    const appId = link[1].match(/\/app\/(\d+)/)?.[1];
    const url = safeSteamUrl(link[1]);
    if (!appId || !url) continue;

    const hoursRaw = chunk.match(/([\d.,]+)\s*hrs on record/)?.[1];
    const hours = hoursRaw ? parseFloat(hoursRaw.replace(/,/g, '')) : 0;
    const lastPlayed = chunk.match(/last played on ([^<]+)</)?.[1]?.trim() ?? null;
    const cover = safeSteamUrl(chunk.match(/class="game_capsule"[^>]*src="([^"]+)"/)?.[1]);

    games.push({ appId, name: decode(link[2]), hours: Number.isFinite(hours) ? hours : 0, lastPlayed, cover, url });
  }

  return games.sort((a, b) => b.hours - a.hours);
}

/** Resposta de IPlayerService/GetOwnedGames (campos que usamos). */
interface OwnedGame {
  appid: number;
  name?: string;
  playtime_forever?: number;
  rtime_last_played?: number;
}

/**
 * Top jogos por horas a partir da Web API oficial (exige chave e "detalhes do jogo"
 * públicos no perfil). A capa vem do CDN da Steam pelo appid; o <img> some se não existir.
 */
export function parseOwnedGames(payload: unknown, limit = 7): SteamGame[] {
  const list = (payload as { response?: { games?: OwnedGame[] } })?.response?.games;
  if (!Array.isArray(list)) return [];

  return list
    .filter((g) => Number.isInteger(g.appid) && g.name && (g.playtime_forever ?? 0) > 0)
    .sort((a, b) => (b.playtime_forever ?? 0) - (a.playtime_forever ?? 0))
    .slice(0, limit)
    .map((g) => ({
      appId: String(g.appid),
      name: g.name as string,
      hours: Math.round(((g.playtime_forever ?? 0) / 60) * 10) / 10,
      lastPlayed: g.rtime_last_played
        ? new Date(g.rtime_last_played * 1000).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
        : null,
      cover: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${g.appid}/capsule_184x69.jpg`,
      url: `https://steamcommunity.com/app/${g.appid}`,
    }));
}
