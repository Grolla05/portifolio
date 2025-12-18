"use client"

import React, { useState } from 'react';
import {
    Terminal,
    Gamepad2,
    ChevronDown,
    ChevronRight,
    X,
    Calendar,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Mock Data
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
        description: 'Bot de Discord focado em suporte ao estudo para vestibulares: gera mensagens motivacionais e macetes (dicas estratégicas) usando IA (Gemini) via comandos de barra (/).',
        tags: ['JavaScript', 'SQL'],
        image: '',
        link: 'https://github.com/Grolla05/Bot_Discord_V1',
        date: '2025-11-21'
    },
    {
        id: 4,
        title: 'MIT 6.002.1x',
        slug: 'MIT_6.002.1x',
        description: 'Este repositório documenta toda a minha jornada no curso MIT 6.002.1x – Circuitos e Eletrônica, oferecido pelo Instituto de Tecnologia de Massachusetts (MIT) na plataforma edX.',
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
        description: 'O DigitalClock é um projeto desenvolvido com o objetivo de criar um relógio digital completo, capaz de contar com precisão horas, minutos e segundos, utilizando apenas componentes eletrônicos discretos e circuitos lógicos digitais, sem linguagens de programação ou microcontroladores.',
        tags: ['Hardware'],
        image: '',
        link: 'https://github.com/Grolla05/Project-Clock-LED',
        date: '2025-06-09'
    },
    {
        id: 7,
        title: 'Player de Música',
        slug: 'Player_de_Musica',
        description: 'Este projeto cria uma jukebox funcional que permite aos usuários navegar e reproduzir músicas usando um sistema de menus exibido em uma tela OLED. Ela apresenta reprodução de áudio sem interrupções, permitindo animações visuais em tempo real enquanto a música toca.',
        tags: ['C++', 'Arduino', 'Hardware'],
        image: '',
        link: 'https://github.com/Grolla05/Arduino-Projects/tree/main/Player%20de%20música',
        date: '2025-12-17'
    },
    {
        id: 8,
        title: 'Jukebox',
        slug: 'Jukebox',
        description: 'O projeto Jukebox utiliza um Arduino, um buzzer piezoelétrico e 9 botões físicos. Cada botão, ao ser pressionado, toca uma música clássica diferente. As músicas são armazenadas como matrizes de notas e durações, e a seleção é feita por hardware, tornando a experiência interativa e divertida.',
        tags: ['C++', 'Arduino', 'Hardware'],
        image: '',
        link: 'https://github.com/Grolla05/Arduino-Projects/tree/main/Jukebox',
        date: '2025-08-03'
    },
    {
        id: 9,
        title: 'Medidor de Presença Luz',
        slug: 'light_meter',
        description: 'Este projeto utiliza um resistor dependente de luz (LDR) para medir a intensidade da luz ambiente. Com base nas leituras do sensor, diferentes LEDs acendem para indicar o nível de brilho detectado.',
        tags: ['C++', 'Arduino', 'Hardware'],
        image: '',
        link: 'https://github.com/Grolla05/Arduino-Projects/tree/main/Light%20Meter',
        date: '2025-08-03'
    },
];

const technologies = [
    { name: 'React', icon: '/language_icons/React.png' },
    { name: 'HTML5', icon: '/language_icons/HTML5.svg' },
    { name: 'Tailwind CSS', icon: '/language_icons/TailWind CSS.png' },
    { name: 'JavaScript', icon: '/language_icons/JavaScript.svg' },
    { name: 'Python', icon: '/language_icons/Python.svg' },
    { name: 'SQL', icon: '/language_icons/SQL.png' },
    { name: 'C', icon: '/language_icons/C.svg' },
    { name: 'C++', icon: '/language_icons/C++.svg' },
    { name: 'Arduino', icon: '/language_icons/Arduino.png' },
    { name: 'Next.js', icon: '/language_icons/NextJS.png' },
    { name: 'Flask', icon: '/language_icons/Flask.png' },
    { name: 'Node.js', icon: '/language_icons/NodeJS.png' },
    { name: 'Vite', icon: '/language_icons/Vite.png' },
    { name: 'Hardware', icon: '/language_icons/Hardware.png' },
];

