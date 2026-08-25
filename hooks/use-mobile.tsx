import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Retorna true enquanto a viewport estiver abaixo de `breakpoint` (px).
 *
 * Existe para permitir que as páginas montem UMA única árvore responsiva em vez de
 * renderizar dois blocos irmãos (`hidden md:flex` + `flex md:hidden`) e esconder um
 * deles via CSS — padrão que duplicava a interface no DOM.
 *
 * Durante SSR e no primeiro render o retorno é `false` (assume desktop); o valor real
 * é aplicado no primeiro efeito do cliente.
 */
export function useIsBelow(breakpoint: number) {
  const [isBelow, setIsBelow] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const onChange = () => {
      setIsBelow(window.innerWidth < breakpoint)
    }
    mql.addEventListener("change", onChange)
    setIsBelow(window.innerWidth < breakpoint)
    return () => mql.removeEventListener("change", onChange)
  }, [breakpoint])

  return !!isBelow
}

export function useIsMobile() {
  return useIsBelow(MOBILE_BREAKPOINT)
}
