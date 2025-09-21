import { Toaster } from 'sonner';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@vercel/analytics/next';

import './globals.css';
import { SessionProvider } from 'next-auth/react';

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  applicationName: 'AI Chatbot',
  title: {
    default: 'AI Chatbot — Fast, Multimodal Chat',
    template: '%s · AI Chatbot',
  },
  description:
    'Conversational AI app with Gemini models, file attachments (images, PDFs), artifacts, and Supermemory.',
  keywords: [
    'AI chatbot',
    'Next.js',
    'Gemini',
    'multimodal',
    'Supermemory',
    'AI SDK',
  ],
  authors: [{ name: 'AI Chatbot' }],
  creator: 'AI Chatbot',
  publisher: 'AI Chatbot',
  openGraph: {
    type: 'website',
    url: appUrl,
    title: 'AI Chatbot — Fast, Multimodal Chat',
    description:
      'Chat with AI, upload images and PDFs, create artifacts, and manage memories.',
    siteName: 'AI Chatbot',
    images: [
      {
        url: '/images/demo-thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'AI Chatbot Preview',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chatbot — Fast, Multimodal Chat',
    description:
      'Chat with AI, upload images and PDFs, create artifacts, and manage memories.',
    images: ['/images/demo-thumbnail.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: appUrl,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const spaceGrotesk = localFont({
  src: './font/SpaceGrotesk-VariableFont_wght.ttf',
  variable: '--font-be-space-grotesk',
});

const LIGHT_THEME_COLOR = 'hsl(0 0% 100%)';
const DARK_THEME_COLOR = 'hsl(240deg 10% 3.92%)';
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // `next-themes` injects an extra classname to the body element to avoid
      // visual flicker before hydration. Hence the `suppressHydrationWarning`
      // prop is necessary to avoid the React hydration mismatch warning.
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      suppressHydrationWarning
      className={`${spaceGrotesk.className} flex h-screen w-screen flex-col antialiased selection:bg-foreground selection:text-background`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          <SessionProvider>
            <Analytics />
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
