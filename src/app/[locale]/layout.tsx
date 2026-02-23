import type { Metadata } from 'next';
import { ThemeProvider } from "next-themes";
import '../globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SileoToaster } from 'sileo';
import { Providers } from '@/components/providers/query-provider';
import { AuthProvider } from '@/context/auth-context';
import { BudgetWidgetProvider } from '@/context/budget-widget-context';
import i18nConfig from '../../../i18nConfig';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/dictionaries';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SmartBudgetWrapper } from '@/components/budget-widget/smart-budget-wrapper';
import { AnalyticsTracker } from '@/components/analytics/analytics-tracker';
import localFont from 'next/font/local';
import { getTranslations } from 'next-intl/server';
import { constructMetadata } from '@/i18n/seo-utils';

import { Inter, PT_Sans } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const ptSans = PT_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

// We can map ptSans to both display and headline variables for uniform styling
const gencha = ptSans;
const genchaDisplay = ptSans;

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://expressrenovationmallorca.com'),
    ...constructMetadata({
      title: t('title'),
      description: t('description'),
      path: '/',
      locale,
      image: '/images/og-home.jpg'
    }),
    keywords: t('keywords'),
  };
}

export function generateStaticParams() {
  return i18nConfig.locales.map(locale => ({ locale }));
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;

  if (!i18nConfig.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dict = await getDictionary(locale as any);
  const faviconUrl = "";

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn('font-body antialiased min-h-screen bg-background flex flex-col', gencha.variable, genchaDisplay.variable, inter.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark-theme-gold"
          enableSystem={false}
          themes={[
            'theme-gold', 'dark-theme-gold',
            'theme-stone', 'dark-theme-stone',
            'theme-forest', 'dark-theme-forest',
            'theme-luxury', 'dark-theme-luxury',
            'theme-blue', 'dark-theme-blue'
          ]}
        >
          <NextIntlClientProvider messages={messages}>
            <Providers>
              <AuthProvider>
                <BudgetWidgetProvider>
                  {children}
                  <SmartBudgetWrapper dictionary={dict?.budgetRequest} />
                  <AnalyticsTracker />
                  <Toaster /> {/* Radix Toaster */}
                  <SileoToaster position="top-center" /> {/* Sileo Toaster */}
                </BudgetWidgetProvider>
              </AuthProvider>
            </Providers>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
