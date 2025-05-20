import type { Metadata } from "next";
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import { Geist, Geist_Mono } from "next/font/google";
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { GoogleAnalytics } from '@next/third-parties/google'
import LanguageSwitcher from '@/components/LanguageSwitcher';
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(
  {
    params
  }: {
    params: Promise<{locale: string}>
  }
): Promise<Metadata> {
  const {locale} = await params;
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return {
    title: messages.metadata.title,
    description: messages.metadata.description
  };
}

 
export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
 
  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider>
          <LanguageSwitcher />
          {children}
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId="G-CFCSRD88H5" />
    </html>
  );
}