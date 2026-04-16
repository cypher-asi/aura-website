'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ButtonAction } from '@/components/ButtonAction/ButtonAction';
import { getDownloadPath, type DownloadTarget } from '@/config/downloadTargets';
import './Hero.css';

const ROTATING_WORDS = [
  'workforce',
  'team',
  'swarm',
  'network',
  'fleet',
  'company',
  'project',
  'startup',
  'DAO',
];

const TYPE_SPEED = 80;
const DELETE_SPEED = 50;
const PAUSE_BEFORE_DELETE = 2000;
const PAUSE_BEFORE_TYPE = 300;
const DOWNLOAD_ICON_SIZE = 16;

type DownloadPlatform = DownloadTarget | 'unknown';

function detectDownloadPlatform(): DownloadPlatform {
  if (typeof window === 'undefined') {
    return 'unknown';
  }

  const navigatorWithUAData = window.navigator as Navigator & {
    userAgentData?: {
      platform?: string;
    };
  };
  const platformSource = [
    navigatorWithUAData.userAgentData?.platform,
    window.navigator.platform,
    window.navigator.userAgent,
  ]
    .join(' ')
    .toLowerCase();

  if (platformSource.includes('win')) {
    return 'windows';
  }

  if (
    platformSource.includes('mac') ||
    platformSource.includes('iphone') ||
    platformSource.includes('ipad') ||
    platformSource.includes('ipod')
  ) {
    return 'mac';
  }

  if (platformSource.includes('linux') || platformSource.includes('x11') || platformSource.includes('ubuntu')) {
    return 'linux';
  }

  return 'unknown';
}

function DownloadPlatformIcon({ platform }: { readonly platform: DownloadPlatform }): React.ReactNode {
  switch (platform) {
    case 'windows':
      return (
        <svg width={DOWNLOAD_ICON_SIZE} height={DOWNLOAD_ICON_SIZE} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.851" />
        </svg>
      );
    case 'mac':
      return (
        <svg width={DOWNLOAD_ICON_SIZE} height={DOWNLOAD_ICON_SIZE} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16.365 12.713c-.014-2.373 1.933-3.511 2.019-3.564-1.103-1.611-2.816-1.833-3.427-1.859-1.444-.153-2.846.866-3.582.866-.75 0-1.882-.851-3.104-.826-1.558.025-3.016.926-3.815 2.322-1.646 2.851-.418 7.04 1.159 9.345.793 1.129 1.719 2.39 2.93 2.345 1.185-.05 1.628-.756 3.058-.756 1.418 0 1.835.756 3.068.728 1.272-.02 2.074-1.139 2.84-2.278.917-1.294 1.285-2.57 1.299-2.634-.027-.01-2.474-.949-2.445-3.685ZM15.71 5.865c.639-.799 1.076-1.887.954-2.99-.923.041-2.078.638-2.743 1.421-.588.69-1.113 1.82-.977 2.882 1.036.078 2.104-.523 2.766-1.313Z" />
        </svg>
      );
    case 'linux':
      return (
        <svg width={DOWNLOAD_ICON_SIZE} height={DOWNLOAD_ICON_SIZE} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="4.75" y="5.75" width="14.5" height="12.5" rx="1.75" stroke="currentColor" strokeWidth="1.5" />
          <path d="m8.5 10.25 2.25 2.25-2.25 2.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.25 15h2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg width={DOWNLOAD_ICON_SIZE} height={DOWNLOAD_ICON_SIZE} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 4.75v9.5m0 0-3.5-3.5M12 14.25l3.5-3.5M5.75 18.25h12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

export function Hero(): React.ReactNode {
  const [displayed, setDisplayed] = useState(ROTATING_WORDS[0]);
  const [downloadPlatform, setDownloadPlatform] = useState<DownloadPlatform>('unknown');
  const indexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const downloadHref = getDownloadPath(downloadPlatform);

  const typeWord = useCallback((word: string, charIndex: number) => {
    if (charIndex <= word.length) {
      setDisplayed(word.slice(0, charIndex));
      timeoutRef.current = setTimeout(() => typeWord(word, charIndex + 1), TYPE_SPEED);
    } else {
      timeoutRef.current = setTimeout(() => deleteWord(word, word.length), PAUSE_BEFORE_DELETE);
    }
  }, []);

  const deleteWord = useCallback((word: string, charIndex: number) => {
    if (charIndex >= 0) {
      setDisplayed(word.slice(0, charIndex));
      timeoutRef.current = setTimeout(() => deleteWord(word, charIndex - 1), DELETE_SPEED);
    } else {
      indexRef.current = (indexRef.current + 1) % ROTATING_WORDS.length;
      const next = ROTATING_WORDS[indexRef.current];
      timeoutRef.current = setTimeout(() => typeWord(next, 1), PAUSE_BEFORE_TYPE);
    }
  }, [typeWord]);

  useEffect(() => {
    timeoutRef.current = setTimeout(
      () => deleteWord(ROTATING_WORDS[0], ROTATING_WORDS[0].length),
      PAUSE_BEFORE_DELETE,
    );
    return () => clearTimeout(timeoutRef.current);
  }, [deleteWord]);

  // Resolve the OS after mount so the server and client start from the same markup.
  useEffect(() => {
    setDownloadPlatform(detectDownloadPlatform());
  }, []);

  return (
    <section className="hero">
      <div className="heroContent">
        <h1 className="heroHeadline">
          Create a{' '}
          <span className="heroRotatingWord">
            {displayed}
            <span className="heroTypewriterCursor" />
          </span>
          <br />
          of agents in minutes.
        </h1>
        <div className="heroSubRow">
          <ButtonAction
            className="sciFiButtonDark"
            href={downloadHref}
            icon={<DownloadPlatformIcon platform={downloadPlatform} />}
          >
            Download
          </ButtonAction>
        </div>
      </div>
    </section>
  );
}
