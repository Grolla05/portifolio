'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Github } from 'lucide-react';
import { CountUp } from '@/components/motion/count-up';
import { fillToToday, toWeeks, type ContributionCalendar, type ContributionDay } from '@/lib/contributions';
import { SOCIAL } from '@/lib/site';

/*
    Gráfico de contribuições do GitHub — no lugar do pulso simulado do osciloscópio.

    Dado REAL (último ano, via /api/contributions) em vez de uma onda decorativa: mostra
    constância de trabalho, que é exatamente o que um recrutador procura no perfil.

    Animação (CSS puro, .contrib-cell em app/globals.css):
      1. entrada em ONDA diagonal — cada célula surge com atraso = semana × 11ms + dia × 18ms,
         "pintando" o ano da esquerda para a direita como um scan;
      2. o dia de hoje pulsa (anel), sinal de que o dado está vivo;
      3. hover: a célula cresce e um tooltip mostra contagem e data.
    Com movimento reduzido: grade pronta, sem onda nem pulso.

    No celular o ano não cabe: a grade rola na horizontal e já abre no fim (semanas
    mais recentes), como no próprio GitHub.
*/

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const WEEKDAYS = ['', 'seg', '', 'qua', '', 'sex', ''];

function formatDate(date: string) {
  const [y, m, d] = date.split('-').map(Number);
  return `${d} de ${MONTHS[m - 1]}. de ${y}`;
}

/** Data de hoje no fuso do visitante, AAAA-MM-DD. */
function localISODate() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
}

function describe(day: ContributionDay) {
  const n = day.count;
  return `${n === 0 ? 'Nenhuma contribuição' : `${n} contribuiç${n === 1 ? 'ão' : 'ões'}`} em ${formatDate(day.date)}`;
}

type Status = 'loading' | 'ready' | 'error';

