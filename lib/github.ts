import { GITHUB_USER } from '@/lib/site';

/*
    Guardas compartilhados das rotas que falam com a API do GitHub
    (app/api/repo, app/api/readme, app/api/projects).

    Motivo de existir: /api/repo montava a URL da API interpolando os parâmetros da
    query crus —

        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`

    O parser de URL normaliza dot-segments, então `path=../../../../user/repos` resolvia
    para `https://api.github.com/user/repos`. Esse endpoint é autenticado: com
    GITHUB_TOKEN definido (que app/api/projects/route.ts recomenda), ele responde com os
    repositórios PRIVADOS da conta, e o handler os devolvia como listagem de diretório.

    Sem validar `owner`/`repo` o site também virava proxy aberto do GitHub: qualquer
    pessoa podia buscar qualquer repositório através daqui, queimando o rate limit do
    token — e, com token autenticado, ler repositórios privados por caminho direto.
*/

/**
 * Charset de nome de repositório aceito pelo GitHub: letras, dígitos, ponto,
 * hífen e underscore. Barra, `?`, `#` e `%` ficam de fora justamente porque
 * escapariam do segmento de caminho ao serem interpolados na URL.
 */
const REPO_NAME = /^[A-Za-z0-9._-]{1,100}$/;

/**
 * Estas rotas servem SOMENTE o GitHub do dono do site.
 *
 * A comparação de `owner` é case-insensitive porque o GitHub não diferencia caixa em
 * nome de usuário — `grolla05` e `Grolla05` são a mesma conta, e recusar a variação
 * só criaria um 403 misterioso sem ganho de segurança.
 */
export function isOwnRepo(owner: string, repo: string): boolean {
  if (owner.toLowerCase() !== GITHUB_USER.toLowerCase()) return false;
  if (repo === '.' || repo === '..') return false;
  return REPO_NAME.test(repo);
}

/**
 * Normaliza um caminho para uso em `/repos/{owner}/{repo}/contents/{path}`.
 *
 * Rejeita (retorna null) qualquer caminho com segmento `.` ou `..`: são eles que
 * escapam do prefixo `/contents` e alcançam outros endpoints da API.
 *
 * Codifica cada segmento SEPARADAMENTE e rejunta com `/`, preservando a barra como
 * separador. Isso também conserta um bug anterior: caminhos com espaço
 * (`docs/Tailwind CSS.png`) geravam URL malformada, porque nada era codificado.
 *
 * Caminho vazio é válido — é a raiz do repositório.
 */
export function safeContentPath(path: string): string | null {
  if (path.includes('\0')) return null;

  const safe: string[] = [];

  for (const segment of path.split('/')) {
    // Barra inicial, final ou duplicada não é erro; só não gera segmento.
    if (segment === '') continue;
    if (segment === '.' || segment === '..') return null;
    safe.push(encodeURIComponent(segment));
  }

  return safe.join('/');
}

/**
 * Headers das chamadas ao GitHub.
 *
 * Definir GITHUB_TOKEN eleva o rate limit de 60 para 5000 req/hora. Só é seguro
 * enviá-lo porque `isOwnRepo` já restringiu o alvo ao dono do site — de outro modo o
 * token autenticaria requisições para repositórios arbitrários.
 */
export function githubHeaders(
  accept: string = 'application/vnd.github+json',
): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: accept,
    'User-Agent': 'portfolio-app',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}
