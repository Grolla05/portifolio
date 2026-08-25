'use client';

import { useRef, useEffect, type ElementType, type CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';
import anime from 'animejs';

export interface SplitTextProps {
    children: string;
    as?: ElementType;
    delay?: number;
    charDelay?: number;
    className?: string;
    style?: CSSProperties;
}

export function SplitText({
    children,
    as: Tag = 'span',
    delay = 0,
    charDelay = 24,
    className,
    style,
}: SplitTextProps) {
    const ref = useRef<HTMLElement>(null);
    const prefersReduced = useReducedMotion();

    useEffect(() => {
        if (prefersReduced || !ref.current) return;
        const spans = ref.current.querySelectorAll<HTMLSpanElement>('[data-char]');
        const anim = anime({
            targets: spans,
            opacity: [0, 1],
            translateY: [6, 0],
            duration: 380,
            delay: anime.stagger(charDelay, { start: delay }),
            easing: 'cubicBezier(0.4, 0, 0.2, 1)',
        });
        return () => anim.pause();
    }, [delay, charDelay, prefersReduced]);

    return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Tag ref={ref as any} className={className} style={style} aria-label={children}>
            {[...children].map((char, i) => (
                <span
                    key={i}
                    data-char=""
                    aria-hidden="true"
                    style={{
                        display: 'inline-block',
                        opacity: prefersReduced ? 1 : 0,
                        willChange: 'opacity, transform',
                    }}
                >
                    {char === ' ' ? ' ' : char}
                </span>
            ))}
        </Tag>
    );
}
