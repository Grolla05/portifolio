import type { Metadata } from 'next';

/*
    Título e canonical próprios da rota. A página é Client Component e não pode
    exportar `metadata` diretamente.
*/
export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Fale com Felipe Grolla — disponível para oportunidades em desenvolvimento de software.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contato — Felipe Grolla',
    url: '/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
