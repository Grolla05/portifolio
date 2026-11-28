/*
    Gráfico de contribuições do GitHub — parser.

    A API GraphQL do GitHub (contributionsCollection) exige token mesmo para dados
    públicos. A página pública do calendário (github.com/users/<user>/contributions) não:
    é o mesmo HTML que o perfil carrega, com um <td data-date data-level> por dia e um
    <tool-tip for="..."> com a contagem ("2 contributions on November 23rd." /
    "No contributions on ..."). Este módulo transforma esse HTML em dados puros.

    Puro e sem `fetch`, para ser testável com um trecho de HTML fixo
    (tests/contributions.test.ts). Quem busca é app/api/contributions/route.ts.
*/

export interface ContributionDay {
  /** AAAA-MM-DD */
  date: string;
  count: number;
  /** 0–4, a mesma escala de intensidade do GitHub. */
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionCalendar {
  total: number;
  days: ContributionDay[];
}

const TD = /<td\b[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*>/g;
const ATTR = (name: string) => new RegExp(`\\b${name}="([^"]*)"`);
const TOOLTIP = /<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g;

export function parseContributions(html: string): ContributionCalendar {
  // id do <td> → texto do tooltip
  const tooltips = new Map<string, string>();
  for (const [, forId, text] of html.matchAll(TOOLTIP)) tooltips.set(forId, text.trim());

  const days: ContributionDay[] = [];
  for (const match of html.matchAll(TD)) {
    const tag = match[0];
    const date = match[1];
    const id = tag.match(ATTR('id'))?.[1];
    const rawLevel = Number(tag.match(ATTR('data-level'))?.[1] ?? 0);
    const level = (Math.min(4, Math.max(0, rawLevel)) || 0) as ContributionDay['level'];
    const text = id ? tooltips.get(id) ?? '' : '';
    const count = /^No contributions/i.test(text) ? 0 : Number(text.match(/^([\d,]+)/)?.[1]?.replace(/,/g, '') ?? 0);
    days.push({ date, count, level });
  }

  days.sort((a, b) => a.date.localeCompare(b.date));
  return { total: days.reduce((sum, d) => sum + d.count, 0), days };
}

/**
 * Estende o calendário com dias zerados até `today` (AAAA-MM-DD).
 *
 * Por que: o JSON vem de cache (servidor/CDN) e pode estar com dias de atraso — o gráfico
 * parava no último dia buscado em vez de ir até hoje. Os dias que faltam entram com 0
 * contribuições (nível 0) e a janela desliza: o mesmo número de dias é mantido, cortando
 * o início, para continuar sendo "o último ano".
 */
export function fillToToday(days: ContributionDay[], today: string): ContributionDay[] {
  if (days.length === 0) return days;
  const last = days[days.length - 1].date;
  if (last >= today) return days;

  const filled = [...days];
  const cursor = new Date(`${last}T00:00:00Z`);
  for (;;) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const date = cursor.toISOString().slice(0, 10);
    if (date > today) break;
    filled.push({ date, count: 0, level: 0 });
  }
  return filled.slice(filled.length - days.length);
}

/**
 * Agrupa os dias em semanas (colunas de domingo a sábado), como o GitHub desenha.
 * A primeira semana é completada com `null` antes do primeiro dia.
 */
export function toWeeks(days: ContributionDay[]): (ContributionDay | null)[][] {
  if (days.length === 0) return [];
  const weeks: (ContributionDay | null)[][] = [];
  const firstWeekday = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  let week: (ContributionDay | null)[] = Array.from({ length: firstWeekday }, () => null);

  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) weeks.push(week);
  return weeks;
}
