import { ImageResponse } from 'next/og';
import { SITE_NAME } from '@/lib/site';

/*
    Ícone de home screen do iOS (180x180).

    Gerado em código, pelo mesmo motivo de app/opengraph-image.tsx: não sobra binário
    para manter sincronizado com a paleta. O desenho é o mesmo `>_` de app/icon.svg —
    prompt de terminal, que rima com o `>` do hero e com a estética de IDE do site.

    Diferenças em relação ao favicon SVG:
      - iOS ignora transparência e aplica o próprio recorte, então o fundo é sólido e
        o raio de canto fica por conta do sistema (nada de borderRadius aqui);
      - satori não desenha <path>, só flexbox — o chevron é montado com dois retângulos
        rotacionados e o cursor é um terceiro retângulo.
*/

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';
export const alt = SITE_NAME;

// Espelham os tokens dark de app/globals.css (satori não lê variáveis CSS).
const BG = '#1e1e1e';
const ACCENT = '#0a84ff';
const TEXT = '#f5f5f7';

const STROKE = 14;
const ARM = 52;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: BG,
        }}
      >
        {/* Chevron ">" — dois braços rotacionados a partir de um vértice comum. */}
        <div
          style={{
            display: 'flex',
            position: 'relative',
            width: ARM,
            height: ARM * 1.5,
            marginRight: 14,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: ARM * 0.75 - STROKE / 2,
              left: 0,
              width: ARM,
              height: STROKE,
              borderRadius: STROKE / 2,
              background: ACCENT,
              transform: `translateY(${-ARM / 2.6}px) rotate(45deg)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: ARM * 0.75 - STROKE / 2,
              left: 0,
              width: ARM,
              height: STROKE,
              borderRadius: STROKE / 2,
              background: ACCENT,
              transform: `translateY(${ARM / 2.6}px) rotate(-45deg)`,
            }}
          />
        </div>

        {/* Cursor "_" alinhado à base do chevron. */}
        <div
          style={{
            display: 'flex',
            width: 46,
            height: STROKE,
            borderRadius: STROKE / 2,
            background: TEXT,
            marginTop: ARM * 0.9,
          }}
        />
      </div>
    ),
    size,
  );
}
