import { NextResponse } from 'next/server';
import { CV_DOC_ID } from '@/lib/site';

/*
    Proxy de download do currículo.

    O currículo vive num Google Doc que é atualizado ao longo do tempo. Em vez de versionar
    um PDF no repositório (que envelhece no primeiro dia), esta rota exporta o documento em
    PDF sob demanda. Editar o Doc atualiza o download, sem deploy.

    Ganhos sobre linkar o Google Docs direto no botão:
      - nome de arquivo decente ao salvar, em vez de um hash do Google
      - a URL do documento não fica exposta no HTML (menos superfície para scraping)
      - resposta cacheada, então rajadas de cliques não viram rajadas de request ao Google
      - se o compartilhamento do Doc quebrar, o erro aparece aqui e não como tela de login
        do Google no rosto de quem visita
*/

const EXPORT_URL = `https://docs.google.com/document/d/${CV_DOC_ID}/export?format=pdf`;
const FILENAME = 'Felipe-Grolla-Curriculo.pdf';

export async function GET() {
  let upstream: Response;

  try {
    upstream = await fetch(EXPORT_URL, {
      // Revalida de hora em hora: edições no Doc aparecem sem deploy, e um pico de
      // acessos não vira um pico de tráfego contra o Google.
      next: { revalidate: 3600 },
      redirect: 'follow',
    });
  } catch {
    return NextResponse.json(
      { error: 'Não foi possível contatar o Google Docs.' },
      { status: 502 },
    );
  }

  const contentType = upstream.headers.get('content-type') ?? '';

  /*
      O Google responde 200 com uma página HTML de login quando o documento perde o
      compartilhamento público. Checar só o status entregaria esse HTML como se fosse PDF,
      e o navegador baixaria um "currículo" corrompido. Por isso valida o content-type.
  */
  if (!upstream.ok || !contentType.includes('application/pdf')) {
    return NextResponse.json(
      {
        error:
          'Currículo indisponível no momento. Verifique se o documento continua ' +
          'compartilhado como "qualquer pessoa com o link".',
      },
      { status: 502 },
    );
  }

  const pdf = await upstream.arrayBuffer();

  return new NextResponse(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      // `inline` deixa o navegador abrir o PDF no visualizador nativo em vez de baixar
      // direto — melhor no celular, onde o download some na pasta de downloads.
      'Content-Disposition': `inline; filename="${FILENAME}"`,
      'Content-Length': String(pdf.byteLength),
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
