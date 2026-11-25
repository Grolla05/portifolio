import { NextResponse } from 'next/server';
import { GITHUB_USER } from '@/lib/site';
import { parseContributions } from '@/lib/contributions';

/*
    Calendário de contribuições do GitHub (último ano), para o gráfico do hero.

    Lê a página pública do calendário — a mesma que o perfil do GitHub carrega — e devolve
    JSON enxuto. Cache de 1h no servidor (revalidate) e no CDN (s-maxage): o calendário
    muda no máximo algumas vezes por dia, e assim o GitHub recebe ~24 requisições por dia
    no total, não uma por visitante.
*/
const REVALIDATE_SECONDS = 3600;

export async function GET() {
  try {
    const res = await fetch(`https://github.com/users/${GITHUB_USER}/contributions`, {
      headers: { Accept: 'text/html', 'User-Agent': 'portfolio-contributions' },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      return NextResponse.json({ error: `GitHub respondeu ${res.status}` }, { status: 502 });
    }

    const calendar = parseContributions(await res.text());
    if (calendar.days.length === 0) {
      return NextResponse.json({ error: 'Calendário vazio ou formato desconhecido.' }, { status: 502 });
    }

    return NextResponse.json(calendar, {
      headers: { 'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' },
    });
  } catch {
    return NextResponse.json({ error: 'Não foi possível falar com o GitHub.' }, { status: 502 });
  }
}
