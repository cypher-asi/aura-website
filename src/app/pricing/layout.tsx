import { type ReactNode } from 'react';

export const metadata = {
  title: 'Pricing',
};

interface PricingLayoutProps {
  readonly children: ReactNode;
}

export default function PricingLayout({ children }: PricingLayoutProps): ReactNode {
  return children;
}
