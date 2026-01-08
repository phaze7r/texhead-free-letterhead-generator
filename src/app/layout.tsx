import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';

export const metadata: Metadata = {
  title: 'TexHead',
  description: 'Generate professional letterheads with ease.',
};

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
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow">
            {children}
        </main>
        <AppFooter />
        <Toaster />
      </body>
    </html>
  );
}
