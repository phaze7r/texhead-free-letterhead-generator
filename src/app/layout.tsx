import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { getSeoSettings } from '@/app/actions/seo';
import { CookieConsent } from '@/components/cookie-consent';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSeoSettings();
  const baseUrl = 'https://letterhead.texodus.tech';

  return {
    title: settings.metaTitle,
    description: settings.metaDescription,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: settings.metaTitle,
      description: settings.metaDescription,
      url: baseUrl,
      siteName: 'TexHead',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.metaTitle,
      description: settings.metaDescription,
    },
    verification: {
      google: settings.googleVerification || "DLAxNrEy7wBocc93W78ZZWzhq9n7dve6leRSDjIbufM",
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=PT+Sans:wght@400;700&family=Caveat:wght@400;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "TexHead",
              "url": "https://letterhead.texodus.tech",
              "description": "Generate professional letterheads with ease. Fully customizable and download as PDF for free.",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "Texodus",
                "url": "https://www.texodus.tech"
              }
            })
          }}
        />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow">
            {children}
        </main>
        <AppFooter />
        <Toaster />
        <CookieConsent />
      </body>
    </html>
  );
}
