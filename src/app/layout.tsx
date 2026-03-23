import { type ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { VideoBackground } from '@/components/VideoBackground/VideoBackground';
import '@/styles/tokens.css';
import '@/styles/themes.css';
import '@/styles/reset.css';
import '@/styles/base.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'AURA',
  description: 'A production-grade, zero-configuration preset for your tools.',
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
          <VideoBackground />
          {children}
        </Providers>
      </body>
    </html>
  );
}
