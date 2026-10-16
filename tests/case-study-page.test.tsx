import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CaseStudyPage, {
  generateMetadata,
  generateStaticParams,
} from '@/app/projects/[slug]/page';
import { CASE_STUDIES } from '@/lib/case-studies';

/*
    A página é um Server Component async: em vez de montar o App Router, resolvemos o
    componente (que devolve JSX) e renderizamos o resultado. `notFound()` lança um erro
    especial do Next — mockado para ser verificável.
*/
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

const params = (slug: string) => Promise.resolve({ slug });

describe('/projects/[slug]', () => {
  it('pré-renderiza uma página por estudo de caso', () => {
    expect(generateStaticParams()).toEqual(CASE_STUDIES.map((s) => ({ slug: s.slug })));
  });

  it('renderiza título, seções e links do estudo', async () => {
    const study = CASE_STUDIES[0];
    render(await CaseStudyPage({ params: params(study.slug) }));

    expect(screen.getByRole('heading', { level: 1, name: study.title })).toBeTruthy();
    for (const section of ['Problema', 'Solução', 'Destaques', 'Decisões técnicas']) {
      expect(screen.getByRole('heading', { level: 2, name: section })).toBeTruthy();
    }

    const repoLink = screen.getByRole('link', { name: /Ver código no GitHub/i });
    expect(repoLink.getAttribute('href')).toBe(
      `https://github.com/Grolla05/${study.repo}`,
    );
    expect(repoLink.getAttribute('rel')).toContain('noopener');
  });

  it('só mostra "Abrir demo" quando o projeto tem demo', async () => {
    const withDemo = CASE_STUDIES.find((s) => s.demo)!;
    const withoutDemo = CASE_STUDIES.find((s) => !s.demo)!;

    const first = render(await CaseStudyPage({ params: params(withDemo.slug) }));
    expect(screen.queryByRole('link', { name: /demo/i })).not.toBeNull();
    first.unmount();

    render(await CaseStudyPage({ params: params(withoutDemo.slug) }));
    expect(screen.queryByRole('link', { name: /demo/i })).toBeNull();
  });

  it('slug inexistente cai em notFound()', async () => {
    await expect(CaseStudyPage({ params: params('nao-existe') })).rejects.toThrow(
      'NEXT_NOT_FOUND',
    );
  });

  it('metadata usa título, tagline e canonical do estudo', async () => {
    const study = CASE_STUDIES[0];
    const metadata = await generateMetadata({ params: params(study.slug) });

    expect(metadata.title).toBe(study.title);
    expect(metadata.description).toBe(study.tagline);
    expect(metadata.alternates?.canonical).toBe(`/projects/${study.slug}`);

    expect(await generateMetadata({ params: params('nao-existe') })).toEqual({});
  });
});
