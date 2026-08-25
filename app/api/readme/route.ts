import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const path = searchParams.get('path'); // optional: subfolder path

    if (!owner || !repo) {
        return NextResponse.json({ error: 'owner and repo required' }, { status: 400 });
    }

    const headers: HeadersInit = {
        Accept: 'application/vnd.github.raw+json',
        'User-Agent': 'portfolio-app',
    };

    // Optional: set GITHUB_TOKEN env var to raise rate limit from 60 to 5000 req/hour
    if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // If path provided (e.g. subfolder in monorepo), try to fetch README from that path first
    if (path) {
        const decodedPath = decodeURIComponent(path);
        const subfolderUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(decodedPath)}/README.md`;

        const subRes = await fetch(subfolderUrl, {
            headers,
            next: { revalidate: 3600 }, // ISR: re-fetch from GitHub every hour
        });

        if (subRes.ok) {
            const text = await subRes.text();
            return new NextResponse(text, {
                headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            });
        }
        // Fall through to root README if subfolder README not found
    }

    // Fetch root README (GitHub API auto-detects main/master branch and file casing)
    const rootUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
    const rootRes = await fetch(rootUrl, {
        headers,
        next: { revalidate: 3600 },
    });

    if (!rootRes.ok) {
        return new NextResponse(null, { status: 404 });
    }

    const text = await rootRes.text();
    return new NextResponse(text, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}
