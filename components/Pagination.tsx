import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type Props = { page: number; totalPages: number; params: Record<string, string | undefined> };

export default function Pagination({ page, totalPages, params }: Props) {
  const t = useTranslations('explore');
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
    if (p > 1) sp.set('page', String(p));
    const qs = sp.toString();
    return `/explore${qs ? `?${qs}` : ''}`;
  };

  return (
    <nav aria-label={t('pagination')} className="mt-10 flex items-center justify-between gap-4">
      {page > 1 ? <Link href={href(page - 1)} rel="prev" className="btn btn-secondary">{t('prev')}</Link> : <span />}
      <p aria-live="polite">{t('pageOf', { page, total: totalPages })}</p>
      {page < totalPages ? <Link href={href(page + 1)} rel="next" className="btn btn-secondary">{t('next')}</Link> : <span />}
    </nav>
  );
}