export default function ProjectsPage() {
    const [selectedTechs, setSelectedTechs] = useState<string[]>(['React', 'HTML5', 'Tailwind CSS', 'JavaScript', 'Python', 'SQL', 'C', 'C++', 'Arduino', 'Next.js', 'Flask', 'Node.js', 'Vite', 'Hardware']);
    const [isProjectsOpen, setIsProjectsOpen] = useState(true);
    const [isSortingOpen, setIsSortingOpen] = useState(true);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    const toggleTech = (tech: string) => {
        setSelectedTechs(prev =>
            prev.includes(tech)
                ? prev.filter(t => t !== tech)
                : [...prev, tech]
        );
    };

    const filteredProjects = selectedTechs.length === 0
        ? [...projects].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        })
        : projects.filter(project =>
            project.tags.some(tag => selectedTechs.includes(tag))
        ).sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 dark:bg-[#011627] transition-colors duration-300 font-mono">

            {/* 1. FAR LEFT ICON SIDEBAR */}
            <aside className="hidden md:flex flex-col w-12 border-r border-slate-200 dark:border-[#1E2D3D] bg-slate-100 dark:bg-[#011627] items-center py-4 gap-6 transition-colors duration-300">
                <Terminal className="w-5 h-5 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 cursor-pointer transition-colors" />
                <div className="w-5 h-5 rounded-full bg-slate-300 dark:bg-gray-600 opacity-50"></div>
                <Gamepad2 className="w-5 h-5 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 cursor-pointer transition-colors" />
            </aside>

            {/* 2. EXPLORER SIDEBAR */}
            <aside className="w-full md:w-[220px] lg:w-[260px] border-r border-slate-200 dark:border-[#1E2D3D] flex flex-col bg-slate-100 dark:bg-[#011627] transition-colors duration-300">
                
                {/* Header */}
                <div className="h-10 flex items-center px-4 border-b border-slate-200 dark:border-[#1E2D3D] transition-colors duration-300">
                    <ChevronDown className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-sm text-slate-600 dark:text-gray-400">projects</span>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto py-2">
                    
                    {/* Language Filter */}
                    <div>
                        <button 
                            onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                            className="w-full flex items-center px-4 py-1 hover:bg-slate-200 dark:hover:bg-[#1E2D3D]/50 transition-colors group"
                        >
                            <ChevronRight className={`w-3 h-3 text-slate-400 mr-2 transition-transform ${isProjectsOpen ? 'rotate-90' : ''}`} />
                            <span className="text-sm text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Linguagens</span>
                        </button>

                        {isProjectsOpen && (
                            <div className="ml-4 pl-0 mt-2 space-y-2">
                                {technologies.map((tech) => (
                                    <div 
                                        key={tech.name}
                                        className="flex items-center px-4 py-1 hover:bg-slate-200 dark:hover:bg-[#1E2D3D]/30 cursor-pointer transition-colors group"
                                        onClick={() => toggleTech(tech.name)}
                                    >
                                        <div className={`w-4 h-4 mr-3 border rounded flex items-center justify-center transition-colors ${
                                            selectedTechs.includes(tech.name)
                                                ? 'bg-slate-400 dark:bg-gray-500 border-slate-400 dark:border-gray-500'
                                                : 'border-slate-300 dark:border-gray-600'
                                        }`}>
                                            {selectedTechs.includes(tech.name) && <span className="text-white text-xs">✓</span>}
                                        </div>
                                        <div className="flex items-center text-slate-500 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                            <div className="mr-2 relative w-5 h-5">
                                                <Image 
                                                    src={tech.icon} 
                                                    alt={tech.name} 
                                                    fill
                                                    className="object-contain" 
                                                />
                                            </div>
                                            <span className="text-sm">{tech.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sorting Filter */}
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-[#1E2D3D]">
                        <button 
                            onClick={() => setIsSortingOpen(!isSortingOpen)}
                            className="w-full flex items-center px-4 py-1 hover:bg-slate-200 dark:hover:bg-[#1E2D3D]/50 transition-colors group"
                        >
                            <ChevronRight className={`w-3 h-3 text-slate-400 mr-2 transition-transform ${isSortingOpen ? 'rotate-90' : ''}`} />
                            <span className="text-sm text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Ordernar por data</span>
                        </button>

                        {isSortingOpen && (
                            <div className="ml-4 pl-0 mt-2 space-y-2">
                                <div 
                                    className="flex items-center px-4 py-1 hover:bg-slate-200 dark:hover:bg-[#1E2D3D]/30 cursor-pointer transition-colors group"
                                    onClick={() => setSortOrder('newest')}
                                >
                                    <div className={`w-4 h-4 mr-3 border rounded flex items-center justify-center transition-colors ${
                                        sortOrder === 'newest'
                                            ? 'bg-slate-400 dark:bg-gray-500 border-slate-400 dark:border-gray-500'
                                            : 'border-slate-300 dark:border-gray-600'
                                    }`}>
                                        {sortOrder === 'newest' && <span className="text-white text-xs rounded-full">●</span>}
                                    </div>
                                    <div className="flex items-center text-slate-500 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span className="text-sm">Mais recentes</span>
                                    </div>
                                </div>
                                
                                <div 
                                    className="flex items-center px-4 py-1 hover:bg-slate-200 dark:hover:bg-[#1E2D3D]/30 cursor-pointer transition-colors group"
                                    onClick={() => setSortOrder('oldest')}
                                >
                                    <div className={`w-4 h-4 mr-3 border rounded flex items-center justify-center transition-colors ${
                                        sortOrder === 'oldest'
                                            ? 'bg-slate-400 dark:bg-gray-500 border-slate-400 dark:border-gray-500'
                                            : 'border-slate-300 dark:border-gray-600'
                                    }`}>
                                        {sortOrder === 'oldest' && <span className="text-white text-xs rounded-full">●</span>}
                                    </div>
                                    <div className="flex items-center text-slate-500 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span className="text-sm">Mais antigos</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </aside>

            {/* 3. MAIN CONTENT - PROJECT GRID */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header Tabs */}
                <div className="h-10 flex border-b border-slate-200 dark:border-[#1E2D3D] transition-colors duration-300">
                    <div className="px-4 flex items-center border-r border-slate-200 dark:border-[#1E2D3D] space-x-2 text-slate-500 dark:text-gray-400">
                         {selectedTechs.length > 0 ? (
                            <span className="text-sm">{selectedTechs.join('; ')}</span>
                         ) : (
                            <span className="text-sm italic">no filters selected</span>
                         )}
                         <X 
                            className="w-4 h-4 cursor-pointer hover:text-slate-700 dark:hover:text-white"
                            onClick={() => setSelectedTechs([])}
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map((project) => (
                            <div key={project.id} className="group">
                                {/* Header: Index // Slug */}
                                <div className="mb-3 flex items-center gap-2">
                                    <span className="text-sm font-bold text-[#5565E8] dark:text-[#5565E8]">
                                        Project {project.id}
                                    </span>
                                    <span className="text-sm text-slate-400 dark:text-gray-500">
                                        // {project.slug}
                                    </span>
                                </div>

                                {/* Card */}
                                <Link 
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <div className="bg-slate-100 dark:bg-[#011221] border border-slate-200 dark:border-[#1E2D3D] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col relative cursor-pointer h-full">
                                        
                                        {/* Image Placeholder */}
                                        <div className="h-32 bg-slate-200 dark:bg-[#0e1823] flex items-center justify-center relative overflow-hidden">
                                            {/* CSS Pattern to make it look cool without actual image */}
                                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
                                            
                                            {/* Main Tech Icon (Center) */}
                                            <div className="relative w-12 h-12 opacity-50 grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110">
                                                 <Image 
                                                    src={technologies.find(t => t.name === project.tags[0])?.icon || '/placeholder.svg'} 
                                                    alt={project.tags[0]}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                            
                                            
                                            {/* Language Icons Top Right */}
                                            <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md p-1.5 rounded-lg shadow-sm flex items-center gap-2">
                                                {project.tags.map((tag) => {
                                                    const tech = technologies.find(t => t.name === tag);
                                                    if (!tech) return null;
                                                    return (
                                                        <div key={tag} className="relative w-5 h-5" title={tag}>
                                                            <Image 
                                                                src={tech.icon} 
                                                                alt={tag} 
                                                                fill
                                                                className="object-contain" 
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col gap-4 flex-1">
                                            <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
                                                {project.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

        </div>
    );
}
