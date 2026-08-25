"use client";

import React, { useState } from 'react';
import {
    Folder,
    ChevronRight,
    ChevronDown,
    FileCode,
    FileText,
    Mail,
    Phone,
    X,
    FolderOpen,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { slideInLeft, fadeUp, staggerContainer, appleSpring } from '@/lib/animations/variants';
import { toast } from 'sonner';
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuShortcut,
    ContextMenuSeparator
} from '@/components/ui/context-menu';
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider
} from '@/components/ui/tooltip';
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle
} from '@/components/ui/resizable';
import Bio from '@/components/about/bio';
import Hobbie from '@/components/about/hobbie';
import Education from '@/components/about/education';
import { useIsMobile } from '@/hooks/use-mobile';

interface FileInfo {
    id: string;
    folder: string;
    name: string;
    icon: React.ElementType;
    color: string;
    path: string;
}

const files: FileInfo[] = [
    {
        id: 'personal-info',
        folder: 'bio',
        name: 'my-bio.md',
        icon: FileText,
        color: '#FFA657',
        path: 'about/bio/my-bio.md',
    },
    {
        id: 'hobbies',
        folder: 'interests',
        name: 'hobbies.ts',
        icon: FileCode,
        color: 'var(--ide-accent)',
        path: 'about/interests/hobbies.ts',
    },
    {
        id: 'education',
        folder: 'education',
        name: 'Education.tsx',
        icon: FileCode,
        color: 'var(--syntax-string)',
        path: 'about/education/Education.tsx',
    },
];

