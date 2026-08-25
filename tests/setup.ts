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
