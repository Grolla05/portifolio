import type { Metadata } from 'next';

/*
    Título e canonical próprios da rota. A página é Client Component e não pode
    exportar `metadata` diretamente.
*/
export const metadata: Metadata = {
  title: 'Sobre mim',
  description:
    'Quem é Felipe Grolla: formação, interesses e trajetória em desenvolvimento de software.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'Sobre mim — Felipe Grolla',
    url: '/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
