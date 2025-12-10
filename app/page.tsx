"use client"

import Link from "next/link"
import { Github, Linkedin } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-[#011627] dark:via-[#01243e] dark:to-[#011627] text-slate-900 dark:text-white transition-colors duration-300">
      <main className="w-full">
        {/* Hero Section */}
        <section id="hello" className="min-h-[calc(100vh-6rem)] flex items-center px-6 md:px-12 lg:px-24 py-20 relative overflow-hidden">
          {/* Background gradient effects */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#43D9AD]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#4D5BCE]/10 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-lg text-slate-600 dark:text-gray-300 font-normal">Hello World. Eu sou</p>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal text-slate-900 dark:text-white">
                  Felipe Grolla
                </h1>
                <h2 className="text-2xl md:text-3xl font-normal flex items-center gap-2">
                  <span className="text-blue-600 dark:text-[#4D5BCE]">&gt;</span>
                  <span className="text-emerald-600 dark:text-[#43D9AD]">Desenvolvedor de Software</span>
                </h2>
              </div>

              {/* Code-style comments */}
              <div className="space-y-3 pt-8 font-mono text-sm">
                <p className="text-slate-500 dark:text-gray-500">// Encontre meu perfil no GitHub:</p>
                <p className="text-slate-600 dark:text-gray-400">
                  <span className="text-blue-600 dark:text-[#4D5BCE]">const</span>{" "}
                  <span className="text-emerald-600 dark:text-[#43D9AD]">githubLink</span>{" "}
                  <span className="text-slate-900 dark:text-white">=</span>{" "}
                  <Link
                    href="https://github.com/Grolla05"
                    target="_blank"
                    className="text-rose-600 dark:text-[#E99287] hover:underline"
                  >
                    "https://github.com/Grolla05"
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Content - Code Snippets */}
            <div className="hidden lg:flex flex-col gap-4 relative">
              {/* Code Snippet 1 - SQL Query */}
              <div className="bg-white/80 dark:bg-[#011221]/60 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden shadow-2xl">
                {/* macOS Window Header */}
                <div className="bg-slate-100 dark:bg-[#1a1f2e] border-b border-slate-200 dark:border-[#2a2f3e] px-4 py-2.5 flex items-center gap-2">
                  {/* Traffic Lights */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 transition-colors"></div>
                  </div>
                  {/* Tab Label */}
                  <span className="text-xs font-medium text-slate-600 dark:text-gray-400 ml-2">SQL Query</span>
                </div>
                {/* Code Content */}
                <div className="p-6">
                <pre className="font-mono text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
                  <code>
                    <span className="text-blue-700 dark:text-[#4D5BCE]">SELECT</span>{" "}
                    <span className="text-slate-900 dark:text-white">u.id</span><span className="text-slate-500 dark:text-gray-400">,</span>{" "}
                    <span className="text-slate-900 dark:text-white">u.username</span><span className="text-slate-500 dark:text-gray-400">,</span>{"\n"}
                    {"  "}<span className="text-emerald-600 dark:text-[#43D9AD]">COUNT</span><span className="text-slate-500 dark:text-gray-400">(</span><span className="text-slate-900 dark:text-white">p.id</span><span className="text-slate-500 dark:text-gray-400">)</span>{" "}
                    <span className="text-blue-700 dark:text-[#4D5BCE]">AS</span>{" "}
                    <span className="text-slate-900 dark:text-white">total</span>{"\n"}
                    <span className="text-blue-700 dark:text-[#4D5BCE]">FROM</span>{" "}
                    <span className="text-slate-900 dark:text-white">users</span>{" "}
                    <span className="text-slate-900 dark:text-white">u</span>{"\n"}
                    <span className="text-blue-700 dark:text-[#4D5BCE]">LEFT JOIN</span>{" "}
                    <span className="text-slate-900 dark:text-white">projects</span>{" "}
                    <span className="text-slate-900 dark:text-white">p</span>{"\n"}
                    {"  "}<span className="text-blue-700 dark:text-[#4D5BCE]">ON</span>{" "}
                    <span className="text-slate-900 dark:text-white">u.id</span>{" "}
                    <span className="text-slate-500 dark:text-gray-400">=</span>{" "}
                    <span className="text-slate-900 dark:text-white">p.user_id</span>{"\n"}
                    <span className="text-blue-700 dark:text-[#4D5BCE]">GROUP BY</span>{" "}
                    <span className="text-slate-900 dark:text-white">u.id</span><span className="text-slate-500 dark:text-gray-400">;</span>
                  </code>
                </pre>
                </div>
              </div>

              {/* Code Snippet 2 - Python Function */}
              <div className="bg-white/80 dark:bg-[#011221]/60 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden shadow-2xl">
                {/* macOS Window Header */}
                <div className="bg-slate-100 dark:bg-[#1a1f2e] border-b border-slate-200 dark:border-[#2a2f3e] px-4 py-2.5 flex items-center gap-2">
                  {/* Traffic Lights */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 transition-colors"></div>
                  </div>
                  {/* Tab Label */}
                  <span className="text-xs font-medium text-slate-600 dark:text-gray-400 ml-2">Python Function</span>
                </div>
                {/* Code Content */}
                <div className="p-6">
                <pre className="font-mono text-xs text-gray-300 leading-relaxed">
                  <code>
                    <span className="text-blue-700 dark:text-[#4D5BCE]">def</span>{" "}
                    <span className="text-emerald-600 dark:text-[#43D9AD]">process_user_data</span>
                    <span className="text-slate-500 dark:text-gray-400">(</span>
                    <span className="text-rose-600 dark:text-[#E99287]">user_id</span>
                    <span className="text-slate-500 dark:text-gray-400">:</span>{" "}
                    <span className="text-emerald-600 dark:text-[#43D9AD]">int</span>
                    <span className="text-slate-500 dark:text-gray-400">)</span>{" "}
                    <span className="text-slate-500 dark:text-gray-400">-&gt;</span>{" "}
                    <span className="text-emerald-600 dark:text-[#43D9AD]">dict</span>
                    <span className="text-slate-500 dark:text-gray-400">:</span>
                    {"\n"}
                    {"    "}
                    <span className="text-rose-600 dark:text-[#E99287]">user</span>{" "}
                    <span className="text-slate-500 dark:text-gray-400">=</span>{" "}
                    <span className="text-slate-900 dark:text-white">db</span>
                    <span className="text-slate-500 dark:text-gray-400">.</span>
                    <span className="text-emerald-600 dark:text-[#43D9AD]">query</span>
                    <span className="text-slate-500 dark:text-gray-400">(</span>
                    <span className="text-rose-600 dark:text-[#E99287]">User</span>
                    <span className="text-slate-500 dark:text-gray-400">).</span>
                    <span className="text-emerald-600 dark:text-[#43D9AD]">get</span>
                    <span className="text-slate-500 dark:text-gray-400">(</span>
                    <span className="text-rose-600 dark:text-[#E99287]">user_id</span>
                    <span className="text-slate-500 dark:text-gray-400">)</span>
                    {"\n"}
                    {"    "}
                    <span className="text-blue-700 dark:text-[#4D5BCE]">if</span>{" "}
                    <span className="text-blue-700 dark:text-[#4D5BCE]">not</span>{" "}
                    <span className="text-rose-600 dark:text-[#E99287]">user</span>
                    <span className="text-slate-500 dark:text-gray-400">:</span>
                    {"\n"}
                    {"        "}
                    <span className="text-blue-700 dark:text-[#4D5BCE]">raise</span>{" "}
                    <span className="text-emerald-600 dark:text-[#43D9AD]">ValueError</span>
                    <span className="text-slate-500 dark:text-gray-400">(</span>
                    <span className="text-rose-600 dark:text-[#E99287]">f"User {"{user_id}"} not found"</span>
                    <span className="text-slate-500 dark:text-gray-400">)</span>
                    {"\n"}
                    {"    "}
                    <span className="text-blue-700 dark:text-[#4D5BCE]">return</span>{" "}
                    <span className="text-slate-500 dark:text-gray-400">{'{'}</span>
                    {"\n"}
                    {"        "}
                    <span className="text-rose-600 dark:text-[#E99287]">"id"</span>
                    <span className="text-slate-500 dark:text-gray-400">:</span>{" "}
                    <span className="text-slate-900 dark:text-white">user</span>
                    <span className="text-slate-500 dark:text-gray-400">.</span>
                    <span className="text-slate-900 dark:text-white">id</span>
                    <span className="text-slate-500 dark:text-gray-400">,</span>
                    {"\n"}
                    {"        "}
                    <span className="text-rose-600 dark:text-[#E99287]">"name"</span>
                    <span className="text-slate-500 dark:text-gray-400">:</span>{" "}
                    <span className="text-slate-900 dark:text-white">user</span>
                    <span className="text-slate-500 dark:text-gray-400">.</span>
                    <span className="text-slate-900 dark:text-white">name</span>
                    <span className="text-slate-500 dark:text-gray-400">,</span>
                    {"\n"}
                    {"    "}
                    <span className="text-slate-500 dark:text-gray-400">{'}'}</span>
                  </code>
                </pre>
                </div>
              </div>

              {/* Code Snippet 3 - JavaScript Function */}
              <div className="bg-white/80 dark:bg-[#011221]/60 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden shadow-2xl">
                {/* macOS Window Header */}
                <div className="bg-slate-100 dark:bg-[#1a1f2e] border-b border-slate-200 dark:border-[#2a2f3e] px-4 py-2.5 flex items-center gap-2">
                  {/* Traffic Lights */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 transition-colors"></div>
                  </div>
                  {/* Tab Label */}
                  <span className="text-xs font-medium text-slate-600 dark:text-gray-400 ml-2">JavaScript Function</span>
                </div>
                {/* Code Content */}
                <div className="p-6">
                <pre className="font-mono text-xs text-gray-300 leading-relaxed">
                  <code>
                    <span className="text-blue-700 dark:text-[#4D5BCE]">async</span>{" "}
                    <span className="text-blue-700 dark:text-[#4D5BCE]">function</span>{" "}
                    <span className="text-emerald-600 dark:text-[#43D9AD]">fetchUserProjects</span>
                    <span className="text-slate-500 dark:text-gray-400">(</span>
                    <span className="text-rose-600 dark:text-[#E99287]">userId</span>
                    <span className="text-slate-500 dark:text-gray-400">)</span>{" "}
                    <span className="text-slate-500 dark:text-gray-400">{'{'}</span>
                    {"\n"}
                    {"  "}
                    <span className="text-blue-700 dark:text-[#4D5BCE]">try</span>{" "}
                    <span className="text-slate-500 dark:text-gray-400">{'{'}</span>
                    {"\n"}
                    {"    "}
                    <span className="text-blue-700 dark:text-[#4D5BCE]">const</span>{" "}
                    <span className="text-slate-900 dark:text-white">response</span>{" "}
                    <span className="text-slate-500 dark:text-gray-400">=</span>{" "}
                    <span className="text-blue-700 dark:text-[#4D5BCE]">await</span>{" "}
                    <span className="text-emerald-600 dark:text-[#43D9AD]">fetch</span>
                    <span className="text-slate-500 dark:text-gray-400">(</span>
                    {"\n"}
                    {"      "}
                    <span className="text-rose-600 dark:text-[#E99287]">{"`/api/users/$"}</span>
                    <span className="text-slate-500 dark:text-gray-400">{'{'}</span>
                    <span className="text-slate-900 dark:text-white">userId</span>
                    <span className="text-slate-500 dark:text-gray-400">{'}'}</span>
                    <span className="text-rose-600 dark:text-[#E99287]">{"/projects`"}</span>
                    {"\n"}
                    {"    "}
                    <span className="text-slate-500 dark:text-gray-400">);</span>
                    {"\n"}
                    {"    "}
                    <span className="text-blue-700 dark:text-[#4D5BCE]">return</span>{" "}
                    <span className="text-blue-700 dark:text-[#4D5BCE]">await</span>{" "}
                    <span className="text-slate-900 dark:text-white">response</span>
                    <span className="text-slate-500 dark:text-gray-400">.</span>
                    <span className="text-emerald-600 dark:text-[#43D9AD]">json</span>
                    <span className="text-slate-500 dark:text-gray-400">();</span>
                    {"\n"}
                    {"  "}
                    <span className="text-slate-500 dark:text-gray-400">{'}'}</span>{" "}
                    <span className="text-blue-700 dark:text-[#4D5BCE]">catch</span>{" "}
                    <span className="text-slate-500 dark:text-gray-400">(</span>
                    <span className="text-rose-600 dark:text-[#E99287]">error</span>
                    <span className="text-slate-500 dark:text-gray-400">)</span>{" "}
                    <span className="text-slate-500 dark:text-gray-400">{'{'}</span>
                    {"\n"}
                    {"    "}
                    <span className="text-slate-900 dark:text-white">console</span>
                    <span className="text-slate-500 dark:text-gray-400">.</span>
                    <span className="text-emerald-600 dark:text-[#43D9AD]">error</span>
                    <span className="text-slate-500 dark:text-gray-400">(</span>
                    <span className="text-rose-600 dark:text-[#E99287]">'Failed to fetch:'</span>
                    <span className="text-slate-500 dark:text-gray-400">,</span>{" "}
                    <span className="text-rose-600 dark:text-[#E99287]">error</span>
                    <span className="text-slate-500 dark:text-gray-400">);</span>
                    {"\n"}
                    {"  "}
                    <span className="text-slate-500 dark:text-gray-400">{'}'}</span>
                    {"\n"}
                    <span className="text-slate-500 dark:text-gray-400">{'}'}</span>
                  </code>
                </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Social Links */}
          <div className="absolute bottom-8 left-6 md:left-12 lg:left-24 flex flex-col gap-4">
            <p className="text-sm text-slate-600 dark:text-gray-400">find me in:</p>
            <div className="flex gap-4">
              <Link
                href="https://github.com/Grolla05"
                target="_blank"
                className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/felipegrolla/"
                target="_blank"
                className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Bottom Right Username */}
          <div className="absolute bottom-8 right-6 md:right-12 lg:right-24 flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-gray-400">@Grolla05</span>
            <Github className="h-5 w-5 text-slate-600 dark:text-gray-400" />
          </div>
        </section>
      </main>
    </div>
  )
}

