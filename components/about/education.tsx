import React from 'react';
import {
    X,
    GraduationCap,
    BookOpen,
    Calendar,
    School
} from 'lucide-react';

export default function Education() {
    return (
        <>
            {/* CENTER - CODE EDITOR */}
            <main className="flex-1 flex flex-col border-r border-slate-200 dark:border-[#1E2D3D] min-h-[500px] transition-colors duration-300">

                {/* Tabs */}
                <div className="h-10 flex border-b border-slate-200 dark:border-[#1E2D3D] transition-colors duration-300">
                    <div className="px-6 flex items-center border-r border-slate-200 dark:border-[#1E2D3D] bg-slate-100 dark:bg-[#011627] border-t-2 border-t-[#FEA55F] text-slate-700 dark:text-white font-mono text-sm transition-colors duration-300 italic">
                        <span>Educação.tsx</span>
                        <X className="w-3 h-3 ml-3 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer" />
                    </div>
                </div>

                {/* Code View */}
                <div className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-[#011627] transition-colors duration-300">
                    <div className="flex font-mono text-sm leading-relaxed">
                        {/* Line Numbers */}
                        <div className="flex flex-col text-slate-300 dark:text-[#607B96] text-right pr-6 select-none transition-colors duration-300">
                            {Array.from({ length: 45 }, (_, i) => (
                                <span key={i + 1}>{i + 1}</span>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="flex flex-col">
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors">/**</span>
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors"><span className="mr-8">*</span>Academic background component</span>
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors">*/</span>

                            <div className="mt-2">
                                <span className="text-purple-600 dark:text-[#C98BDF] transition-colors">import</span>{' '}
                                <span className="text-slate-800 dark:text-white transition-colors">React</span>{' '}
                                <span className="text-purple-600 dark:text-[#C98BDF] transition-colors">from</span>{' '}
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">'react'</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">;</span>
                            </div>

                            <div className="mt-4">
                                <span className="text-purple-600 dark:text-[#C98BDF] transition-colors">export default function</span>{' '}
                                <span className="text-blue-600 dark:text-[#61AFEF] transition-colors">Education</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">()</span>{' '}
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">{'{'}</span>
                            </div>

                            <div className="pl-4 mt-1">
                                <span className="text-purple-600 dark:text-[#C98BDF] transition-colors">return</span>{' '}
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">(</span>
                            </div>

                            <div className="pl-8">
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">{'<'}</span>
                                <span className="text-rose-500 dark:text-[#E06C75] transition-colors">Timeline</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">{'>'}</span>
                            </div>

                            {/* Degree 1 - Controle e Automação */}
                            <div className="pl-12">
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">{'<'}</span>
                                <span className="text-rose-500 dark:text-[#E06C75] transition-colors">Academic</span>
                            </div>
                            <div className="pl-16">
                                <span className="text-yellow-600 dark:text-[#D19A66] transition-colors">level</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">=</span>
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Bacharelado"</span>
                            </div>
                            <div className="pl-16">
                                <span className="text-yellow-600 dark:text-[#D19A66] transition-colors">course</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">=</span>
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Engenharia de Controle e Automação"</span>
                            </div>
                            <div className="pl-16">
                                <span className="text-yellow-600 dark:text-[#D19A66] transition-colors">institution</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">=</span>
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"PUC Campinas"</span>
                            </div>
                            <div className="pl-16">
                                <span className="text-yellow-600 dark:text-[#D19A66] transition-colors">period</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">=</span>
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Desde 2025"</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">{'/>'}</span>
                            </div>

                            {/* Degree 2 - Computação */}
                            <div className="pl-12 mt-2">
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">{'<'}</span>
                                <span className="text-rose-500 dark:text-[#E06C75] transition-colors">Academic</span>
                            </div>
                            <div className="pl-16">
                                <span className="text-yellow-600 dark:text-[#D19A66] transition-colors">level</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">=</span>
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Bacharelado"</span>
                            </div>
                            <div className="pl-16">
                                <span className="text-yellow-600 dark:text-[#D19A66] transition-colors">course</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">=</span>
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Engenharia de Computação"</span>
                            </div>
                            <div className="pl-16">
                                <span className="text-yellow-600 dark:text-[#D19A66] transition-colors">institution</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">=</span>
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"PUC Campinas"</span>
                            </div>
                            <div className="pl-16">
                                <span className="text-yellow-600 dark:text-[#D19A66] transition-colors">period</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">=</span>
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"2024 - 2024"</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">{'/>'}</span>
                            </div>

                            {/* Degree 3 - High School */}
                            <div className="pl-12 mt-2">
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">{'<'}</span>
                                <span className="text-rose-500 dark:text-[#E06C75] transition-colors">Academic</span>
                            </div>
                            <div className="pl-16">
                                <span className="text-yellow-600 dark:text-[#D19A66] transition-colors">level</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">=</span>
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Ensino Médio"</span>
                            </div>
                            <div className="pl-16">
                                <span className="text-yellow-600 dark:text-[#D19A66] transition-colors">institution</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">=</span>
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Colégio Objetivo"</span>
                            </div>
                            <div className="pl-16">
                                <span className="text-yellow-600 dark:text-[#D19A66] transition-colors">period</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">=</span>
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"2021 - 2023"</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">{'/>'}</span>
                            </div>

                            <div className="pl-8">
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">{'</'}</span>
                                <span className="text-rose-500 dark:text-[#E06C75] transition-colors">Timeline</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">{'>'}</span>
                            </div>

                            <div className="pl-4">
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">);</span>
                            </div>

                            <div>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">{'}'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* RIGHT SIDEBAR - PREVIEW */}
            <aside className="hidden xl:flex w-[500px] flex-col border-l border-slate-200 dark:border-[#1E2D3D] transition-colors duration-300">

                {/* Header */}
                <div className="h-10 flex items-center px-4 border-b border-slate-200 dark:border-[#1E2D3D] transition-colors duration-300">
                    <span className="text-sm text-slate-600 dark:text-gray-400 font-mono">// UI Preview</span>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">

                    {/* Card 1 - Controle e Automação */}
                    <div className="relative bg-white dark:bg-[#011627] border border-slate-200 dark:border-[#1E2D3D] rounded-xl shadow-lg p-6 group transition-all duration-300 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-purple-500/10 dark:hover:shadow-purple-900/20">
                        {/* Decorative ribbon */}
                        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-xl">
                            <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-20 h-2 bg-purple-500"></div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <GraduationCap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Engenharia de Controle e Automação</h3>
                                <div className="flex items-center gap-2 mt-1 text-slate-600 dark:text-gray-300">
                                    <School className="w-4 h-4 text-slate-400 dark:text-gray-500" />
                                    <span>PUC Campinas</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-gray-400">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Desde 2025</span>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 text-xs rounded-full bg-slate-100 dark:bg-[#1E2D3D] text-slate-600 dark:text-gray-400">Automação</span>
                                        <span className="px-2 py-1 text-xs rounded-full bg-slate-100 dark:bg-[#1E2D3D] text-slate-600 dark:text-gray-400">Robótica</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 - Computação */}
                    <div className="relative bg-white dark:bg-[#011627] border border-slate-200 dark:border-[#1E2D3D] rounded-xl shadow-lg p-6 group transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Engenharia de Computação</h3>
                                <div className="flex items-center gap-2 mt-1 text-slate-600 dark:text-gray-300">
                                    <School className="w-4 h-4 text-slate-400 dark:text-gray-500" />
                                    <span>PUC Campinas</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-gray-400">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>2024 - 2024</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 text-xs rounded-full bg-slate-100 dark:bg-[#1E2D3D] text-slate-600 dark:text-gray-400">Programação</span>
                                        <span className="px-2 py-1 text-xs rounded-full bg-slate-100 dark:bg-[#1E2D3D] text-slate-600 dark:text-gray-400">Eletrônica Básica</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 - High School (Preserved) */}
                    <div className="relative bg-white dark:bg-[#011627] border border-slate-200 dark:border-[#1E2D3D] rounded-xl shadow-lg p-6 group transition-all duration-300 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-emerald-500/10 dark:hover:shadow-emerald-900/20">

                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                <BookOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Ensino Médio</h3>
                                <div className="flex items-center gap-2 mt-1 text-slate-600 dark:text-gray-300">
                                    <School className="w-4 h-4 text-slate-400 dark:text-gray-500" />
                                    <span>Colégio Objetivo</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-gray-400">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>2021 - 2023</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </aside>
        </>
    );
}
