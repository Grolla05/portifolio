import { ImageResponse } from 'next/og';
import { CASE_STUDIES, getCaseStudyBySlug } from '@/lib/case-studies';
import { SITE_NAME, SITE_URL } from '@/lib/site';

/*
    Card de compartilhamento por estudo de caso (1200x630).

    Mesma linguagem visual de app/opengraph-image.tsx, com o título e a tagline do
    projeto: um link de /projects/solar-points colado no LinkedIn mostra o projeto, não o
    cartão genérico do site. Mesmas restrições do satori: só flexbox, `display:flex` em
    todo elemento com mais de um filho, cores literais (não lê variáveis CSS).
*/

export const alt = `Estudo de caso — ${SITE_NAME}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

// Espelham os tokens dark de app/globals.css.
const BG = '#1e1e1e';
const SURFACE = '#252526';
const BORDER = 'rgba(255,255,255,0.12)';
const TEXT = '#f5f5f7';
const MUTED = '#a1a1a6';
const ACCENT = '#0a84ff';
const COMMENT = '#8b949e';
const STRING = '#a5d6ff';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  const title = study?.title ?? 'Estudo de caso';
  const tagline = study?.tagline ?? '';
  const stack = (study?.stack ?? []).slice(0, 5);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: BG,
          padding: 56,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            borderRadius: 24,
            border: `1px solid ${BORDER}`,
            background: SURFACE,
            padding: 56,
          }}
        >
          <div style={{ display: 'flex', fontSize: 26, color: COMMENT }}>
            {`// estudo de caso · ${SITE_NAME}`}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: title.length > 28 ? 64 : 80,
              color: TEXT,
              fontWeight: 600,
              marginTop: 28,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 32,
              color: MUTED,
              marginTop: 28,
              lineHeight: 1.35,
              maxWidth: 980,
            }}
          >
            {tagline}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 36 }}>
            {stack.map((tech) => (
              <div
                key={tech}
                style={{
                  display: 'flex',
                  fontSize: 24,
                  color: STRING,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 10,
                  padding: '6px 16px',
                  marginRight: 12,
                  marginBottom: 12,
                }}
              >
                {tech}
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 'auto',
              fontSize: 24,
              color: MUTED,
            }}
          >
            <div style={{ display: 'flex' }}>{SITE_URL.replace(/^https?:\/\//, '')}</div>
            <div style={{ display: 'flex', color: ACCENT }}>@Grolla05</div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
