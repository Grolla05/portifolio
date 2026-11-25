'use client';

import React, { useState } from 'react';

/*
    Botões de janela do macOS (decorativos) para os cards de código.

    Existia duplicado em app/page.tsx e app/not-found.tsx, com as cores em hex solto e
    glifos em font-bold (o design só usa pesos 400/500). Agora vem dos tokens
    --traffic-* de app/globals.css. aria-hidden: não fazem nada, não devem ser anunciados.
*/
const LIGHTS = [
  { color: 'var(--traffic-red)', glyph: '×', size: 'text-[8px]' },
  { color: 'var(--traffic-yellow)', glyph: '−', size: 'text-[8px]' },
  { color: 'var(--traffic-green)', glyph: '+', size: 'text-[7px]' },
];

export function TrafficLights() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex items-center gap-1.5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-hidden="true"
    >
      {LIGHTS.map(({ color, glyph, size }) => (
        <div
          key={glyph}
          className={`w-3 h-3 rounded-full shadow-sm border border-black/10 flex items-center justify-center ${size} font-medium text-black/60 leading-none select-none`}
          style={{ backgroundColor: color }}
        >
          <span className={hovered ? 'opacity-100' : 'opacity-0'}>{glyph}</span>
        </div>
      ))}
    </div>
  );
}
