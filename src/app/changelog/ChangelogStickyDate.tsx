'use client';

import { useEffect, useRef, useState } from 'react';

export interface ChangelogStickyDateItem {
  readonly id: string;
  readonly label: string;
}

interface ChangelogStickyDateProps {
  readonly items: readonly ChangelogStickyDateItem[];
}

type Direction = 'down' | 'up';

const STICKY_LINE = 124;
const TRANSITION_MS = 620;

export function ChangelogStickyDate({ items }: ChangelogStickyDateProps): React.ReactElement | null {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<Direction>('down');

  const activeIndexRef = useRef(0);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || items.length === 0) return;

    const clearResetTimer = () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };

    const compute = () => {
      const nodes = document.querySelectorAll<HTMLElement>('[data-changelog-entry-index]');
      if (nodes.length === 0) return;

      let next = 0;
      for (let i = 0; i < nodes.length; i += 1) {
        const rect = nodes[i].getBoundingClientRect();
        if (rect.top - STICKY_LINE <= 1) {
          next = i;
        } else {
          break;
        }
      }

      const current = activeIndexRef.current;
      if (current === next) return;

      activeIndexRef.current = next;
      setDirection(next > current ? 'down' : 'up');
      setPrevIndex(current);
      setActiveIndex(next);

      clearResetTimer();
      resetTimerRef.current = window.setTimeout(() => {
        setPrevIndex(null);
        resetTimerRef.current = null;
      }, TRANSITION_MS);
    };

    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);

    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
      clearResetTimer();
    };
  }, [items.length]);

  if (items.length === 0) return null;

  const active = items[activeIndex] ?? items[0];
  const previous = prevIndex !== null ? (items[prevIndex] ?? null) : null;

  return (
    <div className="changelogStickyDate" aria-hidden="true">
      <div className="changelogStickyDate__stage">
        {previous !== null ? (
          <span
            key={`leave-${previous.id}-${active.id}`}
            className={`changelogStickyDate__label changelogStickyDate__label--leaving-${direction}`}
          >
            {previous.label}
          </span>
        ) : null}
        <span
          key={`enter-${active.id}`}
          className={`changelogStickyDate__label changelogStickyDate__label--entering-${direction}`}
        >
          {active.label}
        </span>
      </div>
    </div>
  );
}
