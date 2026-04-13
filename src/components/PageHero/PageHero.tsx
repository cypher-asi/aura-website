import { type ReactNode } from 'react';
import { ButtonAction } from '@/components/ButtonAction/ButtonAction';
import './PageHero.css';

interface PageHeroProps {
  readonly label: string;
  readonly headline: ReactNode;
  readonly description: string;
  readonly ctaText: string;
  readonly ctaIcon?: ReactNode;
  readonly onCtaClick?: () => void;
  readonly preview?: ReactNode;
}

export function PageHero({
  label,
  headline,
  description,
  ctaText,
  ctaIcon,
  onCtaClick,
  preview,
}: PageHeroProps): ReactNode {
  return (
    <section className="pageHero">
      <div className="pageHeroContent">
        <span className="pageHeroLabel">{label}</span>
        <h1 className="pageHeroHeadline">{headline}</h1>
        <p className="pageHeroDescription">{description}</p>
        <div className="pageHeroActions">
          <ButtonAction icon={ctaIcon} onClick={onCtaClick}>
            {ctaText}
          </ButtonAction>
        </div>
      </div>
      <div className="pageHeroPreview">
        {preview ?? <div className="pageHeroPreviewPlaceholder" />}
      </div>
    </section>
  );
}
