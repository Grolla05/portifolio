import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Typewriter, typingDuration } from '@/components/motion/typewriter';
import { SplitWords } from '@/components/motion/split-words';
import { CountUp } from '@/components/motion/count-up';
import { buildTracePath } from '@/components/motion/signal-trace';
import { ProfileCard, PROFILE_TS } from '@/components/home/profile-card';

/*
    Componentes de cena (Sprint 2). O que importa testar não é a animação em si (CSS),
    e sim que o CONTEÚDO está completo desde o primeiro render — sem depender de JS,
    hidratação ou do fim da animação — e que leitores de tela recebem texto inteiro.
*/

describe('Typewriter', () => {
  it('renderiza o texto completo para leitor de tela e um span por caractere', () => {
    const { container } = render(<Typewriter text="// olá" delay={100} speed={20} />);
    expect(screen.getByText('// olá')).toHaveClass('sr-only');
    const chars = container.querySelectorAll('.type-char');
    expect(chars).toHaveLength(6);
    expect((chars[5] as HTMLElement).style.getPropertyValue('--reveal-delay')).toBe('200ms');
  });

  it('calcula a duração da digitação', () => {
    expect(typingDuration('abcd', 18)).toBe(72);
  });
});

describe('SplitWords', () => {
  it('mantém o texto legível com espaços entre as máscaras', () => {
    const { container } = render(
      <h1>
        <SplitWords text="Software que conversa" />
      </h1>,
    );
    expect(container.querySelector('h1')?.textContent).toBe('Software que conversa');
    expect(container.querySelectorAll('.word-mask')).toHaveLength(3);
  });
});

describe('CountUp', () => {
  it('mostra o placeholder enquanto o dado não chegou', () => {
    render(<CountUp value={37} ready={false} />);
    expect(screen.getByText('–')).toBeInTheDocument();
  });

  it('expõe o valor final para leitor de tela', () => {
    render(<CountUp value={37} />);
    expect(screen.getByText('37', { selector: '.sr-only' })).toBeInTheDocument();
  });
});

describe('buildTracePath', () => {
  it('gera um path SVG válido que cresce com a amplitude', () => {
    const low = buildTracePath(4, 80);
    const high = buildTracePath(20, 80);
    expect(low.startsWith('M0 40')).toBe(true);
    expect(low).not.toBe(high);
  });
});

describe('ProfileCard', () => {
  it('renderiza o código inteiro já no primeiro render', () => {
    const { container } = render(<ProfileCard />);
    const code = container.querySelector('code')?.textContent ?? '';
    // Mesmo conteúdo que o "Copiar profile.ts" leva para a área de transferência.
    expect(code.trim()).toBe(PROFILE_TS.trim());
  });
});
