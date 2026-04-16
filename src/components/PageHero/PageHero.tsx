import { type ReactNode } from 'react';
import { ButtonAction } from '@/components/ButtonAction/ButtonAction';
import './PageHero.css';

interface PageHeroProps {
  readonly label?: string;
  readonly headline: ReactNode;
  readonly description: string;
  readonly ctaText?: string;
  readonly ctaIcon?: ReactNode;
  readonly ctaHref?: string;
  readonly onCtaClick?: () => void;
  readonly preview?: ReactNode | null;
}

export function PageHero({
  label,
  headline,
  description,
  ctaText,
  ctaIcon,
  ctaHref,
  onCtaClick,
  preview,
}: PageHeroProps): ReactNode {
  const pageHeroClassName = preview === null ? 'pageHero pageHeroNoPreview' : 'pageHero';

  return (
    <section className={pageHeroClassName}>
      <div className="pageHeroContent">
        {label ? <span className="pageHeroLabel">{label}</span> : null}
        <h1 className="pageHeroHeadline">{headline}</h1>
        <p className="pageHeroDescription">{description}</p>
        {ctaText ? (
          <div className="pageHeroActions">
            <ButtonAction href={ctaHref} icon={ctaIcon} onClick={onCtaClick}>
              {ctaText}
            </ButtonAction>
          </div>
        ) : null}
      </div>
      {preview !== null ? (
        <div className="pageHeroPreview">
          {preview ?? <div className="pageHeroPreviewPlaceholder" />}
        </div>
      ) : null}
    </section>
  );
}