export function ContributionGraph({ delay = 0 }: { delay?: number }) {
  const [data, setData] = useState<ContributionCalendar | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [hover, setHover] = useState<{ day: ContributionDay; x: number; y: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/contributions', { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((json: ContributionCalendar) => {
        setData(json);
        setStatus('ready');
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('error');
      });
    return () => controller.abort();
  }, []);

  // O JSON pode vir de cache com dias de atraso: completa com dias zerados até hoje
  // (data local do visitante) para o gráfico sempre terminar no dia atual.
  const days = useMemo(() => (data ? fillToToday(data.days, localISODate()) : []), [data]);
  const weeks = useMemo(() => toWeeks(days), [days]);
  const today = days[days.length - 1]?.date;
  const columns = weeks.length || 53;

  // Rótulos de mês: na primeira semana em que o mês muda (sem colar dois rótulos).
  const monthLabels = useMemo(() => {
    const labels: { index: number; label: string }[] = [];
    let last = -1;
    weeks.forEach((week, i) => {
      const first = week.find(Boolean);
      if (!first) return;
      const month = Number(first.date.slice(5, 7)) - 1;
      if (month !== last) {
        if (labels.length === 0 || i - labels[labels.length - 1].index >= 3) labels.push({ index: i, label: MONTHS[month] });
        last = month;
      }
    });
    return labels;
  }, [weeks]);

  // Celular: abre mostrando as semanas mais recentes.
  // ResizeObserver: a largura final só existe depois do layout (fontes, animação de
  // entrada, rotação do aparelho); rolar uma vez no efeito chegava cedo demais.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || status !== 'ready') return;
    const toEnd = () => {
      el.scrollLeft = el.scrollWidth;
    };
    toEnd();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(toEnd);
    ro.observe(el);
    return () => ro.disconnect();
  }, [status]);

  const onOver = (e: React.PointerEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-ix]');
    const box = boxRef.current;
    if (!cell || !box || !data) return setHover(null);
    const day = days[Number(cell.dataset.ix)];
    const c = cell.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    setHover({ day, x: c.left - b.left + c.width / 2, y: c.top - b.top });
  };

  if (status === 'error') return null;

  return (
    <div
      ref={boxRef}
      className="reveal-up relative w-full rounded-xl border p-5 sm:p-6"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-default)',
        '--reveal-delay': `${delay}ms`,
      } as React.CSSProperties}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span className="text-2xl font-medium tracking-tight tabular-nums mr-2" style={{ color: 'var(--text-primary)' }}>
            <CountUp value={data?.total ?? 0} ready={status === 'ready'} />
          </span>
          contribuições no último ano
        </p>
        <a
          href={SOCIAL.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-xs hover:underline underline-offset-4"
          style={{ color: 'var(--text-muted)' }}
        >
          <Github className="w-3.5 h-3.5" aria-hidden="true" />
          github.com/Grolla05
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </div>

      {/*
          Uma grade só, com posição explícita: coluna 1 = dias da semana, linha 1 = meses,
          e cada semana uma coluna `minmax(var(--cell), 1fr)` — as células CRESCEM para
          preencher a largura do card (quadradas via aspect-square) e, quando não cabem
          (celular), param no mínimo e a grade rola.
      */}
      {/*
          p-4 -m-4: respiro DENTRO do container rolável. overflow-x:auto também corta no
          eixo Y, e a célula ampliada no hover (scale 1.6) e o anel do dia de hoje (scale
          2.4) eram cortados nas bordas. A margem negativa devolve o espaço ao layout.
      */}
      <div ref={scrollRef} className="overflow-x-auto no-scrollbar p-4 -m-4">
        <div
          role="img"
          aria-label={data ? `${data.total} contribuições no GitHub no último ano` : 'Carregando contribuições do GitHub'}
          className="grid gap-[var(--gap)] font-mono text-[10px]"
          style={{
            gridTemplateColumns: `auto repeat(${columns}, minmax(var(--cell), 1fr))`,
            gridTemplateRows: 'auto repeat(7, auto)',
            color: 'var(--text-muted)',
          }}
          onPointerOver={onOver}
          onPointerLeave={() => setHover(null)}
        >
          {monthLabels.map(({ index, label }) => (
            <span
              key={`m-${index}`}
              aria-hidden="true"
              className="whitespace-nowrap pb-1"
              style={{ gridColumn: index + 2, gridRow: 1 }}
            >
              {label}
            </span>
          ))}
          {WEEKDAYS.map((d, i) => (
            <span
              key={`w-${i}`}
              aria-hidden="true"
              className="pr-2 self-center leading-none"
              style={{ gridColumn: 1, gridRow: i + 2 }}
            >
              {d}
            </span>
          ))}
          {status === 'loading'
            ? Array.from({ length: columns * 7 }, (_, i) => (
                <span
                  key={i}
                  className="aspect-square rounded-[3px] animate-pulse"
                  style={{ backgroundColor: 'var(--contrib-0)', gridColumn: Math.floor(i / 7) + 2, gridRow: (i % 7) + 2 }}
                />
              ))
            : weeks.flatMap((week, w) =>
                week.map((day, d) =>
                  day ? (
                    <span
                      key={day.date}
                      data-ix={days.indexOf(day)}
                      className={`contrib-cell aspect-square rounded-[3px]${day.date === today ? ' contrib-today' : ''}`}
                      style={{
                        gridColumn: w + 2,
                        gridRow: d + 2,
                        backgroundColor: `var(--contrib-${day.level})`,
                        '--reveal-delay': `${delay + 200 + w * 11 + d * 18}ms`,
                      } as React.CSSProperties}
                    />
                  ) : null,
                ),
              )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-1.5 mt-3 font-mono text-[10px]" style={{ color: 'var(--text-muted)' }} aria-hidden="true">
        menos
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} className="w-[10px] h-[10px] rounded-[2px]" style={{ backgroundColor: `var(--contrib-${l})` }} />
        ))}
        mais
      </div>

      {hover && (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border px-2.5 py-1.5 text-xs elevation-2"
          style={{
            left: hover.x,
            top: hover.y - 6,
            backgroundColor: 'var(--bg-tertiary)',
            borderColor: 'var(--border-default)',
            color: 'var(--text-primary)',
          }}
        >
          {describe(hover.day)}
        </div>
      )}
    </div>
  );
}
