import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { cookies, headers } from 'next/headers';
import './globals.css';
import { PageErrorBoundary } from '@/components/ui/ErrorBoundary';
import { LocaleProvider } from '@/components/i18n/LocaleProvider';
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, getTextDirection } from '@/lib/i18n/rtl';
import {
  getSiteUrl,
  siteDescription,
  siteKeywords,
  siteName,
  softwareApplicationJsonLd,
} from '@/lib/seo';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: siteKeywords,
  authors: [{ name: 'Soroban Security Scanner contributors' }],
  creator: 'Soroban Security Scanner contributors',
  category: 'Security',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: siteName,
    description: siteDescription,
    siteName,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover', // support iPhone notch / safe areas
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // Get the CSP nonce from middleware
  const headersList = headers();
  const nonce = headersList.get('x-nonce') || '';

  // Active locale comes from our own cookie (set by the locale store), never
  // from browser heuristics, so the rendered direction is deterministic and
  // identical on server and client.
  const cookieStore = cookies();
  const locale = cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE;
  const dir = getTextDirection(locale);

  return (
    <html lang={locale} dir={dir}>
      <body>
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              ...softwareApplicationJsonLd,
              url: siteUrl,
            }).replace(/</g, '\\u003c'),
          }}
        />
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
