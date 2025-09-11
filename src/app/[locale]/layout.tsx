import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { Roboto_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import GlobalScrambleEffect from '@/components/scramble-effect';
import { ThemeProvider } from '@/components/theme-provider';
import { routing } from '@/i18n/routing';
import { Navbar } from '@/modules/home/ui/components/navbar';
import '../globals.css';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { navbarItems } from '@/modules/home/constants';
import { NavbarSidebar } from '@/modules/home/ui/components/navbar-sidebar';

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
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[url('/background-light.png')] bg-cover bg-no-repeat opacity-100 transition-opacity duration-500 dark:opacity-0"></div>
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[url('/background-dark.png')] bg-cover bg-no-repeat opacity-0 transition-opacity duration-500 dark:opacity-100"></div>

        <NextIntlClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <GlobalScrambleEffect />

            <SidebarProvider>
              <div className="flex min-h-screen w-full flex-col overflow-hidden px-4 py-4 md:px-[60px] md:py-10">
                <div className="flex flex-1 flex-col text-[rgba(40,40,40,1)] dark:text-white">
                  <SidebarTrigger className="md:hidden" />
                  <Navbar />
                  <NavbarSidebar items={navbarItems} />

                  <div className="flex flex-1 flex-col px-4 py-8 md:px-10">
                    {children}
                  </div>
                </div>
              </div>
            </SidebarProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
