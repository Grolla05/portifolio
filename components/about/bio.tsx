import React from 'react';
import {
    User,
    X,
    Star,
    MessageSquare
} from 'lucide-react';

export default function Bio() {
    return (
        <>
            {/* CENTER - CODE EDITOR */}
            <main className="flex-1 flex flex-col border-r border-slate-200 dark:border-[#1E2D3D] min-h-[500px] transition-colors duration-300">

                {/* Tabs */}
                <div className="h-10 flex border-b border-slate-200 dark:border-[#1E2D3D] transition-colors duration-300">
                    <div className="px-6 flex items-center border-r border-slate-200 dark:border-[#1E2D3D] bg-slate-100 dark:bg-[#011627] border-t-2 border-t-[#FEA55F] text-slate-700 dark:text-white font-mono text-sm transition-colors duration-300 italic">
                        <span>my-bio.md</span>
                        <X className="w-3 h-3 ml-3 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer" />
                    </div>
                </div>

                {/* Code View */}
                <div className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-[#011627] transition-colors duration-300">
                    <div className="flex font-mono text-sm leading-relaxed">
                        {/* Line Numbers */}
                        <div className="flex flex-col text-slate-300 dark:text-[#607B96] text-right pr-6 select-none transition-colors duration-300">
                            {Array.from({ length: 16 }, (_, i) => (
                                <span key={i + 1}>{i + 1}</span>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="flex flex-col">
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors">/**</span>
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors"><span className="mr-8">*</span>About me</span>
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors"><span className="mr-8">*</span>I have 5 years of experience in web</span>
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors"><span className="mr-8">*</span>development lorem ipsum dolor sit amet,</span>
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors"><span className="mr-8">*</span>consectetur adipiscing elit, sed do eiusmod</span>
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors"><span className="mr-8">*</span>tempor incididunt ut labore et dolore</span>
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors"><span className="mr-8">*</span>magna aliqua. Ut enim ad minim veniam,</span>
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors"><span className="mr-8">*</span>quis nostrud exercitation ullamco laboris</span>
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors"><span className="mr-8">*</span>nisi ut aliquip ex ea commodo consequat.</span>
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors"><span className="mr-8">*</span>Duis aute irure dolor in reprehenderit in</span>
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors"><span className="mr-8">*</span></span>
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors"><span className="mr-8">*</span>Duis aute irure dolor in reprehenderit in</span>
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors"><span className="mr-8">*</span>voluptate velit esse cillum dolore eu fugiat</span>
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors"><span className="mr-8">*</span>nulla pariatur. Excepteur sint occaecat</span>
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors"><span className="mr-8">*</span>officia deserunt mollit anim id est laborum.</span>
                            <span className="text-slate-400 dark:text-[#607B96] transition-colors">*/</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* RIGHT SIDEBAR - SNIPPETS */}
            <aside className="hidden xl:flex w-[500px] flex-col border-l border-slate-200 dark:border-[#1E2D3D] transition-colors duration-300">

                {/* Header */}
                <div className="h-10 flex items-center px-4 border-b border-slate-200 dark:border-[#1E2D3D] transition-colors duration-300">
                    <span className="text-sm text-slate-600 dark:text-gray-400 font-mono">// Code snippet showcase:</span>
                </div>

                {/* Snippets Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">

                    {/* Snippet Card 1 */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-gray-700 flex items-center justify-center">
                                    <User className="w-4 h-4 text-slate-600 dark:text-gray-300" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-blue-700 dark:text-[#5565E8] transition-colors">@Grolla05</span>
                                    <span className="text-xs text-slate-400 dark:text-gray-500">Created 5 months ago</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="text-xs">details</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4" />
                                    <span className="text-xs">3 stars</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-100 dark:bg-[#011221] border border-slate-200 dark:border-[#1E2D3D] rounded-lg p-4 font-mono text-xs whitespace-pre-wrap break-words transition-colors duration-300">
                            <pre>
                                <code>
                                    <span className="text-purple-600 dark:text-[#C98BDF] transition-colors">function</span>{' '}
                                    <span className="text-yellow-600 dark:text-[#E5C07B] transition-colors">initializeModelChunk</span>
                                    <span className="text-emerald-600 dark:text-[#43D9AD] transition-colors">{'<T>'}</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">(</span>
                                    <span className="text-rose-500 dark:text-[#E06C75] transition-colors">chunk</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">:</span>{' '}
                                    <span className="text-yellow-600 dark:text-[#E5C07B] transition-colors">ResolvedModelChunk</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">):</span>{' '}
                                    <span className="text-emerald-600 dark:text-[#43D9AD] transition-colors">T</span>{' '}
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">{'{'}</span>
                                    {'\n  '}
                                    <span className="text-purple-600 dark:text-[#C98BDF] transition-colors">const</span>{' '}
                                    <span className="text-slate-800 dark:text-white transition-colors">value</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">:</span>{' '}
                                    <span className="text-emerald-600 dark:text-[#43D9AD] transition-colors">T</span>{' '}
                                    <span className="text-emerald-600 dark:text-[#56B6C2] transition-colors">=</span>{' '}
                                    <span className="text-blue-600 dark:text-[#61AFEF] transition-colors">parseModel</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">(</span>
                                    <span className="text-rose-500 dark:text-[#E06C75] transition-colors">chunk</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">.</span>
                                    <span className="text-slate-800 dark:text-white transition-colors">_response</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>{' '}
                                    <span className="text-rose-500 dark:text-[#E06C75] transition-colors">chunk</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">.</span>
                                    <span className="text-slate-800 dark:text-white transition-colors">_value</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">);</span>
                                    {'\n  '}
                                    <span className="text-purple-600 dark:text-[#C98BDF] transition-colors">const</span>{' '}
                                    <span className="text-slate-800 dark:text-white transition-colors">initializedChunk</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">:</span>{' '}
                                    <span className="text-yellow-600 dark:text-[#E5C07B] transition-colors">InitializedChunk</span>
                                    <span className="text-emerald-600 dark:text-[#43D9AD] transition-colors">{'<T>'}</span>{' '}
                                    <span className="text-emerald-600 dark:text-[#56B6C2] transition-colors">=</span>{' '}
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">(</span>
                                    <span className="text-rose-500 dark:text-[#E06C75] transition-colors">chunk</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">:</span>{' '}
                                    <span className="text-yellow-600 dark:text-[#E5C07B] transition-colors">any</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">);</span>
                                    {'\n  '}
                                    <span className="text-slate-800 dark:text-white transition-colors">initializedChunk</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">.</span>
                                    <span className="text-slate-800 dark:text-white transition-colors">_status</span>{' '}
                                    <span className="text-emerald-600 dark:text-[#56B6C2] transition-colors">=</span>{' '}
                                    <span className="text-yellow-600 dark:text-[#E5C07B] transition-colors">INITIALIZED</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">;</span>
                                    {'\n  '}
                                    <span className="text-slate-800 dark:text-white transition-colors">initializedChunk</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">.</span>
                                    <span className="text-slate-800 dark:text-white transition-colors">_value</span>{' '}
                                    <span className="text-emerald-600 dark:text-[#56B6C2] transition-colors">=</span>{' '}
                                    <span className="text-slate-800 dark:text-white transition-colors">value</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">;</span>
                                    {'\n  '}
                                    <span className="text-purple-600 dark:text-[#C98BDF] transition-colors">return</span>{' '}
                                    <span className="text-slate-800 dark:text-white transition-colors">value</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">;</span>
                                    {'\n'}
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">{'}'}</span>
                                </code>
                            </pre>
                        </div>
                    </div>

                    {/* Snippet Card 2 */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-gray-700 flex items-center justify-center">
                                    <User className="w-4 h-4 text-slate-600 dark:text-gray-300" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-blue-700 dark:text-[#5565E8] transition-colors">@Grolla05</span>
                                    <span className="text-xs text-slate-400 dark:text-gray-500">Created 9 months ago</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="text-xs">details</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4" />
                                    <span className="text-xs">0 stars</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-100 dark:bg-[#011221] border border-slate-200 dark:border-[#1E2D3D] rounded-lg p-4 font-mono text-xs whitespace-pre-wrap break-words transition-colors duration-300">
                            <pre>
                                <code>
                                    <span className="text-purple-600 dark:text-[#C98BDF] transition-colors">export function</span>{' '}
                                    <span className="text-blue-600 dark:text-[#61AFEF] transition-colors">parseModelTuple</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">(</span>
                                    {'\n  '}
                                    <span className="text-rose-500 dark:text-[#E06C75] transition-colors">response</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">:</span>{' '}
                                    <span className="text-yellow-600 dark:text-[#E5C07B] transition-colors">Response</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>
                                    {'\n  '}
                                    <span className="text-rose-500 dark:text-[#E06C75] transition-colors">value</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">:</span>{' '}
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">{'{'}</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">[</span>
                                    <span className="text-rose-500 dark:text-[#E06C75] transition-colors">key</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">:</span>{' '}
                                    <span className="text-yellow-600 dark:text-[#E5C07B] transition-colors">string</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">]:</span>{' '}
                                    <span className="text-yellow-600 dark:text-[#E5C07B] transition-colors">JSONValue</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">{'}'}</span>{' '}
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">|</span>{' '}
                                    <span className="text-yellow-600 dark:text-[#E5C07B] transition-colors">$ReadOnlyArray</span>
                                    <span className="text-emerald-600 dark:text-[#43D9AD] transition-colors">{'<JSONValue>'}</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>
                                    {'\n'}
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">):</span>{' '}
                                    <span className="text-yellow-600 dark:text-[#E5C07B] transition-colors">any</span>{' '}
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">{'{'}</span>
                                    {'\n  '}
                                    <span className="text-purple-600 dark:text-[#C98BDF] transition-colors">const</span>{' '}
                                    <span className="text-slate-800 dark:text-white transition-colors">tuple</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">:</span>{' '}
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">[</span>
                                    <span className="text-yellow-600 dark:text-[#E5C07B] transition-colors">mixed</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>{' '}
                                    <span className="text-yellow-600 dark:text-[#E5C07B] transition-colors">mixed</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>{' '}
                                    <span className="text-yellow-600 dark:text-[#E5C07B] transition-colors">mixed</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">,</span>{' '}
                                    <span className="text-yellow-600 dark:text-[#E5C07B] transition-colors">mixed</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">]</span>{' '}
                                    <span className="text-emerald-600 dark:text-[#56B6C2] transition-colors">=</span>{' '}
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">(</span>
                                    <span className="text-rose-500 dark:text-[#E06C75] transition-colors">value</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">:</span>{' '}
                                    <span className="text-yellow-600 dark:text-[#E5C07B] transition-colors">any</span>
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">);</span>
                                    {'\n'}
                                    <span className="text-slate-500 dark:text-gray-400 transition-colors">{'}'}</span>
                                </code>
                            </pre>
                        </div>
                    </div>

                </div>
            </aside>
        </>
    );
}
