'use client';

import { type ReactNode } from 'react';
import { ThemeProvider } from '@cypher-asi/zui';

interface ProvidersProps {
  readonly children: ReactNode;
}

export function Providers({ children }: ProvidersProps): ReactNode {
  return (
    <ThemeProvider defaultTheme="dark" defaultAccent="purple">
      {children}
    </ThemeProvider>
  );
}
