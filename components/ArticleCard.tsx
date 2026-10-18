import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { ArticleSummary } from '@/lib/articles';

export default function ArticleCard({ article }: { article: ArticleSummary }) {
  const t = useTranslations('explore');
  const tl = useTranslations('languages');
  const format = useFormatter();
  const locale = useLocale();

  const category = article.categories?.names[locale] ?? article.categories?.names.en;
  const author = article.author?.display_name ?? t('anonymousAuthor');

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-teal/15">
      {article.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.cover_image_url} alt="" loading="lazy" className="aspect-video w-full object-cover" />
      )}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm text-teal">
          {category && <span>{category}</span>}
          {category && ' · '}
          <span lang={article.language}>{tl(article.language)}</span>
        </p>
        <h3 className="mt-2 text-xl font-semibold leading-snug" lang={article.language}>
          <Link href={`/article/${article.slug}`} className="hover:underline hover:underline-offset-4">
            {article.title}
          </Link>
        </h3>
        {article.summary && (
          <p className="mt-2 line-clamp-3 text-ink/80" lang={article.language}>{article.summary}</p>
        )}
        <p className="mt-auto pt-4 text-sm text-ink/70">
          {t('by', { name: author })}
          {article.published_at && ` · ${format.dateTime(new Date(article.published_at), { dateStyle: 'medium' })}`}
          {` · ${t('readingTime', { minutes: article.reading_minutes })}`}
        </p>
      </div>
    </article>
  );
}
