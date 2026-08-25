"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { Components } from 'react-markdown';
import { X, ExternalLink, FileText, AlertCircle } from 'lucide-react';
import Image from 'next/image';

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

// Parses GitHub URL into owner, repo, and optional subfolder path
function parseGitHubUrl(url: string): { owner: string; repo: string; path?: string } | null {
    // Handles: github.com/owner/repo/tree/branch/path/to/folder
    const treeMatch = url.match(/github\.com\/([^/]+)\/([^/]+)\/tree\/[^/]+\/(.+)/);
    if (treeMatch) {
        return { owner: treeMatch[1], repo: treeMatch[2], path: treeMatch[3] };
    }
    // Handles: github.com/owner/repo
    const repoMatch = url.match(/github\.com\/([^/]+)\/([^/?#]+)/);
    if (!repoMatch) return null;
    return { owner: repoMatch[1], repo: repoMatch[2] };
}

function useGitHubReadme(link: string | null) {
    const [content, setContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!link) return;

        const parsed = parseGitHubUrl(link);
        if (!parsed) {
            setError(true);
            return;
        }

        const controller = new AbortController();
        setLoading(true);
        setError(false);
        setContent(null);

        const params = new URLSearchParams({ owner: parsed.owner, repo: parsed.repo });
        if (parsed.path) params.set('path', parsed.path);

        fetch(`/api/readme?${params}`, { signal: controller.signal })
            .then(r => {
                if (!r.ok) throw new Error('not found');
                return r.text();
            })
            .then(text => {
                setContent(text);
                setLoading(false);
            })
            .catch(err => {
                if (err.name !== 'AbortError') {
                    setError(true);
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [link]);

    return { content, loading, error };
}

const markdownComponents: Components = {
    h1: ({ children }) => (
        <h1 style={{ color: 'var(--text-primary)', fontSize: '1.375rem', fontWeight: 500, marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            {children}
        </h1>
    ),
    h2: ({ children }) => (
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.125rem', fontWeight: 500, marginBottom: '12px', marginTop: '24px' }}>
            {children}
        </h2>
    ),
    h3: ({ children }) => (
        <h3 style={{ color: 'var(--ide-accent)', fontSize: '1rem', fontWeight: 500, marginBottom: '8px', marginTop: '20px' }}>
            {children}
        </h3>
    ),
    p: ({ children }) => (
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: '12px' }}>
            {children}
        </p>
    ),
    code: ({ className, children, ...props }) => {
        const isBlock = !!className;
        if (isBlock) {
            return (
                <code
                    className={className}
                    style={{ fontSize: '0.875em', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
                    {...props}
                >
                    {children}
                </code>
            );
        }
        return (
            <code
                style={{
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--syntax-string)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.875em',
                    fontFamily: 'var(--font-mono)',
                }}
                {...props}
            >
                {children}
            </code>
        );
    },
    pre: ({ children }) => (
        <pre
            style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '16px',
                overflow: 'auto',
                marginBottom: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
            }}
        >
            {children}
        </pre>
    ),
    ul: ({ children }) => (
        <ul style={{ color: 'var(--text-secondary)', paddingLeft: '20px', marginBottom: '12px', listStyleType: 'disc' }}>
            {children}
        </ul>
    ),
    ol: ({ children }) => (
        <ol style={{ color: 'var(--text-secondary)', paddingLeft: '20px', marginBottom: '12px', listStyleType: 'decimal' }}>
            {children}
        </ol>
    ),
    li: ({ children }) => (
        <li style={{ marginBottom: '6px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
            {children}
        </li>
    ),
    a: ({ href, children }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ide-accent)', textDecoration: 'none' }}>
            {children}
        </a>
    ),
    blockquote: ({ children }) => (
        <blockquote
            style={{
                borderLeft: '3px solid var(--ide-accent)',
                paddingLeft: '16px',
                margin: '16px 0',
                color: 'var(--text-muted)',
            }}
        >
            {children}
        </blockquote>
    ),
    strong: ({ children }) => (
        <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
            {children}
        </strong>
    ),
    em: ({ children }) => (
        <em style={{ color: 'var(--syntax-type)', fontStyle: 'italic' }}>
            {children}
        </em>
    ),
    hr: () => (
        <hr style={{ borderColor: 'var(--border-subtle)', margin: '24px 0', borderTopWidth: 1 }} />
    ),
    table: ({ children }) => (
        <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                {children}
            </table>
        </div>
    ),
    th: ({ children }) => (
        <th
            style={{
                padding: '8px 12px',
                textAlign: 'left',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                borderBottom: '1px solid var(--border-default)',
                fontSize: '0.875rem',
                fontWeight: 500,
            }}
        >
            {children}
        </th>
    ),
    td: ({ children }) => (
        <td
            style={{
                padding: '8px 12px',
                color: 'var(--text-secondary)',
                borderBottom: '1px solid var(--border-subtle)',
                fontSize: '0.875rem',
            }}
        >
            {children}
        </td>
    ),
    img: ({ src, alt, width, height }) => {
        // Detect badge: shields.io or small fixed-size images — render inline
        const isBadge =
            typeof src === 'string' &&
            (src.includes('shields.io') ||
                src.includes('badge') ||
                src.includes('img.shields') ||
                (typeof width === 'number' && width < 200) ||
                (typeof height === 'number' && height < 40));
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={src}
                alt={alt ?? ''}
                style={
                    isBadge
                        ? { display: 'inline-block', verticalAlign: 'middle', margin: '2px 4px' }
                        : { maxWidth: '100%', borderRadius: '8px', display: 'block', margin: '12px 0' }
                }
            />
        );
    },
};

function ReadmeContent({ project }: { project: Project }) {
    const { content, loading, error } = useGitHubReadme(project.link);

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

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={markdownComponents}
        >
            {content}
        </ReactMarkdown>
    );
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
                                    style={{ color: 'var(--ide-accent)' }}
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
