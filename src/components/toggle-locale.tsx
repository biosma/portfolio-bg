'use client';

import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import * as React from 'react';

const locales = ['en', 'es'] as const;
type Locale = (typeof locales)[number];
const localeLabels: Record<Locale, string> = { en: 'EN', es: 'ES' };

// Quita el prefijo de locale del pathname actual
function stripLocale(path: string) {
  return path.replace(/^\/(en|es)(?=\/|$)/, '') || '/';
}

export function LocaleToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const basePath = stripLocale(pathname); // <-- sin /en o /es

  return (
    <div className="flex items-center gap-1">
      {locales.map((l) => (
        <Link
          key={l}
          href={basePath}   // <-- sin prefijo
          locale={l}         // <-- el Link agrega /en o /es
          scroll={false}
          className={cn(
            'px-2 py-1 rounded text-sm dark:shadow dark:hover:bg-white dark:hover:text-black transition-transform',
            locale === l && 'font-bold underline bg-white text-black'
          )}
        >
          {localeLabels[l]}
        </Link>
      ))}
    </div>
  );
}
