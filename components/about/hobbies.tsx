"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Gamepad2, Music, Play } from "lucide-react";
import { appleSpring, fadeUp, staggerContainer } from "@/lib/animations/variants";
import { useMotionOff } from "@/lib/animations/use-motion-off";
import { useTilt } from "@/lib/animations/use-tilt";
import { GAMES, HOBBIES, type GameEntry, type Hobby } from "@/lib/about";
import { SPOTIFY, STEAM } from "@/lib/site";
import type { SteamGame } from "@/lib/steam";

/*
    Seção "Fora do editor" (/about).

    Antes: três cards iguais (ícone, texto, pílulas) — informativos, mas sem vida. Agora
    cada hobby tem um "palco" próprio, com a identidade do serviço/time a que se refere:

      · Games   → ranking por horas no estilo do perfil da Steam (capa, horas, barra). Jogos
                  da Steam vêm de /api/steam; o Fortnite (Epic, sem API de horas) entra com
                  horas informadas em lib/about.ts e é ordenado junto.
      · Música  → o mesmo widget "tocadas recentemente" do README do GitHub (3 faixas).

    Os dois cartões têm a mesma altura (grade esticada) e o palco de cada um preenche o
    espaço: ranking e widget têm ~o mesmo tamanho, então nenhum fica com vazio embaixo.

    Só animam transform e opacity (nada de width/height/top/left) e tudo respeita
    movimento reduzido (useMotionOff). O contorno de marca vem de tokens --brand-* e dos
    dados em lib/about.ts; não há link de Spotify/Steam inventado — ver lib/site.ts.
*/

const ICONS: Record<Hobby["id"], React.ElementType> = {
  games: Gamepad2,
  music: Music,
};

const BRAND: Record<Hobby["id"], { color: string; label: string }> = {
  games: { color: "var(--brand-steam)", label: "// steam.library" },
  music: { color: "var(--brand-spotify)", label: "// spotify.now" },
};

/** Tint translúcido de uma cor (aceita hex ou var()) — fundo/contorno de marca sem gradiente. */
const tint = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

function Chip({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <li
      className="rounded-full px-2.5 py-0.5 font-mono text-xs border"
      style={{ backgroundColor: tint(color, 12), borderColor: tint(color, 30), color: "var(--text-secondary)" }}
    >
      {children}
    </li>
  );
}

