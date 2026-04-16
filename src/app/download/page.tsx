import { Navbar } from '@/components/Navbar/Navbar';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { Taskbar } from '@/components/Taskbar/Taskbar';
import { DownloadCards } from './DownloadCards';
import './DownloadPage.css';

export const metadata = {
  title: 'Download',
};

export default function DownloadPage(): React.ReactNode {
  return (
    <>
      <Navbar />
      <main className="scrollPageMain">
        <section className="downloadPage">
          <div className="downloadPageContent">
            <h1 className="downloadPageHeadline">Download AURA for every major desktop platform.</h1>
            <DownloadCards />
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
