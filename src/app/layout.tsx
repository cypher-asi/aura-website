import { type ReactNode } from 'react';
import { Providers } from './providers';
import '@cypher-asi/zui/styles';
import './globals.css';

export const metadata = {
  title: 'Aura',
  description: 'A production-grade, zero-configuration preset for your tools.',
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
