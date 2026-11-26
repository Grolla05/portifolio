'use client';

import { Fragment, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    AlertCircle,
    Code2,
    Eye,
    RefreshCw,
} from 'lucide-react';
import { MarkdownView } from '@/components/markdown/markdown-view';
import { useGitHubReadme } from '@/hooks/use-github-readme';
import { PROFILE_README, repoUrl, type RepoTarget } from '@/lib/github-url';
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
                        whileTap={{ scale: 0.96 }}
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

function LoadingSkeleton({ filename }: { filename: string }) {
    return (
        <div className="space-y-3 py-2" aria-live="polite" aria-busy="true">
            <p className="text-xs font-mono mb-6" style={{ color: 'var(--text-muted)' }}>
                {`// carregando ${filename} do GitHub...`}
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

function ErrorState({
    message,
    onRetry,
    githubUrl,
    filename,
}: {
    message: string;
    onRetry: () => void;
    githubUrl: string;
    filename: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
            <AlertCircle className="w-8 h-8" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
            <div>
                <p className="text-sm font-mono mb-2" style={{ color: 'var(--syntax-keyword)' }}>
                    {`// falha ao carregar ${filename}`}
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
                    href={githubUrl}
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

/*
    Card de README genérico: cabeçalho com o nome do arquivo e o alternador Código/Prévia,
    corpo com altura máxima que rola sozinho e rodapé que leva ao arquivo no GitHub.

    Nasceu como a bio do /about (README do repositório de perfil) e foi generalizado para
    aceitar qualquer repositório do dono do site: a página de estudo de caso
    (/projects/[slug]) mostra o README principal do projeto com exatamente a mesma
    aparência — um vocabulário só de markdown no site. A busca continua passando por
    /api/readme (cache de 1h, resolução de branch e de caixa do arquivo, e só repositórios
    do próprio dono).
*/
export function ReadmeCard({
    target,
    filename = 'README.md',
}: {
    target: RepoTarget;
    filename?: string;
}) {
    const [mode, setMode] = useState<ViewMode>('preview');
    const { content, status, error, retry } = useGitHubReadme(target);
    const githubUrl = repoUrl(target);

    return (
        <article
            className="flex flex-col min-w-0 rounded-xl border overflow-hidden"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
            aria-label={filename}
        >
            <div
                className="min-h-11 flex items-center justify-between gap-3 pl-4 pr-1.5 py-1 border-b flex-shrink-0"
                style={{ borderColor: 'var(--border-subtle)' }}
            >
                <span className="font-mono text-[13px] truncate" style={{ color: 'var(--text-primary)' }}>
                    {filename}
                </span>
                <ViewToggle mode={mode} onChange={setMode} />
            </div>

            {/* Mais alto (era 560px): o README de perfil tem GIF, cards e tabelas, e com 560px
                quase tudo ficava escondido atrás da rolagem interna. */}
            <div className="p-5 sm:p-7 max-h-[min(85vh,960px)] overflow-y-auto">
                {status === 'error' ? (
                    <ErrorState
                        message={error ?? 'Erro desconhecido.'}
                        onRetry={retry}
                        githubUrl={githubUrl}
                        filename={filename}
                    />
                ) : status !== 'ready' || content === null ? (
                    <LoadingSkeleton filename={filename} />
                ) : mode === 'code' ? (
                    <CodeView source={content} />
                ) : (
                    <MarkdownView content={content} />
                )}
            </div>

            <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 sm:px-7 py-3 border-t font-mono text-xs transition-colors hover:underline"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                title="Abrir o repositório no GitHub"
            >
                ↳ sincronizado de {target.owner}/{target.repo}/README.md
                <span className="sr-only"> (abre em nova aba)</span>
            </a>
        </article>
    );
}

/* Bio do /about: o README do repositório de perfil (my-bio.md). Os CTAs saíram daqui —
   a página inteira fecha com o próprio chamado. */
export default function Bio() {
    return <ReadmeCard target={PROFILE_README} filename="my-bio.md" />;
}
