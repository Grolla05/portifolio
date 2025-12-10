import React from 'react';
import Link from 'next/link';
import Header from '@/components/header';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#011627] via-[#011221] to-[#01111d] flex items-center justify-center px-6 py-12">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left side - 404 ASCII Art */}
                <div className="flex justify-center lg:justify-end order-2 lg:order-1">
                    <pre className="text-[#607B96] font-mono leading-tight" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
                        {`██╗  ██╗ ██████╗ ██╗  ██╗
██║  ██║██╔═████╗██║  ██║
███████║██║██╔██║███████║
╚════██║████╔╝██║╚════██║
     ██║╚██████╔╝     ██║
     ╚═╝ ╚═════╝      ╚═╝`}
                    </pre>
                </div>

                {/* Right side - Code Block */}
                <div className="space-y-6 order-1 lg:order-2">
                    <div className="bg-[#011221] rounded-lg border border-[#1E2D3D] overflow-hidden">
                        {/* Code content */}
                        <div className="p-6 font-mono text-sm lg:text-base">
                            <div className="space-y-1">
                                {/* Line 1 */}
                                <div className="flex">
                                    <span className="text-[#607B96] select-none w-12 text-right pr-4">1</span>
                                    <div>
                                        <span className="text-[#C792EA]">const</span>
                                        <span className="text-white"> page = </span>
                                        <span className="text-[#82AAFF]">findPage</span>
                                        <span className="text-white">(</span>
                                        <span className="text-[#C3E88D]">'you-were-looking-for'</span>
                                        <span className="text-white">);</span>
                                    </div>
                                </div>

                                {/* Line 2 - empty */}
                                <div className="flex">
                                    <span className="text-[#607B96] select-none w-12 text-right pr-4">2</span>
                                </div>

                                {/* Line 3 */}
                                <div className="flex">
                                    <span className="text-[#607B96] select-none w-12 text-right pr-4">3</span>
                                    <div>
                                        <span className="text-[#C792EA]">if</span>
                                        <span className="text-white"> (!page) {'{'}</span>
                                    </div>
                                </div>

                                {/* Line 4 */}
                                <div className="flex">
                                    <span className="text-[#607B96] select-none w-12 text-right pr-4">4</span>
                                    <div className="pl-4">
                                        <span className="text-white">console.</span>
                                        <span className="text-[#82AAFF]">log</span>
                                        <span className="text-white">(</span>
                                        <span className="text-[#C3E88D]">"Oops! Looks like you took a wrong turn in the codebase."</span>
                                        <span className="text-white">);</span>
                                    </div>
                                </div>

                                {/* Line 5 */}
                                <div className="flex">
                                    <span className="text-[#607B96] select-none w-12 text-right pr-4">5</span>
                                    <div className="pl-4">
                                        <span className="text-white">console.</span>
                                        <span className="text-[#82AAFF]">log</span>
                                        <span className="text-white">(</span>
                                        <span className="text-[#C3E88D]">"But hey, since you're here..."</span>
                                        <span className="text-white">);</span>
                                    </div>
                                </div>

                                {/* Line 6 */}
                                <div className="flex">
                                    <span className="text-[#607B96] select-none w-12 text-right pr-4">6</span>
                                    <div className="pl-4">
                                        <span className="text-white">console.</span>
                                        <span className="text-[#82AAFF]">log</span>
                                        <span className="text-white">(</span>
                                        <span className="text-[#C3E88D]">"🔙 Go back to the homepage and explore more cool stuff!"</span>
                                        <span className="text-white">);</span>
                                    </div>
                                </div>

                                {/* Line 7 */}
                                <div className="flex">
                                    <span className="text-[#607B96] select-none w-12 text-right pr-4">7</span>
                                    <div className="pl-4">
                                        <span className="text-[#C792EA]">throw new</span>
                                        <span className="text-white"> </span>
                                        <span className="text-[#FFCB6B]">Error</span>
                                        <span className="text-white">(</span>
                                        <span className="text-[#C3E88D]">"404: PageNotFoundError 😢"</span>
                                        <span className="text-white">);</span>
                                    </div>
                                </div>

                                {/* Line 8 */}
                                <div className="flex">
                                    <span className="text-[#607B96] select-none w-12 text-right pr-4">8</span>
                                    <div>
                                        <span className="text-white">{'}'}</span>
                                    </div>
                                </div>

                                {/* Line 9 - empty */}
                                <div className="flex">
                                    <span className="text-[#607B96] select-none w-12 text-right pr-4">9</span>
                                </div>

                                {/* Line 10 */}
                                <div className="flex">
                                    <span className="text-[#607B96] select-none w-12 text-right pr-4">10</span>
                                    <div>
                                        <span className="text-[#607B96]">/* Suggestions:</span>
                                    </div>
                                </div>

                                {/* Line 11 */}
                                <div className="flex">
                                    <span className="text-[#607B96] select-none w-12 text-right pr-4">11</span>
                                    <div>
                                        <span className="text-[#607B96]"> * - Check the URL for typos</span>
                                    </div>
                                </div>

                                {/* Line 12 */}
                                <div className="flex">
                                    <span className="text-[#607B96] select-none w-12 text-right pr-4">12</span>
                                    <div>
                                        <span className="text-[#607B96]"> * - Use the site navigation</span>
                                    </div>
                                </div>

                                {/* Line 13 */}
                                <div className="flex">
                                    <span className="text-[#607B96] select-none w-12 text-right pr-4">13</span>
                                    <div>
                                        <span className="text-[#607B96]"> * - Or hit CMD+Z in real life 😊</span>
                                    </div>
                                </div>

                                {/* Line 14 */}
                                <div className="flex">
                                    <span className="text-[#607B96] select-none w-12 text-right pr-4">14</span>
                                    <div>
                                        <span className="text-[#607B96]"> */</span>
                                    </div>
                                </div>

                                {/* Line 15 - empty */}
                                <div className="flex">
                                    <span className="text-[#607B96] select-none w-12 text-right pr-4">15</span>
                                </div>

                                {/* Line 16 */}
                                <div className="flex">
                                    <span className="text-[#607B96] select-none w-12 text-right pr-4">16</span>
                                    <div>
                                        <span className="text-[#82AAFF]">redirect</span>
                                        <span className="text-white">(</span>
                                        <span className="text-[#C3E88D]">'home'</span>
                                        <span className="text-white">);</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back to Home Button */}
                    <div className="flex justify-start">
                        <Link
                            href="/"
                            className="px-6 py-3 bg-[#1C2B3A] hover:bg-[#263B4A] border border-[#1E2D3D] text-white rounded-lg font-mono text-sm transition-all duration-300 hover:border-[#607B96] inline-flex items-center gap-2"
                        >
                            <span>←</span>
                            <span>Back to Homepage</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}