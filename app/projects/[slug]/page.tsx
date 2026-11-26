import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  ExternalLink,
} from 'lucide-react';
import { ReadmeCard } from '@/components/about/bio';
import { CaseStudyActions } from '@/components/projects/case-study-actions';
import { ProjectCover } from '@/components/projects/project-cover';
import {
  CASE_STUDIES,
  PROJECT_SUMMARIES,
  getAdjacentCaseStudies,
  getCaseStudyBySlug,
  type CaseStudy,
} from '@/lib/case-studies';
import { getRepoInfo, type RepoInfo } from '@/lib/repo-info';
import { humanizeRepoName } from '@/lib/projects';
import { GITHUB_USER } from '@/lib/site';

/*
    Página de projeto: /projects/[slug]. Existe para TODOS os repositórios da conta.

    Dois tipos de página:
      · Estudo de caso curado (lib/case-studies.ts): problema, solução, destaques e
        decisões escritos à mão — conteúdo editorial, só onde as afirmações são
        verificáveis no README/descrição.
      · Ficha automática (qualquer outro repositório): título, resumo, tópicos, linguagens
        e o README, tudo vindo do GitHub. Nada editorial é inventado: sem texto de
        "problema/solução" para um projeto que não tem.

    Nos dois a "Stack" são os tópicos do repositório no GitHub (a stack curada só entra
    quando o repositório não tem tópicos) e o README principal aparece renderizado, com o
    mesmo alternador Código/Prévia da bio do /about.

    Server Component com ISR (revalidate 1h): os estudos curados são pré-renderizados;
    os demais são gerados no primeiro acesso e cacheados. `getRepoInfo` valida o slug
    (só repositórios públicos do dono, sem forks/arquivados), então um slug inventado cai
    em 404 em vez de renderizar uma página vazia.
*/

export const revalidate = 3600;

type RouteParams = { slug: string };

export function generateStaticParams(): RouteParams[] {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

/** Resumo de uma ficha automática: resumo traduzido → descrição do GitHub → frase neutra. */
function autoTagline(repo: string, info: RepoInfo | null): string {
  return (
    PROJECT_SUMMARIES[repo] ??
    info?.description ??
    'Repositório público no GitHub — veja o README abaixo.'
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  let title: string;
  let description: string;
  let path = `/projects/${slug}`;

  if (study) {
    title = study.title;
    description = study.tagline;
    path = `/projects/${study.slug}`;
  } else {
    const info = await getRepoInfo(slug);
    if (!info || !info.listed) return {};
    title = humanizeRepoName(info.name);
    description = autoTagline(info.name, info);
  }

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title: `${title} — Felipe Grolla`,
      description,
      url: path,
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="text-xs font-medium uppercase tracking-wider mb-3"
      style={{ color: 'var(--text-muted)' }}
    >
      {children}
    </h2>
  );
}

function StatusBadge({ status }: { status: CaseStudy['status'] }) {
  const done = status === 'concluído';
  const Icon = done ? CheckCircle2 : CircleDashed;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border"
      style={{
        color: done ? 'var(--ide-accent-green)' : 'var(--syntax-type)',
        borderColor: 'var(--border-default)',
        backgroundColor: 'var(--bg-secondary)',
      }}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      {status}
    </span>
  );
}

