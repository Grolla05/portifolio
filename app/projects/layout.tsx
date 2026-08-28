import type { Metadata } from 'next';

/*
    app/projects/page.tsx é um Client Component e não pode exportar `metadata`.
    Este layout existe só para isso: dar título e canonical próprios à rota.
    Sem ele, as quatro páginas compartilhavam o mesmo título nos resultados de busca.
*/
export const metadata: Metadata = {
  title: 'Projetos',
  description:
    'Projetos de Felipe Grolla, sincronizados diretamente do GitHub: sistemas embarcados ' +
    'em C e C++, automações em Python e aplicações web em TypeScript.',
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Projetos — Felipe Grolla',
    url: '/projects',
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
