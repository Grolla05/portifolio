"use client";

import React from "react";
import Image from "next/image";
import { getLanguageIcon, getLanguageColor, getLanguageAbbrev } from "@/lib/projects";
import { cn } from "@/lib/utils";

/*
    Marcador visual de linguagem.

    Como as linguagens agora vêm do GitHub e não de uma lista fixa, aparecem nomes sem
    logo em public/language_icons (TypeScript, CSS, Jupyter Notebook, Prolog...).
    Renderizar <Image> com caminho inexistente deixava o ícone quebrado silenciosamente —
    era exatamente o que acontecia com "Typescript.png", que nunca existiu no diretório.

    Regra: logo quando existe; senão, quadrado na cor do linguist com a abreviação da
    linguagem. Os dois caminhos têm a mesma caixa, então o alinhamento não muda.
*/

interface LanguageIconProps {
  language: string;
  size?: number;
  className?: string;
  /** Some para leitores de tela quando o nome da linguagem já está escrito ao lado. */
  decorative?: boolean;
}

export function LanguageIcon({
  language,
  size = 16,
  className,
  decorative = false,
}: LanguageIconProps) {
  const icon = getLanguageIcon(language);
  const a11y = decorative
    ? { "aria-hidden": true as const }
    : { role: "img" as const, "aria-label": language };

  if (icon) {
    return (
      <span
        className={cn("relative inline-block flex-shrink-0", className)}
        style={{ width: size, height: size }}
        {...a11y}
      >
        <Image
          src={icon}
          alt={decorative ? "" : language}
          fill
          sizes={`${size}px`}
          className="object-contain"
        />
      </span>
    );
  }

  const color = getLanguageColor(language);

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center flex-shrink-0 font-mono font-medium",
        className,
      )}
      style={{
        width: size,
        height: size,
        borderRadius: Math.max(3, size * 0.22),
        backgroundColor: `${color}26`, // 15% de opacidade — legível nos dois temas
        border: `1px solid ${color}`,
        color,
        // Tipografia acompanha a caixa para o mesmo componente servir do filtro ao herói.
        fontSize: Math.max(7, size * 0.38),
        lineHeight: 1,
      }}
      title={decorative ? undefined : language}
      {...a11y}
    >
      {getLanguageAbbrev(language)}
    </span>
  );
}

export default LanguageIcon;