function Chip({ children, mono = true }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <li
      className={`rounded-md px-2.5 py-1 text-xs border ${mono ? 'font-mono' : ''}`}
      style={{
        color: 'var(--text-secondary)',
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-default)',
      }}
    >
      {children}
    </li>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  const repo = study?.repo ?? slug;
  const info = await getRepoInfo(repo);

  // Sem estudo curado, o slug só vale se for um repositório público e listado da conta.
  if (!study && (!info || !info.listed)) notFound();

  const title = study?.title ?? humanizeRepoName(info?.name ?? repo);
  const tagline = study?.tagline ?? autoTagline(repo, info);
  const demo = study?.demo ?? info?.homepage ?? undefined;
  const repoUrl = `https://github.com/${GITHUB_USER}/${repo}`;
  const adjacent = study ? getAdjacentCaseStudies(study.slug) : null;

  // Stack = tópicos do repositório. A stack escrita à mão só entra se o repo não tiver tópicos.
  const topics = info?.topics ?? [];
  const stack = topics.length > 0 ? topics : (study?.stack ?? []);
  const languages = info?.languages ?? [];

  const stackSection = stack.length > 0 && (
    <section aria-labelledby="stack">
      <SectionTitle id="stack">Stack</SectionTitle>
      <ul className="flex flex-wrap gap-2">
        {stack.map((tech) => (
          <Chip key={tech}>{tech}</Chip>
        ))}
      </ul>
    </section>
  );

  /* Linguagens só na ficha automática: no estudo curado a stack já cobre. */
  const languagesSection = !study && languages.length > 0 && (
    <section aria-labelledby="linguagens">
      <SectionTitle id="linguagens">Linguagens</SectionTitle>
      <ul className="flex flex-wrap gap-2">
        {languages.map((lang) => (
          <Chip key={lang} mono={false}>
            {lang}
          </Chip>
        ))}
      </ul>
    </section>
  );

  const repoSection = (
    <section aria-labelledby="repositorio">
      <SectionTitle id="repositorio">Repositório</SectionTitle>
      <a
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs font-mono break-all hover:underline"
        style={{ color: 'var(--ide-accent-text)' }}
      >
        {GITHUB_USER}/{repo}
        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
      </a>
    </section>
  );

  const readmeSection = (
    <section aria-labelledby="readme">
      <SectionTitle id="readme">README</SectionTitle>
      <ReadmeCard target={{ owner: GITHUB_USER, repo }} filename="README.md" />
    </section>
  );

  return (
    <div
      className="min-h-[calc(100vh-var(--chrome-height))] w-full"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <main className="mx-auto w-full max-w-5xl px-6 md:px-10 pt-10 pb-24">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-medium rounded-md py-1 transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ide-accent)]"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Todos os projetos
        </Link>

        <header className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {study && <StatusBadge status={study.status} />}
            {(study?.kind ?? languages[0]) && (
              <span
                className="rounded-full px-2.5 py-1 text-xs font-medium border"
                style={{
                  color: 'var(--text-secondary)',
                  borderColor: 'var(--border-default)',
                  backgroundColor: 'var(--bg-secondary)',
                }}
              >
                {study?.kind ?? languages[0]}
              </span>
            )}
          </div>

          {/* viewTransitionName: destino do morph do título do card (view-transition-router). */}
          <h1
            className="text-3xl md:text-5xl font-medium tracking-tight"
            style={{ color: 'var(--text-primary)', viewTransitionName: 'vt-title' }}
          >
            {title}
          </h1>

          <p
            className="text-base md:text-lg max-w-3xl leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {tagline}
          </p>

          <CaseStudyActions variant="header" title={title} repoUrl={repoUrl} demo={demo} />
        </header>

        {/*
            Só renderiza a capa quando há screenshot de verdade (`cover` no estudo). A capa
            gerada dos cards é decorativa e, em largura total, pareceria um placeholder.
        */}
        {study?.cover && (
          <div
            className="mt-10 rounded-xl overflow-hidden border"
            style={{ borderColor: 'var(--border-default)', viewTransitionName: 'vt-cover' }}
          >
            <ProjectCover repo={study.repo} title={study.title} primaryLanguage={null} />
          </div>
        )}

        {study ? (
          <>
            <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-12 min-w-0">
                <section aria-labelledby="problema">
                  <SectionTitle id="problema">Problema</SectionTitle>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {study.problem}
                  </p>
                </section>

                <section aria-labelledby="solucao">
                  <SectionTitle id="solucao">Solução</SectionTitle>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {study.solution}
                  </p>
                </section>

                <section aria-labelledby="destaques">
                  <SectionTitle id="destaques">Destaques</SectionTitle>
                  <ul className="space-y-2">
                    {study.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 leading-relaxed"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <CheckCircle2
                          className="w-4 h-4 mt-1 flex-shrink-0"
                          style={{ color: 'var(--ide-accent)' }}
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section aria-labelledby="decisoes">
                  <SectionTitle id="decisoes">Decisões técnicas</SectionTitle>
                  <div className="space-y-4">
                    {study.decisions.map((decision) => (
                      <article
                        key={decision.title}
                        className="rounded-xl border p-5"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--border-default)',
                        }}
                      >
                        <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {decision.title}
                        </h3>
                        <p
                          className="mt-2 text-sm leading-relaxed"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {decision.text}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>

                {study.nextSteps && study.nextSteps.length > 0 && (
                  <section aria-labelledby="proximos-passos">
                    <SectionTitle id="proximos-passos">Próximos passos</SectionTitle>
                    <ul className="space-y-2">
                      {study.nextSteps.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 leading-relaxed"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          <CircleDashed
                            className="w-4 h-4 mt-1 flex-shrink-0"
                            style={{ color: 'var(--text-muted)' }}
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start" aria-label="Ficha técnica">
                {stackSection}
                {repoSection}
              </aside>
            </div>

            {/* README principal do repositório, em largura total abaixo do estudo. */}
            <div className="mt-14">{readmeSection}</div>
          </>
        ) : (
          /* Ficha automática: o README é a coluna principal; a ficha técnica fica ao lado. */
          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="min-w-0">{readmeSection}</div>
            <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start" aria-label="Ficha técnica">
              {stackSection}
              {languagesSection}
              {repoSection}
            </aside>
          </div>
        )}

        <footer
          className="mt-16 pt-10 border-t space-y-10"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex flex-col items-start gap-4">
            <p className="text-sm max-w-xl" style={{ color: 'var(--text-secondary)' }}>
              Quer saber mais sobre as decisões por trás deste projeto? Posso explicar em detalhe.
            </p>
            <CaseStudyActions variant="footer" title={title} repoUrl={repoUrl} />
          </div>

          {adjacent && (
            <nav aria-label="Outros estudos de caso" className="grid gap-4 sm:grid-cols-2">
              {[
                { study: adjacent.prev, label: 'Anterior', Icon: ArrowLeft },
                { study: adjacent.next, label: 'Próximo', Icon: ArrowRight },
              ].map(({ study: other, label, Icon }) => (
                <Link
                  key={other.slug}
                  href={`/projects/${other.slug}`}
                  className="group rounded-xl border p-4 transition-colors hover:bg-black/5 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ide-accent)]"
                  style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--bg-secondary)' }}
                >
                  <span
                    className="flex items-center gap-2 text-xs font-medium"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {label === 'Anterior' && <Icon className="w-3.5 h-3.5" aria-hidden="true" />}
                    {label}
                    {label === 'Próximo' && <Icon className="w-3.5 h-3.5" aria-hidden="true" />}
                  </span>
                  <span className="mt-1 block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {other.title}
                  </span>
                </Link>
              ))}
            </nav>
          )}
        </footer>
      </main>
    </div>
  );
}
