'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const LABELS: Record<string, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
  'zh-CN': '简体中文',
  fr: 'Français',
};

export default function LanguageSwitcher() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="sr-only">{t('language')}</span>
      <select
        value={locale}
        onChange={(e) => router.replace(pathname, { locale: e.target.value })}
        className="rounded-md border border-teal/40 bg-cream px-2 py-1.5 text-ink"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} lang={l}>
            {LABELS[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
