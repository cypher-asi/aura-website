import { Navbar } from '@/components/Navbar/Navbar';
import { ButtonAction } from '@/components/ButtonAction/ButtonAction';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { Taskbar } from '@/components/Taskbar/Taskbar';
import { getMacDownloadPath } from '@/config/downloadTargets';
import './MacDownloadPage.css';

export default function MacDownloadPage(): React.ReactNode {
  return (
    <>
      <Navbar />
      <main>
        <section className="macDownloadPage">
          <div className="macDownloadContent">
            <span className="macDownloadLabel">Download</span>
            <h1 className="macDownloadHeadline">Choose the right Mac build.</h1>
            <p className="macDownloadDescription">
              Apple Silicon is for M1, M2, M3, and M4 Macs. Intel is for older x86-based Macs.
            </p>
            <div className="macDownloadActions">
              <ButtonAction className="sciFiButtonDark" href={getMacDownloadPath('apple-silicon')}>
                Apple Silicon
              </ButtonAction>
              <ButtonAction href={getMacDownloadPath('intel')}>
                Intel Mac
              </ButtonAction>
            </div>
            <p className="macDownloadNote">
              If you are not sure which one you need, choose Apple Silicon for newer MacBooks and Intel for pre-2020 Macs.
            </p>
          </div>
        </section>
      </main>
      <SocialLinks />
      <Taskbar />
    </>
  );
}
