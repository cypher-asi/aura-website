import { Navbar } from '@/components/Navbar/Navbar';
import { ButtonAction } from '@/components/ButtonAction/ButtonAction';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { Taskbar } from '@/components/Taskbar/Taskbar';
import { getMacDownloadPath } from '@/config/downloadTargets';
import './DownloadPage.css';

const DOWNLOAD_CARDS = [
  {
    eyebrow: 'macOS',
    title: 'Apple Silicon',
    description: 'Native build for M1, M2, M3, and M4 Macs.',
    href: getMacDownloadPath('apple-silicon'),
    cta: 'Download',
    meta: 'Recommended for newer Macs',
  },
  {
    eyebrow: 'macOS',
    title: 'Intel Mac',
    description: 'Desktop build for x86-based Macs and older MacBook Pro and iMac hardware.',
    href: getMacDownloadPath('intel'),
    cta: 'Download',
    meta: 'For pre-Apple Silicon Macs',
  },
  {
    eyebrow: 'Windows',
    title: 'Windows',
    description: 'Signed Windows installer with the latest desktop runtime and updater support.',
    href: '/download/windows',
    cta: 'Download',
    meta: 'x64 installer',
  },
  {
    eyebrow: 'Linux',
    title: 'Linux',
    description: 'Portable AppImage for Linux desktops, suitable for direct download and launch.',
    href: '/download/linux',
    cta: 'Download',
    meta: 'x86_64 AppImage',
  },
] as const;

export default function DownloadPage(): React.ReactNode {
  return (
    <>
      <Navbar />
      <main>
        <section className="downloadPage">
          <div className="downloadPageContent">
            <span className="downloadPageLabel">Downloads</span>
            <h1 className="downloadPageHeadline">
              Download AURA for every major desktop platform.
              <br />
              <span className="downloadPageHeadlineMuted">Choose the build that matches your machine.</span>
            </h1>
            <p className="downloadPageDescription">
              Every link below points to the latest published release for that platform. If you just want the fastest
              path, the main hero button still auto-detects your OS and takes you straight there.
            </p>
            <div className="downloadGrid">
              {DOWNLOAD_CARDS.map((card) => (
                <article key={card.title} className="downloadCard">
                  <div className="downloadCardHeader">
                    <span className="downloadCardEyebrow">{card.eyebrow}</span>
                    <h2 className="downloadCardTitle">{card.title}</h2>
                    <p className="downloadCardDescription">{card.description}</p>
                  </div>
                  <div className="downloadCardActions">
                    <ButtonAction className="sciFiButtonDark" href={card.href}>
                      {card.cta}
                    </ButtonAction>
                    <p className="downloadCardMeta">{card.meta}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="downloadPageFootnote">
              Need a different release track? The site download routes can also be pointed at nightly or stable release
              manifests without changing the page layout.
            </p>
          </div>
        </section>
      </main>
      <SocialLinks />
      <Taskbar />
    </>
  );
}
