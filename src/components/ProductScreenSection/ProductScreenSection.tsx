'use client';

import { type CSSProperties, type MouseEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import './ProductScreenSection.css';

type LightboxPhase = 'closed' | 'opening' | 'open' | 'closing';

interface ImageRect {
  readonly top: number;
  readonly left: number;
  readonly width: number;
  readonly height: number;
}

const LIGHTBOX_TRANSITION_MS = 320;
const DESKTOP_LIGHTBOX_PADDING = 24;
const MOBILE_LIGHTBOX_PADDING = 16;

function getViewportPadding(): number {
  return window.innerWidth <= 768 ? MOBILE_LIGHTBOX_PADDING : DESKTOP_LIGHTBOX_PADDING;
}

function getImageAspectRatio(imageElement: HTMLImageElement | null): number {
  if (!imageElement) {
    return 16 / 9;
  }

  if (imageElement.naturalWidth > 0 && imageElement.naturalHeight > 0) {
    return imageElement.naturalWidth / imageElement.naturalHeight;
  }

  if (imageElement.clientWidth > 0 && imageElement.clientHeight > 0) {
    return imageElement.clientWidth / imageElement.clientHeight;
  }

  return 16 / 9;
}

function getFullscreenRect(imageElement: HTMLImageElement | null): ImageRect {
  const viewportPadding = getViewportPadding();
  const maxWidth = Math.max(window.innerWidth - viewportPadding * 2, 0);
  const maxHeight = Math.max(window.innerHeight - viewportPadding * 2, 0);
  const aspectRatio = getImageAspectRatio(imageElement);

  let width = maxWidth;
  let height = width / aspectRatio;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return {
    top: (window.innerHeight - height) / 2,
    left: (window.innerWidth - width) / 2,
    width,
    height,
  };
}

function getRectStyle(rect: ImageRect | null): CSSProperties | undefined {
  if (!rect) {
    return undefined;
  }

  return {
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  };
}

interface ProductScreenSectionProps {
  readonly headline: ReactNode;
  readonly placeholderLabel?: string;
  readonly imageSrc?: string;
  readonly imageAlt?: string;
}

export function ProductScreenSection({
  headline,
  placeholderLabel = 'Image placeholder',
  imageSrc,
  imageAlt,
}: ProductScreenSectionProps): ReactNode {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const [lightboxPhase, setLightboxPhase] = useState<LightboxPhase>('closed');
  const [originRect, setOriginRect] = useState<ImageRect | null>(null);
  const [lightboxRect, setLightboxRect] = useState<ImageRect | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const clearPendingAnimation = (): void => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
  };

  const finishLightboxTransition = (nextPhase: LightboxPhase): void => {
    clearPendingAnimation();
    transitionTimeoutRef.current = window.setTimeout(() => {
      setLightboxPhase(nextPhase);
      transitionTimeoutRef.current = null;
    }, LIGHTBOX_TRANSITION_MS);
  };

  const updateOpenRect = (): void => {
    setLightboxRect(getFullscreenRect(imageRef.current));
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncReducedMotionPreference = (): void => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    syncReducedMotionPreference();
    mediaQuery.addEventListener('change', syncReducedMotionPreference);

    return () => {
      mediaQuery.removeEventListener('change', syncReducedMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (lightboxPhase === 'closed') {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        closeFullscreen();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxPhase]);

  useEffect(() => {
    if (lightboxPhase !== 'open' && lightboxPhase !== 'opening') {
      return undefined;
    }

    const handleResize = (): void => {
      updateOpenRect();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [lightboxPhase]);

  useEffect(() => {
    if (lightboxPhase !== 'closed') {
      return undefined;
    }

    setLightboxRect(null);
    setOriginRect(null);
    clearPendingAnimation();

    return undefined;
  }, [lightboxPhase]);

  useEffect(() => {
    return () => {
      clearPendingAnimation();
    };
  }, []);

  const openFullscreen = (): void => {
    if (!imageRef.current) {
      return;
    }

    const nextOriginRect = imageRef.current.getBoundingClientRect();
    const nextOpenRect = getFullscreenRect(imageRef.current);

    clearPendingAnimation();
    setOriginRect(nextOriginRect);

    if (prefersReducedMotion) {
      setLightboxRect(nextOpenRect);
      setLightboxPhase('open');
      return;
    }

    setLightboxRect(nextOriginRect);
    setLightboxPhase('opening');

    animationFrameRef.current = window.requestAnimationFrame(() => {
      animationFrameRef.current = window.requestAnimationFrame(() => {
        setLightboxRect(nextOpenRect);
        finishLightboxTransition('open');
      });
    });
  };

  const closeFullscreen = (): void => {
    if (lightboxPhase === 'closed' || lightboxPhase === 'closing') {
      return;
    }

    clearPendingAnimation();

    if (prefersReducedMotion) {
      setLightboxPhase('closed');
      return;
    }

    const nextOriginRect = imageRef.current?.getBoundingClientRect() ?? originRect;

    if (!nextOriginRect) {
      setLightboxPhase('closed');
      return;
    }

    setOriginRect(nextOriginRect);
    setLightboxRect(nextOriginRect);
    setLightboxPhase('closing');
    finishLightboxTransition('closed');
  };

  const stopLightboxClose = (event: MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation();
  };

  return (
    <section className="productScreenSection">
      <div className="productScreenSectionInner">
        <h2 className="productScreenSectionHeadline">{headline}</h2>
        {imageSrc ? (
          <>
            <button
              type="button"
              className="productScreenSectionImageButton"
              onClick={openFullscreen}
              aria-label={`Open fullscreen image: ${imageAlt ?? placeholderLabel}`}
            >
              <div className="productScreenSectionImageFrame">
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt={imageAlt ?? placeholderLabel}
                  className="productScreenSectionImage"
                />
              </div>
            </button>
            {lightboxPhase !== 'closed' ? (
              <div
                className={`productScreenSectionLightbox ${
                  lightboxPhase === 'opening' || lightboxPhase === 'open'
                    ? 'productScreenSectionLightboxVisible'
                    : ''
                }`}
                role="dialog"
                aria-modal="true"
                aria-label={imageAlt ?? placeholderLabel}
                onClick={closeFullscreen}
              >
                <button
                  type="button"
                  className="productScreenSectionLightboxClose"
                  onClick={closeFullscreen}
                  aria-label="Close fullscreen image"
                >
                  Close
                </button>
                <div
                  className="productScreenSectionLightboxImageShell"
                  style={getRectStyle(lightboxRect)}
                  onClick={stopLightboxClose}
                >
                  <img
                    src={imageSrc}
                    alt={imageAlt ?? placeholderLabel}
                    className="productScreenSectionLightboxImage"
                  />
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="productScreenSectionPlaceholder" aria-label={placeholderLabel} role="img">
            <span>{placeholderLabel}</span>
          </div>
        )}
      </div>
    </section>
  );
}
