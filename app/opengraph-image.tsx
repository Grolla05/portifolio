import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/site';

/*
    Imagem de compartilhamento (OpenGraph / Twitter), 1200x630.

    Gerada em código com next/og em vez de um PNG estático: assim o card acompanha
    automaticamente mudanças de nome/tagline e não existe binário para manter sincronizado.

    Restrições do satori (motor por trás do ImageResponse):
      - só flexbox; sem grid, sem backdrop-filter, sem box-shadow em cascata
      - todo elemento com mais de um filho precisa de display:flex explícito
      - fonte: usa a embutida do Next (Noto Sans). Não busca webfont externa de propósito —
        seria uma dependência de rede no build e um ponto de falha no card.
*/

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Espelham os tokens dark de app/globals.css (satori não lê variáveis CSS).
const BG = '#1e1e1e';
const SURFACE = '#252526';
const BORDER = 'rgba(255,255,255,0.12)';
const TEXT = '#f5f5f7';
const MUTED = '#a1a1a6';
const ACCENT = '#0a84ff';
const KEYWORD = '#ff7b72';
const STRING = '#a5d6ff';
const COMMENT = '#8b949e';

function TrafficLight({ color }: { color: string }) {
  return (
    <div
      style={{
        width: 14,
        height: 14,
        borderRadius: 7,
        background: color,
        marginRight: 8,
      }}
    />
  );
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: BG,
          padding: 56,
        }}
      >
        {/* Janela estilo editor */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            borderRadius: 24,
            border: `1px solid ${BORDER}`,
            background: SURFACE,
            overflow: 'hidden',
          }}
        >
          {/* Barra de título com os semáforos do macOS */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 52,
              paddingLeft: 24,
              paddingRight: 24,
              borderBottom: `1px solid ${BORDER}`,
            }}
          >
            <TrafficLight color="#ff5f56" />
            <TrafficLight color="#ffbd2e" />
            <TrafficLight color="#27c93f" />
            <div
              style={{
                display: 'flex',
                marginLeft: 20,
                fontSize: 20,
                color: MUTED,
              }}
            >
              portfolio.tsx
            </div>
          </div>

          {/* Corpo */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              paddingLeft: 56,
              paddingRight: 56,
              paddingTop: 48,
            }}
          >
            <div style={{ display: 'flex', fontSize: 26, color: COMMENT, marginBottom: 20 }}>
              {'// hello world'}
            </div>

            <div style={{ display: 'flex', fontSize: 86, color: TEXT, fontWeight: 600 }}>
              {SITE_NAME}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginTop: 18 }}>
              <div style={{ display: 'flex', fontSize: 40, color: ACCENT, marginRight: 14 }}>
                {'>'}
              </div>
              <div style={{ display: 'flex', fontSize: 40, color: '#ffa657' }}>
                {SITE_TAGLINE}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginTop: 44, fontSize: 27 }}>
              <div style={{ display: 'flex', color: KEYWORD, marginRight: 12 }}>const</div>
              <div style={{ display: 'flex', color: TEXT, marginRight: 12 }}>stack</div>
              <div style={{ display: 'flex', color: MUTED, marginRight: 12 }}>=</div>
              <div style={{ display: 'flex', color: STRING }}>
                [&quot;C&quot;, &quot;C++&quot;, &quot;Python&quot;, &quot;TypeScript&quot;]
              </div>
            </div>

            {/* Rodapé da janela */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 'auto',
                marginBottom: 36,
              }}
            >
              <div style={{ display: 'flex', fontSize: 24, color: MUTED }}>
                {SITE_URL.replace(/^https?:\/\//, '')}
              </div>
              <div style={{ display: 'flex', fontSize: 24, color: MUTED }}>@Grolla05</div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
