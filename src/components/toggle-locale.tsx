'use client';

import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

export function LocaleToggle() {
  const locales = ['en', 'es'] as const;
  type Locale = (typeof locales)[number];
  const localeLabels: Record<Locale, string> = { en: 'EN', es: 'ES' };
  const locale = useLocale();
  const pathname = usePathname();
  const switchLocaleHref = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    return segments.join('/') || '/';
  };
  return (
    <div className="flex items-center gap-1">
      {' '}
      {locales.map((l) => (
        <Link
          key={l}
          href={switchLocaleHref(l)}
          className={cn(
            'px-2 py-1 rounded text-sm dark:shadow dark:hover:bg-white dark:hover:text-black transition-transform',
            locale === l && 'font-bold underline bg-white text-black',
          )}
          locale={l}
          scroll={false}
        >
          {localeLabels[l]}
        </Link>
      ))}
    </div>
  );
}
