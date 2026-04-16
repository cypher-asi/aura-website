'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ROUTE_TRANSITION_CLASS = 'routeTransitioning';

export function resetWindowScroll(): void {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function isInternalHref(href: string): boolean {
  if (!href) {
    return false;
  }

  if (href.startsWith('#')) {
    return false;
  }

  try {
    const url = new URL(href, window.location.href);
    return url.origin === window.location.origin;
  } catch {
    return false;
  }
}

export function shouldHandleClientNavigation(event: {
  readonly button: number;
  readonly metaKey: boolean;
  readonly ctrlKey: boolean;
  readonly shiftKey: boolean;
  readonly altKey: boolean;
}): boolean {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

export function beginRouteTransition(href: string): void {
  if (!isInternalHref(href)) {
    return;
  }

  const targetUrl = new URL(href, window.location.href);
  const currentUrl = new URL(window.location.href);

  if (targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search && targetUrl.hash === currentUrl.hash) {
    return;
  }

  document.body.classList.add(ROUTE_TRANSITION_CLASS);
}

export function RouteTransitionManager(): React.ReactNode {
  const pathname = usePathname();

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    document.body.classList.remove(ROUTE_TRANSITION_CLASS);
    resetWindowScroll();

    const frameId = window.requestAnimationFrame(() => {
      document.body.classList.remove(ROUTE_TRANSITION_CLASS);
      resetWindowScroll();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [pathname]);

  return null;
}
