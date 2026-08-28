import '@testing-library/jest-dom';

// jsdom não implementa matchMedia. `useIsBelow`/`useIsMobile` (hooks/use-mobile.tsx)
// dependem dele para escolher o layout desktop vs. pilha, então sem este stub qualquer
// teste que renderize About/Projects/Contact estoura com "matchMedia is not a function".
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

// jsdom também não implementa IntersectionObserver. O `whileInView` do framer-motion
// (usado no bloco de CTA no fim de /projects) o instancia no mount, então sem este stub
// qualquer teste que renderize a página estoura com "IntersectionObserver is not defined".
if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  class IntersectionObserverStub {
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds: ReadonlyArray<number> = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  /*
      Atribuição via `Record<string, unknown>`: o operador `in` do guard acima estreita
      `window` para `never`, então acessar a propriedade pelo tipo original não compila.
  */
  (window as unknown as Record<string, unknown>).IntersectionObserver =
    IntersectionObserverStub;
  (globalThis as unknown as Record<string, unknown>).IntersectionObserver =
    IntersectionObserverStub;
}
