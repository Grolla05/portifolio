'use client';

import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, fadeIn, scaleIn, staggerContainer } from '@/lib/animations/variants';

export default function ProfilePage() {
  const prefersReduced = useReducedMotion();

  return (
    <div
      className="min-h-screen w-full transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <main className="w-full">
        <section
          id="hello"
          className="min-h-[calc(100vh-3.5rem)] flex items-center px-6 md:px-12 lg:px-24 py-20 relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <motion.p
                  className="text-lg font-normal"
                  style={{ color: 'var(--text-secondary)' }}
                  variants={prefersReduced ? {} : fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={0}
                >
                  Hello World. Eu sou
                </motion.p>

                <motion.h1
                  className="text-5xl md:text-6xl lg:text-7xl font-normal"
                  style={{ color: 'var(--text-primary)' }}
                  variants={prefersReduced ? {} : fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                >
                  Felipe Grolla
                </motion.h1>

                <motion.h2
                  className="text-2xl md:text-3xl font-normal flex items-center gap-2"
                  variants={prefersReduced ? {} : fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                >
                  <span style={{ color: 'var(--ide-accent)' }}>&gt;</span>
                  <span style={{ color: 'var(--syntax-type)' }}>Desenvolvedor de Software</span>
                </motion.h2>
              </div>

              {/* Code-style comments */}
              <motion.div
                className="space-y-3 pt-8 font-mono text-sm"
                variants={prefersReduced ? {} : fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
              >
                <p style={{ color: 'var(--syntax-comment)' }}>
                  // Encontre meu perfil no GitHub:
                </p>
                <p style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--syntax-keyword)' }}>const</span>{' '}
                  <span style={{ color: 'var(--syntax-type)' }}>githubLink</span>{' '}
                  <span style={{ color: 'var(--text-primary)' }}>=</span>{' '}
                  <Link
                    href="https://github.com/Grolla05"
                    target="_blank"
                    className="hover:underline"
                    style={{ color: 'var(--syntax-string)' }}
                  >
                    &quot;https://github.com/Grolla05&quot;
                  </Link>
                </p>
              </motion.div>
            </div>

            {/* Right Content - Code Snippets */}
            <motion.div
              className="hidden lg:flex flex-col gap-4 relative"
              variants={prefersReduced ? {} : staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {/* Code Snippet 1 - SQL */}
              <motion.div
                className="backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl border"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-default)',
                }}
                variants={prefersReduced ? {} : scaleIn}
                whileHover={prefersReduced ? {} : { y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="border-b px-4 py-2.5 flex items-center gap-2"
                  style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-default)' }}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="text-xs font-medium ml-2" style={{ color: 'var(--text-secondary)' }}>
                    SQL Query
                  </span>
                </div>
                <div className="p-6">
                  <pre className="font-mono text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    <code>
                      <span style={{ color: 'var(--syntax-keyword)' }}>SELECT</span>{' '}
                      <span style={{ color: 'var(--text-primary)' }}>u.id, u.username,</span>
                      {'\n  '}
                      <span style={{ color: 'var(--syntax-type)' }}>COUNT</span>
                      <span style={{ color: 'var(--text-muted)' }}>(</span>
                      <span style={{ color: 'var(--text-primary)' }}>p.id</span>
                      <span style={{ color: 'var(--text-muted)' }}>)</span>{' '}
                      <span style={{ color: 'var(--syntax-keyword)' }}>AS</span>{' '}
                      <span style={{ color: 'var(--text-primary)' }}>total</span>
                      {'\n'}
                      <span style={{ color: 'var(--syntax-keyword)' }}>FROM</span>{' '}
                      <span style={{ color: 'var(--text-primary)' }}>users u</span>
                      {'\n'}
                      <span style={{ color: 'var(--syntax-keyword)' }}>LEFT JOIN</span>{' '}
                      <span style={{ color: 'var(--text-primary)' }}>projects p</span>
                      {'\n  '}
                      <span style={{ color: 'var(--syntax-keyword)' }}>ON</span>{' '}
                      <span style={{ color: 'var(--text-primary)' }}>u.id</span>{' '}
                      <span style={{ color: 'var(--text-muted)' }}>=</span>{' '}
                      <span style={{ color: 'var(--text-primary)' }}>p.user_id</span>
                      {'\n'}
                      <span style={{ color: 'var(--syntax-keyword)' }}>GROUP BY</span>{' '}
                      <span style={{ color: 'var(--text-primary)' }}>u.id</span>
                      <span style={{ color: 'var(--text-muted)' }}>;</span>
                    </code>
                  </pre>
                </div>
              </motion.div>

              {/* Code Snippet 2 - Python */}
              <motion.div
                className="backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl border"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-default)',
                }}
                variants={prefersReduced ? {} : scaleIn}
                whileHover={prefersReduced ? {} : { y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="border-b px-4 py-2.5 flex items-center gap-2"
                  style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-default)' }}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="text-xs font-medium ml-2" style={{ color: 'var(--text-secondary)' }}>
                    Python Function
                  </span>
                </div>
                <div className="p-6">
                  <pre className="font-mono text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    <code>
                      <span style={{ color: 'var(--syntax-keyword)' }}>def</span>{' '}
                      <span style={{ color: 'var(--syntax-type)' }}>process_user_data</span>
                      <span style={{ color: 'var(--text-muted)' }}>(</span>
                      <span style={{ color: 'var(--ide-accent-purple)' }}>user_id</span>
                      <span style={{ color: 'var(--text-muted)' }}>:</span>{' '}
                      <span style={{ color: 'var(--syntax-type)' }}>int</span>
                      <span style={{ color: 'var(--text-muted)' }}>)</span>{' '}
                      <span style={{ color: 'var(--text-muted)' }}>-&gt;</span>{' '}
                      <span style={{ color: 'var(--syntax-type)' }}>dict</span>
                      <span style={{ color: 'var(--text-muted)' }}>:</span>
                      {'\n    '}
                      <span style={{ color: 'var(--ide-accent-purple)' }}>user</span>{' '}
                      <span style={{ color: 'var(--text-muted)' }}>=</span>{' '}
                      <span style={{ color: 'var(--text-primary)' }}>db</span>
                      <span style={{ color: 'var(--text-muted)' }}>.</span>
                      <span style={{ color: 'var(--syntax-type)' }}>query</span>
                      <span style={{ color: 'var(--text-muted)' }}>(</span>
                      <span style={{ color: 'var(--ide-accent-purple)' }}>User</span>
                      <span style={{ color: 'var(--text-muted)' }}>).</span>
                      <span style={{ color: 'var(--syntax-type)' }}>get</span>
                      <span style={{ color: 'var(--text-muted)' }}>(</span>
                      <span style={{ color: 'var(--ide-accent-purple)' }}>user_id</span>
                      <span style={{ color: 'var(--text-muted)' }}>)</span>
                      {'\n    '}
                      <span style={{ color: 'var(--syntax-keyword)' }}>if not</span>{' '}
                      <span style={{ color: 'var(--ide-accent-purple)' }}>user</span>
                      <span style={{ color: 'var(--text-muted)' }}>:</span>
                      {'\n        '}
                      <span style={{ color: 'var(--syntax-keyword)' }}>raise</span>{' '}
                      <span style={{ color: 'var(--syntax-type)' }}>ValueError</span>
                      <span style={{ color: 'var(--text-muted)' }}>(</span>
                      <span style={{ color: 'var(--syntax-string)' }}>&quot;User not found&quot;</span>
                      <span style={{ color: 'var(--text-muted)' }}>)</span>
                      {'\n    '}
                      <span style={{ color: 'var(--syntax-keyword)' }}>return</span>{' '}
                      <span style={{ color: 'var(--text-muted)' }}>{'{'}</span>
                      <span style={{ color: 'var(--syntax-string)' }}>&quot;id&quot;</span>
                      <span style={{ color: 'var(--text-muted)' }}>:</span>{' '}
                      <span style={{ color: 'var(--text-primary)' }}>user.id</span>
                      <span style={{ color: 'var(--text-muted)' }}>,</span>{' '}
                      <span style={{ color: 'var(--syntax-string)' }}>&quot;name&quot;</span>
                      <span style={{ color: 'var(--text-muted)' }}>:</span>{' '}
                      <span style={{ color: 'var(--text-primary)' }}>user.name</span>
                      <span style={{ color: 'var(--text-muted)' }}>{'}'}</span>
                    </code>
                  </pre>
                </div>
              </motion.div>

              {/* Code Snippet 3 - JavaScript */}
              <motion.div
                className="backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl border"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-default)',
                }}
                variants={prefersReduced ? {} : scaleIn}
                whileHover={prefersReduced ? {} : { y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="border-b px-4 py-2.5 flex items-center gap-2"
                  style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-default)' }}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="text-xs font-medium ml-2" style={{ color: 'var(--text-secondary)' }}>
                    JavaScript Function
                  </span>
                </div>
                <div className="p-6">
                  <pre className="font-mono text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    <code>
                      <span style={{ color: 'var(--syntax-keyword)' }}>async function</span>{' '}
                      <span style={{ color: 'var(--syntax-type)' }}>fetchUserProjects</span>
                      <span style={{ color: 'var(--text-muted)' }}>(</span>
                      <span style={{ color: 'var(--ide-accent-purple)' }}>userId</span>
                      <span style={{ color: 'var(--text-muted)' }}>) {'{'}</span>
                      {'\n  '}
                      <span style={{ color: 'var(--syntax-keyword)' }}>try</span>{' '}
                      <span style={{ color: 'var(--text-muted)' }}>{'{'}</span>
                      {'\n    '}
                      <span style={{ color: 'var(--syntax-keyword)' }}>const</span>{' '}
                      <span style={{ color: 'var(--text-primary)' }}>response</span>{' '}
                      <span style={{ color: 'var(--text-muted)' }}>=</span>{' '}
                      <span style={{ color: 'var(--syntax-keyword)' }}>await</span>{' '}
                      <span style={{ color: 'var(--syntax-type)' }}>fetch</span>
                      <span style={{ color: 'var(--text-muted)' }}>(</span>
                      <span style={{ color: 'var(--syntax-string)' }}>`/api/users/$&#123;userId&#125;/projects`</span>
                      <span style={{ color: 'var(--text-muted)' }}>);</span>
                      {'\n    '}
                      <span style={{ color: 'var(--syntax-keyword)' }}>return await</span>{' '}
                      <span style={{ color: 'var(--text-primary)' }}>response</span>
                      <span style={{ color: 'var(--text-muted)' }}>.</span>
                      <span style={{ color: 'var(--syntax-type)' }}>json</span>
                      <span style={{ color: 'var(--text-muted)' }}>{'();'}</span>
                      {'\n  '}
                      <span style={{ color: 'var(--text-muted)' }}>{'}'}</span>{' '}
                      <span style={{ color: 'var(--syntax-keyword)' }}>catch</span>{' '}
                      <span style={{ color: 'var(--text-muted)' }}>(</span>
                      <span style={{ color: 'var(--ide-accent-purple)' }}>error</span>
                      <span style={{ color: 'var(--text-muted)' }}>) {'{'}</span>
                      {'\n    '}
                      <span style={{ color: 'var(--text-primary)' }}>console</span>
                      <span style={{ color: 'var(--text-muted)' }}>.</span>
                      <span style={{ color: 'var(--syntax-type)' }}>error</span>
                      <span style={{ color: 'var(--text-muted)' }}>(</span>
                      <span style={{ color: 'var(--syntax-string)' }}>&apos;Failed:&apos;</span>
                      <span style={{ color: 'var(--text-muted)' }}>,</span>{' '}
                      <span style={{ color: 'var(--ide-accent-purple)' }}>error</span>
                      <span style={{ color: 'var(--text-muted)' }}>{'};'}</span>
                      {'\n'}
                      <span style={{ color: 'var(--text-muted)' }}>{'}'}</span>
                    </code>
                  </pre>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Social Links */}
          <motion.div
            className="absolute bottom-8 left-6 md:left-12 lg:left-24 flex flex-col gap-4"
            variants={prefersReduced ? {} : fadeIn}
            initial="hidden"
            animate="visible"
          >
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>find me in:</p>
            <div className="flex gap-4">
              <motion.div whileHover={prefersReduced ? {} : { scale: 1.15, y: -2 }} whileTap={prefersReduced ? {} : { scale: 0.95 }}>
                <Link
                  href="https://github.com/Grolla05"
                  target="_blank"
                  className="transition-colors duration-200"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Github className="h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={prefersReduced ? {} : { scale: 1.15, y: -2 }} whileTap={prefersReduced ? {} : { scale: 0.95 }}>
                <Link
                  href="https://www.linkedin.com/in/felipegrolla/"
                  target="_blank"
                  className="transition-colors duration-200"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom Right username */}
          <motion.div
            className="absolute bottom-8 right-6 md:right-12 lg:right-24 flex items-center gap-2"
            variants={prefersReduced ? {} : fadeIn}
            initial="hidden"
            animate="visible"
          >
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>@Grolla05</span>
            <Github className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
          </motion.div>
        </section>
      </main>
    </div>
  );
}
