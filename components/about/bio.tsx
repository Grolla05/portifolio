'use client';

import { Fragment, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Code2, Eye } from 'lucide-react';
import { MarkdownView } from '@/components/markdown/markdown-view';
import { PROFILE_README, repoUrl } from '@/lib/github-url';
import { highlightMarkdown, TOKEN_COLORS } from '@/lib/markdown-highlight';
import { appleSpring } from '@/lib/animations/variants';
import { BIO_MARKDOWN } from '@/lib/about';

/*
    CENTRO — EDITOR (my-bio.md)

    Até o redesign, este card renderizava o README.md do repositório de perfil do GitHub.
    Aquele README é uma VITRINE de perfil: SVG animado de digitação, badge de visitas,
    tabela de projetos, ícones de stack, gráficos de estatística e a cobrinha de commits.
    Dentro de um card de ~600px isso virava um bloco espremido (o título animado saía
    cortado em "Eng. Con") e repetia o que a própria página já mostra — intro, stack,
    projetos.

    Agora o arquivo é um markdown próprio em lib/about.ts, com os FATOS do README (semestre,
    o que está estudando, certificações) escritos para esta página. O alternador
    Código/Prévia continua: é o mesmo texto visto cru ou renderizado. O README completo
    segue a um clique, no rodapé do card.
*/

type ViewMode = 'preview' | 'code';

const PROFILE_URL = repoUrl(PROFILE_README);

/**
 * Alternador código ⇄ prévia.
 *
 * Segmented control no padrão do resto do site: pilha de dois botões com uma pílula que
 * desliza via `layoutId`, igual à navegação do header. O `layoutId` é exclusivo deste
 * componente — compartilhá-lo com o header faria a pílula voar de um para o outro.
 */
function ViewToggle({
    mode,
    onChange,
}: {
    mode: ViewMode;
    onChange: (mode: ViewMode) => void;
}) {
    const prefersReduced = useReducedMotion();

    const options: { value: ViewMode; label: string; hint: string; icon: React.ElementType }[] = [
        { value: 'code', label: 'Código', hint: 'Ver o markdown cru', icon: Code2 },
        { value: 'preview', label: 'Prévia', hint: 'Ver o markdown renderizado', icon: Eye },
    ];

    return (
        /*
            `role="group"` e não "radiogroup": radiogroup obriga navegação por setas, que
            este controle não implementa. Com dois botões e aria-pressed, Tab + Enter já
            dá o comportamento completo — e é o que leitores de tela anunciam corretamente.
        */
        <div
            role="group"
            aria-label="Modo de exibição do arquivo"
            className="flex items-center gap-0.5 p-1 rounded-full border flex-shrink-0"
            style={{ borderColor: 'var(--border-default)' }}
        >
            {options.map(({ value, label, hint, icon: Icon }) => {
                const active = mode === value;
                return (
                    <motion.button
                        key={value}
                        type="button"
                        onClick={() => onChange(value)}
                        whileTap={prefersReduced ? {} : { scale: 0.96 }}
                        transition={appleSpring}
                        aria-pressed={active}
                        aria-label={hint}
                        title={hint}
                        className="relative flex items-center gap-1.5 min-h-8 px-3 rounded-full text-xs font-medium tracking-tight transition-colors select-none cursor-pointer"
                        style={{
                            color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                        }}
                    >
                        {active && (
                            <motion.span
                                layoutId="bioViewTogglePill"
                                className="absolute inset-0 rounded-full"
                                style={{ backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-default)' }}
                                transition={prefersReduced ? { duration: 0 } : appleSpring}
                            />
                        )}
                        <Icon
                            className="w-3.5 h-3.5 relative z-10"
                            style={{ color: active ? 'var(--ide-accent)' : 'currentColor' }}
                            aria-hidden="true"
                        />
                        {/* O rótulo some em telas estreitas; o aria-label e o title seguram o significado. */}
                        <span className="relative z-10 hidden sm:inline">{label}</span>
                    </motion.button>
                );
            })}
        </div>
    );
}

/** Markdown cru com numeração de linha, no mesmo layout de gutter de hobbies.ts e Education.tsx. */
function CodeView({ source }: { source: string }) {
    // Tokenizar o README inteiro a cada render de troca de aba é desperdício puro.
    const lines = useMemo(() => highlightMarkdown(source), [source]);

    return (
        /*
            GRID de duas colunas, com o número e o conteúdo na MESMA linha da grade — e
            não duas colunas irmãs, como em hobbies.ts e Education.tsx.

            Naqueles arquivos o conteúdo é escrito à mão e cabe numa linha, então duas
            colunas paralelas funcionam. Um README real não cabe: URL de badge passa de
            200 caracteres e quebra em cinco linhas visuais, enquanto a coluna de números
            rende uma altura de linha por número — e as duas saem de sincronia. Medido na
            primeira versão desta view: 932px de desalinhamento no fim do arquivo.

            Numa grade, a altura da linha é a do seu próprio conteúdo, então o número
            acompanha o bloco que numera por mais que ele quebre.
        */
        <div
            className="font-mono text-sm leading-relaxed"
            style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: '1.5rem' }}
        >
            {lines.map((tokens, i) => (
                <Fragment key={i + 1}>
                    {/*
                        `select-none`: sem isso, copiar o README direto da tela traria os
                        números de linha embaralhados no meio do texto.
                        `alignSelf: start` prende o número ao topo da sua linha, em vez de
                        centralizá-lo na altura de um bloco que quebrou em cinco.
                    */}
                    <span
                        className="text-right select-none tabular-nums"
                        style={{ color: 'var(--syntax-comment)', alignSelf: 'start' }}
                    >
                        {i + 1}
                    </span>

                    {/*
                        `whitespace-pre-wrap` e não `pre`: rolagem horizontal deixaria a
                        bio ilegível no celular. `break-words` cobre a URL que não tem
                        onde quebrar.
                    */}
                    <span className="min-w-0 whitespace-pre-wrap break-words">
                        {tokens.length === 0
                            ? ' ' /* linha vazia ainda precisa ocupar uma altura de linha */
                            : tokens.map((token, j) => (
                                  <span key={j} style={{ color: TOKEN_COLORS[token.kind] }}>
                                      {token.text}
                                  </span>
                              ))}
                    </span>
                </Fragment>
            ))}
        </div>
    );
}

/*
    O card cresce com o conteúdo (sem rolagem interna): o texto é curto e escrito para
    caber aqui, então uma caixa com barra de rolagem só esconderia parte dele.
*/
export default function Bio() {
    const [mode, setMode] = useState<ViewMode>('preview');

    return (
        <article
            className="flex flex-col min-w-0 rounded-xl border overflow-hidden"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
            aria-label="my-bio.md"
        >
            <div
                className="min-h-11 flex items-center justify-between gap-3 pl-4 pr-1.5 py-1 border-b flex-shrink-0"
                style={{ borderColor: 'var(--border-subtle)' }}
            >
                <span className="font-mono text-[13px] truncate" style={{ color: 'var(--text-primary)' }}>
                    my-bio.md
                </span>
                <ViewToggle mode={mode} onChange={setMode} />
            </div>

            <div className="p-5 sm:p-7">
                {mode === 'code' ? <CodeView source={BIO_MARKDOWN} /> : <MarkdownView content={BIO_MARKDOWN} />}
            </div>

            <a
                href={PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 sm:px-7 py-3 border-t font-mono text-xs transition-colors hover:underline"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
            >
                ↳ README completo no GitHub
                <span className="sr-only"> (abre em nova aba)</span>
            </a>
        </article>
    );
}
