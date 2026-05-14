'use client';

import React from 'react';
import { Gamepad2, X, Music, Trophy } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations/variants';

const hobbies = [
    {
        icon: Gamepad2,
        name: 'Gaming',
        description: 'Explorando novos mundos e desafios estratégicos.',
        tags: ['Valorant', 'CS-GO 2', 'Fortnite'],
    },
    {
        icon: Music,
        name: 'Music',
        description: 'Jovem de 20 anos com alma de 67 (Spotify).',
        tags: ['MPB', 'Rock', 'Pop'],
    },
    {
        icon: Trophy,
        name: 'Futebol & Basquete',
        description: 'Amante dos dois esportes!!',
        tags: ['Corinthians', 'Lakers'],
    },
];

export default function Hobbie() {
    const prefersReduced = useReducedMotion();

    return (
        <>
            {/* CENTER - CODE EDITOR */}
            <main
                className="flex-1 flex flex-col border-r min-h-[500px] transition-colors duration-300"
                style={{ borderColor: 'var(--border-default)' }}
            >
                <div
                    className="h-10 flex border-b transition-colors duration-300"
                    style={{ borderColor: 'var(--border-default)' }}
                >
                    <div
                        className="px-6 flex items-center border-r border-t-2 font-mono text-sm italic transition-colors duration-300"
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-default)',
                            borderTopColor: '#FFA657',
                            color: 'var(--text-primary)',
                        }}
                    >
                        <span>hobbies.ts</span>
                        <X className="w-3 h-3 ml-3 cursor-pointer" style={{ color: 'var(--text-muted)' }} />
                    </div>
                </div>

                <div
                    className="flex-1 p-6 overflow-y-auto transition-colors duration-300"
                    style={{ backgroundColor: 'var(--bg-primary)' }}
                >
                    <div className="flex font-mono text-sm leading-relaxed">
                        <div
                            className="flex flex-col text-right pr-6 select-none transition-colors duration-300 flex-shrink-0"
                            style={{ color: 'var(--syntax-comment)' }}
                        >
                            {Array.from({ length: 45 }, (_, i) => (
                                <span key={i + 1}>{i + 1}</span>
                            ))}
                        </div>

                        <div className="flex flex-col">
                            <span style={{ color: 'var(--syntax-comment)' }}>/**</span>
                            <span style={{ color: 'var(--syntax-comment)' }}><span className="mr-8">*</span>Hobby list configuration</span>
                            <span style={{ color: 'var(--syntax-comment)' }}><span className="mr-8">*</span>@type {'{Hobby[]}'}</span>
                            <span style={{ color: 'var(--syntax-comment)' }}>*/</span>

                            <div className="mt-2">
                                <span style={{ color: 'var(--ide-accent-purple)' }}>interface</span>{' '}
                                <span style={{ color: 'var(--syntax-type)' }}>Hobby</span>{' '}
                                <span style={{ color: 'var(--text-muted)' }}>{'{'}</span>
                            </div>
                            <div className="pl-4">
                                <span style={{ color: 'var(--syntax-keyword)' }}>name</span>
                                <span style={{ color: 'var(--text-muted)' }}>:</span>{' '}
                                <span style={{ color: 'var(--syntax-type)' }}>string</span>
                                <span style={{ color: 'var(--text-muted)' }}>;</span>
                            </div>
                            <div className="pl-4">
                                <span style={{ color: 'var(--syntax-keyword)' }}>description</span>
                                <span style={{ color: 'var(--text-muted)' }}>:</span>{' '}
                                <span style={{ color: 'var(--syntax-type)' }}>string</span>
                                <span style={{ color: 'var(--text-muted)' }}>;</span>
                            </div>
                            <div className="pl-4">
                                <span style={{ color: 'var(--syntax-keyword)' }}>items</span>
                                <span style={{ color: 'var(--text-muted)' }}>?:</span>{' '}
                                <span style={{ color: 'var(--syntax-type)' }}>string</span>
                                <span style={{ color: 'var(--text-muted)' }}>[];</span>
                            </div>
                            <span style={{ color: 'var(--text-muted)' }}>{'}'}</span>

                            <div className="mt-4">
                                <span style={{ color: 'var(--ide-accent-purple)' }}>const</span>{' '}
                                <span style={{ color: 'var(--ide-accent)' }}>hobbies</span>
                                <span style={{ color: 'var(--text-muted)' }}>:</span>{' '}
                                <span style={{ color: 'var(--syntax-type)' }}>Hobby</span>
                                <span style={{ color: 'var(--text-muted)' }}>[]</span>{' '}
                                <span style={{ color: 'var(--text-muted)' }}>=</span>{' '}
                                <span style={{ color: 'var(--text-muted)' }}>[</span>
                            </div>

                            {hobbies.map((h, i) => (
                                <React.Fragment key={h.name}>
                                    <div className={`pl-4 ${i > 0 ? 'mt-1' : ''}`}>
                                        <span style={{ color: 'var(--text-muted)' }}>{'{'}</span>
                                    </div>
                                    <div className="pl-8">
                                        <span style={{ color: 'var(--syntax-keyword)' }}>name</span>
                                        <span style={{ color: 'var(--text-muted)' }}>:</span>{' '}
                                        <span style={{ color: 'var(--syntax-string)' }}>&quot;{h.name}&quot;</span>
                                        <span style={{ color: 'var(--text-muted)' }}>,</span>
                                    </div>
                                    <div className="pl-8">
                                        <span style={{ color: 'var(--syntax-keyword)' }}>description</span>
                                        <span style={{ color: 'var(--text-muted)' }}>:</span>{' '}
                                        <span style={{ color: 'var(--syntax-string)' }}>&quot;{h.description}&quot;</span>
                                        <span style={{ color: 'var(--text-muted)' }}>,</span>
                                    </div>
                                    <div className="pl-8">
                                        <span style={{ color: 'var(--syntax-keyword)' }}>items</span>
                                        <span style={{ color: 'var(--text-muted)' }}>: [</span>
                                        {h.tags.map((t, ti) => (
                                            <React.Fragment key={t}>
                                                <span style={{ color: 'var(--syntax-string)' }}>&quot;{t}&quot;</span>
                                                {ti < h.tags.length - 1 && <span style={{ color: 'var(--text-muted)' }}>, </span>}
                                            </React.Fragment>
                                        ))}
                                        <span style={{ color: 'var(--text-muted)' }}>]</span>
                                    </div>
                                    <div className="pl-4">
                                        <span style={{ color: 'var(--text-muted)' }}>{'}'}</span>
                                        {i < hobbies.length - 1 && <span style={{ color: 'var(--text-muted)' }}>,</span>}
                                    </div>
                                </React.Fragment>
                            ))}

                            <div style={{ color: 'var(--text-muted)' }}>];</div>
                        </div>
                    </div>
                </div>
            </main>

            {/* RIGHT SIDEBAR - PREVIEW */}
            <aside
                className="hidden xl:flex w-[500px] flex-col border-l transition-colors duration-300"
                style={{ borderColor: 'var(--border-default)' }}
            >
                <div
                    className="h-10 flex items-center px-4 border-b transition-colors duration-300"
                    style={{ borderColor: 'var(--border-default)' }}
                >
                    <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>// Hobbies preview</span>
                </div>

                <motion.div
                    className="flex-1 overflow-y-auto p-4 space-y-6"
                    variants={prefersReduced ? {} : staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {hobbies.map((hobby) => (
                        <motion.div
                            key={hobby.name}
                            className="rounded-lg p-4 border transition-colors duration-300"
                            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
                            variants={prefersReduced ? {} : fadeUp}
                            whileHover={prefersReduced ? {} : { y: -2 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div
                                    className="p-2 rounded-lg"
                                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                                >
                                    <hobby.icon className="w-5 h-5" style={{ color: 'var(--ide-accent)' }} />
                                </div>
                                <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>{hobby.name}</h3>
                            </div>
                            <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                                {hobby.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {hobby.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-0.5 rounded text-[10px]"
                                        style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </aside>
        </>
    );
}
