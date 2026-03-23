'use client';

import { type ReactNode } from 'react';
import { ThemeProvider } from '@cypher-asi/zui';
import '@cypher-asi/zui/styles';
import './globals.css';

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="dark" defaultAccent="purple">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
