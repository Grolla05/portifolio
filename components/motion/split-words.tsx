import React from 'react';

/*
    Palavra que sobe de dentro de uma máscara — o efeito de "título de trailer".

    CSS puro (.word-mask / .word em app/globals.css): o título existe no HTML do servidor
    e anima no primeiro frame, sem esperar hidratação. Só `transform`, sem reflow.
    Os espaços entre palavras ficam FORA das máscaras, então o texto copiado e o lido
    por leitor de tela continuam normais ("Software que conversa…").
*/
interface MaskWordProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function MaskWord({ children, delay = 0, className, style }: MaskWordProps) {
  return (
    <span className="word-mask">
      <span
        className={className ? `word ${className}` : 'word'}
        style={{ ...style, '--reveal-delay': `${delay}ms` } as React.CSSProperties}
      >
        {children}
      </span>
    </span>
  );
}

interface SplitWordsProps {
  text: string;
  delay?: number;
  /** Intervalo entre palavras, em ms. */
  stagger?: number;
}

/** Quebra um texto em palavras mascaradas com stagger. */
export function SplitWords({ text, delay = 0, stagger = 60 }: SplitWordsProps) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, i) => (
        <React.Fragment key={`${word}-${i}`}>
          <MaskWord delay={delay + i * stagger}>{word}</MaskWord>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </>
  );
}
