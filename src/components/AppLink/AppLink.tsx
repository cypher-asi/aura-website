'use client';

import Link, { type LinkProps } from 'next/link';
import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react';
import { beginRouteTransition, shouldHandleClientNavigation } from '@/components/RouteTransition/RouteTransitionManager';

type AppLinkProps = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

export const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>(function AppLink(
  { href, onClick, target, ...props },
  ref,
) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (target && target !== '_self') {
      return;
    }

    if (!shouldHandleClientNavigation(event)) {
      return;
    }

    beginRouteTransition(typeof href === 'string' ? href : href.toString());
  };

  return <Link ref={ref} href={href} onClick={handleClick} target={target} {...props} />;
});
