'use client'

import React from 'react';
import Link from 'next/link';
import { ModeToggle } from './mode-toggle';

export default function Header() {
    return (
        <header className="h-14 border-b border-slate-200 dark:border-[#1E2D3D] bg-white dark:bg-[#011627] transition-colors duration-300">
            <nav className="w-full h-full flex items-center justify-between">
                {/* Left side - Logo and main navigation */}
                <div className="flex items-center h-full">
                    {/* Logo/Name - Aligned with Left Sidebar (Icon + Explorer) */}
                    <div className="w-[268px] lg:w-[308px] h-full flex items-center pl-6 border-r border-slate-200 dark:border-[#1E2D3D] transition-all duration-300">
                        <Link
                            href="/"
                            className="text-sm font-mono text-slate-700 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            Felipe Grolla
                        </Link>
                    </div>

                    {/* Main Navigation Links */}
                    <div className="flex gap-6 pl-6">
                        <Link
                            href="/"
                            className="text-sm font-mono text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors relative group"
                        >
                            <span className="relative">
                                _hello
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                            </span>
                        </Link>

                        <Link
                            href="/about"
                            className="text-sm font-mono text-gray-400 hover:text-white transition-colors relative group"
                        >
                            <span className="relative">
                                _about-me
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                            </span>
                        </Link>

                        <Link
                            href="/projects"
                            className="text-sm font-mono text-gray-400 hover:text-white transition-colors relative group"
                        >
                            <span className="relative">
                                _projects
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                        </span>
                    </Link>
                </div>
            </div>

                {/* Right side - Contact link and Theme Toggle */}
                <div className="flex items-center h-full">
                    <Link
                        href="/contact"
                        className="text-sm font-mono text-gray-400 hover:text-white transition-colors relative group px-6 h-full flex items-center border-l border-transparent"
                    >
                        <span className="relative">
                            _contact-me
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                        </span>
                    </Link>

                    {/* Theme Toggle - Aligned with Right Sidebar (500px) */}
                    <div className="w-[500px] h-full flex items-center border-l border-slate-200 dark:border-[#1E2D3D] pl-6">
                        <ModeToggle />
                    </div>
                </div>
            </nav>
        </header>
    );
}