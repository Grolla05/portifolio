import React from 'react';

/*
    Texto "digitado" caractere a caractere — em CSS puro.

    Cada caractere é um <span class="type-char"> com animation-delay crescente. Não usa
    JS nem estado, então funciona no HTML do servidor (o texto existe desde o primeiro
    byte, só aparece em sequência) e não depende de hidratação para ficar legível.
    Sem `width` animado: só opacidade por caractere, sem reflow.

    Acessibilidade: os caracteres soltos ficam aria-hidden e o texto inteiro vai num
    sr-only — leitor de tela não soletra "/", "/", " ", "F"…
*/
interface TypewriterProps {
  text: string;
  /** Atraso antes do primeiro caractere, em ms. */
  delay?: number;
  /** Intervalo entre caracteres, em ms. */
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: 'p' | 'span';
}

export function Typewriter({ text, delay = 0, speed = 18, className, style, as = 'p' }: TypewriterProps) {
  const Tag = as;
  return (
    <Tag className={className} style={style}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {Array.from(text).map((char, i) => (
          <span
            key={i}
            className="type-char"
            style={{ '--reveal-delay': `${delay + i * speed}ms` } as React.CSSProperties}
          >
            {char}
          </span>
        ))}
      </span>
    </Tag>
  );
}

/** Duração total da digitação, para encadear o próximo passo da cena. */
export function typingDuration(text: string, speed = 18) {
  return Array.from(text).length * speed;
}
