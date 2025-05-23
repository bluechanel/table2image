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
    description: messages.metadata.description,
    keywords: "table to image, excel to image, markdown table, table converter, 表格转图片",
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    robots: "index, follow",
    openGraph: {
      type: "website",
      locale: locale,
      url: "https://table2image.wileyzhang.com",
      siteName: messages.metadata.title,
      title: messages.metadata.title,
      description: messages.metadata.description,
      images: [
        {
          url: "https://table2image.wileyzhang.com/og-image.png",
          width: 1200,
          height: 630,
          alt: messages.metadata.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: messages.metadata.title,
      description: messages.metadata.description,
      images: ["https://table2image.wileyzhang.com/og-image.png"]
    }
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
  const messages = (await import(`../../../messages/${locale}.json`)).default;
 
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://table2image.wileyzhang.com/#website",
        "url": "https://table2image.wileyzhang.com",
        "name": messages.metadata.title,
        "description": messages.metadata.description,
        "inLanguage": locale
      },
      {
        "@type": "WebPage",
        "@id": "https://table2image.wileyzhang.com/#webpage",
        "url": "https://table2image.wileyzhang.com",
        "name": messages.metadata.title,
        "description": messages.metadata.description,
        "isPartOf": { "@id": "https://table2image.wileyzhang.com/#website" },
        "inLanguage": locale
      },
      {
        "@type": "Organization",
        "@id": "https://table2image.wileyzhang.com/#organization",
        "url": "https://table2image.wileyzhang.com",
        "name": messages.metadata.title,
        "description": messages.metadata.description,
        "logo": {
          "@type": "ImageObject",
          "url": "https://table2image.wileyzhang.com/og-image.png",
          "width": 1200,
          "height": 630
        }
      }
    ]
  };

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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