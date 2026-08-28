import AboutView from '@/components/about/about-view';
import { readPapers } from '@/lib/papers-server';

/*
    Server Component fino: sua única função é varrer public/papers/ e entregar a lista
    pronta para a interface, que é toda client-side.

    A varredura precisa acontecer aqui porque usa `fs`. Como /about é prerenderizada
    estaticamente, a leitura ocorre uma vez durante o `next build` e o resultado vai
    congelado no HTML — nenhum custo por visita.
*/
export default function AboutPage() {
  const papers = readPapers();

  return <AboutView papers={papers} />;
}
