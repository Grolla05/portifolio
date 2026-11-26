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

/*
    Sem rede nos testes: getRepoInfo (GitHub) é simulado e o ReadmeCard (client, busca o
    README em /api/readme) vira um marcador. Só "estudo-fake-repo" existe como repositório
    sem estudo curado; qualquer outro slug devolve null → 404.
*/
vi.mock('@/lib/repo-info', () => ({
  getRepoInfo: async (repo: string) => {
    if (repo === 'Estudo-Fake-Repo') {
      return {
        name: 'Estudo-Fake-Repo',
        description: 'Descrição vinda do GitHub',
        homepage: null,
        htmlUrl: 'https://github.com/Grolla05/Estudo-Fake-Repo',
        topics: ['arduino', 'iot'],
        languages: ['C++', 'Python'],
        listed: true,
      };
    }
    if (repo === 'Repo-Arquivado') {
      return { name: repo, description: null, homepage: null, htmlUrl: '', topics: [], languages: [], listed: false };
    }
    // Repositórios dos estudos curados: tópicos reais do GitHub substituem a stack escrita à mão.
    if (repo === 'Project_SolarPoints') {
      return { name: repo, description: null, homepage: null, htmlUrl: '', topics: ['esp32', 'iot'], languages: ['C++'], listed: true };
    }
    return null;
  },
}));

vi.mock('@/components/about/bio', () => ({
  ReadmeCard: ({ target }: { target: { owner: string; repo: string } }) => (
    <div data-testid="readme-card">{`${target.owner}/${target.repo}`}</div>
  ),
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

  it('mostra o README principal e usa os tópicos do GitHub como Stack', async () => {
    const study = CASE_STUDIES.find((s) => s.repo === 'Project_SolarPoints')!;
    render(await CaseStudyPage({ params: params(study.slug) }));

    expect(screen.getByTestId('readme-card').textContent).toBe('Grolla05/Project_SolarPoints');
    const stack = screen.getByRole('heading', { level: 2, name: 'Stack' }).parentElement!;
    expect(stack.textContent).toContain('esp32');
    expect(stack.textContent).toContain('iot');
    // A stack escrita à mão não aparece quando o repositório tem tópicos.
    expect(stack.textContent).not.toContain(study.stack[0]);
  });

  it('repositório sem estudo curado ganha uma ficha automática', async () => {
    render(await CaseStudyPage({ params: params('Estudo-Fake-Repo') }));

    expect(screen.getByRole('heading', { level: 1, name: 'Estudo Fake Repo' })).toBeTruthy();
    expect(screen.getByText('Descrição vinda do GitHub')).toBeTruthy();
    expect(screen.getByTestId('readme-card').textContent).toBe('Grolla05/Estudo-Fake-Repo');

    const stack = screen.getByRole('heading', { level: 2, name: 'Stack' }).parentElement!;
    expect(stack.textContent).toContain('arduino');
    expect(screen.getByRole('heading', { level: 2, name: 'Linguagens' }).parentElement!.textContent).toContain('C++');
    // Nada editorial inventado numa ficha automática.
    expect(screen.queryByRole('heading', { level: 2, name: 'Problema' })).toBeNull();
    expect(screen.queryByRole('heading', { level: 2, name: 'Decisões técnicas' })).toBeNull();
  });

  it('repositório arquivado/fork não ganha página', async () => {
    await expect(CaseStudyPage({ params: params('Repo-Arquivado') })).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
