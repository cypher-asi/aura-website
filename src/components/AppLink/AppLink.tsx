'use client';

import Link, { type LinkProps } from 'next/link';
import { forwardRef, type AnchorHTMLAttributes } from 'react';

type AppLinkProps = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

export const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>(function AppLink(
  { href, ...props },
  ref,
) {
  return <Link ref={ref} href={href} {...props} />;
});
