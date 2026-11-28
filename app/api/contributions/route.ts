import { NextResponse } from 'next/server';
import { GITHUB_USER } from '@/lib/site';
import { parseContributions } from '@/lib/contributions';

/*
    Calendário de contribuições do GitHub (último ano), para o gráfico do hero.

    Lê a página pública do calendário — a mesma que o perfil do GitHub carrega — e devolve
    JSON enxuto. O cache fica só no CDN (s-maxage), para o GitHub não receber uma
    requisição por visitante.

    Bug corrigido: a rota era estática (pré-renderizada no build) e ainda tinha
    `revalidate` na fetch + stale-while-revalidate de 24h — em site de pouco tráfego o
    visitante recebia o calendário do dia do deploy (o gráfico parava dois dias atrás).
    Agora: rota dinâmica, fetch sem cache de dados e janela "stale" curta.
*/
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch(`https://github.com/users/${GITHUB_USER}/contributions`, {
      headers: { Accept: 'text/html', 'User-Agent': 'portfolio-contributions' },
      cache: 'no-store',
    });
    if (!res.ok) {
      return NextResponse.json({ error: `GitHub respondeu ${res.status}` }, { status: 502 });
    }

    const calendar = parseContributions(await res.text());
    if (calendar.days.length === 0) {
      return NextResponse.json({ error: 'Calendário vazio ou formato desconhecido.' }, { status: 502 });
    }

    return NextResponse.json(calendar, {
      headers: { 'Cache-Control': 'public, max-age=0, s-maxage=900, stale-while-revalidate=60' },
    });
  } catch {
    return NextResponse.json({ error: 'Não foi possível falar com o GitHub.' }, { status: 502 });
  }
}
