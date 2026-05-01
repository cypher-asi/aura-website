import { Suspense, type ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { type Metadata, type Viewport } from 'next';
import { Providers } from './providers';
import { RouteTransitionManager } from '@/components/RouteTransition/RouteTransitionManager';
import { FathomAnalytics } from '@/components/Analytics/FathomAnalytics';

import '@/styles/tokens.css';
import '@/styles/themes.css';
import '@/styles/reset.css';
import '@/styles/base.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'AURA',
    template: 'AURA - %s',
  },
  description: 'A production-grade, zero-configuration preset for your tools.',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

const themeInitScript = `(function(){try{var s=JSON.parse(localStorage.getItem('aura-theme'));if(s){if(s.theme==='system'){document.documentElement.setAttribute('data-theme',window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}else if(s.theme==='dark'||s.theme==='light'){document.documentElement.setAttribute('data-theme',s.theme)}if(['cyan','blue','purple','green','orange','rose'].indexOf(s.accent)>-1){document.documentElement.setAttribute('data-accent',s.accent)}}}catch(e){}})()`;

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${inter.className}`} data-theme="dark" data-accent="purple">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Providers>
          <Suspense fallback={null}>
            <RouteTransitionManager />
          </Suspense>
          {children}
        </Providers>
        <FathomAnalytics />
      </body>
    </html>
  );
}
