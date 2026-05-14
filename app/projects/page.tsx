"use client";

import React, { useState } from 'react';
import {
    Terminal,
    Gamepad2,
    ChevronDown,
    ChevronRight,
    X,
    Calendar,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { slideInLeft, fadeUp, staggerContainer } from '@/lib/animations/variants';
import Image from 'next/image';
import Link from 'next/link';

const projects = [
    {
        id: 1,
        title: 'Simula Médias',
        slug: 'simulamedias',
        description: 'Simulador open‑source para estudantes acompanharem e projetarem suas médias por disciplina, de forma simples, visual e transparente.',
        tags: ['React', 'Tailwind CSS', 'Node.js', 'JavaScript', 'Vite'],
        image: '',
        link: 'https://github.com/Grolla05/simulamedias',
        date: '2025-12-02'
    },
    {
        id: 2,
        title: 'Solar Points',
        slug: 'Project_SolarPoints',
        description: 'O Solar Points é um sistema de iluminação pública autônomo e inteligente pensado para locais com pouca ou nenhuma infraestrutura elétrica',
        tags: ['Arduino', 'C++', 'Hardware', 'SQL', 'Python', 'Flask', 'HTML5', 'Tailwind CSS'],
        image: '',
        link: 'https://github.com/Grolla05/Project_SolarPoints',
        date: '2025-11-26'
    },
    {
        id: 3,
        title: 'Bot Discord V1',
        slug: 'Bot_Discord_V1',
        description: 'Bot de Discord focado em suporte ao estudo para vestibulares: gera mensagens motivacionais e macetes usando IA (Gemini) via comandos de barra (/).',
        tags: ['JavaScript', 'SQL'],
        image: '',
        link: 'https://github.com/Grolla05/Bot_Discord_V1',
        date: '2025-11-21'
    },
    {
        id: 4,
        title: 'MIT 6.002.1x',
        slug: 'MIT_6.002.1x',
        description: 'Este repositório documenta toda a minha jornada no curso MIT 6.002.1x – Circuitos e Eletrônica, oferecido pelo MIT na plataforma edX.',
        tags: ['Hardware'],
        image: '/thumbnails/MIT.jpg',
        link: 'https://github.com/Grolla05/MIT_6.002.1x',
        date: '2025-07-08'
    },
    {
        id: 5,
        title: 'CS50',
        slug: 'CS50_2025',
        description: 'Este repositório documenta toda a minha jornada no curso CS50 – Introdução à Ciência da Computação, oferecido por Harvard University na plataforma edX.',
        tags: ['Python', 'Flask', 'SQL', 'C', 'HTML5', 'Tailwind CSS', 'JavaScript'],
        image: '',
        link: 'https://github.com/Grolla05/CS50_2025',
        date: '2025-06-24'
    },
    {
        id: 6,
        title: 'Projeto Relógio de LED',
        slug: 'Project-Clock-LED',
        description: 'O DigitalClock é um relógio digital completo usando apenas componentes eletrônicos discretos e circuitos lógicos digitais, sem microcontroladores.',
        tags: ['Hardware'],
        image: '',
        link: 'https://github.com/Grolla05/Project-Clock-LED',
        date: '2025-06-09'
    },
    {
        id: 7,
        title: 'Player de Música',
        slug: 'Player_de_Musica',
        description: 'Jukebox funcional com navegação por menus em tela OLED, reprodução de áudio sem interrupções e animações visuais em tempo real.',
        tags: ['C++', 'Arduino', 'Hardware'],
        image: '',
        link: 'https://github.com/Grolla05/Arduino-Projects/tree/main/Player%20de%20música',
        date: '2025-12-17'
    },
    {
        id: 8,
        title: 'Jukebox',
        slug: 'Jukebox',
        description: 'Arduino com buzzer piezoelétrico e 9 botões físicos. Cada botão toca uma música clássica diferente armazenada como array de notas.',
        tags: ['C++', 'Arduino', 'Hardware'],
        image: '',
        link: 'https://github.com/Grolla05/Arduino-Projects/tree/main/Jukebox',
        date: '2025-08-03'
    },
    {
        id: 9,
        title: 'Medidor de Presença Luz',
        slug: 'light_meter',
        description: 'Usa um LDR para medir a intensidade da luz ambiente. LEDs acendem para indicar o nível de brilho detectado.',
        tags: ['C++', 'Arduino', 'Hardware'],
        image: '',
        link: 'https://github.com/Grolla05/Arduino-Projects/tree/main/Light%20Meter',
        date: '2025-08-03'
    },
];

const technologies = [
    { name: 'React',       icon: '/language_icons/React.png' },
    { name: 'HTML5',       icon: '/language_icons/HTML5.svg' },
    { name: 'Tailwind CSS',icon: '/language_icons/TailWind CSS.png' },
    { name: 'JavaScript',  icon: '/language_icons/JavaScript.svg' },
    { name: 'Python',      icon: '/language_icons/Python.svg' },
    { name: 'SQL',         icon: '/language_icons/SQL.png' },
    { name: 'C',           icon: '/language_icons/C.svg' },
    { name: 'C++',         icon: '/language_icons/C++.svg' },
    { name: 'Arduino',     icon: '/language_icons/Arduino.png' },
    { name: 'Next.js',     icon: '/language_icons/NextJS.png' },
    { name: 'Flask',       icon: '/language_icons/Flask.png' },
    { name: 'Node.js',     icon: '/language_icons/NodeJS.png' },
    { name: 'Vite',        icon: '/language_icons/Vite.png' },
    { name: 'Hardware',    icon: '/language_icons/Hardware.png' },
];

export default function ProjectsPage() {
    const [selectedTechs, setSelectedTechs] = useState<string[]>(technologies.map(t => t.name));
    const [isProjectsOpen, setIsProjectsOpen] = useState(true);
    const [isSortingOpen, setIsSortingOpen] = useState(true);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const prefersReduced = useReducedMotion();

    const toggleTech = (tech: string) => {
        setSelectedTechs(prev =>
            prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
        );
    };

    const filteredProjects = (
        selectedTechs.length === 0
            ? [...projects]
            : projects.filter(p => p.tags.some(t => selectedTechs.includes(t)))
    ).sort((a, b) => {
        const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortOrder === 'newest' ? -diff : diff;
    });

    return (
        <div
            className="min-h-screen w-full flex flex-col md:flex-row transition-colors duration-300 font-mono"
            style={{ backgroundColor: 'var(--bg-primary)' }}
        >
            {/* FAR LEFT ICON SIDEBAR */}
            <aside
                className="hidden md:flex flex-col w-12 border-r items-center py-4 gap-6 transition-colors duration-300"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-default)' }}
            >
                <Terminal className="w-5 h-5 cursor-pointer" style={{ color: 'var(--text-muted)' }} />
                <div className="w-5 h-5 rounded-full opacity-50" style={{ backgroundColor: 'var(--text-muted)' }} />
                <Gamepad2 className="w-5 h-5 cursor-pointer" style={{ color: 'var(--text-muted)' }} />
            </aside>

            {/* EXPLORER SIDEBAR */}
            <motion.aside
                className="w-full md:w-[220px] lg:w-[260px] border-r flex flex-col transition-colors duration-300"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
                variants={prefersReduced ? {} : slideInLeft}
                initial="hidden"
                animate="visible"
            >
                <div
                    className="h-10 flex items-center px-4 border-b transition-colors duration-300"
                    style={{ borderColor: 'var(--border-default)' }}
                >
                    <ChevronDown className="w-4 h-4 mr-2" style={{ color: 'var(--text-muted)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>projects</span>
                </div>

                <div className="flex-1 overflow-y-auto py-2">
                    {/* Language Filter */}
                    <div>
                        <button
                            onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                            className="w-full flex items-center px-4 py-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        >
                            <motion.span
                                animate={{ rotate: isProjectsOpen ? 90 : 0 }}
                                transition={{ duration: 0.15 }}
                                className="inline-flex"
                            >
                                <ChevronRight className="w-3 h-3 mr-2" style={{ color: 'var(--text-muted)' }} />
                            </motion.span>
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Linguagens</span>
                        </button>

                        <AnimatePresence>
                            {isProjectsOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                                    style={{ overflow: 'hidden' }}
                                    className="ml-4 pl-0 mt-2 space-y-2"
                                >
                                    {technologies.map((tech) => (
                                        <div
                                            key={tech.name}
                                            className="flex items-center px-4 py-1 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                                            onClick={() => toggleTech(tech.name)}
                                        >
                                            <div
                                                className="w-4 h-4 mr-3 border rounded flex items-center justify-center transition-colors flex-shrink-0"
                                                style={{
                                                    backgroundColor: selectedTechs.includes(tech.name) ? 'var(--ide-accent)' : 'transparent',
                                                    borderColor: selectedTechs.includes(tech.name) ? 'var(--ide-accent)' : 'var(--border-default)',
                                                }}
                                            >
                                                {selectedTechs.includes(tech.name) && (
                                                    <span className="text-white text-xs">✓</span>
                                                )}
                                            </div>
                                            <div className="flex items-center" style={{ color: 'var(--text-secondary)' }}>
                                                <div className="mr-2 relative w-5 h-5 flex-shrink-0">
                                                    <Image src={tech.icon} alt={tech.name} fill className="object-contain" />
                                                </div>
                                                <span className="text-sm">{tech.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sorting Filter */}
                    <div
                        className="mt-4 pt-4 border-t"
                        style={{ borderColor: 'var(--border-default)' }}
                    >
                        <button
                            onClick={() => setIsSortingOpen(!isSortingOpen)}
                            className="w-full flex items-center px-4 py-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        >
                            <motion.span
                                animate={{ rotate: isSortingOpen ? 90 : 0 }}
                                transition={{ duration: 0.15 }}
                                className="inline-flex"
                            >
                                <ChevronRight className="w-3 h-3 mr-2" style={{ color: 'var(--text-muted)' }} />
                            </motion.span>
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Ordernar por data</span>
                        </button>

                        <AnimatePresence>
                            {isSortingOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                                    style={{ overflow: 'hidden' }}
                                    className="ml-4 pl-0 mt-2 space-y-2"
                                >
                                    {(['newest', 'oldest'] as const).map((order) => (
                                        <div
                                            key={order}
                                            className="flex items-center px-4 py-1 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                                            onClick={() => setSortOrder(order)}
                                        >
                                            <div
                                                className="w-4 h-4 mr-3 border rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                                                style={{
                                                    borderColor: sortOrder === order ? 'var(--ide-accent)' : 'var(--border-default)',
                                                }}
                                            >
                                                {sortOrder === order && (
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--ide-accent)' }} />
                                                )}
                                            </div>
                                            <div className="flex items-center" style={{ color: 'var(--text-secondary)' }}>
                                                <Calendar className="w-4 h-4 mr-2" />
                                                <span className="text-sm">{order === 'newest' ? 'Mais recentes' : 'Mais antigos'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <div
                    className="h-10 flex border-b transition-colors duration-300"
                    style={{ borderColor: 'var(--border-default)' }}
                >
                    <div
                        className="px-4 flex items-center border-r space-x-2"
                        style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                    >
                        {selectedTechs.length > 0 ? (
                            <span className="text-sm truncate max-w-xs">{selectedTechs.join('; ')}</span>
                        ) : (
                            <span className="text-sm italic">no filters selected</span>
                        )}
                        <X
                            className="w-4 h-4 cursor-pointer flex-shrink-0 hover:opacity-70"
                            onClick={() => setSelectedTechs([])}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 md:p-12">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        layout
                        variants={prefersReduced ? {} : staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    layout
                                    initial={prefersReduced ? {} : { opacity: 0, scale: 0.92, y: 16 }}
                                    animate={prefersReduced ? {} : { opacity: 1, scale: 1, y: 0 }}
                                    exit={prefersReduced ? {} : { opacity: 0, scale: 0.92, y: 8 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: [0.4, 0, 0.2, 1],
                                        delay: prefersReduced ? 0 : index * 0.04,
                                    }}
                                    whileHover={prefersReduced ? {} : { y: -4 }}
                                    className="group"
                                >
                                    <div className="mb-3 flex items-center gap-2">
                                        <span className="text-sm font-mono" style={{ color: 'var(--ide-accent)' }}>
                                            Project {project.id}
                                        </span>
                                        <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
                                            // {project.slug}
                                        </span>
                                    </div>

                                    <Link
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <div
                                            className="rounded-xl overflow-hidden shadow-sm flex flex-col cursor-pointer h-full border transition-all duration-300"
                                            style={{
                                                backgroundColor: 'var(--bg-secondary)',
                                                borderColor: 'var(--border-default)',
                                            }}
                                        >
                                            <div
                                                className="h-32 flex items-center justify-center relative overflow-hidden"
                                                style={{ backgroundColor: 'var(--bg-tertiary)' }}
                                            >
                                                <div className="relative w-12 h-12 opacity-50 grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110">
                                                    <Image
                                                        src={technologies.find(t => t.name === project.tags[0])?.icon || '/placeholder.svg'}
                                                        alt={project.tags[0]}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <div
                                                    className="absolute top-3 right-3 backdrop-blur-md p-1.5 rounded-lg shadow-sm flex items-center gap-2"
                                                    style={{ backgroundColor: 'var(--bg-glass)' }}
                                                >
                                                    {project.tags.map((tag) => {
                                                        const tech = technologies.find(t => t.name === tag);
                                                        if (!tech) return null;
                                                        return (
                                                            <div key={tag} className="relative w-5 h-5" title={tag}>
                                                                <Image src={tech.icon} alt={tag} fill className="object-contain" />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="p-6 flex flex-col gap-4 flex-1">
                                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                                    {project.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
