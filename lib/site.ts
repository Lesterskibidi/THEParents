export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
export const LOCALES = ['en', 'vi', 'zh-CN', 'fr'] as const;
export type SiteLocale = (typeof LOCALES)[number];
export const isLocale = (v: unknown): v is SiteLocale => typeof v === 'string' && (LOCALES as readonly string[]).includes(v);
