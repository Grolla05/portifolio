"use client";

import React from "react";
import { ArrowLeft, Github, Globe, Mail } from "lucide-react";
import { CtaGroup } from "@/components/cta-group";

/*
    Botões da página de estudo de caso.

    Existe como Client Component porque `CtaGroup` recebe os ícones como componentes
    (funções) em `actions`, e função não atravessa a fronteira Server → Client — a página
    /projects/[slug] é Server Component e quebrava ao serializar `Github`, `Globe` etc.
    Aqui os ícones são importados do lado do cliente; a página só passa dados simples.
*/

interface CaseStudyActionsProps {
  variant: "header" | "footer";
  title: string;
  repoUrl: string;
  demo?: string;
}

export function CaseStudyActions({ variant, title, repoUrl, demo }: CaseStudyActionsProps) {
  if (variant === "footer") {
    return (
      <CtaGroup
        animateOnMount={false}
        actions={[
          { href: "/contact", label: "Falar comigo", icon: Mail, variant: "primary" },
          { href: "/projects", label: "Ver todos os projetos", icon: ArrowLeft },
        ]}
      />
    );
  }

  return (
    <CtaGroup
      className="pt-2"
      animateOnMount={false}
      actions={[
        {
          href: repoUrl,
          label: "Ver código no GitHub",
          icon: Github,
          external: true,
          variant: "primary",
        },
        ...(demo
          ? [
              {
                href: demo,
                label: "Abrir demo",
                icon: Globe,
                external: true,
                ariaLabel: `Abrir demo de ${title} (abre em nova aba)`,
              },
            ]
          : []),
      ]}
    />
  );
}

export default CaseStudyActions;
