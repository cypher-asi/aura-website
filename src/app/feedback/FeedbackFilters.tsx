'use client';

import { useCallback, useState, type ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  CircleDot,
  Clock,
  Eye,
  Flame,
  Globe,
  HelpCircle,
  Layers,
  MessageCircle,
  Palette,
  Rocket,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  Bug,
  type LucideIcon,
} from 'lucide-react';

import {
  FEEDBACK_ALL_CATEGORY_OPTION,
  FEEDBACK_ALL_STATUS_OPTION,
  FEEDBACK_CATEGORY_FILTERS,
  FEEDBACK_SORT_FILTERS,
  FEEDBACK_STATUS_FILTERS,
  type FeedbackFilterOption,
} from './feedback-constants';

const ICONS: Record<string, LucideIcon> = {
  Clock,
  Star,
  Flame,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Bug,
  Palette,
  MessageCircle,
  HelpCircle,
  CircleDashed,
  Eye,
  CircleDot,
  CheckCircle2,
  Rocket,
  Layers,
  Globe,
};

function Icon({ name }: { name: string }): ReactNode {
  const Cmp = ICONS[name];
  if (!Cmp) return null;
  return <Cmp size={14} strokeWidth={1.75} />;
}

type SectionId = 'trending' | 'type' | 'status';

interface FolderSectionProps {
  readonly label: string;
  readonly expanded: boolean;
  readonly onToggle: () => void;
  readonly children: ReactNode;
}

function FolderSection({
  label,
  expanded,
  onToggle,
  children,
}: FolderSectionProps): ReactNode {
  return (
    <div className="feedbackFolder">
      <button
        type="button"
        className="feedbackFolderHeader"
        aria-expanded={expanded}
        onClick={onToggle}
      >
        <span
          className={`feedbackFolderChevron ${expanded ? 'feedbackFolderChevronOpen' : ''}`}
          aria-hidden
        >
          <ChevronRight size={12} strokeWidth={2} />
        </span>
        <span className="feedbackFolderLabel">{label}</span>
      </button>
      {expanded && <div className="feedbackFolderBody">{children}</div>}
    </div>
  );
}

interface FilterRowProps<Id extends string> {
  readonly option: FeedbackFilterOption<Id>;
  readonly selected: boolean;
  readonly onSelect: (id: Id) => void;
}

function FilterRow<Id extends string>({
  option,
  selected,
  onSelect,
}: FilterRowProps<Id>): ReactNode {
  return (
    <button
      type="button"
      className={`feedbackFilterRow ${selected ? 'feedbackFilterRowActive' : ''}`}
      aria-pressed={selected}
      onClick={() => onSelect(option.id)}
    >
      <span className="feedbackFilterRowIcon" aria-hidden>
        <Icon name={option.iconName} />
      </span>
      <span className="feedbackFilterRowLabel">{option.label}</span>
    </button>
  );
}

export interface FeedbackFiltersProps {
  readonly sort: string;
  readonly category: string | null;
  readonly status: string | null;
}

export function FeedbackFilters({
  sort,
  category,
  status,
}: FeedbackFiltersProps): ReactNode {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [expanded, setExpanded] = useState<Record<SectionId, boolean>>({
    trending: true,
    type: true,
    status: true,
  });

  const toggle = useCallback((id: SectionId) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const updateParam = useCallback(
    (key: 'sort' | 'type' | 'status', value: string | null) => {
      const next = new URLSearchParams(searchParams?.toString() ?? '');
      if (value === null || value === '' || value === 'all') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  return (
    <aside className="feedbackSidebar" aria-label="Feedback filters">
      <FolderSection
        label="Trending"
        expanded={expanded.trending}
        onToggle={() => toggle('trending')}
      >
        {FEEDBACK_SORT_FILTERS.map((opt) => (
          <FilterRow
            key={opt.id}
            option={opt}
            selected={opt.id === sort}
            onSelect={(id) => updateParam('sort', id)}
          />
        ))}
      </FolderSection>

      <FolderSection
        label="Type"
        expanded={expanded.type}
        onToggle={() => toggle('type')}
      >
        <FilterRow
          option={FEEDBACK_ALL_CATEGORY_OPTION}
          selected={category === null}
          onSelect={() => updateParam('type', null)}
        />
        {FEEDBACK_CATEGORY_FILTERS.map((opt) => (
          <FilterRow
            key={opt.id}
            option={opt}
            selected={opt.id === category}
            onSelect={(id) => updateParam('type', id)}
          />
        ))}
      </FolderSection>

      <FolderSection
        label="Status"
        expanded={expanded.status}
        onToggle={() => toggle('status')}
      >
        <FilterRow
          option={FEEDBACK_ALL_STATUS_OPTION}
          selected={status === null}
          onSelect={() => updateParam('status', null)}
        />
        {FEEDBACK_STATUS_FILTERS.map((opt) => (
          <FilterRow
            key={opt.id}
            option={opt}
            selected={opt.id === status}
            onSelect={(id) => updateParam('status', id)}
          />
        ))}
      </FolderSection>
    </aside>
  );
}
