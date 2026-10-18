import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations('footer');
  return (
    <footer className="mt-24 bg-teal-dark text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">THEParents</p>
          <p className="mt-2 max-w-xs text-cream/85">{t('tagline')}</p>
        </div>
        <nav aria-label={t('explore')}>
          <p className="font-semibold">{t('explore')}</p>
          <ul className="mt-3 space-y-2">
            <li><Link href="/explore" className="hover:underline">{t('library')}</Link></li>
            <li><Link href="/mission" className="hover:underline">{t('mission')}</Link></li>
            <li><Link href="/about" className="hover:underline">{t('about')}</Link></li>
            <li><Link href="/contact" className="hover:underline">{t('contact')}</Link></li>
          </ul>
        </nav>
        <nav aria-label={t('policies')}>
          <p className="font-semibold">{t('policies')}</p>
          <ul className="mt-3 space-y-2">
            <li><Link href="/policies/terms" className="hover:underline">{t('terms')}</Link></li>
            <li><Link href="/policies/privacy" className="hover:underline">{t('privacy')}</Link></li>
            <li><Link href="/policies/content" className="hover:underline">{t('content')}</Link></li>
            <li><Link href="/policies/refunds" className="hover:underline">{t('refunds')}</Link></li>
          </ul>
        </nav>
      </div>
      <p className="border-t border-cream/20 px-4 py-4 text-center text-sm text-cream/80">
        © {new Date().getFullYear()} THEParents
      </p>
    </footer>
  );
}
