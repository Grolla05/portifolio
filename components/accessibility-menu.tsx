'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import { Accessibility, X, Type, Contrast, Zap, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { appleSpring } from '@/lib/animations/variants';

interface A11ySettings {
    fontSize: 'normal' | 'large' | 'xlarge';
    highContrast: boolean;
    reduceMotion: boolean;
}

const STORAGE_KEY = 'a11y-settings';
const defaults: A11ySettings = { fontSize: 'normal', highContrast: false, reduceMotion: false };

const panelVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: -6 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
    exit: { opacity: 0, scale: 0.95, y: -6, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] as [number, number, number, number] } },
};

export default function AccessibilityMenu() {
    const [open, setOpen] = useState(false);
    const systemReducedMotion = useReducedMotion();
    const [settings, setSettings] = useState<A11ySettings>(defaults);
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setSettings({ ...defaults, ...JSON.parse(saved) });
        } catch {}
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const html = document.documentElement;
        html.classList.remove('a11y-text-large', 'a11y-text-xlarge');
        if (settings.fontSize === 'large') html.classList.add('a11y-text-large');
        if (settings.fontSize === 'xlarge') html.classList.add('a11y-text-xlarge');
        html.classList.toggle('a11y-high-contrast', settings.highContrast);
        html.classList.toggle('a11y-reduce-motion', settings.reduceMotion);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch {}
    }, [settings, mounted]);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const animOff = systemReducedMotion || settings.reduceMotion;
    const isDark = resolvedTheme === 'dark';

    const update = <K extends keyof A11ySettings>(key: K, value: A11ySettings[K]) =>
        setSettings(s => ({ ...s, [key]: value }));

    if (!mounted) return null;

    /*
        Superfície do painel via TOKENS, não rgba hardcoded.
        Antes usava `rgba(22,27,34,.82)` / `rgba(246,248,250,.90)` — a paleta GitHub antiga
        (#161B22), que não bate com a slate macOS atual do site (--bg-secondary = #252526).
        Era essa a origem da cor destoante.

        Também caiu o `backdrop-filter`: este painel é filho de <header>, que já tem
        `backdrop-blur-xl`. Um ancestral com backdrop-filter vira o backdrop root, então o
        blur daqui não amostrava a página — só deixava o conteúdo atravessar sem borrar
        (era o código do editor aparecendo através do menu). Superfície opaca resolve e
        garante contraste do texto.
    */
    const panelSurface = {
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
    };

    const toggleRows: { key: 'highContrast' | 'reduceMotion'; label: string; desc: string; icon: React.ElementType }[] = [
        { key: 'highContrast', label: 'High Contrast', desc: 'Increase color contrast', icon: Contrast },
        { key: 'reduceMotion', label: 'Reduce Motion', desc: 'Minimize animations', icon: Zap },
    ];

    return (
        <div ref={containerRef} className="relative h-full flex items-center">
            {/*
                Trigger com a MESMA estilização dos itens do navbar (components/header.tsx):
                container `glass-panel rounded-full p-1`, item `rounded-full` com as mesmas
                métricas (py-1.5, ícone w-3.5) e pill de estado ativo por cima.
                O pill NÃO usa `layoutId="headerNavPill"` de propósito — compartilhar o id faria
                o indicador voar da nav até aqui ao abrir o menu.
            */}
            <div className="flex items-center p-1 rounded-full glass-panel">
                <motion.button
                    onClick={() => setOpen(v => !v)}
                    whileTap={animOff ? {} : { scale: 0.96 }}
                    transition={appleSpring}
                    aria-label="Accessibility options"
                    aria-expanded={open}
                    aria-haspopup="dialog"
                    title="Opções de acessibilidade"
                    className="relative flex items-center px-3 py-1.5 rounded-full transition-colors duration-200 select-none cursor-pointer"
                    style={{ color: open ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                >
                    <AnimatePresence>
                        {open && (
                            <motion.span
                                key="a11yPill"
                                initial={animOff ? {} : { opacity: 0, scale: 0.9 }}
                                animate={animOff ? {} : { opacity: 1, scale: 1 }}
                                exit={animOff ? {} : { opacity: 0, scale: 0.9 }}
                                transition={appleSpring}
                                className="absolute inset-0 rounded-full bg-white/70 dark:bg-white/10 shadow-sm border border-white/30 dark:border-white/15"
                            />
                        )}
                    </AnimatePresence>
                    <Accessibility className="w-3.5 h-3.5 relative z-10 text-primary" />
                </motion.button>
            </div>

            {/* Dropdown panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="panel"
                        variants={animOff ? ({} as Variants) : panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Accessibility settings"
                        className="absolute top-full right-0 mt-2 w-72 rounded-2xl p-5 z-50 origin-top-right elevation-2"
                        style={panelSurface}
                    >
                        {/* Panel header */}
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <Accessibility className="w-4 h-4" style={{ color: 'var(--ide-accent)' }} />
                                <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                    Accessibility
                                </span>
                            </div>
                            <button onClick={() => setOpen(false)} aria-label="Close" style={{ color: 'var(--text-muted)' }}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Theme */}
                        <div className="mb-5">
                            <div className="flex items-center gap-1.5 mb-2.5">
                                {isDark
                                    ? <Moon className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                                    : <Sun className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />}
                                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                                    Theme
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                                {([
                                    { value: 'light', label: 'Light', icon: Sun },
                                    { value: 'dark',  label: 'Dark',  icon: Moon },
                                ] as const).map(({ value, label, icon: Icon }) => {
                                    const active = resolvedTheme === value;
                                    return (
                                        <motion.button
                                            key={value}
                                            onClick={() => setTheme(value)}
                                            whileHover={animOff ? {} : { scale: 1.03 }}
                                            whileTap={animOff ? {} : { scale: 0.97 }}
                                            aria-pressed={active}
                                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors font-medium text-xs tracking-tight"
                                            style={{
                                                background: active ? 'var(--accent-soft)' : 'var(--surface-subtle)',
                                                border: '1px solid',
                                                borderColor: active ? 'var(--accent-ring)' : 'var(--border-subtle)',
                                                color: active ? 'var(--ide-accent-text)' : 'var(--text-secondary)',
                                            }}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            <span>{label}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Font Size */}
                        <div className="mb-5">
                            <div className="flex items-center gap-1.5 mb-2.5">
                                <Type className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                                    Font Size
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                                {([
                                    { value: 'normal', label: 'A', sublabel: 'Default' },
                                    { value: 'large',  label: 'A', sublabel: 'Large'   },
                                    { value: 'xlarge', label: 'A', sublabel: 'X-Large' },
                                ] as const).map(({ value, label, sublabel }) => {
                                    const active = settings.fontSize === value;
                                    return (
                                        <motion.button
                                            key={value}
                                            onClick={() => update('fontSize', value)}
                                            whileHover={animOff ? {} : { scale: 1.03 }}
                                            whileTap={animOff ? {} : { scale: 0.97 }}
                                            aria-pressed={active}
                                            className="flex flex-col items-center py-2.5 rounded-xl transition-colors"
                                            style={{
                                                background: active ? 'var(--accent-soft)' : 'var(--surface-subtle)',
                                                border: '1px solid',
                                                borderColor: active ? 'var(--accent-ring)' : 'var(--border-subtle)',
                                                color: active ? 'var(--ide-accent-text)' : 'var(--text-secondary)',
                                            }}
                                        >
                                            <span
                                                className="font-medium leading-none mb-1"
                                                style={{
                                                    fontSize: value === 'normal' ? '14px' : value === 'large' ? '18px' : '22px',
                                                }}
                                            >
                                                {label}
                                            </span>
                                            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                                {sublabel}
                                            </span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Toggle rows */}
                        <div
                            className="rounded-xl overflow-hidden"
                            style={{ border: '1px solid var(--border-subtle)', background: 'var(--surface-subtle)' }}
                        >
                            {toggleRows.map(({ key, label, desc, icon: Icon }, idx) => {
                                const active = settings[key];
                                return (
                                    <div
                                        key={key}
                                        className="flex items-center justify-between px-4 py-3"
                                        style={{ borderTop: idx > 0 ? '1px solid var(--border-subtle)' : undefined }}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Icon
                                                className="w-4 h-4 flex-shrink-0"
                                                style={{ color: active ? 'var(--ide-accent)' : 'var(--text-muted)' }}
                                            />
                                            <div>
                                                <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                                                    {label}
                                                </p>
                                                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                                    {desc}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            role="switch"
                                            aria-checked={active}
                                            aria-label={label}
                                            onClick={() => update(key, !active)}
                                            className="relative w-9 h-5 rounded-full flex-shrink-0 transition-colors"
                                            style={{ background: active ? 'var(--ide-accent)' : 'var(--switch-track)' }}
                                        >
                                            <motion.span
                                                layout
                                                transition={
                                                    animOff
                                                        ? { duration: 0 }
                                                        : { type: 'spring', stiffness: 500, damping: 35 }
                                                }
                                                className="absolute top-0.5 w-4 h-4 rounded-full"
                                                style={{
                                                    background: '#ffffff',
                                                    left: active ? 'calc(100% - 18px)' : '2px',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                                                }}
                                            />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Reset */}
                        <motion.button
                            onClick={() => setSettings(defaults)}
                            whileHover={animOff ? {} : { opacity: 0.8 }}
                            whileTap={animOff ? {} : { scale: 0.98 }}
                            className="w-full mt-3 py-2 rounded-xl text-xs font-medium transition-colors"
                            style={{
                                background: 'var(--surface-subtle)',
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--border-subtle)',
                            }}
                        >
                            Reset to defaults
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
