'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function resetWindowScroll(): void {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function RouteTransitionManager(): React.ReactNode {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      resetWindowScroll();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [pathname, search]);

  return null;
}
