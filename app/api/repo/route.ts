import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const path = searchParams.get('path') ?? '';

    if (!owner || !repo) {
        return NextResponse.json({ error: 'owner and repo required' }, { status: 400 });
    }

    const headers: HeadersInit = {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'portfolio-app',
    };
    if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const res = await fetch(url, { headers, next: { revalidate: 3600 } });

    if (!res.ok) {
        return NextResponse.json({ error: 'not found' }, { status: res.status });
    }

    const data = await res.json();

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
        return NextResponse.json({ type: 'dir', items });
    }

    // Single file — content is base64 encoded
    if (data.type === 'file') {
        if (!data.content) {
            return NextResponse.json({
                type: 'file',
                name: data.name,
                path: data.path,
                content: '// File too large to display. View it on GitHub.',
            });
        }
        const content = Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf-8');
        return NextResponse.json({ type: 'file', name: data.name, path: data.path, content });
    }

    return NextResponse.json({ error: 'unsupported type' }, { status: 400 });
}
