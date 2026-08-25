'use client';

import { useRef, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import anime from 'animejs';

interface UseAnimeRevealOptions {
    delay?: number;
    duration?: number;
    translateY?: number;
    threshold?: number;
}

export function useAnimeReveal<T extends HTMLElement = HTMLDivElement>({
    delay = 0,
    duration = 400,
    translateY = 12,
    threshold = 0.15,
}: UseAnimeRevealOptions = {}) {
    const ref = useRef<T>(null);
    const prefersReduced = useReducedMotion();

    useEffect(() => {
        const el = ref.current;
        if (!el || prefersReduced) return;

        el.style.opacity = '0';
        el.style.transform = `translateY(${translateY}px)`;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                anime({
                    targets: el,
                    opacity: [0, 1],
                    translateY: [translateY, 0],
                    duration,
                    delay,
                    easing: 'cubicBezier(0.4, 0, 0.2, 1)',
                });
                observer.disconnect();
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [delay, duration, translateY, threshold, prefersReduced]);

    return ref;
}
