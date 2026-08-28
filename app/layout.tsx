import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/header';
import { CommandPalette } from '@/components/command-palette';
import { StatusBar } from '@/components/status-bar';
import { TerminalPanel } from '@/components/terminal/terminal-panel';
import { Toaster } from '@/components/ui/sonner';
import { SITE_URL, SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, SOCIAL } from '@/lib/site';
import { readPapers } from '@/lib/papers-server';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

/*
    Metadata completa.

    Antes: title/description genéricos, sem metadataBase e sem OpenGraph — o link colado
    no LinkedIn/WhatsApp virava card cinza, sem imagem nem descrição, e as URLs relativas
    de imagem não podiam ser resolvidas em absolutas.

    `metadataBase` é pré-requisito para o Next resolver /opengraph-image em URL absoluta;
    sem ele o Next emite warning no build e omite a tag.
*/
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    // Páginas filhas definem só o próprio nome; o sufixo vem daqui.
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: `${SITE_NAME} — Portfólio`,
  authors: [{ name: SITE_NAME, url: SOCIAL.github }],
  creator: SITE_NAME,
  keywords: [
    'Felipe Grolla',
    'desenvolvedor de software',
    'portfólio',
    'engenharia de computação',
    'sistemas embarcados',
    'C++',
    'Python',
    'TypeScript',
    'Next.js',
    'Arduino',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: `${SITE_NAME} — Portfólio`,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    // A imagem vem de app/opengraph-image.tsx; o Next injeta a tag sozinho.
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  formatDetection: {
    // Evita que o iOS transforme números e e-mails do conteúdo em links azuis
    // automáticos, que quebram a tipografia das páginas de contato.
    telephone: false,
    email: false,
    address: false,
  },
  generator: 'Next.js',
};

/*
    themeColor precisa viver em `viewport`, não em `metadata` — desde o Next 14 declarar
    em metadata gera warning de build e é ignorado.
    Os valores batem com --bg-primary de cada tema em globals.css.
*/
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f7' },
    { media: '(prefers-color-scheme: dark)', color: '#1e1e1e' },
  ],
  colorScheme: 'dark light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /*
      A lista de artigos é varrida aqui, no layout (Server Component), e não dentro do
      terminal: a varredura usa `fs`, e o terminal é client. Como o layout é estático,
      isso acontece uma vez no build.
  */
  const papers = readPapers();

  return (
    /*
        lang="pt-BR": todo o conteúdo do site é português. Com lang="en" (valor anterior)
        leitores de tela aplicavam fonética inglesa a texto português, e o Google indexava
        o site como conteúdo em inglês.
    */
    <html lang="pt-BR" suppressHydrationWarning className={inter.variable}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          <CommandPalette />
          <TerminalPanel papers={papers} />
          <StatusBar />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
