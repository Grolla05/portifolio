'use client';

import React from 'react';
import { User, X, Star, MessageSquare } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations/variants';

export default function Bio() {
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
                        <span>my-bio.md</span>
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
                            {Array.from({ length: 16 }, (_, i) => (
                                <span key={i + 1}>{i + 1}</span>
                            ))}
                        </div>
                        <div className="flex flex-col" style={{ color: 'var(--syntax-comment)' }}>
                            <span>/**</span>
                            <span><span className="mr-8">*</span>About me</span>
                            <span><span className="mr-8">*</span>I have 5 years of experience in web</span>
                            <span><span className="mr-8">*</span>development lorem ipsum dolor sit amet,</span>
                            <span><span className="mr-8">*</span>consectetur adipiscing elit, sed do eiusmod</span>
                            <span><span className="mr-8">*</span>tempor incididunt ut labore et dolore</span>
                            <span><span className="mr-8">*</span>magna aliqua. Ut enim ad minim veniam,</span>
                            <span><span className="mr-8">*</span>quis nostrud exercitation ullamco laboris</span>
                            <span><span className="mr-8">*</span>nisi ut aliquip ex ea commodo consequat.</span>
                            <span><span className="mr-8">*</span>Duis aute irure dolor in reprehenderit in</span>
                            <span><span className="mr-8">*</span></span>
                            <span><span className="mr-8">*</span>Duis aute irure dolor in reprehenderit in</span>
                            <span><span className="mr-8">*</span>voluptate velit esse cillum dolore eu fugiat</span>
                            <span><span className="mr-8">*</span>nulla pariatur. Excepteur sint occaecat</span>
                            <span><span className="mr-8">*</span>officia deserunt mollit anim id est laborum.</span>
                            <span>*/</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* RIGHT SIDEBAR - SNIPPETS */}
            <aside
                className="hidden xl:flex w-[500px] flex-col border-l transition-colors duration-300"
                style={{ borderColor: 'var(--border-default)' }}
            >
                <div
                    className="h-10 flex items-center px-4 border-b transition-colors duration-300"
                    style={{ borderColor: 'var(--border-default)' }}
                >
                    <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>// Code snippet showcase:</span>
                </div>

                <motion.div
                    className="flex-1 overflow-y-auto p-4 space-y-6"
                    variants={prefersReduced ? {} : staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Snippet Card 1 */}
                    <motion.div className="space-y-3" variants={prefersReduced ? {} : fadeUp}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                                >
                                    <User className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-mono" style={{ color: 'var(--ide-accent)' }}>@Grolla05</span>
                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Created 5 months ago</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                                <div className="flex items-center gap-1">
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="text-xs">details</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4" />
                                    <span className="text-xs">3 stars</span>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            className="rounded-lg p-4 font-mono text-xs whitespace-pre-wrap break-words border transition-colors duration-300"
                            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
                            whileHover={prefersReduced ? {} : { y: -2 }}
                            transition={{ duration: 0.2 }}
                        >
                            <pre><code>
                                <span style={{ color: 'var(--ide-accent-purple)' }}>function</span>{' '}
                                <span style={{ color: 'var(--syntax-type)' }}>initializeModelChunk</span>
                                <span style={{ color: 'var(--text-muted)' }}>{'<T>('}</span>
                                <span style={{ color: 'var(--syntax-keyword)' }}>chunk</span>
                                <span style={{ color: 'var(--text-muted)' }}>:</span>{' '}
                                <span style={{ color: 'var(--syntax-type)' }}>ResolvedModelChunk</span>
                                <span style={{ color: 'var(--text-muted)' }}>{'): T {'}</span>
                                {'\n  '}
                                <span style={{ color: 'var(--ide-accent-purple)' }}>const</span>{' '}
                                <span style={{ color: 'var(--text-primary)' }}>value</span>
                                <span style={{ color: 'var(--text-muted)' }}>:</span>{' '}
                                <span style={{ color: 'var(--syntax-type)' }}>T</span>{' '}
                                <span style={{ color: 'var(--text-muted)' }}>=</span>{' '}
                                <span style={{ color: 'var(--ide-accent)' }}>parseModel</span>
                                <span style={{ color: 'var(--text-muted)' }}>(chunk._response, chunk._value);</span>
                                {'\n  '}
                                <span style={{ color: 'var(--ide-accent-purple)' }}>const</span>{' '}
                                <span style={{ color: 'var(--text-primary)' }}>initializedChunk</span>
                                <span style={{ color: 'var(--text-muted)' }}>:</span>{' '}
                                <span style={{ color: 'var(--syntax-type)' }}>InitializedChunk</span>
                                <span style={{ color: 'var(--text-muted)' }}>{'<T>'}</span>{' '}
                                <span style={{ color: 'var(--text-muted)' }}>= (chunk: any);</span>
                                {'\n  '}
                                <span style={{ color: 'var(--text-primary)' }}>initializedChunk._status</span>{' '}
                                <span style={{ color: 'var(--text-muted)' }}>=</span>{' '}
                                <span style={{ color: 'var(--syntax-type)' }}>INITIALIZED</span>
                                <span style={{ color: 'var(--text-muted)' }}>;</span>
                                {'\n  '}
                                <span style={{ color: 'var(--text-primary)' }}>initializedChunk._value</span>{' '}
                                <span style={{ color: 'var(--text-muted)' }}>=</span>{' '}
                                <span style={{ color: 'var(--text-primary)' }}>value</span>
                                <span style={{ color: 'var(--text-muted)' }}>;</span>
                                {'\n  '}
                                <span style={{ color: 'var(--ide-accent-purple)' }}>return</span>{' '}
                                <span style={{ color: 'var(--text-primary)' }}>value</span>
                                <span style={{ color: 'var(--text-muted)' }}>;</span>
                                {'\n'}
                                <span style={{ color: 'var(--text-muted)' }}>{'}'}</span>
                            </code></pre>
                        </motion.div>
                    </motion.div>

                    {/* Snippet Card 2 */}
                    <motion.div className="space-y-3" variants={prefersReduced ? {} : fadeUp}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                                >
                                    <User className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-mono" style={{ color: 'var(--ide-accent)' }}>@Grolla05</span>
                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Created 9 months ago</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                                <div className="flex items-center gap-1">
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="text-xs">details</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4" />
                                    <span className="text-xs">0 stars</span>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            className="rounded-lg p-4 font-mono text-xs whitespace-pre-wrap break-words border transition-colors duration-300"
                            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
                            whileHover={prefersReduced ? {} : { y: -2 }}
                            transition={{ duration: 0.2 }}
                        >
                            <pre><code>
                                <span style={{ color: 'var(--ide-accent-purple)' }}>export function</span>{' '}
                                <span style={{ color: 'var(--ide-accent)' }}>parseModelTuple</span>
                                <span style={{ color: 'var(--text-muted)' }}>(</span>
                                {'\n  '}
                                <span style={{ color: 'var(--syntax-keyword)' }}>response</span>
                                <span style={{ color: 'var(--text-muted)' }}>:</span>{' '}
                                <span style={{ color: 'var(--syntax-type)' }}>Response</span>
                                <span style={{ color: 'var(--text-muted)' }}>,</span>
                                {'\n  '}
                                <span style={{ color: 'var(--syntax-keyword)' }}>value</span>
                                <span style={{ color: 'var(--text-muted)' }}>: {'{'}</span>
                                <span style={{ color: 'var(--text-muted)' }}>[key: </span>
                                <span style={{ color: 'var(--syntax-type)' }}>string</span>
                                <span style={{ color: 'var(--text-muted)' }}>]:</span>{' '}
                                <span style={{ color: 'var(--syntax-type)' }}>JSONValue</span>
                                <span style={{ color: 'var(--text-muted)' }}>{'}'}</span>
                                {'\n'}
                                <span style={{ color: 'var(--text-muted)' }}>):</span>{' '}
                                <span style={{ color: 'var(--syntax-type)' }}>any</span>{' '}
                                <span style={{ color: 'var(--text-muted)' }}>{'{'}</span>
                                {'\n  '}
                                <span style={{ color: 'var(--ide-accent-purple)' }}>const</span>{' '}
                                <span style={{ color: 'var(--text-primary)' }}>tuple</span>
                                <span style={{ color: 'var(--text-muted)' }}>: [mixed, mixed, mixed, mixed] = (value: any);</span>
                                {'\n'}
                                <span style={{ color: 'var(--text-muted)' }}>{'}'}</span>
                            </code></pre>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </aside>
        </>
    );
}
