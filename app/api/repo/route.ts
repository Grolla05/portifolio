import { NextRequest, NextResponse } from 'next/server';
import { githubHeaders, isOwnRepo, safeContentPath } from '@/lib/github';

/*
    Navegador de arquivos de um repositório (usado pelo RepoModal).

    Os parâmetros da query eram interpolados crus na URL da API do GitHub, o que abria
    duas falhas — path traversal via `..` e proxy aberto para qualquer repositório.
    A validação vive em lib/github.ts, com o detalhamento do problema.
*/

const REVALIDATE_SECONDS = 3600;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const path = searchParams.get('path') ?? '';

    if (!owner || !repo) {
        return NextResponse.json({ error: 'owner and repo required' }, { status: 400 });
    }

    if (!isOwnRepo(owner, repo)) {
        return NextResponse.json(
            { error: 'Repositório não permitido por esta rota.' },
            { status: 403 },
        );
    }

    const safePath = safeContentPath(path);

    if (safePath === null) {
        return NextResponse.json({ error: 'Caminho inválido.' }, { status: 400 });
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${safePath}`;
    const res = await fetch(url, {
        headers: githubHeaders(),
        next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) {
        return NextResponse.json({ error: 'not found' }, { status: res.status });
    }

    const data = await res.json();

    // Mesmo cache de /api/projects: a árvore de um repositório muda devagar, e sem isso
    // cada expansão de pasta no modal vira uma requisição nova ao GitHub.
    const cacheHeaders = {
        'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    };

    // Directory listing
    if (Array.isArray(data)) {
        const items = data
            .map(({ name, type, path: p }: { name: string; type: string; path: string }) => ({
                name,
                type,
                path: p,
            }))
            .sort((a: { name: string; type: string }, b: { name: string; type: string }) => {
                if (a.type === b.type) return a.name.localeCompare(b.name);
                return a.type === 'dir' ? -1 : 1;
            });
        return NextResponse.json({ type: 'dir', items }, { headers: cacheHeaders });
    }

    // Single file — content is base64 encoded
    if (data.type === 'file') {
        if (!data.content) {
            return NextResponse.json(
                {
                    type: 'file',
                    name: data.name,
                    path: data.path,
                    content: '// File too large to display. View it on GitHub.',
                },
                { headers: cacheHeaders },
            );
        }
        const content = Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf-8');
        return NextResponse.json(
            { type: 'file', name: data.name, path: data.path, content },
            { headers: cacheHeaders },
        );
    }

    return NextResponse.json({ error: 'unsupported type' }, { status: 400 });
}
