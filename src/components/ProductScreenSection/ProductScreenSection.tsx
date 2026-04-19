'use client';

import {
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import './ProductScreenSection.css';

type LightboxPhase = 'closed' | 'opening' | 'open' | 'closing';

interface ImageRect {
  readonly top: number;
  readonly left: number;
  readonly width: number;
  readonly height: number;
}

interface ProductScreenSectionProps {
  readonly headline: ReactNode;
  readonly description?: ReactNode;
  readonly centered?: boolean;
  readonly showMedia?: boolean;
  readonly placeholderLabel?: string;
  readonly imageSrc?: string;
  readonly imageAlt?: string;
}

const IMAGE_ANIMATION_MS = 420;
const BACKDROP_ANIMATION_MS = 220;
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

function buildTransform(originRect: ImageRect, targetRect: ImageRect): string {
  const translateX = originRect.left - targetRect.left;
  const translateY = originRect.top - targetRect.top;
  const scaleX = originRect.width / targetRect.width;
  const scaleY = originRect.height / targetRect.height;

  return `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
}

export function ProductScreenSection({
  headline,
  description,
  centered = false,
  showMedia = true,
  placeholderLabel = 'Image placeholder',
  imageSrc,
  imageAlt,
}: ProductScreenSectionProps): ReactNode {
  const inlineImageRef = useRef<HTMLImageElement | null>(null);
  const animatedImageShellRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const activeAnimationsRef = useRef<Animation[]>([]);
  const [phase, setPhase] = useState<LightboxPhase>('closed');
  const [originRect, setOriginRect] = useState<ImageRect | null>(null);
  const [targetRect, setTargetRect] = useState<ImageRect | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const isLightboxVisible = phase !== 'closed';

  const cancelAnimations = (): void => {
    activeAnimationsRef.current.forEach((animation) => {
      animation.cancel();
    });
    activeAnimationsRef.current = [];
  };

  const runOpenAnimation = (): void => {
    if (!animatedImageShellRef.current || !backdropRef.current || !originRect || !targetRect) {
      setPhase('open');
      return;
    }

    cancelAnimations();

    const imageAnimation = animatedImageShellRef.current.animate(
      [
        {
          transform: 'scale(0.92)',
          opacity: 0,
        },
        {
          transform: 'scale(1)',
          opacity: 1,
        },
      ],
      {
        duration: IMAGE_ANIMATION_MS,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards',
      },
    );

    const backdropAnimation = backdropRef.current.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      {
        duration: BACKDROP_ANIMATION_MS,
        easing: 'ease-out',
        fill: 'forwards',
      },
    );

    const closeAnimation = closeButtonRef.current?.animate(
      [
        { opacity: 0, transform: 'translateY(-8px)' },
        { opacity: 1, transform: 'translateY(0px)' },
      ],
      {
        duration: 180,
        easing: 'ease-out',
        fill: 'forwards',
        delay: 100,
      },
    );

    activeAnimationsRef.current = [imageAnimation, backdropAnimation, closeAnimation].filter(
      (animation): animation is Animation => Boolean(animation),
    );

    imageAnimation.addEventListener(
      'finish',
      () => {
        activeAnimationsRef.current = [];
        setPhase('open');
      },
      { once: true },
    );
  };

  const runCloseAnimation = (): void => {
    if (!animatedImageShellRef.current || !backdropRef.current || !originRect || !targetRect) {
      setPhase('closed');
      return;
    }

    cancelAnimations();

    const imageAnimation = animatedImageShellRef.current.animate(
      [
        {
          transform: 'scale(1)',
          opacity: 1,
        },
        {
          transform: 'scale(0.92)',
          opacity: 0,
        },
      ],
      {
        duration: 340,
        easing: 'cubic-bezier(0.7, 0, 0.84, 0)',
        fill: 'forwards',
      },
    );

    const backdropAnimation = backdropRef.current.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      {
        duration: 180,
        easing: 'ease-out',
        fill: 'forwards',
      },
    );

    const closeAnimation = closeButtonRef.current?.animate(
      [
        { opacity: 1, transform: 'translateY(0px)' },
        { opacity: 0, transform: 'translateY(-8px)' },
      ],
      {
        duration: 120,
        easing: 'ease-in',
        fill: 'forwards',
      },
    );

    activeAnimationsRef.current = [imageAnimation, backdropAnimation, closeAnimation].filter(
      (animation): animation is Animation => Boolean(animation),
    );

    imageAnimation.addEventListener(
      'finish',
      () => {
        activeAnimationsRef.current = [];
        setPhase('closed');
      },
      { once: true },
    );
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
    if (!isLightboxVisible) {
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
  }, [isLightboxVisible]);

  useEffect(() => {
    if (phase !== 'open') {
      return undefined;
    }

    const handleResize = (): void => {
      setTargetRect(getFullscreenRect(inlineImageRef.current));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [phase]);

  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      if (phase === 'opening') {
        setPhase('open');
      }

      if (phase === 'closing') {
        setPhase('closed');
      }

      return;
    }

    if (phase === 'opening') {
      runOpenAnimation();
    }

    if (phase === 'closing') {
      runCloseAnimation();
    }
  }, [phase, prefersReducedMotion, originRect, targetRect]);

  useEffect(() => {
    if (phase !== 'closed') {
      return undefined;
    }

    cancelAnimations();
    setOriginRect(null);
    setTargetRect(null);

    return undefined;
  }, [phase]);

  useEffect(() => {
    return () => {
      cancelAnimations();
    };
  }, []);

  const openFullscreen = (): void => {
    if (!inlineImageRef.current) {
      return;
    }

    setOriginRect(inlineImageRef.current.getBoundingClientRect());
    setTargetRect(getFullscreenRect(inlineImageRef.current));

    if (prefersReducedMotion) {
      setPhase('open');
      return;
    }

    setPhase('opening');
  };

  const closeFullscreen = (): void => {
    if (phase === 'closed' || phase === 'closing') {
      return;
    }

    if (prefersReducedMotion) {
      setPhase('closed');
      return;
    }

    setOriginRect(inlineImageRef.current?.getBoundingClientRect() ?? originRect);
    setPhase('closing');
  };

  const stopLightboxClose = (event: MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation();
  };

  const lightbox =
    isLightboxVisible && targetRect && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="productScreenSectionLightbox"
            role="dialog"
            aria-modal="true"
            aria-label={imageAlt ?? placeholderLabel}
            onClick={closeFullscreen}
          >
            <div ref={backdropRef} className="productScreenSectionLightboxBackdrop" />
            <button
              ref={closeButtonRef}
              type="button"
              className="productScreenSectionLightboxClose"
              onClick={closeFullscreen}
              aria-label="Close fullscreen image"
            >
              Close
            </button>
            <div
              ref={animatedImageShellRef}
              className="productScreenSectionLightboxImageShell"
              style={getRectStyle(targetRect)}
              onClick={stopLightboxClose}
            >
              <img
                src={imageSrc}
                alt={imageAlt ?? placeholderLabel}
                className="productScreenSectionLightboxImage"
              />
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <section
      className={`productScreenSection ${centered ? 'productScreenSectionCentered' : ''}`}
    >
      <div className="productScreenSectionInner">
        <h2 className="productScreenSectionHeadline">{headline}</h2>
        {description ? (
          <p className="productScreenSectionDescription">{description}</p>
        ) : null}
        {showMedia ? (
          imageSrc ? (
            <>
              <button
                type="button"
                className="productScreenSectionImageButton"
                onClick={openFullscreen}
                aria-label={`Open fullscreen image: ${imageAlt ?? placeholderLabel}`}
              >
                <div
                  className={`productScreenSectionImageFrame ${
                    isLightboxVisible ? 'productScreenSectionImageFrameHidden' : ''
                  }`}
                >
                  <img
                    ref={inlineImageRef}
                    src={imageSrc}
                    alt={imageAlt ?? placeholderLabel}
                    className="productScreenSectionImage"
                  />
                </div>
              </button>
              {lightbox}
            </>
          ) : (
            <div
              className="productScreenSectionPlaceholder"
              aria-label={placeholderLabel}
              role="img"
            >
              <span>{placeholderLabel}</span>
            </div>
          )
        ) : null}
      </div>
    </section>
  );
}
