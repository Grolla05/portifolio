"use client"

import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import {
    Terminal,
    Gamepad2,
    Mail,
    Phone,
    ChevronDown,
    ChevronRight,
    ExternalLink,
    Copy,
    Check
} from 'lucide-react';

export default function ContactPage() {
    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [date] = useState(new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' }));

    // Copy Feedback State
    const [copied, setCopied] = useState(false);

    // Sidebar Folders State
    const [openFolders, setOpenFolders] = useState({
        contacts: true,
        socials: true
    });

    const toggleFolder = (folder: keyof typeof openFolders) => {
        setOpenFolders(prev => ({
            ...prev,
            [folder]: !prev[folder]
        }));
    };

    const handleCopyCode = () => {
        const code = `const button = document.querySelector('#sendBtn');

const message = {
    name: "${name}",
    email: "${email}",
    message: "${message}",
    date: "${date}"
}

button.addEventListener('click', () => {
    form.send(message);
})`;
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const form = useRef<HTMLFormElement>(null);

    const sendEmail = (e: React.FormEvent) => {
        e.preventDefault();

        if (form.current) {
            emailjs.sendForm('service_t1tmh03', 'template_rpvclnm', form.current, {
                publicKey: 'CE7O3eEe9VG24eQB4',
            })
            .then(
                () => {
                    console.log('SUCCESS!');
                    alert('Message sent successfully!');
                },
                (error) => {
                    console.log('FAILED...', error.text);
                    alert(`Failed to send message: ${error.text}`);
                },
            );
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 dark:bg-[#011627] transition-colors duration-300 font-mono">

            {/* 1. FAR LEFT ICON SIDEBAR (Consistent with About) */}
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
                    <span className="text-sm text-slate-600 dark:text-gray-400">contacts</span>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto py-2 text-sm">
                    
                    {/* Contacts Folder */}
                    <div>
                        <button 
                            onClick={() => toggleFolder('contacts')}
                            className="w-full flex items-center px-4 py-1 hover:bg-slate-200 dark:hover:bg-[#1E2D3D]/50 transition-colors group"
                        >
                            <ChevronRight className={`w-3 h-3 text-slate-400 mr-2 transition-transform ${openFolders.contacts ? 'rotate-90' : ''}`} />
                            <span className={`text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors`}>contacts</span>
                        </button>

                        {openFolders.contacts && (
                            <div className="ml-4 pl-0 mt-1 space-y-2">
                                <div className="flex items-center px-4 py-1 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-gray-400 cursor-pointer transition-colors">
                                    <Mail className="w-3.5 h-3.5 mr-2" />
                                    <span className="text-xs">felipegrolla@gmail.com</span>
                                </div>
                                <div className="flex items-center px-4 py-1 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-gray-400 cursor-pointer transition-colors">
                                    <Phone className="w-3.5 h-3.5 mr-2" />
                                    <span className="text-xs">+55 (19) 99999-9999</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Find Me Also In Folder */}
                    <div className="mt-4">
                        <button 
                            onClick={() => toggleFolder('socials')}
                            className="w-full flex items-center px-4 py-1 hover:bg-slate-200 dark:hover:bg-[#1E2D3D]/50 transition-colors group"
                        >
                            <ChevronRight className={`w-3 h-3 text-slate-400 mr-2 transition-transform ${openFolders.socials ? 'rotate-90' : ''}`} />
                            <span className={`text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors`}>find-me-also-in</span>
                        </button>

                        {openFolders.socials && (
                            <div className="ml-4 pl-0 mt-1 space-y-2">
                                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-1 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-gray-400 cursor-pointer transition-colors group">
                                    <ExternalLink className="w-3.5 h-3.5 mr-2 opacity-70 group-hover:opacity-100" />
                                    <span className="text-xs">YouTube</span>
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-1 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-gray-400 cursor-pointer transition-colors group">
                                    <ExternalLink className="w-3.5 h-3.5 mr-2 opacity-70 group-hover:opacity-100" />
                                    <span className="text-xs">LinkedIn</span>
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-1 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-gray-400 cursor-pointer transition-colors group">
                                    <ExternalLink className="w-3.5 h-3.5 mr-2 opacity-70 group-hover:opacity-100" />
                                    <span className="text-xs">Instagram</span>
                                </a>
                            </div>
                        )}
                    </div>

                </div>
            </aside>

            {/* CENTER - FORM */}
            <main className="flex-1 flex flex-col border-r border-slate-200 dark:border-[#1E2D3D] overflow-hidden">
                {/* Header */}
                <div className="h-10 flex border-b border-slate-200 dark:border-[#1E2D3D] transition-colors duration-300">
                    <div className="px-6 flex items-center border-r border-slate-200 dark:border-[#1E2D3D] bg-slate-100 dark:bg-[#011627] text-slate-700 dark:text-white font-mono text-sm transition-colors duration-300">
                        <span>contacts</span>
                        <div className="w-3 h-3 ml-3 rounded-full bg-slate-300 dark:bg-gray-700/50 hover:bg-slate-400 dark:hover:bg-gray-500 cursor-pointer" />
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-[#011627] transition-colors duration-300 overflow-y-auto">
                    <form ref={form} onSubmit={sendEmail} className="w-full max-w-sm space-y-6">
                        
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="text-sm text-slate-500 dark:text-gray-400">_name:</label>
                            <input 
                                type="text"
                                name="user_name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white dark:bg-[#011221] border border-slate-300 dark:border-[#1E2D3D] rounded-lg p-3 text-sm text-slate-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 dark:focus:border-[#607B96] transition-colors shadow-sm"
                                placeholder="Seu nome"
                            />
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-sm text-slate-500 dark:text-gray-400">_email:</label>
                            <input 
                                type="email"
                                name="user_email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white dark:bg-[#011221] border border-slate-300 dark:border-[#1E2D3D] rounded-lg p-3 text-sm text-slate-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 dark:focus:border-[#607B96] transition-colors shadow-sm"
                                placeholder="seu@email.com"
                            />
                        </div>

                        {/* Message Input */}
                        <div className="space-y-2">
                            <label className="text-sm text-slate-500 dark:text-gray-400">_message:</label>
                            <textarea 
                                name="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={6}
                                className="w-full bg-white dark:bg-[#011221] border border-slate-300 dark:border-[#1E2D3D] rounded-lg p-3 text-sm text-slate-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 dark:focus:border-[#607B96] transition-colors shadow-sm resize-none"
                                placeholder="Sua mensagem..."
                            />
                        </div>

                        {/* Button */}
                        <button type="submit" className="bg-slate-200 dark:bg-[#1E2D3D] hover:bg-slate-300 dark:hover:bg-[#2C3C4C] text-slate-700 dark:text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">
                            submit-message
                        </button>

                    </form>
                </div>
            </main>

            {/* RIGHT - CODE PREVIEW */}
            <aside className="hidden xl:flex w-[500px] flex-col border-l border-slate-200 dark:border-[#1E2D3D] transition-colors duration-300">
                {/* Header */}
                <div className="h-10 flex items-center px-4 border-b border-slate-200 dark:border-[#1E2D3D] transition-colors duration-300">
                    <span className="text-sm text-slate-600 dark:text-gray-400 font-mono">// Code snippet</span>
                </div>

                {/* Code Content */}
                <div className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-[#011627] transition-colors duration-300">
                    <div className="relative group">
                        
                        {/* Copy Button */}
                        <button 
                            onClick={handleCopyCode}
                            className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                        </button>

                        <div className="flex font-mono text-sm leading-relaxed">
                            {/* Line Numbers */}
                            <div className="flex flex-col text-slate-300 dark:text-[#607B96] text-right pr-6 select-none border-r border-slate-200 dark:border-[#1E2D3D] mr-6">
                                {Array.from({ length: 12 }, (_, i) => (
                                    <span key={i + 1}>{i + 1}</span>
                                ))}
                            </div>

                            {/* Code Text */}
                            <div className="flex-1 overflow-x-auto whitespace-pre-wrap break-words">
                                <span className="text-purple-600 dark:text-[#C98BDF]">const</span>{' '}
                                <span className="text-blue-600 dark:text-[#61AFEF]">button</span>{' '}
                                <span className="text-emerald-600 dark:text-[#56B6C2]">=</span>{' '}
                                <span className="text-blue-600 dark:text-[#61AFEF]">document</span>
                                <span className="text-slate-500 dark:text-gray-400">.</span>
                                <span className="text-blue-600 dark:text-[#61AFEF]">querySelector</span>
                                <span className="text-slate-500 dark:text-gray-400">(</span>
                                <span className="text-yellow-600 dark:text-[#98C379]">'#sendBtn'</span>
                                <span className="text-slate-500 dark:text-gray-400">);</span>
                                {'\n\n'}
                                <span className="text-purple-600 dark:text-[#C98BDF]">const</span>{' '}
                                <span className="text-blue-600 dark:text-[#61AFEF]">message</span>{' '}
                                <span className="text-emerald-600 dark:text-[#56B6C2]">=</span>{' '}
                                <span className="text-slate-500 dark:text-gray-400">{'{'}</span>
                                {'\n'}
                                <span className="text-slate-500 dark:text-gray-400 pl-4">name:</span>{' '}
                                <span className="text-yellow-600 dark:text-[#98C379]">"{name}"</span>
                                <span className="text-slate-500 dark:text-gray-400">,</span>
                                {'\n'}
                                <span className="text-slate-500 dark:text-gray-400 pl-4">email:</span>{' '}
                                <span className="text-yellow-600 dark:text-[#98C379]">"{email}"</span>
                                <span className="text-slate-500 dark:text-gray-400">,</span>
                                {'\n'}
                                <span className="text-slate-500 dark:text-gray-400 pl-4">message:</span>{' '}
                                <span className="text-yellow-600 dark:text-[#98C379]">"{message.substring(0, 30)}{message.length > 30 ? '...' : ''}"</span>
                                <span className="text-slate-500 dark:text-gray-400">,</span>
                                {'\n'}
                                <span className="text-slate-500 dark:text-gray-400 pl-4">date:</span>{' '}
                                <span className="text-yellow-600 dark:text-[#98C379]">"{date}"</span>
                                {'\n'}
                                <span className="text-slate-500 dark:text-gray-400">{'}'}</span>
                                {'\n\n'}
                                <span className="text-blue-600 dark:text-[#61AFEF]">button</span>
                                <span className="text-slate-500 dark:text-gray-400">.</span>
                                <span className="text-blue-600 dark:text-[#61AFEF]">addEventListener</span>
                                <span className="text-slate-500 dark:text-gray-400">(</span>
                                <span className="text-yellow-600 dark:text-[#98C379]">'click'</span>
                                <span className="text-slate-500 dark:text-gray-400">,</span>{' '}
                                <span className="text-slate-500 dark:text-gray-400">()</span>{' '}
                                <span className="text-purple-600 dark:text-[#C98BDF]">{'=>'}</span>{' '}
                                <span className="text-slate-500 dark:text-gray-400">{'{'}</span>
                                {'\n'}
                                <span className="text-blue-600 dark:text-[#61AFEF] pl-4">form</span>
                                <span className="text-slate-500 dark:text-gray-400">.</span>
                                <span className="text-blue-600 dark:text-[#61AFEF]">send</span>
                                <span className="text-slate-500 dark:text-gray-400">(</span>
                                <span className="text-blue-600 dark:text-[#61AFEF]">message</span>
                                <span className="text-slate-500 dark:text-gray-400">);</span>
                                {'\n'}
                                <span className="text-slate-500 dark:text-gray-400">{'}'})</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}
