# THEParents (Phase 1 foundation + Phase 2 knowledge library)

Next.js 14 (App Router) + TypeScript + Tailwind + next-intl (en, vi, zh-CN, fr). Database: Supabase Postgres.

## Run locally
```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000  (redirects to /en)
npm run typecheck
```

## Database (needed from Phase 3, schema is ready now)
1. Create a free project at supabase.com.
2. SQL editor -> paste `supabase/migrations/0001_foundation.sql` -> Run.
3. Put the project URL and keys into `.env.local` (never commit them; the service-role key is server-only).

## What exists in Phase 1
- Responsive navbar (logged-out state), language switcher, footer, accessible skip link and focus styles.
- Home page: hero, search form, category list, how-it-works, mission note, publishing summary.
- Four languages, same keys in every file. No hardcoded UI text.
- Security headers. Database schema with Row Level Security, configurable allowance/fee, role table users cannot write to.

## Phase 2: knowledge library
- `/explore`: search, category / language / tag filters, newest or oldest first, pagination (12 per page).
- `/search?q=...` redirects to Explore. `/article/[slug]`: table of contents, references, related articles, share, tags,
  language notice, JSON-LD, Open Graph, canonical URL in the article's own language.
- `/sitemap.xml`, `/robots.txt`. Filtered and paginated Explore views are marked noindex.
- Article text is stored as **Markdown** and rendered to React elements (no raw HTML), so author text cannot inject scripts.
- Unknown URLs show a localized 404.

### Set up the data
1. Run `supabase/migrations/0001_foundation.sql`, then `0002_article_reading_time.sql`, in the Supabase SQL editor.
2. Fill `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
3. To see something on screen: Authentication > Add user (the trigger creates the profile), then run `supabase/seed.sql`.
   The seed adds 3 articles titled `[SAMPLE]`. Delete them before launch.
4. Public content refreshes every 60 seconds; article pages every 5 minutes.

## Known limits (honest list)
- No "most popular" sort: there is no trustworthy view signal yet, and a plain counter could be inflated by bots.
- Search is database full-text with the `simple` config plus a title substring match. It does not rank by relevance,
  does not search author names, and Chinese body text is matched only loosely. A better search index is a later upgrade.
- Bookmark and report buttons need accounts (Phase 3). Math notation is not rendered yet.
- Cover images use plain `<img>`; switch to `next/image` once the Supabase Storage domain is configured.

## Not built yet (these links show the 404 page)
/mission, /membership, /login, /register, /about, /contact, /policies/*. No auth and no payments yet.

## Next
Phase 2: article listing, search, article page. Phase 3: auth + editor + free allowance. Payments only after a provider
that supports VND micro-payments and subscriptions is verified.
