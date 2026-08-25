"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Home, FolderGit2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  scaleIn,
  fadeUp,
  staggerContainer,
  appleSpring,
} from "@/lib/animations/variants";

const ascii404 = `██╗  ██╗ ██████╗ ██╗  ██╗
██║  ██║██╔═████╗██║  ██║
███████║██║██╔██║███████║
╚════██║████╔╝██║╚════██║
     ██║╚██████╔╝     ██║
     ╚═╝ ╚═════╝      ╚═╝`;

function TrafficLights() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex items-center gap-1.5 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm border border-black/10 flex items-center justify-center text-[8px] font-bold text-black/60 leading-none select-none">
        <span className={hovered ? "opacity-100" : "opacity-0"}>×</span>
      </div>
      <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm border border-black/10 flex items-center justify-center text-[8px] font-bold text-black/60 leading-none select-none">
        <span className={hovered ? "opacity-100" : "opacity-0"}>−</span>
      </div>
      <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm border border-black/10 flex items-center justify-center text-[7px] font-bold text-black/60 leading-none select-none">
        <span className={hovered ? "opacity-100" : "opacity-0"}>+</span>
      </div>
    </div>
  );
}

export default function NotFound() {
  const prefersReduced = useReducedMotion();

  return (
    /*
        Descontar a altura do header (h-16 = 4rem): `app/layout.tsx` já renderiza <Header />
        acima de {children}, e ele ocupa espaço no fluxo. Com `min-h-screen` aqui o body ficava
        100vh + 64px e a página nascia com barra de rolagem à toa.
        O <Header /> local também foi removido — era um SEGUNDO header empilhado sob o do layout.
    */
    <div
      className="min-h-[calc(100vh-4rem)] w-full flex flex-col transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <main className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        <motion.div
          className="w-full max-w-2xl glass-panel rounded-3xl p-8 md:p-12 elevation-3 border border-white/30 dark:border-white/10 relative overflow-hidden text-center"
          variants={prefersReduced ? {} : scaleIn}
          initial="hidden"
          animate="visible"
        >
          {/* Window Chrome Header */}
          <div className="flex items-center justify-between pb-6 border-b border-black/5 dark:border-white/10">
            <div className="flex items-center gap-3">
              <TrafficLights />
              <span className="text-xs font-semibold tracking-tight text-foreground/80 uppercase">
                404
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <span>status: 404_NOT_FOUND</span>
            </div>
          </div>

          <motion.div
            className="mt-8 space-y-6 flex flex-col items-center"
            variants={prefersReduced ? {} : staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* ASCII 404 Art Centered */}
            <motion.div
              className="py-4 px-6 rounded-2xl bg-black/5 dark:bg-black/30 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-inner"
              variants={prefersReduced ? {} : fadeUp}
            >
              {/* aria-hidden: leitores de tela leem o ASCII como ruído; o
                  código 404 é anunciado pelo <h1> abaixo */}
              <pre
                aria-hidden="true"
                className="font-mono font-bold leading-tight select-none text-primary"
                style={{ fontSize: "clamp(1rem, 2.8vw, 1.75rem)" }}
              >
                {ascii404}
              </pre>
            </motion.div>

            {/* Title & Description */}
            <motion.div
              className="space-y-2 max-w-md"
              variants={prefersReduced ? {} : fadeUp}
            >
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {/* sr-only: nome acessível do heading inclui o código 404,
                    já que a arte ASCII está oculta para leitores de tela */}
                <span className="sr-only">404 — </span>
                Página Não Encontrada
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                O arquivo ou rota que você tentou acessar não foi localizado no
                diretório do sistema.
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div
              className="pt-2 flex flex-wrap items-center justify-center gap-3"
              variants={prefersReduced ? {} : fadeUp}
            >
              <motion.div
                whileHover={prefersReduced ? {} : { scale: 1.02 }}
                whileTap={prefersReduced ? {} : { scale: 0.97 }}
                transition={appleSpring}
              >
                <Link
                  href="/"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold tracking-tight bg-primary text-primary-foreground shadow-sm hover:opacity-95 transition-opacity"
                >
                  <Home className="w-4 h-4" />
                  <span>Voltar ao Início</span>
                </Link>
              </motion.div>

              <motion.div
                whileHover={prefersReduced ? {} : { scale: 1.02 }}
                whileTap={prefersReduced ? {} : { scale: 0.97 }}
                transition={appleSpring}
              >
                <Link
                  href="/projects"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-tight glass-pill transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                  style={{ color: "var(--text-primary)" }}
                >
                  <FolderGit2 className="w-4 h-4 text-primary" />
                  <span>Ver Projetos</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
