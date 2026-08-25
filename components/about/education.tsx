'use client';

import React from 'react';
import { X, GraduationCap, BookOpen, Calendar, School } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations/variants';

export default function Education() {
    const prefersReduced = useReducedMotion();

    return (
        <>
            {/* CENTER - CODE EDITOR */}
            <main
                className="flex-1 flex flex-col border-r min-h-[500px] transition-colors duration-300"
                style={{ borderColor: 'var(--border-default)' }}
            >
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
                            <span style={{ color: 'var(--syntax-comment)' }}><span className="mr-8">*</span>Academic background component</span>
                            <span style={{ color: 'var(--syntax-comment)' }}>*/</span>

                            <div className="mt-2">
                                <span style={{ color: 'var(--ide-accent-purple)' }}>import</span>{' '}
                                <span style={{ color: 'var(--text-primary)' }}>React</span>{' '}
                                <span style={{ color: 'var(--ide-accent-purple)' }}>from</span>{' '}
                                <span style={{ color: 'var(--syntax-string)' }}>&apos;react&apos;</span>
                                <span style={{ color: 'var(--text-muted)' }}>;</span>
                            </div>

                            <div className="mt-4">
                                <span style={{ color: 'var(--ide-accent-purple)' }}>export default function</span>{' '}
                                <span style={{ color: 'var(--ide-accent)' }}>Education</span>
                                <span style={{ color: 'var(--text-muted)' }}>{'() {'}</span>
                            </div>

                            <div className="pl-4 mt-1">
                                <span style={{ color: 'var(--ide-accent-purple)' }}>return</span>{' '}
                                <span style={{ color: 'var(--text-muted)' }}>(</span>
                            </div>

                            <div className="pl-8">
                                <span style={{ color: 'var(--text-muted)' }}>{'<'}</span>
                                <span style={{ color: 'var(--syntax-keyword)' }}>Timeline</span>
                                <span style={{ color: 'var(--text-muted)' }}>{'>'}</span>
                            </div>

                            {[
                                { level: 'Bacharelado', course: 'Engenharia de Controle e Automação', institution: 'PUC Campinas', period: 'Desde 2025' },
                                { level: 'Bacharelado', course: 'Engenharia de Computação', institution: 'PUC Campinas', period: '2024 - 2024' },
                                { level: 'Ensino Médio', institution: 'Colégio Objetivo', period: '2021 - 2023' },
                            ].map((item, i) => (
                                <React.Fragment key={i}>
                                    <div className={`pl-12 ${i > 0 ? 'mt-2' : ''}`}>
                                        <span style={{ color: 'var(--text-muted)' }}>{'<'}</span>
                                        <span style={{ color: 'var(--syntax-keyword)' }}>Academic</span>
                                    </div>
                                    {item.course && (
                                        <div className="pl-16">
                                            <span style={{ color: 'var(--syntax-type)' }}>course</span>
                                            <span style={{ color: 'var(--text-muted)' }}>=</span>
                                            <span style={{ color: 'var(--syntax-string)' }}>&quot;{item.course}&quot;</span>
                                        </div>
                                    )}
                                    <div className="pl-16">
                                        <span style={{ color: 'var(--syntax-type)' }}>level</span>
                                        <span style={{ color: 'var(--text-muted)' }}>=</span>
                                        <span style={{ color: 'var(--syntax-string)' }}>&quot;{item.level}&quot;</span>
                                    </div>
                                    <div className="pl-16">
                                        <span style={{ color: 'var(--syntax-type)' }}>institution</span>
                                        <span style={{ color: 'var(--text-muted)' }}>=</span>
                                        <span style={{ color: 'var(--syntax-string)' }}>&quot;{item.institution}&quot;</span>
                                    </div>
                                    <div className="pl-16">
                                        <span style={{ color: 'var(--syntax-type)' }}>period</span>
                                        <span style={{ color: 'var(--text-muted)' }}>=</span>
                                        <span style={{ color: 'var(--syntax-string)' }}>&quot;{item.period}&quot;</span>
                                    </div>
                                    <div className="pl-12">
                                        <span style={{ color: 'var(--text-muted)' }}>{'/>'}</span>
                                    </div>
                                </React.Fragment>
                            ))}

                            <div className="pl-8">
                                <span style={{ color: 'var(--text-muted)' }}>{'</'}</span>
                                <span style={{ color: 'var(--syntax-keyword)' }}>Timeline</span>
                                <span style={{ color: 'var(--text-muted)' }}>{'>'}</span>
                            </div>
                            <div className="pl-4"><span style={{ color: 'var(--text-muted)' }}>);</span></div>
                            <div><span style={{ color: 'var(--text-muted)' }}>{'}'}</span></div>
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
                    <span className="text-xs font-semibold tracking-tight uppercase" style={{ color: 'var(--text-secondary)' }}>Education preview</span>
                </div>

                <motion.div
                    className="flex-1 overflow-y-auto p-4 space-y-6"
                    variants={prefersReduced ? {} : staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {[
                        {
                            icon: GraduationCap,
                            title: 'Engenharia de Controle e Automação',
                            institution: 'PUC Campinas',
                            period: 'Desde 2025',
                            tags: ['Automação', 'Robótica'],
                            accent: 'var(--ide-accent-purple)',
                        },
                        {
                            icon: GraduationCap,
                            title: 'Engenharia de Computação',
                            institution: 'PUC Campinas',
                            period: '2024 - 2024',
                            tags: ['Programação', 'Eletrônica Básica'],
                            accent: 'var(--ide-accent)',
                        },
                        {
                            icon: BookOpen,
                            title: 'Ensino Médio',
                            institution: 'Colégio Objetivo',
                            period: '2021 - 2023',
                            tags: [],
                            accent: 'var(--syntax-type)',
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            className="border rounded-2xl shadow-sm p-6 group transition-all duration-300 hover:shadow-md"
                            style={{
                                backgroundColor: 'var(--bg-secondary)',
                                borderColor: 'var(--border-default)',
                            }}
                            variants={prefersReduced ? {} : fadeUp}
                            whileHover={prefersReduced ? {} : { y: -2 }}
                            whileTap={prefersReduced ? {} : { scale: 0.98 }}
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className="flex-shrink-0 p-3 rounded-xl"
                                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                                >
                                    <item.icon className="w-8 h-8" style={{ color: item.accent }} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1" style={{ color: 'var(--text-secondary)' }}>
                                        <School className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                                        <span className="text-sm font-medium">{item.institution}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{item.period}</span>
                                    </div>
                                    {item.tags.length > 0 && (
                                        <div
                                            className="mt-4 pt-4 border-t flex flex-wrap gap-1.5"
                                            style={{ borderColor: 'var(--border-subtle)' }}
                                        >
                                            {item.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2.5 py-0.5 text-xs font-medium rounded-full"
                                                    style={{
                                                        backgroundColor: 'var(--bg-tertiary)',
                                                        color: 'var(--text-secondary)',
                                                    }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </aside>
        </>
    );
}
