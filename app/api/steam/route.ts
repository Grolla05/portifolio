import { NextResponse } from 'next/server';
import { STEAM } from '@/lib/site';
import { parseOwnedGames, parseSteamProfile } from '@/lib/steam';

/*
    Ranking de jogos por horas (cartão "Games" em /about).

    Lê a página pública do perfil configurado em lib/site.ts (nunca uma URL vinda do
    cliente) e devolve JSON enxuto. Cache de 1h no servidor e no CDN: a Steam recebe
    ~24 requisições por dia no total, não uma por visitante. Perfil privado, mudança de
    marcação ou Steam fora do ar → 502, e o cartão mostra a versão estática.
*/
const REVALIDATE_SECONDS = 3600;

export async function GET() {
  if (!STEAM.profileUrl) {
    return NextResponse.json({ error: 'Perfil da Steam não configurado.' }, { status: 404 });
  }

  try {
    /*
        Caminho completo: com STEAM_API_KEY (variável de ambiente do servidor) e o perfil
        com "detalhes do jogo" públicos, a Web API devolve a conta inteira e saem os 7 com
        mais horas. Qualquer falha aqui cai na raspagem do perfil, abaixo.
    */
    const key = process.env.STEAM_API_KEY;
    if (key && STEAM.steamId64) {
      const api = new URL('https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/');
      api.search = new URLSearchParams({
        key,
        steamid: STEAM.steamId64,
        include_appinfo: 'true',
        include_played_free_games: 'true',
      }).toString();
      const owned = await fetch(api, { next: { revalidate: REVALIDATE_SECONDS } }).catch(() => null);
      if (owned?.ok) {
        const games = parseOwnedGames(await owned.json());
        if (games.length > 0) {
          return NextResponse.json(
            { games, source: 'api' },
            { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' } },
          );
        }
      }
    }

    const res = await fetch(STEAM.profileUrl, {
      headers: { Accept: 'text/html', 'Accept-Language': 'en-US,en;q=0.9', 'User-Agent': 'Mozilla/5.0 (portfolio-steam)' },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      return NextResponse.json({ error: `Steam respondeu ${res.status}` }, { status: 502 });
    }

    const games = parseSteamProfile(await res.text());
    if (games.length === 0) {
      return NextResponse.json({ error: 'Nenhum jogo público ou formato desconhecido.' }, { status: 502 });
    }

    return NextResponse.json(
      { games, source: 'profile' },
      { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' } },
    );
  } catch {
    return NextResponse.json({ error: 'Não foi possível falar com a Steam.' }, { status: 502 });
  }
}