/* Casca comum: inclinação 3D leve (igual aos cards de projeto), cabeçalho e rodapé. */
function Shell({
  hobby,
  children,
  footer,
}: {
  hobby: Hobby;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const tilt = useTilt(3);
  const Icon = ICONS[hobby.id];
  const brand = BRAND[hobby.id];
  return (
    <motion.li
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={appleSpring}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      className="group flex flex-col gap-5 p-5 sm:p-6 rounded-xl border"
      style={{
        ...tilt.style,
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border-default)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className="w-10 h-10 rounded-[10px] flex items-center justify-center border"
          style={{ backgroundColor: tint(brand.color, 14), borderColor: tint(brand.color, 32) }}
        >
          <Icon className="w-5 h-5" style={{ color: brand.color }} aria-hidden="true" />
        </span>
        <span className="font-mono text-xs whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
          {brand.label}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg font-medium tracking-tight">{hobby.name}</h3>
        {hobby.description && (
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {hobby.description}
          </p>
        )}
      </div>

      {/* Palco do cartão: ocupa o espaço livre, então os dois cartões ficam preenchidos. */}
      <div className="flex-1 flex flex-col min-h-[148px]">{children}</div>

      <div className="mt-auto flex flex-col gap-3">
        <ul className="flex flex-wrap gap-1.5" aria-label={`Exemplos de ${hobby.name}`}>
          {hobby.tags.map((tag) => (
            <Chip key={tag} color={brand.color}>
              {tag}
            </Chip>
          ))}
        </ul>
        {footer}
      </div>
    </motion.li>
  );
}

function ExternalPill({ href, label, color }: { href: string; label: string; color: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="self-start inline-flex items-center gap-1.5 min-h-9 px-3 rounded-full border text-xs font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ide-accent)]"
      style={{ borderColor: tint(color, 40), color: "var(--text-primary)" }}
    >
      <ExternalLink className="w-3.5 h-3.5" style={{ color }} aria-hidden="true" />
      {label}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}

/* ------------------------------ GAMES ------------------------------ */

/*
    Ranking por horas, no estilo do bloco "jogos recentes" do perfil da Steam: capa em
    cápsula, nome, horas e uma barra proporcional ao líder. Dados de /api/steam (perfil
    público, cache de 1h). Enquanto carrega mostra esqueleto; se a rota falhar (perfil
    privado, Steam fora do ar) cai na estante estática de pôsteres — a página nunca quebra.
*/

type SteamState = { status: "loading" } | { status: "error" } | { status: "ok"; games: SteamGame[] };

function useSteamGames(): SteamState {
  const [state, setState] = useState<SteamState>({ status: "loading" });
  useEffect(() => {
    if (!STEAM.profileUrl) {
      setState({ status: "error" });
      return;
    }
    const ctrl = new AbortController();
    fetch("/api/steam", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { games?: SteamGame[] }) =>
        setState(data.games?.length ? { status: "ok", games: data.games } : { status: "error" }),
      )
      .catch((e: unknown) => {
        if ((e as { name?: string })?.name !== "AbortError") setState({ status: "error" });
      });
    return () => ctrl.abort();
  }, []);
  return state;
}

const formatHours = (h: number) => (h >= 10 ? `${Math.round(h)} h` : `${h.toFixed(1).replace(".", ",")} h`);

/** Quantas linhas o ranking mostra — casa com a altura do widget do Spotify (3 faixas). */
const RANK_LIMIT = 4;

interface RankRow {
  key: string;
  name: string;
  hours: number | null;
  cover: string | null;
  url: string;
  lastPlayed: string | null;
  /** Rótulo da plataforma só quando não é a Steam. */
  platform: string | null;
}

/** Steam (automático) + jogos fora da Steam com horas informadas, ordenados por horas. */
function buildRows(steam: SteamGame[]): RankRow[] {
  const rows: RankRow[] = steam.map((g) => ({
    key: `steam-${g.appId}`,
    name: g.name,
    hours: g.hours,
    cover: g.cover,
    url: g.url,
    lastPlayed: g.lastPlayed,
    platform: null,
  }));
  for (const g of GAMES as readonly GameEntry[]) {
    if (g.platform === "steam") continue;
    rows.push({ key: `${g.platform}-${g.name}`, name: g.name, hours: g.hours ?? null, cover: g.cover ?? null, url: g.url ?? "#", lastPlayed: null, platform: "Epic" });
  }
  return rows
    .sort((a, b) => (b.hours ?? -1) - (a.hours ?? -1))
    .slice(0, RANK_LIMIT);
}

function SteamRanking({ games }: { games: SteamGame[] }) {
  const rows = buildRows(games);
  const max = Math.max(...rows.map((r) => r.hours ?? 0), 1);
  return (
    <div className="flex-1 flex flex-col gap-3">
      <span className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
        {"// ranking · horas jogadas"}
      </span>
      <ol className="flex-1 flex flex-col justify-between gap-2.5" aria-label="Jogos com mais horas">
        {rows.map((row, i) => (
          <motion.li key={row.key} whileHover={{ x: 3 }} transition={appleSpring}>
            <a
              href={row.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ide-accent)]"
              title={row.lastPlayed ? `${row.name} — última vez em ${row.lastPlayed}` : row.name}
            >
              <span
                className="w-4 flex-shrink-0 font-mono text-sm text-center"
                style={{ color: i === 0 ? "var(--brand-steam)" : "var(--text-muted)" }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span
                className="relative flex-shrink-0 w-[118px] aspect-[184/69] rounded-md overflow-hidden border"
                style={{ backgroundColor: "var(--surface-sunken)", borderColor: "var(--border-subtle)" }}
              >
                {row.cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.cover}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: "50% 30%" }}
                  />
                )}
              </span>
              <span className="flex-1 min-w-0 flex flex-col gap-2">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="flex items-baseline gap-2 min-w-0">
                    <span className="text-[15px] font-medium truncate">{row.name}</span>
                    {row.platform && (
                      <span className="font-mono text-[10px] flex-shrink-0" style={{ color: "var(--text-muted)" }}>
                        {row.platform}
                      </span>
                    )}
                  </span>
                  <span
                    className="font-mono text-sm flex-shrink-0"
                    style={{ color: i === 0 ? "var(--brand-steam)" : "var(--text-secondary)" }}
                  >
                    {row.hours === null ? "—" : formatHours(row.hours)}
                  </span>
                </span>
                <span className="block h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: tint("var(--brand-steam)", 14) }} aria-hidden="true">
                  <motion.span
                    className="block h-full w-full rounded-full origin-left"
                    style={{ backgroundColor: "var(--brand-steam)", opacity: i === 0 ? 1 : 0.6 }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: Math.max((row.hours ?? 0) / max, 0.03) }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </span>
              </span>
            </a>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function SteamSkeleton() {
  return (
    <div className="flex-1 flex flex-col justify-between gap-2.5" aria-hidden="true">
      {Array.from({ length: RANK_LIMIT }, (_, i) => (
        <div key={i} className="flex items-center gap-3.5 animate-pulse motion-reduce:animate-none">
          <span className="w-4" />
          <span className="w-[118px] aspect-[184/69] rounded-md" style={{ backgroundColor: "var(--chip-bg)" }} />
          <span className="flex-1 h-3 rounded" style={{ backgroundColor: "var(--chip-bg)" }} />
        </div>
      ))}
    </div>
  );
}

function GamesShelf() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <ul className="grid grid-cols-2 gap-2.5 flex-1 min-h-[148px]" aria-label="Biblioteca de jogos">
      {GAMES.map((game) => {
        const on = active === game.name;
        return (
          <li key={game.name} className="min-w-0">
            <motion.button
              type="button"
              onPointerEnter={() => setActive(game.name)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(game.name)}
              onBlur={() => setActive(null)}
              animate={{ y: on ? -6 : 0 }}
              transition={appleSpring}
              className="relative w-full h-full overflow-hidden rounded-[10px] border flex flex-col items-center justify-center text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ide-accent)]"
              style={{
                backgroundColor: tint(game.accent, on ? 24 : 14),
                borderColor: tint(game.accent, on ? 85 : 38),
                boxShadow: on ? `0 10px 24px ${tint(game.accent, 28)}` : "none",
                transition: "background-color 0.25s, border-color 0.25s, box-shadow 0.25s",
              }}
              aria-label={`${game.name} — ${game.genre}`}
            >
              <motion.span
                className="font-mono text-xl font-medium"
                style={{ color: game.accent }}
                animate={{ scale: on ? 1.18 : 1, y: on ? -8 : 0 }}
                transition={appleSpring}
              >
                {game.mono}
              </motion.span>
              <motion.span
                className="absolute inset-x-0 bottom-0 px-1.5 pb-2 pt-4 flex flex-col"
                initial={false}
                animate={{ opacity: on ? 1 : 0, y: on ? 0 : 10 }}
                transition={{ duration: 0.22 }}
              >
                <span className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>
                  {game.name}
                </span>
                <span className="text-[10.5px] leading-tight" style={{ color: "var(--text-secondary)" }}>
                  {game.genre}
                </span>
              </motion.span>
            </motion.button>
          </li>
        );
      })}
    </ul>
  );
}

function GamesStage() {
  const steam = useSteamGames();
  if (steam.status === "loading") return <SteamSkeleton />;
  if (steam.status === "ok") return <SteamRanking games={steam.games} />;
  return <GamesShelf />;
}

/* ------------------------------ MÚSICA ----------------------------- */

const EQ = [0.45, 0.9, 0.6, 1, 0.5, 0.8, 0.35, 0.95, 0.55, 0.75, 0.4, 0.85];

function Equalizer({ off }: { off: boolean }) {
  return (
    <div className="flex items-end gap-[3px] h-full" aria-hidden="true">
      {EQ.map((h, i) => (
        <motion.span
          key={i}
          className="w-[5px] h-full rounded-full origin-bottom"
          style={{ backgroundColor: "var(--brand-spotify)", scaleY: h }}
          animate={off ? undefined : { scaleY: [h, 1, h * 0.35, 0.85, h] }}
          transition={{ duration: 1.1 + (i % 5) * 0.18, repeat: Infinity, ease: "easeInOut", delay: i * 0.06 }}
        />
      ))}
    </div>
  );
}

/*
    Mesmo widget "Spotify recently played" do README do perfil no GitHub (serviço
    spotify-recently-played, do Jeffrey C.): histórico das últimas faixas ouvidas, com
    capas e equalizador animado. É um <img> SVG — roda sem JavaScript de terceiros na
    página. Se não carregar (serviço fora do ar), cai no vinil + equalizador abaixo.
*/
const SPOTIFY_USER = SPOTIFY.profileUrl?.split("/").filter(Boolean).pop() ?? null;
const SPOTIFY_WIDGET = SPOTIFY_USER
  ? `https://spotify-recently-played.jeffreyca.workers.dev/svg?user=${encodeURIComponent(SPOTIFY_USER)}&count=3&width=520&time=0&duration=1`
  : null;

function MusicFallback() {
  const off = useMotionOff();
  return (
    <div className="h-[148px] flex items-center gap-5">
      {/* Vinil: gira enquanto o cartão está sob o cursor/foco. */}
      <div
        className="relative flex-shrink-0 w-[112px] h-[112px] rounded-full border flex items-center justify-center animate-spin [animation-duration:5s] [animation-play-state:paused] group-hover:[animation-play-state:running] group-focus-within:[animation-play-state:running] motion-reduce:animate-none"
        style={{ backgroundColor: "var(--surface-sunken)", borderColor: "var(--border-default)" }}
        aria-hidden="true"
      >
        <span className="absolute inset-[10px] rounded-full border" style={{ borderColor: "var(--border-subtle)" }} />
        <span className="absolute inset-[22px] rounded-full border" style={{ borderColor: "var(--border-subtle)" }} />
        <span className="absolute inset-[34px] rounded-full border" style={{ borderColor: "var(--border-subtle)" }} />
        <span className="relative w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--brand-spotify)" }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--bg-secondary)" }} />
        </span>
        <span className="absolute top-2 left-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2" style={{ backgroundColor: tint("var(--text-primary)", 35) }} />
      </div>
      <div className="flex-1 min-w-0 h-full flex flex-col justify-between py-1">
        <div className="h-[72px]">
          <Equalizer off={off} />
        </div>
        <span className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
          {"// em loop"}
        </span>
      </div>
    </div>
  );
}

