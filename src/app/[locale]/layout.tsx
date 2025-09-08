import GlobalScrambleEffect from '@/components/scramble-effect';
import { ThemeProvider } from '@/components/theme-provider';
import { routing } from '@/i18n/routing';
import { Navbar } from '@/modules/home/ui/components/navbar';
import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { Roboto_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';

import '../globals.css';

export const metadata: Metadata = {
  title: 'Gonzalo Bonelli',
  description: 'My portfolio',
};
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${robotoMono.className} antialiased`}>
        <div className="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-500 opacity-100 dark:opacity-0 bg-[url('/background-light.png')] bg-cover bg-no-repeat"></div>
        <div className="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-500 opacity-0 dark:opacity-100 bg-[url('/background-dark.png')] bg-cover bg-no-repeat"></div>

        <NextIntlClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <GlobalScrambleEffect />

            <div className="flex flex-col min-h-screen py-10 px-[60px]">
              <div className="flex flex-col flex-1  text-[rgba(40,40,40,1)] dark:text-white">
                {/* border dark:border-white border-[#282828] overflow-hidden */}
                <Navbar />
                <div className="flex flex-col flex-1 p-10">{children}</div>
              </div>
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
