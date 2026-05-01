import Script from 'next/script';
import { FATHOM_SITE_ID } from '@/config/analytics';

export function FathomAnalytics(): React.ReactNode {
  if (!FATHOM_SITE_ID) {
    return null;
  }

  return (
    <Script
      src="https://cdn.usefathom.com/script.js"
      data-site={FATHOM_SITE_ID}
      data-spa="auto"
      strategy="afterInteractive"
      defer
    />
  );
}
