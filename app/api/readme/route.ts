import { NextRequest, NextResponse } from 'next/server';
import { githubHeaders, isOwnRepo, safeContentPath } from '@/lib/github';

/*
    README de um repositório em texto cru (usado pelo ProjectModal).

    Como em /api/repo, `owner` e `repo` eram usados sem validação — o que transformava a
    rota em proxy aberto do GitHub e, com GITHUB_TOKEN definido, dava acesso de leitura a
    repositórios privados da conta. Detalhes em lib/github.ts.
*/

const REVALIDATE_SECONDS = 3600; // ISR: re-busca no GitHub a cada hora

/** `raw+json` faz o GitHub devolver o markdown em si, não o envelope JSON com base64. */
const RAW_ACCEPT = 'application/vnd.github.raw+json';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const path = searchParams.get('path'); // optional: subfolder path

    if (!owner || !repo) {
        return NextResponse.json({ error: 'owner and repo required' }, { status: 400 });
    }

    if (!isOwnRepo(owner, repo)) {
        return NextResponse.json(
            { error: 'Repositório não permitido por esta rota.' },
            { status: 403 },
        );
    }

    const headers = githubHeaders(RAW_ACCEPT);

    // If path provided (e.g. subfolder in monorepo), try to fetch README from that path first
    if (path) {
        /*
            Antes: `encodeURIComponent(decodeURIComponent(path))`, que codificava também as
            barras (`src/api` virava `src%2Fapi`) e portanto nunca encontrava o README de
            uma subpasta de verdade. `safeContentPath` codifica segmento a segmento e
            preserva a barra — e rejeita `..`, que é o que escaparia do prefixo /contents.
        */
        const safePath = safeContentPath(decodeURIComponent(path));

        if (safePath === null) {
            return NextResponse.json({ error: 'Caminho inválido.' }, { status: 400 });
        }

        if (safePath !== '') {
            const subfolderUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${safePath}/README.md`;

            const subRes = await fetch(subfolderUrl, {
                headers,
                next: { revalidate: REVALIDATE_SECONDS },
            });

            if (subRes.ok) {
                const text = await subRes.text();
                return new NextResponse(text, {
                    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
                });
            }
            // Fall through to root README if subfolder README not found
        }
    }

    // Fetch root README (GitHub API auto-detects main/master branch and file casing)
    const rootUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
    const rootRes = await fetch(rootUrl, {
        headers,
        next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!rootRes.ok) {
        return new NextResponse(null, { status: 404 });
    }

    const text = await rootRes.text();
    return new NextResponse(text, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}
