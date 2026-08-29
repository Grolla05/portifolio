"use client";

import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ExternalLink, FileText, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { MarkdownView } from '@/components/markdown/markdown-view';
import { useGitHubReadme } from '@/hooks/use-github-readme';
import { parseGitHubUrl } from '@/lib/github-url';

export interface Project {
    id: number;
    title: string;
    slug: string;
    description: string;
    tags: string[];
    image?: string;
    link: string;
    date: string;
}

interface Technology {
    name: string;
    icon: string;
}

interface ProjectModalProps {
    project: Project | null;
    onClose: () => void;
    technologies: Technology[];
}

function ReadmeContent({ project }: { project: Project }) {
    /*
        `useMemo` porque useGitHubReadme observa os CAMPOS do alvo, não o objeto — mas
        manter a identidade estável evita re-renders inúteis do hook a cada render daqui.
    */
    const target = useMemo(() => parseGitHubUrl(project.link), [project.link]);
    const { content, status, error } = useGitHubReadme(target);
    const loading = status === 'loading' || status === 'idle';

    if (loading) {
        return (
            <div className="space-y-3 py-2" style={{ animation: 'pulse 2s ease-in-out infinite' }}>
                <div className="flex items-center gap-2 mb-6" style={{ color: 'var(--text-muted)' }}>
                    <span className="text-xs font-mono">// fetching README.md from GitHub...</span>
                </div>
                {[75, 55, 85, 45, 65, 80, 40, 70].map((w, i) => (
                    <div
                        key={i}
                        className="h-3 rounded"
                        style={{
                            width: `${w}%`,
                            backgroundColor: 'var(--bg-tertiary)',
                            opacity: 1 - i * 0.07,
                        }}
                    />
                ))}
            </div>
        );
    }

    if (error || !content) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <AlertCircle className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
                <div>
                    <p className="text-sm font-mono mb-2" style={{ color: 'var(--syntax-keyword)' }}>
                        // README.md not found
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {project.description}
                    </p>
                </div>
            </div>
        );
    }

    return <MarkdownView content={content} />;
}

export function ProjectModal({ project, onClose, technologies }: ProjectModalProps) {
    const prefersReduced = useReducedMotion();

    useEffect(() => {
        if (!project) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [project, onClose]);

    return (
        <AnimatePresence>
            {project && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ isolation: 'isolate' }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0"
                        style={{ backgroundColor: 'rgba(13,17,23,0.85)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="project-modal-title"
                        className="relative w-full max-w-3xl flex flex-col rounded-xl overflow-hidden border shadow-2xl"
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-default)',
                            maxHeight: '85vh',
                        }}
                        variants={
                            prefersReduced
                                ? {}
                                : {
                                    hidden: { opacity: 0, scale: 0.94, y: 12 },
                                    visible: { opacity: 1, scale: 1, y: 0 },
                                }
                        }
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    >
                        {/* Title bar */}
                        <div
                            className="flex items-center justify-between px-4 h-10 border-b flex-shrink-0"
                            style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-default)' }}
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--ide-accent)' }} />
                                <span className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
                                    README.md
                                </span>
                                <span
                                    id="project-modal-title"
                                    className="text-xs font-semibold tracking-tight truncate"
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    — {project.title}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                                <motion.a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileTap={{ scale: 0.96 }}
                                    className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
                                    style={{ color: 'var(--ide-accent-text)' }}
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    GitHub
                                </motion.a>
                                <motion.button
                                    onClick={onClose}
                                    whileTap={{ scale: 0.92 }}
                                    aria-label="Fechar"
                                    className="p-1 rounded-md transition-opacity hover:opacity-70"
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    <X className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Tags row */}
                        <div
                            className="flex items-center gap-2 px-6 py-2 border-b flex-shrink-0 flex-wrap"
                            style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-subtle)' }}
                        >
                            {project.tags.map((tag) => {
                                const tech = technologies.find(t => t.name === tag);
                                return (
                                    <span
                                        key={tag}
                                        className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium"
                                        style={{
                                            backgroundColor: 'var(--bg-primary)',
                                            color: 'var(--text-secondary)',
                                            border: '1px solid var(--border-subtle)',
                                        }}
                                    >
                                        {tech && (
                                            <span className="relative inline-block flex-shrink-0" style={{ width: 14, height: 14 }}>
                                                <Image src={tech.icon} alt={tag} fill className="object-contain" />
                                            </span>
                                        )}
                                        {tag}
                                    </span>
                                );
                            })}
                        </div>

                        {/* README content */}
                        <div className="flex-1 overflow-y-auto p-8 text-sm leading-relaxed">
                            <ReadmeContent project={project} />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
