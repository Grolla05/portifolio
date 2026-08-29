"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
    X, ExternalLink, Code2, Folder, ChevronRight,
    File, ArrowLeft, AlertCircle,
} from 'lucide-react';
import Image from 'next/image';
import type { Project } from './project-modal';
import { parseGitHubUrl } from '@/lib/github-url';

interface FileItem {
    name: string;
    type: 'file' | 'dir';
    path: string;
}

interface Technology {
    name: string;
    icon: string;
}

interface RepoModalProps {
    project: Project | null;
    onClose: () => void;
    technologies: Technology[];
}

function getFileInfo(name: string): { lang: string; color: string } {
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    const map: Record<string, { lang: string; color: string }> = {
        js:   { lang: 'JS',   color: 'var(--syntax-type)' },
        jsx:  { lang: 'JSX',  color: 'var(--syntax-type)' },
        ts:   { lang: 'TS',   color: 'var(--ide-accent-text)' },
        tsx:  { lang: 'TSX',  color: 'var(--ide-accent-text)' },
        py:   { lang: 'PY',   color: 'var(--syntax-string)' },
        c:    { lang: 'C',    color: 'var(--accent-purple)' },
        cpp:  { lang: 'C++',  color: 'var(--accent-purple)' },
        h:    { lang: 'H',    color: 'var(--accent-purple)' },
        hpp:  { lang: 'H++',  color: 'var(--accent-purple)' },
        ino:  { lang: 'INO',  color: 'var(--syntax-keyword)' },
        css:  { lang: 'CSS',  color: 'var(--syntax-string)' },
        html: { lang: 'HTML', color: 'var(--syntax-type)' },
        md:   { lang: 'MD',   color: 'var(--text-secondary)' },
        json: { lang: 'JSON', color: 'var(--syntax-type)' },
        sh:   { lang: 'SH',   color: 'var(--syntax-string)' },
        yml:  { lang: 'YML',  color: 'var(--syntax-type)' },
        yaml: { lang: 'YAML', color: 'var(--syntax-type)' },
        txt:  { lang: 'TXT',  color: 'var(--text-muted)' },
        rs:   { lang: 'RS',   color: 'var(--syntax-keyword)' },
        go:   { lang: 'GO',   color: 'var(--ide-accent-text)' },
        sql:  { lang: 'SQL',  color: 'var(--syntax-string)' },
        env:  { lang: 'ENV',  color: 'var(--syntax-keyword)' },
        toml: { lang: 'TOML', color: 'var(--syntax-type)' },
        lock: { lang: 'LOCK', color: 'var(--text-muted)' },
    };
    return map[ext] ?? { lang: (ext.toUpperCase() || 'FILE'), color: 'var(--text-muted)' };
}

function isBinary(name: string): boolean {
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    return ['png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'webp', 'bmp',
            'mp3', 'mp4', 'wav', 'ogg', 'pdf', 'zip', 'gz', 'tar',
            'exe', 'bin', 'woff', 'woff2', 'ttf', 'eot'].includes(ext);
}