export default function AboutPage() {
    const [openTabs, setOpenTabs] = useState<string[]>(['personal-info']);
    const [activeTab, setActiveTab] = useState('personal-info');
    const [openFolders, setOpenFolders] = useState({
        'bio': true,
        'interests': false,
        'education': false,
        'contacts': true
    });
    const prefersReduced = useReducedMotion();
    const isMobile = useIsMobile();

    const toggleFolder = (folder: string) => {
        setOpenFolders(prev => ({
            ...prev,
            [folder]: !prev[folder as keyof typeof prev]
        }));
    };

    const openFile = (fileId: string) => {
        if (!openTabs.includes(fileId)) {
            setOpenTabs(prev => [...prev, fileId]);
        }
        setActiveTab(fileId);
    };

    const closeTab = (fileId: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const newTabs = openTabs.filter(id => id !== fileId);
        setOpenTabs(newTabs);

        if (activeTab === fileId) {
            if (newTabs.length > 0) {
                const currentIndex = openTabs.indexOf(fileId);
                const nextIndex = Math.min(currentIndex, newTabs.length - 1);
                setActiveTab(newTabs[nextIndex]);
            } else {
                setActiveTab('');
            }
        }
    };

    const closeOtherTabs = (fileId: string) => {
        setOpenTabs([fileId]);
        setActiveTab(fileId);
        toast.success("Outras abas foram fechadas");
    };

    const copyPath = (path: string) => {
        navigator.clipboard.writeText(path);
        toast.success(`Caminho copiado: ${path}`);
    };

    const renderSidebar = () => (
        <motion.aside
            className="w-full h-full flex flex-col transition-colors duration-300 flex-shrink-0 select-none overflow-hidden"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
            variants={prefersReduced ? {} : slideInLeft}
            initial="hidden"
            animate="visible"
        >
            <div
                className="h-10 flex items-center px-4 border-b transition-colors duration-300 select-none flex-shrink-0"
                style={{ borderColor: 'var(--border-default)' }}
            >
                <ChevronDown className="w-4 h-4 mr-2" style={{ color: 'var(--text-muted)' }} />
                <span className="text-xs font-semibold tracking-tight uppercase" style={{ color: 'var(--text-secondary)' }}>
                    personal-info
                </span>
            </div>

            <motion.div
                className="flex-1 overflow-y-auto py-2 text-xs font-medium"
                variants={prefersReduced ? {} : staggerContainer}
                initial="hidden"
                animate="visible"
            >
                {/* Bio Folder */}
                <motion.div variants={prefersReduced ? {} : fadeUp}>
                    <motion.button
                        onClick={() => toggleFolder('bio')}
                        whileTap={prefersReduced ? {} : { scale: 0.98 }}
                        className="w-full flex items-center px-4 py-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-md"
                    >
                        <motion.span
                            animate={{ rotate: openFolders['bio'] ? 90 : 0 }}
                            transition={{ duration: 0.15 }}
                            className="inline-flex"
                        >
                            <ChevronRight className="w-3 h-3 mr-2" style={{ color: 'var(--text-muted)' }} />
                        </motion.span>
                        <Folder className="w-3.5 h-3.5 mr-2" style={{ color: '#E99287' }} fill="#E99287" />
                        <span style={{ color: openFolders['bio'] ? 'var(--text-primary)' : 'var(--text-secondary)' }}>bio</span>
                    </motion.button>
                    <AnimatePresence>
                        {openFolders['bio'] && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                                style={{ overflow: 'hidden' }}
                                className="ml-4 pl-2"
                            >
                                <ContextMenu>
                                    <ContextMenuTrigger asChild>
                                        <motion.div
                                            onClick={() => openFile('personal-info')}
                                            whileTap={prefersReduced ? {} : { scale: 0.98 }}
                                            className={`flex items-center px-4 py-1.5 cursor-pointer transition-colors rounded-md ${
                                                activeTab === 'personal-info'
                                                    ? 'bg-primary/10 text-primary font-semibold'
                                                    : 'hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)]'
                                            }`}
                                        >
                                            <FileText className="w-3.5 h-3.5 mr-2" style={{ color: '#FFA657' }} />
                                            <span>my-bio.md</span>
                                        </motion.div>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent>
                                        <ContextMenuItem onClick={() => openFile('personal-info')}>
                                            Abrir Arquivo
                                            <ContextMenuShortcut>↵</ContextMenuShortcut>
                                        </ContextMenuItem>
                                        <ContextMenuItem onClick={() => copyPath('about/bio/my-bio.md')}>
                                            Copiar Caminho
                                            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                                        </ContextMenuItem>
                                        {openTabs.includes('personal-info') && (
                                            <>
                                                <ContextMenuSeparator />
                                                <ContextMenuItem onClick={() => closeOtherTabs('personal-info')}>
                                                    Fechar Outras Abas
                                                </ContextMenuItem>
                                                <ContextMenuItem onClick={() => closeTab('personal-info')}>
                                                    Fechar Aba
                                                    <ContextMenuShortcut>⌘W</ContextMenuShortcut>
                                                </ContextMenuItem>
                                            </>
                                        )}
                                    </ContextMenuContent>
                                </ContextMenu>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Interests Folder */}
                <motion.div variants={prefersReduced ? {} : fadeUp}>
                    <motion.button
                        onClick={() => toggleFolder('interests')}
                        whileTap={prefersReduced ? {} : { scale: 0.98 }}
                        className="w-full flex items-center px-4 py-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-md"
                    >
                        <motion.span
                            animate={{ rotate: openFolders['interests'] ? 90 : 0 }}
                            transition={{ duration: 0.15 }}
                            className="inline-flex"
                        >
                            <ChevronRight className="w-3 h-3 mr-2" style={{ color: 'var(--text-muted)' }} />
                        </motion.span>
                        <Folder className="w-3.5 h-3.5 mr-2" style={{ color: '#43D9AD' }} fill="#43D9AD" />
                        <span style={{ color: openFolders['interests'] ? 'var(--text-primary)' : 'var(--text-secondary)' }}>hobbies</span>
                    </motion.button>
                    <AnimatePresence>
                        {openFolders['interests'] && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                                style={{ overflow: 'hidden' }}
                                className="ml-4 pl-2"
                            >
                                <ContextMenu>
                                    <ContextMenuTrigger asChild>
                                        <motion.div
                                            onClick={() => openFile('hobbies')}
                                            whileTap={prefersReduced ? {} : { scale: 0.98 }}
                                            className={`flex items-center px-4 py-1.5 cursor-pointer transition-colors rounded-md ${
                                                activeTab === 'hobbies'
                                                    ? 'bg-primary/10 text-primary font-semibold'
                                                    : 'hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)]'
                                            }`}
                                        >
                                            <FileCode className="w-3.5 h-3.5 mr-2" style={{ color: 'var(--ide-accent)' }} />
                                            <span>hobbies.ts</span>
                                        </motion.div>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent>
                                        <ContextMenuItem onClick={() => openFile('hobbies')}>
                                            Abrir Arquivo
                                            <ContextMenuShortcut>↵</ContextMenuShortcut>
                                        </ContextMenuItem>
                                        <ContextMenuItem onClick={() => copyPath('about/interests/hobbies.ts')}>
                                            Copiar Caminho
                                            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                                        </ContextMenuItem>
                                        {openTabs.includes('hobbies') && (
                                            <>
                                                <ContextMenuSeparator />
                                                <ContextMenuItem onClick={() => closeOtherTabs('hobbies')}>
                                                    Fechar Outras Abas
                                                </ContextMenuItem>
                                                <ContextMenuItem onClick={() => closeTab('hobbies')}>
                                                    Fechar Aba
                                                    <ContextMenuShortcut>⌘W</ContextMenuShortcut>
                                                </ContextMenuItem>
                                            </>
                                        )}
                                    </ContextMenuContent>
                                </ContextMenu>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Education Folder */}
                <motion.div variants={prefersReduced ? {} : fadeUp}>
                    <motion.button
                        onClick={() => toggleFolder('education')}
                        whileTap={prefersReduced ? {} : { scale: 0.98 }}
                        className="w-full flex items-center px-4 py-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-md"
                    >
                        <motion.span
                            animate={{ rotate: openFolders['education'] ? 90 : 0 }}
                            transition={{ duration: 0.15 }}
                            className="inline-flex"
                        >
                            <ChevronRight className="w-3 h-3 mr-2" style={{ color: 'var(--text-muted)' }} />
                        </motion.span>
                        <Folder className="w-3.5 h-3.5 mr-2" style={{ color: '#3A49A4' }} fill="#3A49A4" />
                        <span style={{ color: openFolders['education'] ? 'var(--text-primary)' : 'var(--text-secondary)' }}>education</span>
                    </motion.button>
                    <AnimatePresence>
                        {openFolders['education'] && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                                style={{ overflow: 'hidden' }}
                                className="ml-4 pl-2"
                            >
                                <ContextMenu>
                                    <ContextMenuTrigger asChild>
                                        <motion.div
                                            className={`flex items-center px-4 py-1.5 cursor-pointer transition-colors rounded-md ${
                                                activeTab === 'education'
                                                    ? 'bg-primary/10 text-primary font-semibold'
                                                    : 'hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)]'
                                            }`}
                                            whileTap={prefersReduced ? {} : { scale: 0.98 }}
                                            onClick={() => openFile('education')}
                                        >
                                            <FileCode className="w-3.5 h-3.5 mr-2" style={{ color: 'var(--syntax-string)' }} />
                                            <span>Education.tsx</span>
                                        </motion.div>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent>
                                        <ContextMenuItem onClick={() => openFile('education')}>
                                            Abrir Arquivo
                                            <ContextMenuShortcut>↵</ContextMenuShortcut>
                                        </ContextMenuItem>
                                        <ContextMenuItem onClick={() => copyPath('about/education/Education.tsx')}>
                                            Copiar Caminho
                                            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                                        </ContextMenuItem>
                                        {openTabs.includes('education') && (
                                            <>
                                                <ContextMenuSeparator />
                                                <ContextMenuItem onClick={() => closeOtherTabs('education')}>
                                                    Fechar Outras Abas
                                                </ContextMenuItem>
                                                <ContextMenuItem onClick={() => closeTab('education')}>
                                                    Fechar Aba
                                                    <ContextMenuShortcut>⌘W</ContextMenuShortcut>
                                                </ContextMenuItem>
                                            </>
                                        )}
                                    </ContextMenuContent>
                                </ContextMenu>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Contacts Section */}
                <motion.div
                    className="mt-4 pt-4 border-t"
                    style={{ borderColor: 'var(--border-default)' }}
                    variants={prefersReduced ? {} : fadeUp}
                >
                    <motion.button
                        onClick={() => toggleFolder('contacts')}
                        whileTap={prefersReduced ? {} : { scale: 0.98 }}
                        className="w-full flex items-center px-4 py-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-md"
                    >
                        <motion.span
                            animate={{ rotate: openFolders['contacts'] ? 0 : -90 }}
                            transition={{ duration: 0.15 }}
                            className="inline-flex"
                        >
                            <ChevronDown className="w-3 h-3 mr-2" style={{ color: 'var(--text-muted)' }} />
                        </motion.span>
                        <span className="text-xs font-semibold tracking-tight" style={{ color: 'var(--text-secondary)' }}>contacts</span>
                    </motion.button>
                    <AnimatePresence>
                        {openFolders['contacts'] && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                                style={{ overflow: 'hidden' }}
                                className="mt-1 space-y-1"
                            >
                                <div
                                    onClick={() => copyPath('fegrolla0210@gmail.com')}
                                    className="flex items-center px-4 py-1.5 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-[var(--text-secondary)]"
                                >
                                    <Mail className="w-3.5 h-3.5 mr-2" style={{ color: 'var(--text-muted)' }} />
                                    <span className="text-xs font-medium truncate">fegrolla0210@gmail.com</span>
                                </div>
                                <div
                                    onClick={() => copyPath('+55 (11) 99770-5370')}
                                    className="flex items-center px-4 py-1.5 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-[var(--text-secondary)]"
                                >
                                    <Phone className="w-3.5 h-3.5 mr-2" style={{ color: 'var(--text-muted)' }} />
                                    <span className="text-xs font-medium">+55 (11) 99770-5370</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </motion.aside>
    );

    const renderMainContent = () => (
        <div className="flex-1 h-full flex flex-col overflow-hidden">
            {/* Top Multi-Tab Bar (macOS Editor Style) */}
            <div
                className="h-10 flex border-b transition-colors duration-300 overflow-x-auto select-none flex-shrink-0"
                style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-default)',
                }}
            >
                {openTabs.map(tabId => {
                    const file = files.find(f => f.id === tabId);
                    if (!file) return null;
                    const isActive = activeTab === tabId;
                    const Icon = file.icon;

                    return (
                        <ContextMenu key={tabId}>
                            <ContextMenuTrigger asChild>
                                <motion.div
                                    onClick={() => setActiveTab(tabId)}
                                    whileTap={prefersReduced ? {} : { scale: 0.99 }}
                                    className={`relative px-5 h-full flex items-center border-r text-xs font-medium tracking-tight cursor-pointer transition-colors group ${
                                        isActive
                                            ? 'text-[var(--text-primary)] font-semibold'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                                    }`}
                                    style={{
                                        backgroundColor: isActive ? 'var(--bg-primary)' : 'transparent',
                                        borderColor: 'var(--border-default)',
                                    }}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeEditorTabIndicator"
                                            className="absolute top-0 left-0 right-0 h-[2px]"
                                            style={{ backgroundColor: file.color }}
                                            transition={appleSpring}
                                        />
                                    )}
                                    <Icon className="w-3.5 h-3.5 mr-2 flex-shrink-0" style={{ color: file.color }} />
                                    <span className="truncate">{file.name}</span>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <motion.button
                                                onClick={(e) => closeTab(tabId, e)}
                                                whileHover={prefersReduced ? {} : { scale: 1.15, backgroundColor: 'rgba(0,0,0,0.1)' }}
                                                whileTap={prefersReduced ? {} : { scale: 0.9 }}
                                                aria-label={`Fechar aba ${file.name}`}
                                                className="ml-3 p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors opacity-70 group-hover:opacity-100"
                                            >
                                                <X className="w-3 h-3" />
                                            </motion.button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Fechar aba ({file.name})
                                        </TooltipContent>
                                    </Tooltip>
                                </motion.div>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                                <ContextMenuItem onClick={() => setActiveTab(tabId)}>
                                    Ativar Aba
                                </ContextMenuItem>
                                <ContextMenuItem onClick={() => closeTab(tabId)}>
                                    Fechar Aba
                                    <ContextMenuShortcut>⌘W</ContextMenuShortcut>
                                </ContextMenuItem>
                                <ContextMenuItem onClick={() => closeOtherTabs(tabId)}>
                                    Fechar Outras Abas
                                </ContextMenuItem>
                                <ContextMenuSeparator />
                                <ContextMenuItem onClick={() => copyPath(file.path)}>
                                    Copiar Caminho
                                    <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                                </ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>
                    );
                })}
            </div>

            {/* Content View or Empty State */}
            {openTabs.length > 0 ? (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        className="flex-1 flex overflow-hidden"
                        initial={prefersReduced ? {} : { opacity: 0, x: 6 }}
                        animate={prefersReduced ? {} : { opacity: 1, x: 0 }}
                        exit={prefersReduced ? {} : { opacity: 0, x: -6 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    >
                        {activeTab === 'personal-info' ? <Bio /> :
                            activeTab === 'hobbies' ? <Hobbie /> :
                                activeTab === 'education' ? <Education /> :
                                    <Bio />}
                    </motion.div>
                </AnimatePresence>
            ) : (
                <div
                    className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                    style={{ backgroundColor: 'var(--bg-primary)' }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={appleSpring}
                        className="glass-panel rounded-3xl p-8 max-w-sm flex flex-col items-center gap-4 elevation-2 border border-white/20 dark:border-white/10"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <FolderOpen className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-semibold tracking-tight text-[var(--text-primary)]">
                            Nenhum arquivo aberto
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            Selecione um arquivo no menu lateral para visualizar biografia, interesses ou formação acadêmica.
                        </p>
                        <motion.button
                            onClick={() => openFile('personal-info')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.96 }}
                            transition={appleSpring}
                            className="mt-2 px-5 py-2 rounded-xl text-xs font-semibold tracking-tight bg-primary text-primary-foreground shadow-sm"
                        >
                            Abrir my-bio.md
                        </motion.button>
                    </motion.div>
                </div>
            )}
        </div>
    );

    return (
        <TooltipProvider>
            <div
                /*
                    Desktop usa ALTURA DEFINIDA (`h-`), não `min-h-`.
                    `h-full` dos filhos resolve contra `height` do pai; com apenas `min-height`
                    a porcentagem cai para `auto` e o split view colapsava na altura do conteúdo
                    (~500px vindos do `min-h-[500px]` do Bio), deixando a tela cortada no meio.
                    No mobile a pilha precisa crescer, então lá continua `min-h-`.
                */
                className={`w-full flex flex-col transition-colors duration-300 ${
                    isMobile ? 'min-h-[calc(100vh-4rem)]' : 'h-[calc(100vh-4rem)]'
                }`}
                style={{ backgroundColor: 'var(--bg-primary)' }}
            >
                {/*
                    Render ÚNICO da árvore.
                    Antes havia dois blocos irmãos (`hidden md:flex` + `flex md:hidden`) que
                    montavam sidebar e editor duas vezes no DOM, contando apenas com CSS para
                    ocultar um deles — o que duplicava a interface na tela e criava dois
                    elementos com o mesmo `layoutId` do framer-motion.
                    Agora só uma variante é montada, escolhida em runtime por `useIsMobile()`.
                */}
                {isMobile ? (
                    /* Mobile: pilha vertical (sidebar acima, editor abaixo) */
                    <div className="flex flex-1 min-h-0 flex-col w-full">
                        {renderSidebar()}
                        {renderMainContent()}
                    </div>
                ) : (
                    /* Desktop: split view redimensionável — `min-h-0` deixa o filho encolher dentro do flex */
                    <div className="flex flex-1 min-h-0 w-full">
                        <ResizablePanelGroup direction="horizontal" className="w-full h-full">
                            <ResizablePanel defaultSize={20} minSize={14} maxSize={35} className="min-w-[200px]">
                                {renderSidebar()}
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                            <ResizablePanel defaultSize={80}>
                                {renderMainContent()}
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </div>
                )}
            </div>
        </TooltipProvider>
    );
}
