"use client"

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
import Bio from '@/components/about/bio';
import Hobbie from '@/components/about/hobbie';
import Education from '@/components/about/education';
import Image from 'next/image';

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState('personal-info');
    const [openFolders, setOpenFolders] = useState({
        'personal-info': true,
        'bio': true,
        'interests': false,
        'education': false,
        'contacts': true
    });

    const toggleFolder = (folder: string) => {
        setOpenFolders(prev => ({
            ...prev,
            [folder]: !prev[folder as keyof typeof prev]
        }));
    };

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 dark:bg-[#011627] transition-colors duration-300">

            {/* FAR LEFT ICON SIDEBAR */}
            <aside className="hidden md:flex flex-col w-12 border-r border-slate-200 dark:border-[#1E2D3D] bg-slate-100 dark:bg-[#011627] items-center py-4 gap-6 transition-colors duration-300">
                <Terminal className="w-5 h-5 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 cursor-pointer transition-colors" />
                <div className="w-5 h-5 rounded-full bg-slate-300 dark:bg-gray-600 opacity-50"></div>
                <Gamepad2 className="w-5 h-5 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 cursor-pointer transition-colors" />
            </aside>

            {/* EXPLORER SIDEBAR */}
            <aside className="w-full md:w-[220px] lg:w-[260px] border-r border-slate-200 dark:border-[#1E2D3D] flex flex-col bg-slate-100 dark:bg-[#011627] transition-colors duration-300">

                {/* Sidebar Header */}
                <div className="h-10 flex items-center px-4 border-b border-slate-200 dark:border-[#1E2D3D] transition-colors duration-300">
                    <ChevronDown className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-sm text-slate-600 dark:text-gray-400 font-mono">personal-info</span>
                </div>

                {/* Folders */}
                <div className="flex-1 overflow-y-auto py-2 font-mono text-sm">
                    {/* Bio Folder */}
                    <div>
                        <button
                            onClick={() => toggleFolder('bio')}
                            className="w-full flex items-center px-6 py-1 hover:bg-slate-200 dark:hover:bg-[#1E2D3D]/50 transition-colors"
                        >
                            <ChevronRight className={`w-3 h-3 text-slate-400 mr-2 transition-transform ${openFolders['bio'] ? 'rotate-90' : ''}`} />
                            <Folder className="w-3.5 h-3.5 text-[#E99287] mr-2" fill="#E99287" />
                            <span className={`text-slate-600 dark:text-gray-400 transition-colors ${activeTab === 'bio' ? 'text-slate-900 dark:text-white' : ''}`}>bio</span>
                        </button>

                        {openFolders['bio'] && (
                            <div className="ml-4 pl-4 transition-colors duration-300">
                                <div onClick={() => setActiveTab('personal-info')} className="flex items-center px-4 py-1 cursor-pointer hover:bg-slate-200 dark:hover:bg-[#1E2D3D]/30 transition-colors group">
                                    <FileText className="w-3.5 h-3.5 text-yellow-500 mr-2 group-hover:text-yellow-600" />
                                    <span className={`transition-colors ${activeTab === 'personal-info' ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300'}`}>my-bio.md</span>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Interests Folder */}
                    <div>
                        <button
                            onClick={() => toggleFolder('interests')}
                            className="w-full flex items-center px-6 py-1 hover:bg-slate-200 dark:hover:bg-[#1E2D3D]/50 transition-colors"
                        >
                            <ChevronRight className={`w-3 h-3 text-slate-400 mr-2 transition-transform ${openFolders['interests'] ? 'rotate-90' : ''}`} />
                            <Folder className="w-3.5 h-3.5 text-[#43D9AD] mr-2" fill="#43D9AD" />
                            <span className="text-slate-600 dark:text-gray-400 transition-colors">hobbies</span>
                        </button>

                        {openFolders['interests'] && (
                            <div className="ml-4 pl-4 transition-colors duration-300">
                                <div onClick={() => setActiveTab('hobbies')} className="flex items-center px-4 py-1 cursor-pointer hover:bg-slate-200 dark:hover:bg-[#1E2D3D]/30 transition-colors group">
                                    <FileCode className="w-3.5 h-3.5 text-blue-500 mr-2 group-hover:text-blue-600" />
                                    <span className={`transition-colors ${activeTab === 'hobbies' ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300'}`}>hobbies.ts</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Education Folder */}
                    <div>
                        <button
                            onClick={() => toggleFolder('education')}
                            className="w-full flex items-center px-6 py-1 hover:bg-slate-200 dark:hover:bg-[#1E2D3D]/50 transition-colors"
                        >
                            <ChevronRight className={`w-3 h-3 text-slate-400 mr-2 transition-transform ${openFolders['education'] ? 'rotate-90' : ''}`} />
                            <Folder className="w-3.5 h-3.5 text-[#3A49A4] mr-2" fill="#3A49A4" />
                            <span className="text-slate-600 dark:text-gray-400 transition-colors">education</span>
                        </button>

                        {openFolders['education'] && (
                            <div className="ml-4 pl-4 transition-colors duration-300">
                                <div
                                    className="flex items-center px-4 py-1 cursor-pointer hover:bg-slate-200 dark:hover:bg-[#1E2D3D]/30 transition-colors group"
                                    onClick={() => setActiveTab('education')}
                                >
                                    <FileCode className="w-3.5 h-3.5 text-sky-400 mr-2 group-hover:text-sky-500" />
                                    <span className={`text-slate-500 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300 ${activeTab === 'education' ? 'text-slate-700 dark:text-gray-200' : ''}`}>Education.tsx</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contacts Section */}
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-[#1E2D3D]">
                        <button
                            onClick={() => toggleFolder('contacts')}
                            className="w-full flex items-center px-4 py-1 hover:bg-slate-200 dark:hover:bg-[#1E2D3D]/50 transition-colors"
                        >
                            <ChevronDown className={`w-3 h-3 text-slate-400 mr-2 transition-transform ${openFolders['contacts'] ? '' : '-rotate-90'}`} />
                            <span className="text-slate-600 dark:text-gray-400 font-mono">contacts</span>
                        </button>

                        {openFolders['contacts'] && (
                            <div className="mt-1 transition-colors duration-300">
                                <div className="flex items-center px-4 py-1 cursor-pointer hover:bg-slate-200 dark:hover:bg-[#1E2D3D]/30 transition-colors">
                                    <Mail className="w-3.5 h-3.5 text-slate-400 mr-2" />
                                    <span className="text-slate-500 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300">fegrolla0210@gmail.com</span>
                                </div>
                                <div className="flex items-center px-4 py-1 cursor-pointer hover:bg-slate-200 dark:hover:bg-[#1E2D3D]/30 transition-colors">
                                    <Phone className="w-3.5 h-3.5 text-slate-400 mr-2" />
                                    <span className="text-slate-500 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300">+55 (11) 99770-5370</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {activeTab === 'personal-info' ? <Bio /> :
                activeTab === 'hobbies' ? <Hobbie /> :
                    activeTab === 'education' ? <Education /> :
                        <Bio />}
        </div>
    );
}
