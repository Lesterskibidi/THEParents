import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'vi', 'zh-CN', 'fr'],
  defaultLocale: 'en',
});

export type Locale = (typeof routing.locales)[number];
