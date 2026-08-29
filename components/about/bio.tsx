'use client';

import { Fragment, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    AlertCircle,
    Code2,
    Eye,
    FileDown,
    FolderGit2,
    Mail,
    RefreshCw,
} from 'lucide-react';
import { CtaGroup } from '@/components/cta-group';
import { MarkdownView } from '@/components/markdown/markdown-view';
import { useGitHubReadme } from '@/hooks/use-github-readme';
import { PROFILE_README, repoUrl } from '@/lib/github-url';
import { highlightMarkdown, TOKEN_COLORS } from '@/lib/markdown-highlight';
import { appleSpring } from '@/lib/animations/variants';

/*
    CENTRO — EDITOR

    O conteúdo era um bloco de comentário escrito à mão neste arquivo (com lorem ipsum
    dentro). Agora é o README.md do repositório de perfil do GitHub, buscado em runtime:
    a bio passa a ter uma fonte só, e editar o perfil no GitHub atualiza o site sem deploy.

    O alvo vem de PROFILE_README, derivado de GITHUB_USER — não há URL literal aqui.
    A busca reutiliza /api/readme via useGitHubReadme, a mesma rota e o mesmo hook que o
    ProjectModal usa para o README de cada projeto (cache de 1h no servidor, resolução de
    branch e de caixa do nome do arquivo já resolvidas lá).
*/

type ViewMode = 'preview' | 'code';

const GITHUB_URL = repoUrl(PROFILE_README);

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
            className="flex items-center gap-0.5 p-1 rounded-full glass-panel flex-shrink-0"
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
                        className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-tight transition-colors select-none cursor-pointer"
                        style={{
                            color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                        }}
                    >
                        {active && (
                            <motion.span
                                layoutId="bioViewTogglePill"
                                className="absolute inset-0 rounded-full bg-white/70 dark:bg-white/10 shadow-sm border border-white/30 dark:border-white/15"
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

function LoadingSkeleton() {
    return (
        <div className="space-y-3 py-2" aria-live="polite" aria-busy="true">
            <p className="text-xs font-mono mb-6" style={{ color: 'var(--text-muted)' }}>
                {'// carregando README.md do GitHub...'}
            </p>
            {[75, 55, 85, 45, 65, 80, 40, 70].map((w, i) => (
                <div
                    key={i}
                    className="h-3 rounded"
                    style={{
                        width: `${w}%`,
                        backgroundColor: 'var(--bg-tertiary)',
                        opacity: 1 - i * 0.07,
                    }}
                />
            ))}
        </div>
    );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
            <AlertCircle className="w-8 h-8" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
            <div>
                <p className="text-sm font-mono mb-2" style={{ color: 'var(--syntax-keyword)' }}>
                    {'// falha ao carregar README.md'}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {message}
                </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                    type="button"
                    onClick={onRetry}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors"
                    style={{
                        background: 'var(--surface-subtle)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                    }}
                >
                    <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                    Tentar de novo
                </button>
                {/*
                    Saída de emergência: se a API do GitHub estiver fora ou o rate limit
                    estourado, a bio ainda leva a pessoa ao conteúdo real.
                */}
                <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium underline underline-offset-4"
                    style={{ color: 'var(--ide-accent-text)' }}
                >
                    Ler no GitHub
                </a>
            </div>
        </div>
    );
}

export default function Bio() {
    const [mode, setMode] = useState<ViewMode>('preview');
    const { content, status, error, retry } = useGitHubReadme(PROFILE_README);

    return (
        <main className="flex-1 flex flex-col min-h-[500px] min-w-0 transition-colors duration-300">
            {/*
                Barra de ações do arquivo — o "canto superior" do editor.
                Fica dentro do Bio, e não na barra de abas de app/about/page.tsx, porque o
                alternador só faz sentido para este arquivo: hobbies.ts e Education.tsx não
                têm markdown para renderizar.
            */}
            <div
                className="h-10 flex items-center justify-between gap-3 px-4 sm:px-6 border-b flex-shrink-0"
                style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-subtle)',
                }}
            >
                <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono truncate transition-colors hover:underline"
                    style={{ color: 'var(--text-muted)' }}
                    title="Abrir o repositório de perfil no GitHub"
                >
                    {PROFILE_README.owner}/{PROFILE_README.repo}/README.md
                </a>

                <ViewToggle mode={mode} onChange={setMode} />
            </div>

            <div
                className="flex-1 p-6 overflow-y-auto transition-colors duration-300"
                style={{ backgroundColor: 'var(--bg-primary)' }}
            >
                {status === 'error' ? (
                    <ErrorState
                        message={error ?? 'Erro desconhecido.'}
                        onRetry={retry}
                    />
                ) : status !== 'ready' || content === null ? (
                    <LoadingSkeleton />
                ) : mode === 'code' ? (
                    <CodeView source={content} />
                ) : (
                    <MarkdownView content={content} />
                )}

                {/*
                    Fecho do arquivo: quem termina de ler sobre mim precisa de um próximo
                    passo. Fica fora do bloco de estados de propósito — os CTAs continuam
                    disponíveis mesmo se o GitHub falhar.
                */}
                <div className="mt-10 pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <p className="font-mono text-xs mb-4" style={{ color: 'var(--syntax-comment)' }}>
                        {'// próximos passos'}
                    </p>
                    <CtaGroup
                        animateOnMount={false}
                        actions={[
                            { href: '/projects', label: 'Ver meus projetos', icon: FolderGit2, variant: 'primary' },
                            {
                                href: '/api/cv',
                                label: 'Baixar CV',
                                icon: FileDown,
                                external: true,
                                ariaLabel: 'Baixar currículo em PDF (abre em nova aba)',
                            },
                            { href: '/contact', label: 'Falar comigo', icon: Mail },
                        ]}
                    />
                </div>
            </div>
        </main>
    );
}
