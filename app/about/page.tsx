"use client";

import React, { useState } from 'react';
import {
    Terminal,
    Gamepad2,
    Folder,
    ChevronRight,
    ChevronDown,
    FileCode,
    FileText,
    Mail,
    Phone
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { slideInLeft, fadeUp, staggerContainer } from '@/lib/animations/variants';
import Bio from '@/components/about/bio';
import Hobbie from '@/components/about/hobbie';
import Education from '@/components/about/education';

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState('personal-info');
    const [openFolders, setOpenFolders] = useState({
        'bio': true,
        'interests': false,
        'education': false,
        'contacts': true
    });
    const prefersReduced = useReducedMotion();

    const toggleFolder = (folder: string) => {
        setOpenFolders(prev => ({
            ...prev,
            [folder]: !prev[folder as keyof typeof prev]
        }));
    };

    return (
        <div
            className="min-h-screen w-full flex flex-col md:flex-row transition-colors duration-300"
            style={{ backgroundColor: 'var(--bg-primary)' }}
        >
            {/* FAR LEFT ICON SIDEBAR */}
            <aside
                className="hidden md:flex flex-col w-12 border-r items-center py-4 gap-6 transition-colors duration-300"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-default)' }}
            >
                <Terminal className="w-5 h-5 cursor-pointer transition-colors" style={{ color: 'var(--text-muted)' }} />
                <div className="w-5 h-5 rounded-full opacity-50" style={{ backgroundColor: 'var(--text-muted)' }} />
                <Gamepad2 className="w-5 h-5 cursor-pointer transition-colors" style={{ color: 'var(--text-muted)' }} />
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
                    <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>personal-info</span>
                </div>

                <motion.div
                    className="flex-1 overflow-y-auto py-2 font-mono text-sm"
                    variants={prefersReduced ? {} : staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Bio Folder */}
                    <motion.div variants={prefersReduced ? {} : fadeUp}>
                        <button
                            onClick={() => toggleFolder('bio')}
                            className="w-full flex items-center px-6 py-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        >
                            <motion.span
                                animate={{ rotate: openFolders['bio'] ? 90 : 0 }}
                                transition={{ duration: 0.15 }}
                                className="inline-flex"
                            >
                                <ChevronRight className="w-3 h-3 mr-2" style={{ color: 'var(--text-muted)' }} />
                            </motion.span>
                            <Folder className="w-3.5 h-3.5 mr-2" style={{ color: '#E99287' }} fill="#E99287" />
                            <span style={{ color: activeTab === 'bio' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>bio</span>
                        </button>
                        <AnimatePresence>
                            {openFolders['bio'] && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                                    style={{ overflow: 'hidden' }}
                                    className="ml-4 pl-4"
                                >
                                    <div
                                        onClick={() => setActiveTab('personal-info')}
                                        className="flex items-center px-4 py-1 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                                    >
                                        <FileText className="w-3.5 h-3.5 mr-2" style={{ color: '#FFA657' }} />
                                        <span style={{ color: activeTab === 'personal-info' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                            my-bio.md
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Interests Folder */}
                    <motion.div variants={prefersReduced ? {} : fadeUp}>
                        <button
                            onClick={() => toggleFolder('interests')}
                            className="w-full flex items-center px-6 py-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        >
                            <motion.span
                                animate={{ rotate: openFolders['interests'] ? 90 : 0 }}
                                transition={{ duration: 0.15 }}
                                className="inline-flex"
                            >
                                <ChevronRight className="w-3 h-3 mr-2" style={{ color: 'var(--text-muted)' }} />
                            </motion.span>
                            <Folder className="w-3.5 h-3.5 mr-2" style={{ color: '#43D9AD' }} fill="#43D9AD" />
                            <span style={{ color: 'var(--text-secondary)' }}>hobbies</span>
                        </button>
                        <AnimatePresence>
                            {openFolders['interests'] && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                                    style={{ overflow: 'hidden' }}
                                    className="ml-4 pl-4"
                                >
                                    <div
                                        onClick={() => setActiveTab('hobbies')}
                                        className="flex items-center px-4 py-1 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                                    >
                                        <FileCode className="w-3.5 h-3.5 mr-2" style={{ color: 'var(--ide-accent)' }} />
                                        <span style={{ color: activeTab === 'hobbies' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                            hobbies.ts
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Education Folder */}
                    <motion.div variants={prefersReduced ? {} : fadeUp}>
                        <button
                            onClick={() => toggleFolder('education')}
                            className="w-full flex items-center px-6 py-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        >
                            <motion.span
                                animate={{ rotate: openFolders['education'] ? 90 : 0 }}
                                transition={{ duration: 0.15 }}
                                className="inline-flex"
                            >
                                <ChevronRight className="w-3 h-3 mr-2" style={{ color: 'var(--text-muted)' }} />
                            </motion.span>
                            <Folder className="w-3.5 h-3.5 mr-2" style={{ color: '#3A49A4' }} fill="#3A49A4" />
                            <span style={{ color: 'var(--text-secondary)' }}>education</span>
                        </button>
                        <AnimatePresence>
                            {openFolders['education'] && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                                    style={{ overflow: 'hidden' }}
                                    className="ml-4 pl-4"
                                >
                                    <div
                                        className="flex items-center px-4 py-1 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                                        onClick={() => setActiveTab('education')}
                                    >
                                        <FileCode className="w-3.5 h-3.5 mr-2" style={{ color: 'var(--syntax-string)' }} />
                                        <span style={{ color: activeTab === 'education' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                            Education.tsx
                                        </span>
                                    </div>
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
                        <button
                            onClick={() => toggleFolder('contacts')}
                            className="w-full flex items-center px-4 py-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        >
                            <motion.span
                                animate={{ rotate: openFolders['contacts'] ? 0 : -90 }}
                                transition={{ duration: 0.15 }}
                                className="inline-flex"
                            >
                                <ChevronDown className="w-3 h-3 mr-2" style={{ color: 'var(--text-muted)' }} />
                            </motion.span>
                            <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>contacts</span>
                        </button>
                        <AnimatePresence>
                            {openFolders['contacts'] && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                                    style={{ overflow: 'hidden' }}
                                    className="mt-1"
                                >
                                    <div className="flex items-center px-4 py-1 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                                        <Mail className="w-3.5 h-3.5 mr-2" style={{ color: 'var(--text-muted)' }} />
                                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>fegrolla0210@gmail.com</span>
                                    </div>
                                    <div className="flex items-center px-4 py-1 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                                        <Phone className="w-3.5 h-3.5 mr-2" style={{ color: 'var(--text-muted)' }} />
                                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>+55 (11) 99770-5370</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </motion.aside>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    className="flex-1 flex overflow-hidden"
                    initial={prefersReduced ? {} : { opacity: 0, x: 8 }}
                    animate={prefersReduced ? {} : { opacity: 1, x: 0 }}
                    exit={prefersReduced ? {} : { opacity: 0, x: -8 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                    {activeTab === 'personal-info' ? <Bio /> :
                        activeTab === 'hobbies' ? <Hobbie /> :
                            activeTab === 'education' ? <Education /> :
                                <Bio />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
