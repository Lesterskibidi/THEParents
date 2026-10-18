import { cache } from 'react';
import { getPublicClient } from './supabase';
import { LOCALES } from './site';

export const PAGE_SIZE = 12;

export type CategoryRow = { slug: string; names: Record<string, string> };
export type AuthorRow = { username: string | null; display_name: string } | null;

export type ArticleSummary = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string | null;
  cover_image_url: string | null;
  language: string;
  published_at: string | null;
  reading_minutes: number;
  categories: CategoryRow | null;
  author: AuthorRow;
};

export type ArticleDetail = ArticleSummary & {
  body: string;
  updated_at: string;
  article_tags: { tags: { slug: string; name: string } | null }[];
  article_references: { position: number; citation: string; url: string | null }[];
};

export type ExploreParams = {
  q?: string;
  category?: string;
  language?: string;
  tag?: string;
  sort?: 'newest' | 'oldest';
  page?: number;
  pageSize?: number;
};

const CARD_FIELDS =
  'id, slug, title, subtitle, summary, cover_image_url, language, published_at, reading_minutes';
const AUTHOR = 'author:profiles!articles_author_id_fkey(username, display_name)';

/** Keep only letters, numbers and spaces so user text can never alter the query syntax. */
export function cleanQuery(q: string | undefined): string {
  return (q ?? '').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim().slice(0, 100);
}

export const getCategories = cache(async (): Promise<CategoryRow[]> => {
  const db = getPublicClient();
  if (!db) return [];
  const { data, error } = await db.from('categories').select('slug, names').order('sort_order');
  if (error) { console.error('categories query failed:', error.message); return []; }
  return (data ?? []) as CategoryRow[];
});

export async function listArticles(p: ExploreParams) {
  const db = getPublicClient();
  if (!db) return { configured: false, items: [] as ArticleSummary[], total: 0 };

  const pageSize = p.pageSize ?? PAGE_SIZE;
  const page = Math.max(1, p.page ?? 1);
  const q = cleanQuery(p.q);

  const select = [
    CARD_FIELDS,
    p.category ? 'categories!inner(slug, names)' : 'categories(slug, names)',
    AUTHOR,
    p.tag ? 'article_tags!inner(tags!inner(slug))' : null,
  ].filter(Boolean).join(', ');

  let query = db.from('articles').select(select, { count: 'exact' }).eq('status', 'published');

  if (p.category) query = query.eq('categories.slug', p.category);
  if (p.tag) query = query.eq('article_tags.tags.slug', p.tag);
  if (p.language && (LOCALES as readonly string[]).includes(p.language)) query = query.eq('language', p.language);
  if (q) {
    // Full-text match on title/summary/body, plus a substring match on the title.
    // The substring part helps Chinese, which the 'simple' text-search config cannot segment into words.
    query = query.or(`search.wfts(simple).${q},title.ilike.*${q}*`);
  }

  query = query
    .order('published_at', { ascending: p.sort === 'oldest' })
    .range((page - 1) * pageSize, page * pageSize - 1);

  const { data, count, error } = await query;
  if (error) {
    console.error('articles query failed:', error.message);
    return { configured: true, items: [] as ArticleSummary[], total: 0 };
  }
  return { configured: true, items: (data ?? []) as unknown as ArticleSummary[], total: count ?? 0 };
}

export const getArticle = cache(async (slug: string): Promise<ArticleDetail | null> => {
  const db = getPublicClient();
  if (!db) return null;
  const { data, error } = await db
    .from('articles')
    .select(
      `${CARD_FIELDS}, body, updated_at, categories(slug, names), ${AUTHOR},
       article_tags(tags(slug, name)), article_references(position, citation, url)`,
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error) { console.error('article query failed:', error.message); return null; }
  return (data as unknown as ArticleDetail) ?? null;
});

export async function listPublishedForSitemap(limit = 5000) {
  const db = getPublicClient();
  if (!db) return [];
  const { data } = await db
    .from('articles')
    .select('slug, language, updated_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);
  return (data ?? []) as { slug: string; language: string; updated_at: string }[];
}
