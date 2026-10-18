'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';

// Phase 1 shows the logged-out state only.
// Phase 3 swaps Sign In / Get Started for the avatar menu once real sessions exist.
const LINKS = [
  { href: '/', key: 'home' },
  { href: '/explore', key: 'explore' },
  { href: '/explore#categories', key: 'categories' },
  { href: '/mission', key: 'mission' },
  { href: '/search', key: 'search' },
] as const;

export default function Navbar() {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-teal/20 bg-cream/95 backdrop-blur">
      <nav aria-label={t('primary')} className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-display text-2xl text-teal" onClick={() => setOpen(false)}>
          THEParents
        </Link>

        <ul className="hidden items-center gap-6 lg:flex">
          {LINKS.map(({ href, key }) => (
            <li key={key}>
              <Link href={href} className="font-medium hover:text-teal hover:underline hover:underline-offset-4">
                {t(key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Link href="/login" className="font-semibold text-teal hover:underline">
            {t('signIn')}
          </Link>
          <Link href="/register" className="btn btn-primary !py-2">
            {t('getStarted')}
          </Link>
        </div>

        <button
          type="button"
          className="rounded-md border border-teal/40 px-3 py-2 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? t('closeMenu') : t('menu')}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-teal/20 px-4 pb-5 lg:hidden"
          onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        >
          <ul className="flex flex-col py-2">
            {LINKS.map(({ href, key }) => (
              <li key={key}>
                <Link href={href} className="block py-3 font-medium" onClick={() => setOpen(false)}>
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mb-4">
            <LanguageSwitcher />
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="btn btn-secondary flex-1" onClick={() => setOpen(false)}>
              {t('signIn')}
            </Link>
            <Link href="/register" className="btn btn-primary flex-1" onClick={() => setOpen(false)}>
              {t('getStarted')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
