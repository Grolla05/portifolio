import { describe, it, expect } from 'vitest';
import { parseContributions, toWeeks } from '@/lib/contributions';

/*
    Parser do calendário de contribuições (lib/contributions.ts) contra um trecho no
    mesmo formato do HTML público do GitHub.
*/
const HTML = `
<td data-ix="0" data-date="2025-11-25" id="contribution-day-component-2-0" data-level="1" class="ContributionCalendar-day"></td>
<td data-ix="0" data-date="2025-11-23" id="contribution-day-component-0-0" data-level="2" class="ContributionCalendar-day"></td>
<td data-ix="0" data-date="2025-11-24" id="contribution-day-component-1-0" data-level="0" class="ContributionCalendar-day"></td>
<tool-tip for="contribution-day-component-0-0" class="sr-only">1,204 contributions on November 23rd.</tool-tip>
<tool-tip for="contribution-day-component-1-0" class="sr-only">No contributions on November 24th.</tool-tip>
<tool-tip for="contribution-day-component-2-0" class="sr-only">1 contribution on November 25th.</tool-tip>
`;

describe('parseContributions', () => {
  it('lê data, nível e contagem (com separador de milhar) e ordena por data', () => {
    const { days, total } = parseContributions(HTML);
    expect(days.map((d) => d.date)).toEqual(['2025-11-23', '2025-11-24', '2025-11-25']);
    expect(days[0]).toEqual({ date: '2025-11-23', count: 1204, level: 2 });
    expect(days[1].count).toBe(0);
    expect(total).toBe(1205);
  });

  it('devolve calendário vazio para HTML sem dias', () => {
    expect(parseContributions('<html></html>')).toEqual({ total: 0, days: [] });
  });
});

describe('toWeeks', () => {
  it('agrupa em colunas de domingo a sábado, preenchendo o início', () => {
    // 2025-11-25 é terça: a primeira semana começa com dois espaços vazios.
    const weeks = toWeeks([{ date: '2025-11-25', count: 1, level: 1 }]);
    expect(weeks[0].slice(0, 2)).toEqual([null, null]);
    expect(weeks[0][2]?.date).toBe('2025-11-25');
  });
});
