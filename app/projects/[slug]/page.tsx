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
import { CaseStudyActions } from '@/components/projects/case-study-actions';
import { ProjectCover } from '@/components/projects/project-cover';
import {
  CASE_STUDIES,
  getAdjacentCaseStudies,
  getCaseStudyBySlug,
  type CaseStudy,
} from '@/lib/case-studies';
import { GITHUB_USER } from '@/lib/site';

/*
    Página de estudo de caso: /projects/[slug].

    Server Component estático — o conteúdo vem de lib/case-studies.ts, então não há fetch
    em runtime nem estado de carregamento. `generateStaticParams` + `dynamicParams = false`
    pré-renderiza uma página por estudo e devolve 404 para qualquer outro slug, em vez de
    renderizar uma página vazia.

    A grade em /projects mostra QUE o projeto existe; esta página mostra o que ele resolve,
    como foi construído e que decisões técnicas estão por trás — o que o card não cabe.
*/

export const dynamicParams = false;

type RouteParams = { slug: string };

export function generateStaticParams(): RouteParams[] {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) return {};

  return {
    title: study.title,
    description: study.tagline,
    alternates: { canonical: `/projects/${study.slug}` },
    openGraph: {
      type: 'article',
      title: `${study.title} — Felipe Grolla`,
      description: study.tagline,
      url: `/projects/${study.slug}`,
    },
    twitter: { card: 'summary_large_image', title: study.title, description: study.tagline },
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

export default async function CaseStudyPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) notFound();

  const adjacent = getAdjacentCaseStudies(study.slug);
  const repoUrl = `https://github.com/${GITHUB_USER}/${study.repo}`;

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
            <StatusBadge status={study.status} />
            {study.kind && (
              <span
                className="rounded-full px-2.5 py-1 text-xs font-medium border"
                style={{
                  color: 'var(--text-secondary)',
                  borderColor: 'var(--border-default)',
                  backgroundColor: 'var(--bg-secondary)',
                }}
              >
                {study.kind}
              </span>
            )}
          </div>

          <h1
            className="text-3xl md:text-5xl font-medium tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {study.title}
          </h1>

          <p
            className="text-base md:text-lg max-w-3xl leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {study.tagline}
          </p>

          <CaseStudyActions
            variant="header"
            title={study.title}
            repoUrl={repoUrl}
            demo={study.demo}
          />
        </header>

        {/*
            Só renderiza a capa quando há screenshot de verdade (`cover` no estudo). A capa
            gerada dos cards é decorativa e, em largura total, pareceria um placeholder.
        */}
        {study.cover && (
          <div
            className="mt-10 rounded-xl overflow-hidden border"
            style={{ borderColor: 'var(--border-default)' }}
          >
            <ProjectCover repo={study.repo} title={study.title} primaryLanguage={null} />
          </div>
        )}

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
                    <h3
                      className="text-sm font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
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
            <section aria-labelledby="stack">
              <SectionTitle id="stack">Stack</SectionTitle>
              <ul className="flex flex-wrap gap-2">
                {study.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md px-2.5 py-1 text-xs font-mono border"
                    style={{
                      color: 'var(--text-secondary)',
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-default)',
                    }}
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="repositorio">
              <SectionTitle id="repositorio">Repositório</SectionTitle>
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono break-all hover:underline"
                style={{ color: 'var(--ide-accent-text)' }}
              >
                {GITHUB_USER}/{study.repo}
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              </a>
            </section>
          </aside>
        </div>

        <footer
          className="mt-16 pt-10 border-t space-y-10"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex flex-col items-start gap-4">
            <p className="text-sm max-w-xl" style={{ color: 'var(--text-secondary)' }}>
              Quer saber mais sobre as decisões por trás deste projeto? Posso explicar em detalhe.
            </p>
            <CaseStudyActions
              variant="footer"
              title={study.title}
              repoUrl={repoUrl}
            />
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
                  <span
                    className="mt-1 block text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
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
