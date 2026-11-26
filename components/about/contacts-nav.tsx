"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { appleSpring } from "@/lib/animations/variants";
import { useMotionOff } from "@/lib/animations/use-motion-off";
import { SOCIAL } from "@/lib/site";

/*
    "CONTATOS" do explorer (/about).

    Antes: três links com `hover:bg-black/5` — o hover era só um cinza chapado.

    Agora o hover é um único "marcador" que DESLIZA de linha em linha (como a seleção de
    um menu do macOS) e assume a cor da marca do canal sob o cursor: contorno e fundo em
    tint da cor, barra de assinatura à esquerda, ícone que cresce e uma seta ↗ que entra
    pela direita. Ícones já repousam na cor da marca (Gmail, GitHub, LinkedIn).

    Só transform/opacity animam (o marcador usa `y`, as linhas têm altura fixa de 36px) e a
    mesma trilha funciona por foco de teclado. Cor do marcador troca por transição de CSS.
*/

const ROW = 36; // px — altura fixa de cada linha (h-9)
const GAP = 2; // px — gap-0.5

const CONTACTS = [
  { href: `mailto:${SOCIAL.email}`, label: SOCIAL.email, icon: Mail, external: false, brand: "var(--brand-gmail)" },
  { href: SOCIAL.github, label: "github.com/Grolla05", icon: Github, external: true, brand: "var(--brand-github)" },
  { href: SOCIAL.linkedin, label: "LinkedIn", icon: Linkedin, external: true, brand: "var(--brand-linkedin)" },
] as const;

const tint = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

export function ContactsNav() {
  const off = useMotionOff();
  // `last` mantém a cor/posição do marcador enquanto ele some, sem piscar para a 1ª linha.
  const [last, setLast] = useState(0);
  const [on, setOn] = useState(false);

  const enter = (i: number) => () => {
    setLast(i);
    setOn(true);
  };
  const leave = () => setOn(false);

  return (
    <div className="flex flex-col gap-0.5 text-[13px]">
      <span className="px-2 pb-1.5 text-[11px] font-medium tracking-[0.08em]" style={{ color: "var(--text-muted)" }}>
        CONTATOS
      </span>

      <div className="relative flex flex-col gap-0.5" onPointerLeave={leave}>
        <motion.span
          aria-hidden="true"
          className="absolute left-0 right-0 top-0 rounded-md pointer-events-none"
          style={{
            height: ROW,
            backgroundColor: tint(CONTACTS[last].brand, 11),
            boxShadow: `inset 0 0 0 1px ${tint(CONTACTS[last].brand, 28)}`,
            transition: "background-color 0.25s, box-shadow 0.25s",
          }}
          initial={false}
          animate={{ y: last * (ROW + GAP), opacity: on ? 1 : 0 }}
          transition={off ? { duration: 0 } : { y: appleSpring, opacity: { duration: 0.18 } }}
        >
          <span
            className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full"
            style={{ backgroundColor: CONTACTS[last].brand, transition: "background-color 0.25s" }}
          />
        </motion.span>

        {CONTACTS.map(({ href, label, icon: Icon, external, brand }, i) => (
          <a
            key={href}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            onPointerEnter={enter(i)}
            onFocus={enter(i)}
            onBlur={leave}
            className="group relative flex items-center gap-2.5 h-9 px-2.5 rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ide-accent)]"
            style={{ color: "var(--text-secondary)" }}
          >
            <Icon
              className="w-4 h-4 flex-shrink-0 transition-transform duration-300 ease-out group-hover:scale-125 group-hover:-rotate-6 group-focus-visible:scale-125 motion-reduce:transition-none"
              style={{ color: brand }}
              aria-hidden="true"
            />
            <span className="flex-1 min-w-0 truncate transition-[transform,color] duration-300 ease-out group-hover:translate-x-0.5 group-hover:text-[var(--text-primary)] group-focus-visible:text-[var(--text-primary)] motion-reduce:transition-none">
              {label}
            </span>
            <ArrowUpRight
              className="w-3.5 h-3.5 flex-shrink-0 opacity-0 -translate-x-1.5 translate-y-1 transition-[transform,opacity] duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"
              style={{ color: brand }}
              aria-hidden="true"
            />
            {external && <span className="sr-only"> (abre em nova aba)</span>}
          </a>
        ))}
      </div>
    </div>
  );
}

export default ContactsNav;
