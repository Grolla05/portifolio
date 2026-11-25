import type { Transition, Variants } from 'framer-motion';

/*
    Tokens de motion — fonte única de tempo e curva do site.

    Antes cada componente escolhia a própria duração (0.25, 0.3, 0.35…) e a própria curva,
    e o site não "respirava" num ritmo só. As mesmas durações existem como CSS custom
    properties em app/globals.css (--dur-*, --ease-out-expo) para as animações em CSS
    puro (primeiro paint do hero, View Transitions); mexeu aqui, mexe lá.
*/
export const ease = {
  /** Desaceleração longa: entra rápido e assenta devagar. Curva padrão de "cena". */
  outExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  /** Para movimentos que começam e terminam parados (linhas desenhadas, wipes). */
  inOutQuint: [0.83, 0, 0.17, 1] as [number, number, number, number],
  /** Curva padrão do Material/Apple para microinterações. */
  standard: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

/** Durações em segundos. Interação ≤ md; cena ≤ xl. */
export const dur = {
  xs: 0.12,
  sm: 0.2,
  md: 0.3,
  lg: 0.6,
  xl: 0.9,
};

/**
 * Apple HIG Spring Transitions
 */
export const appleSpring: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
  mass: 0.8,
};

export const gentleSpring: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
  mass: 1,
};

export const bouncySpring: Transition = {
  type: 'spring',
  stiffness: 450,
  damping: 20,
  mass: 0.8,
};

/**
 * Spring-driven Animation Variants
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: appleSpring,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: dur.md, ease: ease.outExpo },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: appleSpring,
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: appleSpring,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: appleSpring,
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

/*
    Variantes de "cena" (Sprint 2 do redesign cinematográfico).
*/

/**
 * Palavra subindo de dentro de uma máscara (`overflow: hidden` no pai).
 * É o efeito de "título de trailer": só transform, então não causa reflow.
 */
export const wordReveal: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: dur.xl, ease: ease.outExpo },
  },
};

/** Traço SVG se desenhando (pathLength é transform-free: anima stroke-dashoffset). */
export const drawPath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.2, ease: ease.inOutQuint },
      opacity: { duration: dur.xs },
    },
  },
};

/** Reveal de seção ao rolar: sobe 24px e assenta com a curva de cena. */
export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: dur.lg, ease: ease.outExpo },
  },
};

/**
 * Props prontas para "anima quando entra na tela, uma vez só".
 * margin negativa: espera o bloco entrar 15% para não animar algo que mal apareceu.
 */
export const revealOnScroll = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '0px 0px -15% 0px' },
} as const;