function MusicStage() {
  const [failed, setFailed] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);

  if (SPOTIFY.embed && playerOpen) {
    return (
      <iframe
        title="Player do Spotify"
        src={`https://open.spotify.com/embed/${SPOTIFY.embed}?theme=0`}
        className="w-full h-[152px] rounded-[12px] border-0"
        allow="encrypted-media; clipboard-write; fullscreen"
        loading="lazy"
      />
    );
  }

  if (!SPOTIFY_WIDGET || failed) return <MusicFallback />;

  return (
    <div className="flex-1 flex flex-col gap-3">
      <span className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
        {"// tocadas recentemente"}
      </span>
      <motion.a
        href={SPOTIFY.profileUrl ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.015 }}
        transition={appleSpring}
        className="block my-auto rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ide-accent)]"
        aria-label="Últimas músicas ouvidas no Spotify (abre o perfil em nova aba)"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SPOTIFY_WIDGET}
          alt="Spotify: últimas músicas ouvidas"
          width={520}
          height={216}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="block w-full h-auto"
        />
      </motion.a>
      {SPOTIFY.embed && (
        <button
          type="button"
          onClick={() => setPlayerOpen(true)}
          className="self-start inline-flex items-center gap-1.5 min-h-9 px-3.5 rounded-full text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ide-accent)]"
          style={{ backgroundColor: "var(--brand-spotify)", color: "#0b0b0c" }}
        >
          <Play className="w-3.5 h-3.5" aria-hidden="true" fill="currentColor" />
          Ouvir
        </button>
      )}
    </div>
  );
}

/* ------------------------------ SEÇÃO ------------------------------ */

export function Hobbies() {
  const byId = (id: Hobby["id"]) => HOBBIES.find((h) => h.id === id)!;
  return (
    <motion.ul
      className="grid lg:grid-cols-2 gap-3 sm:gap-4"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      <Shell
        hobby={byId("games")}
        footer={STEAM.profileUrl ? <ExternalPill href={STEAM.profileUrl} label="Perfil na Steam" color="var(--brand-steam)" /> : undefined}
      >
        <GamesStage />
      </Shell>
      <Shell
        hobby={byId("music")}
        footer={SPOTIFY.profileUrl ? <ExternalPill href={SPOTIFY.profileUrl} label="Perfil no Spotify" color="var(--brand-spotify)" /> : undefined}
      >
        <MusicStage />
      </Shell>
    </motion.ul>
  );
}

export default Hobbies;
