import { describe, it, expect } from 'vitest';
import { parseOwnedGames, parseSteamProfile } from '@/lib/steam';

const block = (id: string, name: string, hours: string, cover = 'https://shared.akamai.steamstatic.com/x.jpg') => `
  <div class="recent_game"><div class="game_info">
    <div class="game_info_cap"><a href="https://steamcommunity.com/app/${id}"><img class="game_capsule" src="${cover}"></a></div>
    <div class="game_info_details"> ${hours} hrs on record<br> last played on 7 Nov </div>
    <div class="game_name"><a class="whiteLink" href="https://steamcommunity.com/app/${id}">${name}</a></div>
  </div></div>`;

describe('parseSteamProfile', () => {
  it('extrai jogos e ordena por horas', () => {
    const games = parseSteamProfile(block('1', 'Deadlock', '30') + block('730', 'Counter-Strike 2', '1,488') + block('2', 'R6', '0.6'));
    expect(games.map((g) => g.name)).toEqual(['Counter-Strike 2', 'Deadlock', 'R6']);
    expect(games[0].hours).toBe(1488);
    expect(games[0].lastPlayed).toBe('7 Nov');
    expect(games[0].appId).toBe('730');
  });

  it('decodifica entidades no nome', () => {
    expect(parseSteamProfile(block('359550', 'Tom Clancy&#039;s Rainbow Six', '1'))[0].name).toBe("Tom Clancy's Rainbow Six");
  });

  it('descarta capa fora dos domínios da Steam', () => {
    expect(parseSteamProfile(block('1', 'X', '1', 'https://evil.example.com/a.jpg'))[0].cover).toBeNull();
    expect(parseSteamProfile(block('1', 'X', '1', 'javascript:alert(1)'))[0].cover).toBeNull();
  });

  it('devolve lista vazia quando a marcação é desconhecida', () => {
    expect(parseSteamProfile('<html><body>nada</body></html>')).toEqual([]);
  });
});

describe('parseOwnedGames', () => {
  const payload = {
    response: {
      games: [
        { appid: 1, name: 'A', playtime_forever: 60 },
        { appid: 730, name: 'Counter-Strike 2', playtime_forever: 29280, rtime_last_played: 1762500000 },
        { appid: 3, name: 'Nunca jogado', playtime_forever: 0 },
        { appid: 4, name: 'B', playtime_forever: 600 },
      ],
    },
  };

  it('ordena por horas, descarta 0 h e converte minutos em horas', () => {
    const games = parseOwnedGames(payload);
    expect(games.map((g) => g.name)).toEqual(['Counter-Strike 2', 'B', 'A']);
    expect(games[0].hours).toBe(488);
    expect(games[0].cover).toContain('/apps/730/');
  });

  it('respeita o limite', () => {
    expect(parseOwnedGames(payload, 2)).toHaveLength(2);
  });

  it('devolve vazio quando o perfil esconde os jogos (resposta sem "games")', () => {
    expect(parseOwnedGames({ response: {} })).toEqual([]);
    expect(parseOwnedGames(null)).toEqual([]);
  });
});
