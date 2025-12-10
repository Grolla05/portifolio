import React from 'react';
import {
    Terminal,
    MapPin,
    Gamepad2,
    Coffee,
    X,
    Music,
    Trophy
} from 'lucide-react';

export default function Hobbie() {
    return (
        <>
            {/* CENTER - CODE EDITOR */}
            <main className="flex-1 flex flex-col border-r border-slate-200 dark:border-[#1E2D3D] min-h-[500px] transition-colors duration-300">

                {/* Tabs */}
                <div className="h-10 flex border-b border-slate-200 dark:border-[#1E2D3D] transition-colors duration-300">
                    <div className="px-6 flex items-center border-r border-slate-200 dark:border-[#1E2D3D] bg-slate-100 dark:bg-[#011627] border-t-2 border-t-[#FEA55F] text-slate-700 dark:text-white font-mono text-sm transition-colors duration-300 italic">
                        <span>hobbies.ts</span>
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
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors"><span className="mr-8">*</span>Hobby list configuration</span>
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors"><span className="mr-8">*</span>@type {'{Hobby[]}'}</span>
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors">*/</span>

                            <div className="mt-2">
                                <span className="text-purple-600 dark:text-[#C98BDF] transition-colors">interface</span>{' '}
                                <span className="text-yellow-600 dark:text-[#E5C07B] transition-colors">Hobby</span>{' '}
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">{'{'}</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-rose-500 dark:text-[#E06C75] transition-colors">name</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">:</span>{' '}
                                <span className="text-yellow-600 dark:text-[#E5C07B] transition-colors">string</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">;</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-rose-500 dark:text-[#E06C75] transition-colors">description</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">:</span>{' '}
                                <span className="text-yellow-600 dark:text-[#E5C07B] transition-colors">string</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">;</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-rose-500 dark:text-[#E06C75] transition-colors">items</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">?:</span>{' '}
                                <span className="text-yellow-600 dark:text-[#E5C07B] transition-colors">string</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">[];</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-rose-500 dark:text-[#E06C75] transition-colors">teams</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">?:</span>{' '}
                                <span className="text-yellow-600 dark:text-[#E5C07B] transition-colors">string</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">[];</span>
                            </div>
                            <span className="text-slate-500 dark:text-gray-400 transition-colors">{'}'}</span>

                            <div className="mt-4">
                                <span className="text-purple-600 dark:text-[#C98BDF] transition-colors">const</span>{' '}
                                <span className="text-blue-600 dark:text-[#61AFEF] transition-colors">hobbies</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">:</span>{' '}
                                <span className="text-yellow-600 dark:text-[#E5C07B] transition-colors">Hobby</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">[]</span>{' '}
                                <span className="text-emerald-600 dark:text-[#56B6C2] transition-colors">=</span>{' '}
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">[</span>
                            </div>

                            {/* Gaming */}
                            <div className="pl-4">
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">{'{'}</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-rose-500 dark:text-[#E06C75] transition-colors">name</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">:</span>{' '}
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Gaming"</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-rose-500 dark:text-[#E06C75] transition-colors">description</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">:</span>{' '}
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Explorando novos mundos e desafios estratégicos"</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-rose-500 dark:text-[#E06C75] transition-colors">items</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">:</span>{' '}
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">[</span>
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Valorant"</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>{' '}
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"CS-GO 2"</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>{' '}
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Fortnite"</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>{' '}
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Minecraft"</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>{' '}
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Bloons TD"</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">]</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">{'}'}</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>
                            </div>

                            {/* Music */}
                            <div className="pl-4 mt-1">
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">{'{'}</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-rose-500 dark:text-[#E06C75] transition-colors">name</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">:</span>{' '}
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Music"</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-rose-500 dark:text-[#E06C75] transition-colors">description</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">:</span>{' '}
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Sou um jovem de 20 anos com alma de 67 (segundo o Spotify)"</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-rose-500 dark:text-[#E06C75] transition-colors">items</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">:</span>{' '}
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">[</span>
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"MPB"</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>{' '}
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Rock"</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>{' '}
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Pop"</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>{' '}
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Reggae"</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">]</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">{'}'}</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>
                            </div>

                            {/* Futebol & Basquete */}
                            <div className="pl-4 mt-1">
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">{'{'}</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-rose-500 dark:text-[#E06C75] transition-colors">name</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">:</span>{' '}
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Futebol & Basquete"</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-rose-500 dark:text-[#E06C75] transition-colors">description</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">:</span>{' '}
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Sou um amante dos dois esportes!!"</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-rose-500 dark:text-[#E06C75] transition-colors">teams</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">:</span>{' '}
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">[</span>
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Corinthians"</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>{' '}
                                <span className="text-yellow-600 dark:text-[#98C379] transition-colors">"Lakers"</span>
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">]</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-slate-500 dark:text-gray-400 transition-colors">{'}'}</span>
                            </div>

                            <div className="text-slate-500 dark:text-gray-400 transition-colors">];</div>
                        </div>
                    </div>
                </div>
            </main>

            {/* RIGHT SIDEBAR - HOBBIES PREVIEW */}
            <aside className="hidden xl:flex w-[500px] flex-col border-l border-slate-200 dark:border-[#1E2D3D] transition-colors duration-300">

                {/* Header */}
                <div className="h-10 flex items-center px-4 border-b border-slate-200 dark:border-[#1E2D3D] transition-colors duration-300">
                    <span className="text-sm text-slate-600 dark:text-gray-400 font-mono">// Hobbies preview</span>
                </div>

                {/* Hobbies Grid */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">

                    {/* Item 1 */}
                    <div className="bg-slate-100 dark:bg-[#011221] border border-slate-200 dark:border-[#1E2D3D] rounded-lg p-4 transition-colors duration-300">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                                <Gamepad2 className="w-5 h-5" />
                            </div>
                            <h3 className="font-medium text-slate-700 dark:text-gray-200">Gaming</h3>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-gray-400 mb-2">
                            Explorando novos mundos e desafios estratégicos.
                        </p>
                        <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-[#1E2D3D] text-slate-600 dark:text-gray-400">Valorant</span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-[#1E2D3D] text-slate-600 dark:text-gray-400">CS-GO 2</span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-[#1E2D3D] text-slate-600 dark:text-gray-400">Fortnite</span>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="bg-slate-100 dark:bg-[#011221] border border-slate-200 dark:border-[#1E2D3D] rounded-lg p-4 transition-colors duration-300">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                <Music className="w-5 h-5" />
                            </div>
                            <h3 className="font-medium text-slate-700 dark:text-gray-200">Music</h3>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-gray-400 mb-2">
                            Jovem de 20 anos com alma de 67 (Spotify).
                        </p>
                        <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-[#1E2D3D] text-slate-600 dark:text-gray-400">MPB</span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-[#1E2D3D] text-slate-600 dark:text-gray-400">Rock</span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-[#1E2D3D] text-slate-600 dark:text-gray-400">Pop</span>
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="bg-slate-100 dark:bg-[#011221] border border-slate-200 dark:border-[#1E2D3D] rounded-lg p-4 transition-colors duration-300">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                                <Trophy className="w-5 h-5" />
                            </div>
                            <h3 className="font-medium text-slate-700 dark:text-gray-200">Futebol & Basquete</h3>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-gray-400 mb-2">
                            Amante dos dois esportes!!
                        </p>
                        <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-[#1E2D3D] text-slate-600 dark:text-gray-400">Corinthians</span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-[#1E2D3D] text-slate-600 dark:text-gray-400">Lakers</span>
                        </div>
                    </div>

                </div>
            </aside>
        </>
    );
}
