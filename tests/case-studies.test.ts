import { describe, it, expect } from 'vitest';
import {
  CASE_STUDIES,
  PROJECT_SUMMARIES,
  getAdjacentCaseStudies,
  getCaseStudy,
  getCaseStudyBySlug,
  getCuratedSummary,
  getExplicitCover,
} from '@/lib/case-studies';

describe('case studies', () => {
  it('slugs são únicos e seguros para URL', () => {
    const slugs = CASE_STUDIES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('repositórios são únicos (chave de junção com /api/projects)', () => {
    const repos = CASE_STUDIES.map((s) => s.repo);
    expect(new Set(repos).size).toBe(repos.length);
  });

  it('todo estudo tem o conteúdo mínimo preenchido', () => {
    for (const study of CASE_STUDIES) {
      expect(study.title.length, study.slug).toBeGreaterThan(0);
      expect(study.tagline.length, study.slug).toBeGreaterThan(20);
      expect(study.summary.length, study.slug).toBeGreaterThan(20);
      expect(study.problem.length, study.slug).toBeGreaterThan(40);
      expect(study.solution.length, study.slug).toBeGreaterThan(40);
      expect(study.highlights.length, study.slug).toBeGreaterThan(0);
      expect(study.decisions.length, study.slug).toBeGreaterThan(0);
      expect(study.stack.length, study.slug).toBeGreaterThan(0);
    }
  });

  it('demo, quando existe, é https', () => {
    for (const study of CASE_STUDIES) {
      if (study.demo) expect(study.demo, study.slug).toMatch(/^https:\/\//);
    }
  });

  it('busca por repositório e por slug devolve o mesmo estudo', () => {
    const first = CASE_STUDIES[0];
    expect(getCaseStudy(first.repo)).toBe(first);
    expect(getCaseStudyBySlug(first.slug)).toBe(first);
    expect(getCaseStudy('repo-inexistente')).toBeUndefined();
    expect(getCaseStudyBySlug('nao-existe')).toBeUndefined();
  });

  it('resumo curado: estudo > resumo traduzido > null', () => {
    const study = CASE_STUDIES[0];
    expect(getCuratedSummary(study.repo)).toBe(study.summary);

    const [translatedRepo, translated] = Object.entries(PROJECT_SUMMARIES)[0];
    expect(getCuratedSummary(translatedRepo)).toBe(translated);

    expect(getCuratedSummary('repo-sem-resumo')).toBeNull();
  });

  it('resumos traduzidos não colidem com repositórios que já têm estudo', () => {
    for (const study of CASE_STUDIES) {
      expect(PROJECT_SUMMARIES[study.repo], study.repo).toBeUndefined();
    }
  });

  it('capa explícita: miniatura local ou null (o componente gera a capa em CSS)', () => {
    expect(getExplicitCover('CS50_2025')).toBe('/thumbnails/CS50.jpg');
    expect(getExplicitCover('MIT_6.002.1x')).toBe('/thumbnails/MIT.jpg');
    expect(getExplicitCover('Snake-game')).toBeNull();
  });

  it('navegação circular entre estudos', () => {
    const first = CASE_STUDIES[0];
    const last = CASE_STUDIES[CASE_STUDIES.length - 1];

    const adjacent = getAdjacentCaseStudies(first.slug)!;
    expect(adjacent.prev).toBe(last);
    expect(adjacent.next).toBe(CASE_STUDIES[1]);

    expect(getAdjacentCaseStudies('nao-existe')).toBeNull();
  });
});