function TreeView({
    items, loading, error, onNavigate, onOpenFile,
}: {
    items: FileItem[] | null;
    loading: boolean;
    error: boolean;
    onNavigate: (path: string) => void;
    onOpenFile: (item: FileItem) => void;
}) {
    if (loading) {
        return (
            <div className="p-8 space-y-2" style={{ animation: 'pulse 2s ease-in-out infinite' }}>
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                    // fetching repository contents...
                </span>
                {[60, 80, 45, 70, 55, 85, 40].map((w, i) => (
                    <div
                        key={i}
                        className="h-3 rounded mt-3"
                        style={{
                            width: `${w}%`,
                            backgroundColor: 'var(--bg-tertiary)',
                            opacity: 1 - i * 0.1,
                        }}
                    />
                ))}
            </div>
        );
    }

    if (error || !items) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
                <AlertCircle className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm font-mono" style={{ color: 'var(--syntax-keyword)' }}>
                    // failed to load repository
                </p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
                    // empty directory
                </p>
            </div>
        );
    }

    return (
        <div className="py-2">
            {items.map((item) => {
                const isDir = item.type === 'dir';
                const fileInfo = isDir ? null : getFileInfo(item.name);
                const binary = !isDir && isBinary(item.name);

                return (
                    <button
                        key={item.path}
                        onClick={() => isDir ? onNavigate(item.path) : (!binary && onOpenFile(item))}
                        disabled={binary}
                        className="w-full flex items-center gap-3 px-6 py-2 text-left transition-colors hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ color: isDir ? 'var(--ide-accent-text)' : 'var(--text-secondary)' }}
                    >
                        {isDir ? (
                            <Folder className="w-4 h-4 flex-shrink-0" />
                        ) : (
                            <File
                                className="w-4 h-4 flex-shrink-0"
                                style={{ color: fileInfo?.color ?? 'var(--text-muted)' }}
                            />
                        )}
                        <span className="text-sm flex-1 font-mono">{item.name}</span>
                        {!isDir && fileInfo && (
                            <span
                                className="text-xs px-1.5 py-0.5 rounded flex-shrink-0 font-mono"
                                style={{
                                    backgroundColor: 'var(--bg-primary)',
                                    color: fileInfo.color,
                                    border: '1px solid var(--border-subtle)',
                                }}
                            >
                                {fileInfo.lang}
                            </span>
                        )}
                        {isDir && (
                            <ChevronRight
                                className="w-3 h-3 flex-shrink-0"
                                style={{ color: 'var(--text-muted)' }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

function FileView({ content, loading, fileName }: {
    content: string | null;
    loading: boolean;
    fileName: string;
}) {
    if (loading) {
        return (
            <div className="p-8 space-y-2" style={{ animation: 'pulse 2s ease-in-out infinite' }}>
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                    // loading {fileName}...
                </span>
                {[70, 45, 85, 30, 60, 75, 40, 55, 80].map((w, i) => (
                    <div
                        key={i}
                        className="h-3 rounded mt-3"
                        style={{
                            width: `${w}%`,
                            backgroundColor: 'var(--bg-tertiary)',
                            opacity: 1 - i * 0.08,
                        }}
                    />
                ))}
            </div>
        );
    }

    if (!content) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>// no content</p>
            </div>
        );
    }

    const lines = content.split('\n');

    return (
        <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100%' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <tbody>
                    {lines.map((line, i) => (
                        <tr key={i} style={{ verticalAlign: 'top' }}>
                            <td
                                className="select-none text-right"
                                style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.75rem',
                                    lineHeight: '1.65',
                                    minWidth: '3rem',
                                    paddingLeft: '16px',
                                    paddingRight: '12px',
                                    userSelect: 'none',
                                    borderRight: '1px solid var(--border-subtle)',
                                    paddingTop: '1px',
                                    paddingBottom: '1px',
                                    fontFamily: 'var(--font-mono)',
                                }}
                            >
                                {i + 1}
                            </td>
                            <td
                                style={{
                                    color: 'var(--text-primary)',
                                    fontSize: '0.8125rem',
                                    lineHeight: '1.65',
                                    paddingLeft: '16px',
                                    paddingRight: '16px',
                                    whiteSpace: 'pre',
                                    paddingTop: '1px',
                                    paddingBottom: '1px',
                                    fontFamily: 'var(--font-mono)',
                                }}
                            >
                                {line || ' '}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function RepoModal({ project, onClose, technologies }: RepoModalProps) {
    const prefersReduced = useReducedMotion();
    const parsed = useMemo(() => (project ? parseGitHubUrl(project.link) : null), [project]);

    const [pathStack, setPathStack] = useState<string[]>(['']);
    const [dirItems, setDirItems] = useState<FileItem[] | null>(null);
    const [dirLoading, setDirLoading] = useState(false);
    const [dirError, setDirError] = useState(false);

    const [viewMode, setViewMode] = useState<'tree' | 'file'>('tree');
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [fileName, setFileName] = useState('');
    const [fileLoading, setFileLoading] = useState(false);

    const currentPath = pathStack[pathStack.length - 1];

    // Reset on project change
    useEffect(() => {
        if (project) {
            const p = parseGitHubUrl(project.link);
            setPathStack([p?.path ?? '']);
            setViewMode('tree');
            setDirItems(null);
            setFileContent(null);
            setFileName('');
        }
    }, [project]);

    // Fetch directory listing
    useEffect(() => {
        if (!project || !parsed || viewMode !== 'tree') return;

        const controller = new AbortController();
        setDirLoading(true);
        setDirError(false);
        setDirItems(null);

        const params = new URLSearchParams({ owner: parsed.owner, repo: parsed.repo, path: currentPath });
        fetch(`/api/repo?${params}`, { signal: controller.signal })
            .then(r => { if (!r.ok) throw new Error(); return r.json(); })
            .then(data => {
                if (data.type === 'dir') setDirItems(data.items);
                setDirLoading(false);
            })
            .catch(err => {
                if (err.name !== 'AbortError') {
                    setDirError(true);
                    setDirLoading(false);
                }
            });

        return () => controller.abort();
    }, [project, parsed, currentPath, viewMode]);

    // ESC + scroll lock
    useEffect(() => {
        if (!project) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [project, onClose]);

    const navigateTo = useCallback((path: string) => {
        setPathStack(prev => [...prev, path]);
        setViewMode('tree');
        setFileContent(null);
    }, []);

    const navigateBack = useCallback(() => {
        if (viewMode === 'file') {
            setViewMode('tree');
            setFileContent(null);
            setFileName('');
            return;
        }
        setPathStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
    }, [viewMode]);

    const openFile = useCallback(async (item: FileItem) => {
        if (!parsed || isBinary(item.name)) return;
        setFileLoading(true);
        setFileName(item.name);
        setViewMode('file');
        setFileContent(null);

        const params = new URLSearchParams({ owner: parsed.owner, repo: parsed.repo, path: item.path });
        try {
            const r = await fetch(`/api/repo?${params}`);
            if (!r.ok) throw new Error();
            const data = await r.json();
            setFileContent(data.type === 'file' ? data.content : '// Unable to load content');
        } catch {
            setFileContent('// Error loading file');
        }
        setFileLoading(false);
    }, [parsed]);

    const canGoBack = pathStack.length > 1 || viewMode === 'file';

    const breadcrumbs = useMemo(() => {
        const base = currentPath.split('/').filter(Boolean);
        return viewMode === 'file' ? [...base, fileName] : base;
    }, [currentPath, viewMode, fileName]);

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
                        aria-labelledby="repo-modal-title"
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
                                <Code2
                                    className="w-3.5 h-3.5 flex-shrink-0"
                                    style={{ color: 'var(--ide-accent)' }}
                                />
                                <span
                                    id="repo-modal-title"
                                    className="text-xs font-semibold tracking-tight flex-shrink-0"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    {parsed ? `${parsed.owner}/${parsed.repo}` : 'repository'}
                                </span>
                                {viewMode === 'file' && fileName && (
                                    <span
                                        className="text-xs font-mono truncate"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        — {fileName}
                                    </span>
                                )}
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
                                            <span
                                                className="relative inline-block flex-shrink-0"
                                                style={{ width: 14, height: 14 }}
                                            >
                                                <Image src={tech.icon} alt={tag} fill className="object-contain" />
                                            </span>
                                        )}
                                        {tag}
                                    </span>
                                );
                            })}
                        </div>

                        {/* Breadcrumb bar */}
                        <div
                            className="flex items-center gap-2 px-4 h-9 border-b flex-shrink-0"
                            style={{ borderColor: 'var(--border-subtle)' }}
                        >
                            {canGoBack && (
                                <button
                                    onClick={navigateBack}
                                    className="flex items-center gap-1 text-xs font-mono transition-opacity hover:opacity-70 flex-shrink-0 pr-2"
                                    style={{
                                        color: 'var(--ide-accent-text)',
                                        borderRight: '1px solid var(--border-subtle)',
                                    }}
                                >
                                    <ArrowLeft className="w-3 h-3" />
                                    back
                                </button>
                            )}
                            <div
                                className="flex items-center gap-1 text-xs font-mono min-w-0 overflow-hidden"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                <span className="flex-shrink-0">~</span>
                                {breadcrumbs.map((crumb, i) => (
                                    <span key={i} className="flex items-center gap-1 flex-shrink-0">
                                        <span>/</span>
                                        <span
                                            style={{
                                                color: i === breadcrumbs.length - 1
                                                    ? 'var(--text-secondary)'
                                                    : 'var(--text-muted)',
                                            }}
                                        >
                                            {crumb}
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto font-mono text-sm">
                            {viewMode === 'tree' && (
                                <TreeView
                                    items={dirItems}
                                    loading={dirLoading}
                                    error={dirError}
                                    onNavigate={navigateTo}
                                    onOpenFile={openFile}
                                />
                            )}
                            {viewMode === 'file' && (
                                <FileView
                                    content={fileContent}
                                    loading={fileLoading}
                                    fileName={fileName}
                                />
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
