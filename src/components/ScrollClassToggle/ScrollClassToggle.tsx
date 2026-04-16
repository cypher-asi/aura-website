'use client';

import { useEffect, type ReactNode } from 'react';

type ScrollClassToggleProps = {
  readonly className: string;
};

export function ScrollClassToggle({ className }: ScrollClassToggleProps): ReactNode {
  useEffect(() => {
    document.documentElement.classList.add(className);
    document.body.classList.add(className);

    return () => {
      document.documentElement.classList.remove(className);
      document.body.classList.remove(className);
    };
  }, [className]);

  return null;
}
